import type { FC, ReactNode } from 'react';
import { clsx } from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page.tsx';
import { WalletHomeIndicator } from '@/components/wallet/WalletHomeIndicator.tsx';
import { WalletLayout } from '@/components/wallet/WalletLayout.tsx';

import { useI18n } from '@/i18n/I18nProvider.tsx';
import { useWalletSession, useWalletSessionGuard } from '@/state/wallet/WalletSessionContext.tsx';
import { WALLET_HOME_ASSETS } from '@/pages/app/walletHomeFigmaAssets.ts';
import { getPrimaryVaultRecord } from '@/wallet-core/vault/vaultRepository.ts';
import type { SupportedChain, VaultAddressRecord } from '@/wallet-core/vault/vaultTypes.ts';

/** Matches Figma home greens (#17e19d / #17e29d). */
const HOME_GREEN = '#17e19d';
const HOME_GREEN_MSG = '#17e29d';

const CHAIN_ORDER: SupportedChain[] = ['eth', 'bsc', 'tron'];

type TagSpec =
  | { variant: 'blue'; textKey: string }
  | { variant: 'neutral'; textKey: string }
  | { variant: 'yellow'; textKey: string }
  | { variant: 'red'; textKey: string };

type TxIconKind =
  | { kind: 'progress'; label: string }
  | { kind: 'arrow'; dir: 'in' | 'out' }
  | { kind: 'warning'; tone: 'yellow' | 'red' };

interface TxRowData {
  id: string;
  icon: TxIconKind;
  titleKey: string;
  tags: TagSpec[];
  subtitleKey?: string;
  subtitleText?: string;
  amount: string;
  unit: string;
}

function formatAddressShort(address: string): string {
  if (address.startsWith('0x') && address.length > 12) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
  if (address.length > 10) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
  return address;
}

function chainLabel(chain: SupportedChain): string {
  if (chain === 'eth') return 'ETH';
  if (chain === 'bsc') return 'BSC';
  return 'TRON';
}

async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const el = document.createElement('textarea');
  el.value = text;
  el.setAttribute('readonly', 'true');
  el.style.position = 'fixed';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

const MOCK_TX: TxRowData[] = [
  {
    id: '1',
    icon: { kind: 'progress', label: '2/3' },
    titleKey: 'home.tx.receive',
    tags: [{ variant: 'blue', textKey: 'home.tx.kytChecking' }],
    subtitleText: 'Just now. Done in 3s.',
    amount: '2,000,00',
    unit: ' USDT',
  },
  {
    id: '2',
    icon: { kind: 'arrow', dir: 'out' },
    titleKey: 'home.tx.pay',
    tags: [{ variant: 'neutral', textKey: 'home.tx.safe' }],
    subtitleKey: 'home.tx.today1432',
    amount: '2,000,00',
    unit: '0x742d...bEb',
  },
  {
    id: '3',
    icon: { kind: 'arrow', dir: 'in' },
    titleKey: 'home.tx.receive',
    tags: [{ variant: 'neutral', textKey: 'home.tx.privatePay' }],
    subtitleKey: 'home.tx.yesterday0915',
    amount: '2,000,00',
    unit: '0x8ba1...3e8C',
  },
  {
    id: '4',
    icon: { kind: 'warning', tone: 'yellow' },
    titleKey: 'home.tx.pay',
    tags: [{ variant: 'yellow', textKey: 'home.tx.pendingReview' }],
    subtitleKey: 'home.tx.today1432',
    amount: '2,000,00',
    unit: '0x8ba1...3e8C',
  },
  {
    id: '5',
    icon: { kind: 'warning', tone: 'red' },
    titleKey: 'home.tx.pay',
    tags: [
      { variant: 'red', textKey: 'home.tx.quarantined' },
      { variant: 'red', textKey: 'home.tx.blackToken' },
    ],
    subtitleKey: 'home.tx.today1432',
    amount: '2,000,00',
    unit: '0x8ba1...3e8C',
  },
  {
    id: '6',
    icon: { kind: 'arrow', dir: 'out' },
    titleKey: 'home.tx.pay',
    tags: [],
    subtitleKey: 'home.tx.today1432',
    amount: '2,000,00',
    unit: '0x742d...bEb',
  },
];

function ShieldBannerIcon() {
  return (
    <img src={WALLET_HOME_ASSETS.shieldBanner} alt="" className="size-5 shrink-0 object-contain" />
  );
}

function ShieldCongratsIcon() {
  return (
    <img
      src={WALLET_HOME_ASSETS.shieldCongrats}
      alt=""
      className="size-4 shrink-0 object-contain"
    />
  );
}

