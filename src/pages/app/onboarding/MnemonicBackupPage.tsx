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
            textClassName="text-[12px] leading-[17px]"
          >
            助记词是恢复钱包的唯一方式，丢失将无法找回资产。请勿截图或拍照，建议手抄在纸上并妥善保管。
          </WalletInfoBanner>

          <h3 className="mt-8 text-[25px] font-semibold leading-[25px] text-wallet-text">
            您的助记词
          </h3>

          <div className="mt-4 flex flex-col gap-4">
            {rows.map((pair, rowIdx) => (
              <div key={rowIdx} className="flex gap-4">
                {pair.map(([idx, w]) => (
                  <div
                    key={idx}
                    className="flex h-11 flex-1 items-center gap-2 rounded-[10px] border-[0.5px] border-wallet-border-strong px-2"
                  >
                    <span className="w-5 shrink-0 text-center text-sm text-wallet-text-muted">
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
            className="mt-4 flex h-8 w-[80px] items-center justify-center gap-1 rounded-[40px] bg-wallet-surface-muted px-2 text-sm font-semibold text-wallet-text"
          >
            <img src={FIGMA_WELCOME.eye} alt="" className="size-4 object-contain" />
            {hidden ? '显示' : '隐藏'}
          </button>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-10 flex flex-col items-center bg-wallet-canvas pb-[env(safe-area-inset-bottom)] pt-3">
          <WalletPrimaryButton
            className="max-w-[303px]"
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
