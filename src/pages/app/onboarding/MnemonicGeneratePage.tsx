import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCopyToClipboard } from 'react-use';
import { Page } from '@/components/Page.tsx';
import { WalletInfoBanner } from '@/components/wallet/WalletInfoBanner.tsx';
import { WalletLayout } from '@/components/wallet/WalletLayout.tsx';
import { WalletPrimaryButton } from '@/components/wallet/WalletPrimaryButton.tsx';
import { WalletScreenHeader } from '@/components/wallet/WalletScreenHeader.tsx';
import { useI18n } from '@/i18n/I18nProvider.tsx';
import { FIGMA_WELCOME } from '@/pages/app/onboarding/figmaAssets.ts';

import {
  useOnboardingGuard,
  useOnboardingMock,
} from '@/pages/app/onboarding/OnboardingMockContext.tsx';

export const MnemonicGeneratePage: FC = () => {
  const navigate = useNavigate();
  const { mnemonic, ensureMnemonic, revealMnemonic, mnemonicRevealed, markMnemonicBackedUp } =
    useOnboardingMock();
  const [revealed, setRevealed] = useState(mnemonicRevealed);
  const { t } = useI18n();

  useOnboardingGuard('generate');

  useEffect(() => {
    ensureMnemonic();
  }, [ensureMnemonic]);

  const words = mnemonic ?? [];

  console.log('wordswordswords', words);

  const [, copy] = useCopyToClipboard();

  const onCopy = () => {
    copy(words.toString());
  };

  return (
    <Page>
      <WalletLayout>
        <WalletScreenHeader title={t('mnemonic.header')} />
        <div className="flex flex-col px-5  pt-2">
          <WalletInfoBanner
            iconSrc={FIGMA_WELCOME.warning}
            className="border-[rgba(255,255,255,0.08)] items-center bg-wallet-surface-soft shadow-[0_-8px_28px_rgba(255,255,255,0.018)]"
            textClassName="text-[12px] leading-[17px]"
          >
            {t('mnemonic.warning')}
          </WalletInfoBanner>

          <div className=" mt-5 flex justify-between  items-center">
            <h3 className="text-[16px] font-semibold leading-[25px] text-wallet-text">
              {t('mnemonic.title')}
            </h3>

            <div onClick={() => onCopy()} className="bg-[#FFFFFF0D] rounded-4xl p-2">
              Copy
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setRevealed(true);
              revealMnemonic();
            }}
            className={`relative mt-5 flex min-h-[310px] w-full flex-col items-center justify-center overflow-hidden rounded-[14px]  ${!revealed && 'border'} border-wallet-border `}
          >
            <div
              className={`pointer-events-none absolute inset-0 ${!revealed && 'bg-[#FFFFFF1A]'} `}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute left-1/2  top-6 h-16 w-[180px] -translate-x-1/2 rounded-[999px] "
              aria-hidden
            />
            {!revealed ? (
              <div className="relative flex max-w-[196px] flex-col items-center gap-3.5 px-4">
                <img src={FIGMA_WELCOME.eye} alt="" className="size-12 object-contain" />
                <p className="text-center text-sm font-semibold leading-5 text-[rgba(255,255,255,0.8)]">
                  {t('mnemonic.revealTitle')}
                  <br />
                  {t('mnemonic.revealSubtitle')}
                </p>
              </div>
            ) : (
              <div
                className={`relative grid w-full grid-cols-2 gap-x-[17px] gap-y-3  ${!revealed && 'px-4 py-5'} `}
              >
                {words.map((w, i) => (
                  <div
                    key={`${i}-${w}`}
                    className="relative flex h-11 items-center gap-2 rounded-[10px] border border-wallet-border px-2.5 "
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
          {revealed && (
            <div
              className="justify-end mt-4  flex "
              onClick={() => {
                setRevealed(false);
                revealMnemonic();
              }}
            >
              <div className="w-auto text-[.875rem] flex items-center gap-1 bg-[#FFFFFF0D] rounded-4xl p-1.5">
                <img src="./images/eye.svg" />
                {t('mnemonic.hidden')}
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-5 w-full flex flex-col items-center bg-wallet-canvas  ">
          <WalletPrimaryButton
            className="max-w-[303px] shadow-[0_14px_34px_rgba(255,255,255,0.045)]"
            onClick={() => {
              markMnemonicBackedUp();
              navigate('/onboarding/mnemonic/verify?tab=random');
            }}
          >
            {t('mnemonic.nextVerify')}
          </WalletPrimaryButton>
        </div>
      </WalletLayout>
    </Page>
  );
};
