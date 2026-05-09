import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page.tsx';
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
          <div className="flex flex-col gap-[8px]">
            <h2 className="text-[32px] font-semibold leading-[34px] text-wallet-text">
              设置安全密码
            </h2>
            <p className="text-sm leading-5 text-wallet-text-secondary">
              此密码用于加密您的私钥，请妥善保管
            </p>
          </div>

          <form className="mt-11 flex flex-1 flex-col" onSubmit={onSubmit}>
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

            <WalletInfoBanner
              iconSrc={FIGMA_WELCOME.warning}
              className="mt-auto mb-10 border-[rgba(255,255,255,0.08)] bg-wallet-surface-soft"
              textClassName="text-[12px] leading-[17px]"
            >
              密码无法找回，请务必牢记。建议使用包含大小写字母、数字和特殊符号的强密码。
            </WalletInfoBanner>

            <div className="fixed bottom-0 left-0 right-0 z-10 flex justify-center bg-wallet-canvas px-9 pb-[max(24px,env(safe-area-inset-bottom))] pt-4">
              <WalletPrimaryButton type="submit" className="max-w-[303px]">
                创建钱包
              </WalletPrimaryButton>
            </div>
          </form>
        </div>
      </WalletLayout>
    </Page>
  );
};
