import type { FC } from 'react';
import { useEffect, useState } from 'react';
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

export const MnemonicGeneratePage: FC = () => {
  const navigate = useNavigate();
  const { mnemonic, ensureMnemonic, revealMnemonic, mnemonicRevealed } = useOnboardingMock();
  const [revealed, setRevealed] = useState(mnemonicRevealed);

  useOnboardingGuard('generate');

  useEffect(() => {
    ensureMnemonic();
  }, [ensureMnemonic]);

  const words = mnemonic ?? [];

  return (
    <Page>
      <WalletLayout>
        <WalletScreenHeader title="备份助记词" />
        <div className="flex flex-col px-5 pb-44 pt-2">
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

          <button
            type="button"
            onClick={() => {
              setRevealed(true);
              revealMnemonic();
            }}
            className="relative mt-4 flex min-h-[310px] w-full flex-col items-center justify-center overflow-hidden rounded-[14px] border border-wallet-border bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.008)_32%,rgba(255,255,255,0)_100%)]"
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0)_36%)]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute left-1/2 top-6 h-16 w-[180px] -translate-x-1/2 rounded-[999px] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),rgba(255,255,255,0)_72%)] blur-[20px]"
              aria-hidden
            />
            {!revealed ? (
              <div className="relative flex max-w-[196px] flex-col items-center gap-3.5 px-4">
                <img src={FIGMA_WELCOME.eye} alt="" className="size-12 object-contain" />
                <p className="text-center text-sm font-semibold leading-5 text-[rgba(255,255,255,0.8)]">
                  点击查看助记词
                  <br />
                  请确保周围没有其他人及摄像头
                </p>
              </div>
            ) : (
              <div className="relative grid w-full grid-cols-2 gap-x-[17px] gap-y-3 px-4 py-5">
                {words.map((w, i) => (
                  <div
                    key={`${i}-${w}`}
                    className="relative flex h-11 items-center gap-2 rounded-[10px] border border-wallet-border px-2.5 bg-[linear-gradient(180deg,rgba(255,255,255,0.024)_0%,rgba(255,255,255,0.008)_100%)]"
                  >
                    <div
                      className="pointer-events-none absolute inset-x-2 top-0 h-px bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.16),rgba(255,255,255,0))]"
                      aria-hidden
                    />
                    <span className="w-5 shrink-0 text-center text-sm text-wallet-text-muted">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="h-4 w-px shrink-0 bg-white/20" aria-hidden />
                    <span className="truncate text-base font-semibold capitalize text-wallet-text">
                      {w}
                    </span>
                  </div>
                ))}
              </div>
            )}
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
          {revealed ? (
            <WalletPrimaryButton
              className="max-w-[303px] shadow-[0_14px_34px_rgba(255,255,255,0.045)]"
              onClick={() => navigate('/onboarding/mnemonic/backup')}
            >
              下一步，备份助记词
            </WalletPrimaryButton>
          ) : (
            <div className="h-12 w-[303px]" aria-hidden />
          )}
          <WalletHomeIndicator />
        </div>
      </WalletLayout>
    </Page>
  );
};
