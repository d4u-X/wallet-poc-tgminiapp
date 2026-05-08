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
        <div className="pointer-events-none absolute -left-28 -top-36 size-[120vw] opacity-40">
          <div className="relative size-full rotate-90">
            <img
              src={FIGMA_WELCOME.heroDecoration}
              alt=""
              className="absolute inset-0 size-full max-w-none object-cover"
            />
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(19,19,19,0)_0%,#131313_75%)]"
              aria-hidden
            />
          </div>
        </div>

        <div className="relative flex flex-col px-5 pb-8 pt-14">
          <div className="flex flex-col items-center gap-5">
            <div className="flex flex-col items-center gap-5">
              <img
                src={FIGMA_WELCOME.logoMark}
                alt=""
                className="size-16 rounded-2xl object-cover"
              />
              <div className="flex items-end justify-center gap-1">
                {FIGMA_WELCOME.logoD4.map((src) => (
                  <img key={src} src={src} alt="" className="h-[22px] w-auto object-contain" />
                ))}
              </div>
            </div>
            <p className="max-w-[218px] text-center text-base text-wallet-text-secondary">
              安全、去中心化的多链钱包
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-6">
            {FEATURES.map((row) => (
              <div key={row.title} className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-wallet-card)] bg-wallet-surface-icon">
                  <img src={row.icon} alt="" className="size-5 object-contain" />
                </div>
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="text-base font-medium text-wallet-text">{row.title}</p>
                  <p className="text-xs text-wallet-text-secondary">{row.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-4 pt-16">
            <WalletPrimaryButton
              onClick={() => {
                beginOnboarding();
                navigate('/onboarding/password');
              }}
            >
              创建新钱包
            </WalletPrimaryButton>
            <WalletSecondaryButton
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

          <p className="mt-6 text-center text-xs leading-relaxed text-wallet-text-secondary">
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