function TransferArrowIcon({ dir }: { dir: 'in' | 'out' }) {
  return (
    <img
      src={dir === 'in' ? WALLET_HOME_ASSETS.txArrowIn : WALLET_HOME_ASSETS.txArrow}
      alt=""
      className="size-6 object-contain"
    />
  );
}

function TxLeadIcon({ icon }: { icon: TxIconKind }) {
  if (icon.kind === 'progress') {
    return (
      <img src={WALLET_HOME_ASSETS.txProgress} alt="" className="size-10 shrink-0 object-contain" />
    );
  }
  if (icon.kind === 'arrow') {
    return (
      <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.04)_100%)]">
        <div
          className="pointer-events-none absolute inset-x-2 top-0 h-px bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.24),rgba(255,255,255,0))]"
          aria-hidden
        />
        <TransferArrowIcon dir={icon.dir} />
      </div>
    );
  }
  const src =
    icon.tone === 'yellow' ? WALLET_HOME_ASSETS.warningYellow : WALLET_HOME_ASSETS.warningRed;
  return (
    <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.04)_100%)]">
      <div
        className="pointer-events-none absolute inset-x-2 top-0 h-px bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.24),rgba(255,255,255,0))]"
        aria-hidden
      />
      <img src={src} alt="" className="relative size-6 object-contain" />
    </div>
  );
}

function TagPill({ spec, text }: { spec: TagSpec; text: string }) {
  const cls =
    spec.variant === 'blue'
      ? 'border-[0.5px] border-[#257cff] bg-[rgba(37,124,255,0.1)] text-[#257cff]'
      : spec.variant === 'neutral'
        ? 'border-[0.5px] border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.1)] text-white'
        : spec.variant === 'yellow'
          ? 'border-[0.5px] border-[rgba(255,194,67,0.2)] bg-[rgba(255,194,67,0.1)] text-[#ffc343]'
          : 'border-[0.5px] border-[rgba(255,50,119,0.2)] bg-[rgba(255,50,119,0.1)] text-[#ff3277]';

  return (
    <span
      className={clsx(
        'inline-flex h-[18px] max-h-[18px] shrink-0 items-center justify-center rounded-[30px] px-1.5 text-[10px] font-medium leading-none',
        cls,
      )}
    >
      {text}
    </span>
  );
}

function TabButton({ active, icon, label }: { active: boolean; icon: string; label: string }) {
  return (
    <button
      type="button"
      className={clsx(
        'relative flex flex-1 flex-col items-center gap-0.5 rounded-[999px] py-1 transition-opacity',
        active ? 'opacity-100' : 'opacity-90',
      )}
    >
      {active ? (
        <span
          className="pointer-events-none absolute inset-x-2 top-0 h-[34px] rounded-[999px] bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_100%)]"
          aria-hidden
        />
      ) : null}
      <img
        src={icon}
        alt=""
        className={clsx(
          'relative size-6 max-w-none object-contain',
          active ? 'opacity-100' : 'opacity-90',
        )}
      />
      <span
        className={clsx(
          'relative text-[10px] leading-none',
          active ? 'font-medium text-white' : 'text-[rgba(255,255,255,0.4)]',
        )}
      >
        {label}
      </span>
    </button>
  );
}

function QuickAction({ label, children }: { label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      className="flex h-[72px] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[20px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.1)] py-2 text-white"
    >
      <div className="flex size-6 items-center justify-center">{children}</div>
      <span className="text-xs font-medium leading-none">{label}</span>
    </button>
  );
}

