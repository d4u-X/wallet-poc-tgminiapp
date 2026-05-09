import { openLink } from '@tma.js/sdk-react';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page.tsx';
import { WalletLayout } from '@/components/wallet/WalletLayout.tsx';
import { WalletPrimaryButton } from '@/components/wallet/WalletPrimaryButton.tsx';
import { WalletSecondaryButton } from '@/components/wallet/WalletSecondaryButton.tsx';
import { Link } from '@/components/Link/Link.tsx';

import { FIGMA_WELCOME } from '@/pages/app/onboarding/figmaAssets.ts';
import {
  readOnboardingCompleteFlag,
  useOnboardingMock,
} from '@/pages/app/onboarding/OnboardingMockContext.tsx';

const FEATURES = [
  {
    title: '非托管钱包',
    subtitle: '私钥自持，资产自己掌控',
    icon: FIGMA_WELCOME.featureIcons[0],
  },
  {
    title: '安全收款',
    subtitle: '智能检测风险，收款无忧',
    icon: FIGMA_WELCOME.featureIcons[1],
  },
  {
    title: '隐私支付',
    subtitle: '匿名交易，隐私全程保护',
    icon: FIGMA_WELCOME.featureIcons[2],
  },
] as const;

export const OnboardingWelcomePage: FC = () => {
  const navigate = useNavigate();
  const { beginOnboarding } = useOnboardingMock();
  const [importHint, setImportHint] = useState(false);

  useEffect(() => {
    if (readOnboardingCompleteFlag()) {
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  return (
    <Page back={false}>
      <WalletLayout className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-[54px] -top-[126px] h-[585px] w-[482px] opacity-60">
          <div className="relative h-full w-full">
            <img
              src={FIGMA_WELCOME.heroDecoration}
              alt=""
              className="absolute inset-0 h-full w-full max-w-none object-cover"
            />
            <div
              className="absolute inset-0 bg-[radial-gradient(circle_at_55%_38%,rgba(19,19,19,0)_0%,rgba(19,19,19,0.16)_40%,#131313_78%)]"
              aria-hidden
            />
          </div>
        </div>

        <div className="relative flex min-h-screen flex-col px-5 pb-8 pt-[76px]">
          <div className="flex flex-col items-center gap-[27px]">
            <div className="flex flex-col items-center gap-5">
              <img src={FIGMA_WELCOME.logoMark} alt="" className="h-16 w-16 object-contain" />
              <img
                src={FIGMA_WELCOME.logoWordmark}
                alt=""
                className="h-[22px] w-16 object-contain"
              />
            </div>
            <p className="max-w-[218px] text-center text-base font-normal leading-[22px] text-wallet-text-secondary">
              安全、去中心化的多链钱包
            </p>
          </div>

          <div className="relative mt-[230px] flex flex-col gap-[24px]">
            <div
              className="pointer-events-none absolute inset-x-0 top-[-14px] bottom-[-14px] rounded-[24px] bg-[linear-gradient(180deg,rgba(255,255,255,0.025)_0%,rgba(255,255,255,0)_100%)]"
              aria-hidden
            />
            {FEATURES.map((row) => (
              <div key={row.title} className="relative flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-wallet-surface-icon">
                  <img src={row.icon} alt="" className="size-5 max-w-none object-contain" />
                </div>
                <div className="flex min-w-0 flex-col gap-1 pt-0.5">
                  <p className="text-base font-medium leading-[22px] text-wallet-text">
                    {row.title}
                  </p>
                  <p className="text-xs leading-[17px] text-wallet-text-secondary">
                    {row.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-4 pt-8">
            <WalletPrimaryButton
              className="h-12 rounded-[40px] text-base font-semibold"
              onClick={() => {
                beginOnboarding();
                navigate('/onboarding/password');
              }}
            >
              创建新钱包
            </WalletPrimaryButton>
            <WalletSecondaryButton
              className="h-12 rounded-[40px] border border-wallet-border bg-wallet-surface-icon text-base font-semibold"
              onClick={() => {
                setImportHint(true);
              }}
            >
              导入已有钱包
            </WalletSecondaryButton>
            {importHint ? (
              <p className="text-center text-xs text-wallet-text-muted">导入流程即将开放（Mock）</p>
            ) : null}
          </div>

          <p className="mx-auto mt-6 max-w-[244px] text-center text-xs leading-[17px] text-wallet-text-secondary">
            <span>继续即表示您同意我们的</span>{' '}
            <button
              type="button"
              className="underline decoration-solid underline-offset-2"
              onClick={() => openLink('https://telegram.org/tos')}
            >
              服务条款
            </button>{' '}
            <span>和</span>{' '}
            <button
              type="button"
              className="underline decoration-solid underline-offset-2"
              onClick={() => openLink('https://telegram.org/privacy')}
            >
              隐私政策
            </button>
          </p>

          {import.meta.env.DEV ? (
            <Link
              to="/demo"
              className="mt-4 block text-center text-xs text-wallet-text-muted underline"
            >
              开发者：旧版 TMA Demo
            </Link>
          ) : null}
        </div>

        <div className="pointer-events-none flex h-[34px] w-full items-end justify-center pb-2">
          <div className="h-[5px] w-[134px] rounded-full bg-[#676767]" aria-hidden />
        </div>
      </WalletLayout>
    </Page>
  );
};
