import type { FC, ReactNode } from 'react';
import { clsx } from 'clsx';

import { Page } from '@/components/Page.tsx';
import { WalletHomeIndicator } from '@/components/wallet/WalletHomeIndicator.tsx';
import { WalletLayout } from '@/components/wallet/WalletLayout.tsx';

import {
  useOnboardingGuard,
  useOnboardingMock,
} from '@/pages/app/onboarding/OnboardingMockContext.tsx';
import { WALLET_HOME_ASSETS } from '@/pages/app/walletHomeFigmaAssets.ts';

/** Matches Figma home greens (#17e19d / #17e29d). */
const HOME_GREEN = '#17e19d';
const HOME_GREEN_MSG = '#17e29d';

type TagSpec =
  | { variant: 'blue'; text: string }
  | { variant: 'neutral'; text: string }
  | { variant: 'yellow'; text: string }
  | { variant: 'red'; text: string };

type TxIconKind =
  | { kind: 'progress'; label: string }
  | { kind: 'arrow'; dir: 'in' | 'out' }
  | { kind: 'warning'; tone: 'yellow' | 'red' };

interface TxRowData {
  id: string;
  icon: TxIconKind;
  title: string;
  tags: TagSpec[];
  subtitle: string;
  amount: string;
  unit: string;
}

const MOCK_TX: TxRowData[] = [
  {
    id: '1',
    icon: { kind: 'progress', label: '2/3' },
    title: '收款',
    tags: [{ variant: 'blue', text: 'KYT 监测中' }],
    subtitle: 'Just now. Done in 3s.',
    amount: '2,000,00',
    unit: ' USDT',
  },
  {
    id: '2',
    icon: { kind: 'arrow', dir: 'out' },
    title: '支付',
    tags: [{ variant: 'neutral', text: '安全' }],
    subtitle: '今天14:32',
    amount: '2,000,00',
    unit: '0x742d...bEb',
  },
  {
    id: '3',
    icon: { kind: 'arrow', dir: 'in' },
    title: '收款',
    tags: [{ variant: 'neutral', text: '隐私支付' }],
    subtitle: '昨天09:15',
    amount: '2,000,00',
    unit: '0x8ba1...3e8C',
  },
  {
    id: '4',
    icon: { kind: 'warning', tone: 'yellow' },
    title: '支付',
    tags: [{ variant: 'yellow', text: '待审核' }],
    subtitle: '今天14:32',
    amount: '2,000,00',
    unit: '0x8ba1...3e8C',
  },
  {
    id: '5',
    icon: { kind: 'warning', tone: 'red' },
    title: '支付',
    tags: [
      { variant: 'red', text: '已隔离' },
      { variant: 'red', text: '黑U' },
    ],
    subtitle: '今天14:32',
    amount: '2,000,00',
    unit: '0x8ba1...3e8C',
  },
  {
    id: '6',
    icon: { kind: 'arrow', dir: 'out' },
    title: '支付',
    tags: [],
    subtitle: '今天14:32',
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
      <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-wallet-surface-muted">
        <TransferArrowIcon dir={icon.dir} />
      </div>
    );
  }
  const src =
    icon.tone === 'yellow' ? WALLET_HOME_ASSETS.warningYellow : WALLET_HOME_ASSETS.warningRed;
  return (
    <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-wallet-surface-muted">
      <img src={src} alt="" className="relative size-6 object-contain" />
    </div>
  );
}

function TagPill({ spec }: { spec: TagSpec }) {
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
        'inline-flex h-4 max-h-[18px] shrink-0 items-center justify-center rounded-[30px] px-1.5 text-[10px] leading-none',
        cls,
      )}
    >
      {spec.text}
    </span>
  );
}

function QuickAction({ label, children }: { label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      className="flex h-[72px] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[20px] border border-white bg-[rgba(255,255,255,0.1)] py-2 text-white"
    >
      <div className="flex size-6 items-center justify-center">{children}</div>
      <span className="text-xs font-medium leading-none">{label}</span>
    </button>
  );
}

