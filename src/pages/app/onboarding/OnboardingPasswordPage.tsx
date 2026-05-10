import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page.tsx';
import { WalletHomeIndicator } from '@/components/wallet/WalletHomeIndicator.tsx';
import { WalletInfoBanner } from '@/components/wallet/WalletInfoBanner.tsx';
import { WalletLayout } from '@/components/wallet/WalletLayout.tsx';
import { WalletPrimaryButton } from '@/components/wallet/WalletPrimaryButton.tsx';
import { WalletScreenHeader } from '@/components/wallet/WalletScreenHeader.tsx';
import { WalletTextField } from '@/components/wallet/WalletTextField.tsx';
import { FIGMA_WELCOME } from '@/pages/app/onboarding/figmaAssets.ts';

import {
  useOnboardingGuard,
  useOnboardingMock,
} from '@/pages/app/onboarding/OnboardingMockContext.tsx';

export const OnboardingPasswordPage: FC = () => {
  const navigate = useNavigate();
  const { savePassword } = useOnboardingMock();
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  useOnboardingGuard('password');

  const pwError = showErrors && pw.length < 8 ? '密码至少需要 8 位字符' : undefined;
  const matchError = showErrors && pw !== confirm ? '两次输入的密码不一致' : undefined;
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setShowErrors(true);
    if (pw.length < 8 || pw !== confirm) return;
    savePassword(pw);
    navigate('/onboarding/mnemonic/generate');
  };

  return (
    <Page>
      <WalletLayout>
        <WalletScreenHeader title="创建钱包" />
        <div className="flex min-h-[calc(100vh-44px)] flex-col px-[22px] pb-8 pt-10">
          <div className="relative flex max-w-[290px] flex-col gap-[9px]">
            <div
              className="pointer-events-none absolute left-0 top-[-12px] h-[76px] w-[220px] rounded-[999px] bg-[radial-gradient(circle_at_0%_50%,rgba(255,255,255,0.05),rgba(255,255,255,0)_78%)] blur-[22px]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute left-0 top-[-2px] h-[46px] w-[170px] rounded-[999px] bg-[radial-gradient(circle_at_0%_50%,rgba(255,255,255,0.035),rgba(255,255,255,0)_76%)] blur-[16px]"
              aria-hidden
            />
            <h2 className="text-[32px] font-semibold leading-[34px] text-wallet-text">
              设置安全密码
            </h2>
            <p className="max-w-[248px] text-sm leading-5 text-wallet-text-secondary">
              此密码用于加密您的私钥，请妥善保管
            </p>
          </div>

          <form className="mt-8 flex flex-1 flex-col" onSubmit={onSubmit}>
            <div className="relative rounded-[20px] bg-[linear-gradient(180deg,rgba(255,255,255,0.022)_0%,rgba(255,255,255,0)_100%)] px-3 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
              <div
                className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.16),rgba(255,255,255,0))]"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute left-1/2 top-0 h-10 w-[220px] -translate-x-1/2 rounded-[999px] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.04),rgba(255,255,255,0)_72%)] blur-[16px]"
                aria-hidden
              />
              <WalletTextField
                label="设置密码"
                type="password"
                autoComplete="new-password"
                placeholder="至少8位字符"
                labelClassName="text-[16px] leading-5"
                inputClassName="h-12 rounded-[14px] px-4 text-[16px]"
                value={pw}
                onChange={(ev) => setPw(ev.target.value)}
                error={pwError}
              />
              <WalletTextField
                className="mt-8"
                label="确认密码"
                type="password"
                autoComplete="new-password"
                placeholder="再次输入密码"
                labelClassName="text-[16px] leading-5"
                inputClassName="h-12 rounded-[14px] px-4 text-[16px]"
                value={confirm}
                onChange={(ev) => setConfirm(ev.target.value)}
                error={matchError}
              />
            </div>

            <div className="relative mt-auto mb-[90px]">
              <div
                className="pointer-events-none absolute inset-x-6 top-[-10px] h-10 rounded-[999px] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.045),rgba(255,255,255,0)_75%)] blur-[16px]"
                aria-hidden
              />
              <WalletInfoBanner
                iconSrc={FIGMA_WELCOME.warning}
                className="border-[rgba(255,255,255,0.08)] bg-wallet-surface-soft shadow-[0_-8px_32px_rgba(255,255,255,0.02)]"
                textClassName="text-[12px] leading-[17px]"
              >
                密码无法找回，请务必牢记。建议使用包含大小写字母、数字和特殊符号的强密码。
              </WalletInfoBanner>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-10 flex flex-col items-center bg-wallet-canvas px-9 pb-[env(safe-area-inset-bottom)] pt-3">
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-[linear-gradient(180deg,rgba(19,19,19,0.01)_0%,rgba(19,19,19,0.94)_100%)]"
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
                type="submit"
                className="max-w-[303px] shadow-[0_14px_34px_rgba(255,255,255,0.045)]"
              >
                创建钱包
              </WalletPrimaryButton>
              <WalletHomeIndicator />
            </div>
          </form>
        </div>
      </WalletLayout>
    </Page>
  );
};
