import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page.tsx';
import { WalletHomeIndicator } from '@/components/wallet/WalletHomeIndicator.tsx';
import { WalletInfoBanner } from '@/components/wallet/WalletInfoBanner.tsx';
import { WalletLayout } from '@/components/wallet/WalletLayout.tsx';
import { WalletPrimaryButton } from '@/components/wallet/WalletPrimaryButton.tsx';
import { WalletScreenHeader } from '@/components/wallet/WalletScreenHeader.tsx';
import { FIGMA_WELCOME } from '@/pages/app/onboarding/figmaAssets.ts';

import {
  useOnboardingGuard,
  useOnboardingMock,
} from '@/pages/app/onboarding/OnboardingMockContext.tsx';

export const MnemonicBackupPage: FC = () => {
  const navigate = useNavigate();
  const { mnemonic, ensureMnemonic, markMnemonicBackedUp } = useOnboardingMock();
  const [hidden, setHidden] = useState(false);

  useOnboardingGuard('backup');

  useEffect(() => {
    ensureMnemonic();
  }, [ensureMnemonic]);

  const rows = useMemo(() => {
    const list = mnemonic ?? [];
    const out: [number, string][] = list.map((w, i) => [i, w]);
    const pairs: (typeof out)[] = [];
    for (let i = 0; i < out.length; i += 2) {
      pairs.push(out.slice(i, i + 2));
    }
    return pairs;
  }, [mnemonic]);

  return (
    <Page>
      <WalletLayout>
        <WalletScreenHeader title="备份助记词" />
        <div className="flex flex-col px-5 pb-48 pt-2">
          <WalletInfoBanner
            iconSrc={FIGMA_WELCOME.warning}
            className="border-[rgba(255,255,255,0.08)] bg-wallet-surface-soft shadow-[0_-8px_28px_rgba(255,255,255,0.018)]"
            textClassName="text-[12px] leading-[17px]"
          >
            助记词是恢复钱包的唯一方式，丢失将无法找回资产。请勿截图或拍照，建议手抄在纸上并妥善保管。
          </WalletInfoBanner>

          <div className="relative mt-8 flex flex-col gap-1.5">
            <div
              className="pointer-events-none absolute left-0 top-[-8px] h-[54px] w-[168px] rounded-[999px] bg-[radial-gradient(circle_at_0%_50%,rgba(255,255,255,0.04),rgba(255,255,255,0)_76%)] blur-[18px]"
              aria-hidden
            />
            <h3 className="text-[25px] font-semibold leading-[25px] text-wallet-text">
              您的助记词
            </h3>
          </div>

          <div className="relative mt-4 flex flex-col gap-3.5 rounded-[18px] bg-[linear-gradient(180deg,rgba(255,255,255,0.024)_0%,rgba(255,255,255,0)_100%)] px-2 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
            <div
              className="pointer-events-none absolute left-1/2 top-0 h-[48px] w-[220px] -translate-x-1/2 rounded-[999px] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),rgba(255,255,255,0)_75%)] blur-[16px]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.14),rgba(255,255,255,0))]"
              aria-hidden
            />
            {rows.map((pair, rowIdx) => (
              <div key={rowIdx} className="flex gap-3">
                {pair.map(([idx, w]) => (
                  <div
                    key={idx}
                    className="relative flex h-[46px] flex-1 items-center gap-2 rounded-[11px] border-[0.5px] border-wallet-border-strong bg-[linear-gradient(180deg,rgba(255,255,255,0.024)_0%,rgba(255,255,255,0.008)_100%)] px-2.5"
                  >
                    <div
                      className="pointer-events-none absolute inset-x-2 top-0 h-px bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.16),rgba(255,255,255,0))]"
                      aria-hidden
                    />
                    <span className="w-6 shrink-0 text-center text-sm text-wallet-text-muted">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="h-4 w-px shrink-0 bg-white/20" aria-hidden />
                    <span className="min-w-0 flex-1 truncate text-base font-semibold capitalize text-wallet-text">
                      {hidden ? '••••••' : w}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setHidden((v) => !v)}
            className="mt-4 flex h-8 w-[84px] items-center justify-center gap-1 rounded-[40px] border border-[rgba(255,255,255,0.08)] bg-wallet-surface-muted px-2 text-sm font-semibold text-wallet-text shadow-[0_8px_18px_rgba(255,255,255,0.015)] transition-[transform,background-color,box-shadow] duration-150 ease-out hover:bg-[rgba(255,255,255,0.08)] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          >
            <img src={FIGMA_WELCOME.eye} alt="" className="size-4 object-contain" />
            {hidden ? '显示' : '隐藏'}
          </button>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-10 flex flex-col items-center bg-wallet-canvas pb-[env(safe-area-inset-bottom)] pt-3">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-[linear-gradient(180deg,rgba(19,19,19,0.02)_0%,rgba(19,19,19,0.94)_100%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.12),rgba(255,255,255,0))]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-12 w-[236px] -translate-x-1/2 rounded-[999px] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.045),rgba(255,255,255,0)_72%)] blur-[18px]"
            aria-hidden
          />
          <WalletPrimaryButton
            className="max-w-[303px] shadow-[0_14px_34px_rgba(255,255,255,0.045)]"
            onClick={() => {
              markMnemonicBackedUp();
              navigate('/onboarding/mnemonic/verify?tab=random');
            }}
          >
            下一步，验证助记词
          </WalletPrimaryButton>
          <WalletHomeIndicator />
        </div>
      </WalletLayout>
    </Page>
  );
};