export const WalletHomePage: FC = () => {
  const navigate = useNavigate();
  const { clearVault } = useWalletSession();
  const { t } = useI18n();

  useWalletSessionGuard();

  const [addresses, setAddresses] = useState<VaultAddressRecord[]>([]);
  const [activeChain, setActiveChain] = useState<SupportedChain>('eth');
  const [addressesLoaded, setAddressesLoaded] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<'idle' | 'copied' | 'error'>('idle');
  const copiedTimerRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    getPrimaryVaultRecord()
      .then((record) => {
        if (cancelled) return;
        setAddresses(record?.addresses ?? []);
        setAddressesLoaded(true);
      })
      .catch(() => {
        if (cancelled) return;
        setAddresses([]);
        setAddressesLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current !== null) {
        window.clearTimeout(copiedTimerRef.current);
      }
    };
  }, []);

  const addressByChain = useMemo(() => {
    const out: Partial<Record<SupportedChain, string>> = {};
    for (const row of addresses) {
      out[row.chain] = row.address;
    }
    return out;
  }, [addresses]);

  const currentAddress = addressByChain[activeChain] ?? '';

  const cycleChain = () => {
    const available = new Set<SupportedChain>(Object.keys(addressByChain) as SupportedChain[]);
    setActiveChain((prev) => {
      if (available.size === 0) return prev;
      const startIndex = CHAIN_ORDER.indexOf(prev);
      const baseIndex = startIndex >= 0 ? startIndex : 0;
      for (let i = 1; i <= CHAIN_ORDER.length; i += 1) {
        const next = CHAIN_ORDER[(baseIndex + i) % CHAIN_ORDER.length];
        if (next && available.has(next)) return next;
      }
      return prev;
    });
  };

  const onCopy = async () => {
    if (!currentAddress) return;
    try {
      await copyToClipboard(currentAddress);
      setCopyFeedback('copied');
      if (copiedTimerRef.current !== null) {
        window.clearTimeout(copiedTimerRef.current);
      }
      copiedTimerRef.current = window.setTimeout(() => setCopyFeedback('idle'), 1200);
    } catch {
      setCopyFeedback('error');
      if (copiedTimerRef.current !== null) {
        window.clearTimeout(copiedTimerRef.current);
      }
      copiedTimerRef.current = window.setTimeout(() => setCopyFeedback('idle'), 1200);
    }
  };

  const resetDev = async () => {
    await clearVault();
    navigate('/', { replace: true });
  };

  return (
    <Page back={false}>
      <WalletLayout className="relative overflow-hidden pb-0">
        {/* Hex grid hero — Figma 476:12552 */}
        <div className="pointer-events-none absolute left-0 top-0 z-0 h-[320px] w-full overflow-hidden">
          <img
            src={WALLET_HOME_ASSETS.hexGrid}
            alt=""
            className="absolute left-0 top-0 h-[320px] w-full max-w-none object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-[#131313]/70 to-[#131313]"
            aria-hidden
          />
        </div>

        <div className="relative z-[1] flex min-h-screen flex-col pb-[calc(110px+env(safe-area-inset-bottom))]">
          {/* Top bar — wallet + message (no fake iOS status bar in Mini App). */}
          <header className="flex h-11 items-center justify-between px-5 pt-1.5">
            <div className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                className="flex min-w-0 items-center gap-1 rounded-[50px] text-white"
                onClick={cycleChain}
              >
                <div className="flex min-w-0 flex-col items-start">
                  <span className="text-[19px] font-semibold leading-none">Wallet 1</span>
                  <span className="mt-1 truncate text-[12px] leading-none text-[rgba(255,255,255,0.7)]">
                    {!addressesLoaded
                      ? t('home.addressLoading')
                      : currentAddress
                        ? `${chainLabel(activeChain)} · ${formatAddressShort(currentAddress)}`
                        : t('home.noAddress')}
                  </span>
                </div>
                <span className="flex size-4 translate-y-px rotate-90 items-center justify-center">
                  <img
                    src={WALLET_HOME_ASSETS.walletChevron}
                    alt=""
                    className="size-4 max-w-none opacity-90"
                  />
                </span>
              </button>
              <button
                type="button"
                className={clsx(
                  'flex h-7 items-center justify-center rounded-[40px] border px-2 text-[12px] font-semibold leading-none transition-[transform,background-color,opacity] duration-150 ease-out active:scale-[0.985]',
                  currentAddress
                    ? 'border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)] text-white hover:bg-[rgba(255,255,255,0.08)]'
                    : 'cursor-not-allowed border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-[rgba(255,255,255,0.35)]',
                )}
                onClick={onCopy}
                disabled={!currentAddress}
              >
                {copyFeedback === 'copied'
                  ? t('common.copied')
                  : copyFeedback === 'error'
                    ? t('common.copyFailed')
                    : t('common.copy')}
              </button>
            </div>
            <button
              type="button"
              className="relative flex h-7 w-[29px] items-center justify-center text-white"
              aria-label={t('home.messagesAria')}
            >
              <img
                src={WALLET_HOME_ASSETS.messageBubble}
                alt=""
                className="h-7 w-[29px] max-w-none object-contain"
              />
            </button>
          </header>

          {/* Security strip — Figma 476:12568 */}
          <div className="mt-2 flex h-9 w-full items-center justify-center gap-2 bg-gradient-to-r from-[rgba(23,225,157,0)] via-[rgba(23,225,157,0.2)] to-[rgba(23,225,157,0)] px-3">
            <ShieldBannerIcon />
            <span className="text-[14px] leading-normal" style={{ color: HOME_GREEN }}>
              {t('home.protecting')}
            </span>
          </div>

          {/* Assets + quick actions — Figma 476:12571 */}
          <section className="flex flex-col items-center gap-[30px] px-5 pb-2 pt-[22px]">
            <div className="relative flex w-full flex-col items-center gap-[18px]">
              <div
                className="pointer-events-none absolute left-1/2 top-[-18px] h-[180px] w-[260px] -translate-x-1/2 rounded-[999px] bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.11),rgba(255,255,255,0)_60%)] blur-[36px]"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute left-1/2 top-[4px] h-[102px] w-[214px] -translate-x-1/2 rounded-[28px] bg-[linear-gradient(180deg,rgba(255,255,255,0.055)_0%,rgba(255,255,255,0.012)_48%,rgba(255,255,255,0)_100%)]"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute left-1/2 top-[4px] h-px w-[174px] -translate-x-1/2 bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.28),rgba(255,255,255,0))]"
                aria-hidden
              />
              <div className="relative flex w-[214px] flex-col items-center gap-[9px] pt-[2px]">
                <p className="text-[16px] leading-[18px] text-white/60">{t('home.totalAssets')}</p>
                <button
                  type="button"
                  className="flex items-end gap-1.5 text-left"
                  aria-label={t('home.viewAllAssetsAria')}
                >
                  <span className="text-[32px] font-semibold leading-none tracking-[-0.02em] text-white">
                    48,293.86
                  </span>
                  <span className="flex h-7 items-center gap-0.5 pb-[2px]">
                    <span className="text-[16px] font-bold leading-none text-white">USD</span>
                    <img
                      src={WALLET_HOME_ASSETS.balanceChevron}
                      alt=""
                      className="mt-px size-3 max-w-none opacity-80"
                    />
                  </span>
                </button>
              </div>
              <div className="relative flex items-center gap-1">
                <ShieldCongratsIcon />
                <p className="text-[14px] leading-[18px]" style={{ color: HOME_GREEN_MSG }}>
                  {t('home.allAssetsSafe')}
                </p>
              </div>
            </div>

            <div className="flex w-full gap-[13px]">
              <QuickAction label={t('home.action.receive')}>
                <TransferArrowIcon dir="in" />
              </QuickAction>
              <QuickAction label={t('home.action.pay')}>
                <img
                  src={WALLET_HOME_ASSETS.quickTransfer}
                  alt=""
                  className="size-6 object-contain"
                />
              </QuickAction>
              <QuickAction label={t('home.action.invite')}>
                <img
                  src={WALLET_HOME_ASSETS.quickInvite}
                  alt=""
                  className="size-6 object-contain"
                />
              </QuickAction>
              <QuickAction label={t('home.action.support')}>
                <img
                  src={WALLET_HOME_ASSETS.quickSupport}
                  alt=""
                  className="size-6 object-contain"
                />
              </QuickAction>
            </div>
          </section>

          {/* Transactions — flat rows like Figma 476:12609 */}
          <section className="flex flex-col gap-7 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">{t('home.recentTransactions')}</h2>
            <ul className="flex flex-col gap-[22px]">
              {MOCK_TX.map((tx) => (
                <li key={tx.id} className="flex min-h-10 items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <TxLeadIcon icon={tx.icon} />
                    <div className="flex min-w-0 flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="text-[15px] font-medium leading-5 text-white">
                          {t(tx.titleKey)}
                        </span>
                        {tx.tags.map((tag) => (
                          <TagPill key={tag.textKey} spec={tag} text={t(tag.textKey)} />
                        ))}
                      </div>
                      <p className="text-[12px] leading-4 text-[rgba(255,255,255,0.6)]">
                        {tx.subtitleKey ? t(tx.subtitleKey) : tx.subtitleText}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right leading-none">
                    <p className="text-[15px] font-medium leading-5 text-white">{tx.amount}</p>
                    <p className="mt-1 text-[12px] leading-4 text-[rgba(255,255,255,0.6)]">
                      {tx.unit}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {import.meta.env.DEV ? (
            <button
              type="button"
              onClick={resetDev}
              className="mx-5 mt-4 py-2 text-center text-xs text-white/40 underline"
            >
              {t('home.resetDev')}
            </button>
          ) : null}
        </div>

        {/* Floating tab bar + home indicator — Figma 476:12721 + Tab */}
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex flex-col items-center bg-wallet-canvas">
          <nav
            className="pointer-events-auto relative mb-2 flex h-[60px] w-[295px] max-w-[calc(100%-40px)] items-center justify-between overflow-hidden rounded-[170px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.05)] px-3.5 backdrop-blur-[7px]"
            aria-label={t('home.mainNavAria')}
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.24),rgba(255,255,255,0))]"
              aria-hidden
            />
            <TabButton active icon={WALLET_HOME_ASSETS.tabHomeActive} label={t('home.tab.home')} />
            <TabButton
              active={false}
              icon={WALLET_HOME_ASSETS.tabOrders}
              label={t('home.tab.orders')}
            />
            <TabButton
              active={false}
              icon={WALLET_HOME_ASSETS.tabProfile}
              label={t('home.tab.profile')}
            />
          </nav>
          <div className="pointer-events-auto w-full">
            <WalletHomeIndicator />
          </div>
        </div>
      </WalletLayout>
    </Page>
  );
};