export const WalletHomePage: FC = () => {
  const { resetOnboarding } = useOnboardingMock();

  useOnboardingGuard('home');

  const resetDev = () => {
    resetOnboarding();
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
          <header className="flex h-11 items-center justify-between px-5 pt-1">
            <button
              type="button"
              className="flex items-center gap-1 rounded-[50px] text-[19px] font-semibold text-white"
            >
              Wallet 1
              <span className="flex size-4 rotate-90 items-center justify-center">
                <img src={WALLET_HOME_ASSETS.walletChevron} alt="" className="size-4 max-w-none" />
              </span>
            </button>
            <button type="button" className="relative size-6 text-white" aria-label="消息">
              <span className="absolute left-1/2 top-1 h-[17px] w-[18px] -translate-x-1/2">
                <img
                  src={WALLET_HOME_ASSETS.messageBubble}
                  alt=""
                  className="size-full max-w-none object-contain"
                />
              </span>
              <span className="absolute left-1/2 top-[10px] flex translate-x-[-50%] gap-[1.5px]">
                <span className="size-0.5 rounded-[1px] bg-white" />
                <span className="size-0.5 rounded-[1px] bg-white" />
                <span className="size-0.5 rounded-[1px] bg-white" />
              </span>
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-[40px] bg-[#257cff] px-1 font-[Poppins,sans-serif] text-[10px] leading-none text-white">
                9
              </span>
            </button>
          </header>

          {/* Security strip — Figma 476:12568 */}
          <div className="mt-2 flex h-9 w-full items-center justify-center gap-2 bg-gradient-to-r from-[rgba(23,225,157,0)] via-[rgba(23,225,157,0.2)] to-[rgba(23,225,157,0)] px-3">
            <ShieldBannerIcon />
            <span className="text-[14px] leading-normal" style={{ color: HOME_GREEN }}>
              安全保护中
            </span>
          </div>

          {/* Assets + quick actions — Figma 476:12571 */}
          <section className="flex flex-col items-center gap-8 px-5 pb-2 pt-[22px]">
            <div className="flex w-full flex-col items-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <p className="text-[16px] leading-4 text-white/60">全部资产</p>
                <button
                  type="button"
                  className="flex items-end gap-1 text-left"
                  aria-label="查看全部资产"
                >
                  <span className="text-[32px] font-semibold leading-none tracking-tight text-white">
                    48,293.86
                  </span>
                  <span className="flex h-7 items-center gap-0.5 pb-0.5">
                    <span className="text-base font-bold text-white">USD</span>
                    <img
                      src={WALLET_HOME_ASSETS.balanceChevron}
                      alt=""
                      className="size-3 max-w-none opacity-80"
                    />
                  </span>
                </button>
              </div>
              <div className="flex items-center gap-0.5">
                <ShieldCongratsIcon />
                <p className="text-[14px]" style={{ color: HOME_GREEN_MSG }}>
                  恭喜！你的所有资产均已安全。
                </p>
              </div>
            </div>

            <div className="flex w-full gap-[13px]">
              <QuickAction label="收款">
                <TransferArrowIcon dir="in" />
              </QuickAction>
              <QuickAction label="支付">
                <img
                  src={WALLET_HOME_ASSETS.quickTransfer}
                  alt=""
                  className="size-6 object-contain"
                />
              </QuickAction>
              <QuickAction label="邀请">
                <img
                  src={WALLET_HOME_ASSETS.quickInvite}
                  alt=""
                  className="size-6 object-contain"
                />
              </QuickAction>
              <QuickAction label="客服">
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
            <h2 className="text-lg font-semibold text-white">最近交易</h2>
            <ul className="flex flex-col gap-6">
              {MOCK_TX.map((tx) => (
                <li key={tx.id} className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <TxLeadIcon icon={tx.icon} />
                    <div className="flex min-w-0 flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="text-base font-medium text-white">{tx.title}</span>
                        {tx.tags.map((t) => (
                          <TagPill key={t.text} spec={t} />
                        ))}
                      </div>
                      <p className="text-xs text-[rgba(255,255,255,0.6)]">{tx.subtitle}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right leading-none">
                    <p className="text-base font-medium text-white">{tx.amount}</p>
                    <p className="mt-1 text-xs text-[rgba(255,255,255,0.6)]">{tx.unit}</p>
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
              重置创建流程（仅开发）
            </button>
          ) : null}
        </div>

        {/* Floating tab bar + home indicator — Figma 476:12721 + Tab */}
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex flex-col items-center bg-wallet-canvas">
          <nav
            className="pointer-events-auto mb-2 flex h-[60px] w-[295px] max-w-[calc(100%-40px)] items-center justify-between rounded-[170px] border-t-[0.5px] border-white bg-[rgba(255,255,255,0.05)] px-3.5 backdrop-blur-[7px]"
            aria-label="主导航"
          >
            <button type="button" className="flex flex-1 flex-col items-center gap-0.5 py-1">
              <img
                src={WALLET_HOME_ASSETS.tabHomeActive}
                alt=""
                className="size-6 max-w-none object-contain"
              />
              <span className="text-[10px] text-white">首页</span>
            </button>
            <button type="button" className="flex flex-1 flex-col items-center gap-0.5 py-1">
              <img
                src={WALLET_HOME_ASSETS.tabOrders}
                alt=""
                className="size-6 max-w-none object-contain opacity-90"
              />
              <span className="text-[10px] text-[rgba(255,255,255,0.4)]">订单</span>
            </button>
            <button type="button" className="flex flex-1 flex-col items-center gap-0.5 py-1">
              <img
                src={WALLET_HOME_ASSETS.tabProfile}
                alt=""
                className="size-6 max-w-none object-contain opacity-90"
              />
              <span className="text-[10px] text-[rgba(255,255,255,0.4)]">个人</span>
            </button>
          </nav>
          <div className="pointer-events-auto w-full">
            <WalletHomeIndicator />
          </div>
        </div>
      </WalletLayout>
    </Page>
  );
};
