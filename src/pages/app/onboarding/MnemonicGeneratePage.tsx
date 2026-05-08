import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page.tsx';
import { WalletHomeIndicator } from '@/components/wallet/WalletHomeIndicator.tsx';
import { WalletInfoBanner } from '@/components/wallet/WalletInfoBanner.tsx';
import { WalletLayout } from '@/components/wallet/WalletLayout.tsx';
import { WalletPrimaryButton } from '@/components/wallet/WalletPrimaryButton.tsx';
import { WalletScreenHeader } from '@/components/wallet/WalletScreenHeader.tsx';

import {
  useOnboardingGuard,
  useOnboardingMock,
} from '@/pages/app/onboarding/OnboardingMockContext.tsx';

function EyeGraphic() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden>
      <ellipse
        cx="24"
        cy="24"
        rx="18"
        ry="11"
        stroke="white"
        strokeOpacity="0.45"
        strokeWidth="1.5"
      />
      <circle cx="24" cy="24" r="5.5" fill="white" fillOpacity="0.85" />
    </svg>
  );
}

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
          <WalletInfoBanner>
            助记词是恢复钱包的唯一方式，丢失将无法找回资产。请勿截图或拍照，建议手抄在纸上并妥善保管。
          </WalletInfoBanner>

          <h3 className="mt-8 text-lg font-semibold text-wallet-text">您的助记词</h3>

          <button
            type="button"
            onClick={() => {
              setRevealed(true);
              revealMnemonic();
            }}
            className="mt-4 flex min-h-[310px] w-full flex-col items-center justify-center rounded-[var(--radius-wallet-field)] bg-wallet-surface-muted ring-1 ring-wallet-border"
          >
            {!revealed ? (
              <div className="flex max-w-[196px] flex-col items-center gap-3 px-4">
                <EyeGraphic />
                <p className="text-center text-sm font-semibold leading-normal text-[rgba(255,255,255,0.8)]">
                  点击查看助记词
                </p>
                <p className="text-center text-sm font-semibold leading-normal text-[rgba(255,255,255,0.8)]">
                  请确保周围没有其他人及摄像头
                </p>
              </div>
            ) : (
              <div className="grid w-full grid-cols-3 gap-2 p-4">
                {words.map((w, i) => (
                  <div
                    key={`${i}-${w}`}
                    className="rounded-lg bg-wallet-surface-icon px-2 py-2 text-center text-sm text-wallet-text"
                  >
                    <span className="text-wallet-text-muted">{i + 1}. </span>
                    {w}
                  </div>
                ))}
              </div>
            )}
          </button>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-10 flex flex-col items-center bg-wallet-canvas pb-[env(safe-area-inset-bottom)] pt-3">
          {revealed ? (
            <WalletPrimaryButton
              className="max-w-[303px]"
              onClick={() => navigate('/onboarding/mnemonic/backup')}
            >
              下一步
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
