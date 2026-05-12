import { openLink } from '@tma.js/sdk-react';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page.tsx';
import { WalletLayout } from '@/components/wallet/WalletLayout.tsx';
import { WalletPrimaryButton } from '@/components/wallet/WalletPrimaryButton.tsx';
import { WalletSecondaryButton } from '@/components/wallet/WalletSecondaryButton.tsx';

import { useI18n } from '@/i18n/I18nProvider.tsx';
import { FIGMA_WELCOME } from '@/pages/app/onboarding/figmaAssets.ts';
import { useOnboardingMock } from '@/pages/app/onboarding/OnboardingMockContext.tsx';
import { useWalletSession } from '@/state/wallet/WalletSessionContext.tsx';

const FEATURES = [
  {
    titleKey: 'welcome.feature.nonCustodial.title',
    subtitleKey: 'welcome.feature.nonCustodial.subtitle',
    icon: FIGMA_WELCOME.featureIcons[0],
  },
  {
    titleKey: 'welcome.feature.safeReceive.title',
    subtitleKey: 'welcome.feature.safeReceive.subtitle',
    icon: FIGMA_WELCOME.featureIcons[1],
  },
  {
    titleKey: 'welcome.feature.privatePay.title',
    subtitleKey: 'welcome.feature.privatePay.subtitle',
    icon: FIGMA_WELCOME.featureIcons[2],
  },
] as const;

function safeOpenLink(url: string) {
  try {
    openLink(url);
  } catch {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

export const OnboardingWelcomePage: FC = () => {
  const navigate = useNavigate();
  const { beginOnboarding } = useOnboardingMock();
  const { status } = useWalletSession();
  const { t } = useI18n();

  useEffect(() => {
    if (status === 'unlocked') {
      navigate('/home', { replace: true });
    }
    if (status === 'locked') {
      navigate('/unlock', { replace: true });
    }
  }, [navigate, status]);

  return (
    <Page back={false}>
      <WalletLayout className="pb-0 pt-0">
        <div
          className="flex min-h-dvh w-full flex-col overflow-hidden bg-wallet-canvas px-5"
          style={{
            backgroundImage: `url(${FIGMA_WELCOME.heroDecoration})`,
            backgroundPosition: 'left -54px top -126px',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '483px 585px',
          }}
        >
          <div className="mx-auto mt-20 flex w-[218px] flex-col items-center gap-6">
            <div className="flex w-[65px] flex-col items-center gap-5">
              <img src={FIGMA_WELCOME.logoMark} alt="" className="h-16 w-[65px] object-contain" />
              <img
                src={FIGMA_WELCOME.logoWordmark}
                alt="D4U"
                className="h-[22px] w-[65px] object-contain"
              />
            </div>
            <p className="w-[218px] text-center text-base font-normal leading-normal text-wallet-text-secondary">
              {t('welcome.tagline')}
            </p>
          </div>

          <div className="mt-[65px] flex w-full flex-col gap-6">
            {FEATURES.map((row) => (
              <div key={row.titleKey} className="flex items-center gap-[11px]">
                <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-wallet-surface-icon">
                  <img src={row.icon} alt="" className="size-5 max-w-none object-contain" />
                </div>
                <div className="flex min-w-0 flex-col justify-center gap-1">
                  <p className="text-base font-medium leading-normal text-wallet-text">
                    {t(row.titleKey)}
                  </p>
                  <p className="text-xs leading-[17px] text-wallet-text-secondary">
                    {t(row.subtitleKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-[72px] flex flex-col gap-4">
            <WalletPrimaryButton
              className="h-12 rounded-[40px] text-base font-semibold shadow-none"
              onClick={() => {
                beginOnboarding();
                navigate('/onboarding/password');
              }}
            >
              {t('welcome.create')}
            </WalletPrimaryButton>
            <WalletSecondaryButton
              className="h-12 rounded-[40px] bg-wallet-surface-icon text-base font-semibold shadow-none"
              onClick={() => {
                navigate('/onboarding/import');
              }}
            >
              {t('welcome.import')}
            </WalletSecondaryButton>
          </div>

          <div className="mx-auto mt-[50px] pb-8">
            <p className="text-center text-xs leading-normal text-wallet-text-secondary">
              <span>{t('welcome.termsPrefix')}</span>{' '}
              <button
                type="button"
                className="rounded-[6px] text-wallet-text underline decoration-solid underline-offset-2 transition-opacity duration-150 hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                onClick={() => safeOpenLink('https://telegram.org/tos')}
              >
                {t('welcome.terms')}
              </button>{' '}
              <span>{t('welcome.and')}</span>{' '}
              <button
                type="button"
                className="rounded-[6px] text-wallet-text underline decoration-solid underline-offset-2 transition-opacity duration-150 hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                onClick={() => safeOpenLink('https://telegram.org/privacy')}
              >
                {t('welcome.privacy')}
              </button>
            </p>
          </div>
        </div>
      </WalletLayout>
    </Page>
  );
};
