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
            textClassName="text-[12px] leading-[17px]"
          >
            助记词是恢复钱包的唯一方式，丢失将无法找回资产。请勿截图或拍照，建议手抄在纸上并妥善保管。
          </WalletInfoBanner>

          <h3 className="mt-8 text-[25px] font-semibold leading-[25px] text-wallet-text">
            您的助记词
          </h3>

          <button
            type="button"
            onClick={() => {
              setRevealed(true);
              revealMnemonic();
            }}
            className="mt-4 flex min-h-[310px] w-full flex-col items-center justify-center rounded-[12px] bg-wallet-surface-muted ring-1 ring-wallet-border"
          >
            {!revealed ? (
              <div className="flex max-w-[196px] flex-col items-center gap-3 px-4">
                <img src={FIGMA_WELCOME.eye} alt="" className="size-12 object-contain" />
                <p className="text-center text-sm font-semibold leading-5 text-[rgba(255,255,255,0.8)]">
                  点击查看助记词
                  <br />
                  请确保周围没有其他人及摄像头
                </p>
              </div>
            ) : (
              <div className="grid w-full grid-cols-2 gap-x-[17px] gap-y-3 px-4 py-5">
                {words.map((w, i) => (
                  <div
                    key={`${i}-${w}`}
                    className="flex h-11 items-center gap-2 rounded-[10px] border border-wallet-border px-2.5"
                  >
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
          {revealed ? (
            <WalletPrimaryButton
              className="max-w-[303px]"
              onClick={() => navigate('/onboarding/mnemonic/backup')}
            >
              下一步，验证助记词
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
