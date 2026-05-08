import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page.tsx';
import { WalletInfoBanner } from '@/components/wallet/WalletInfoBanner.tsx';
import { WalletLayout } from '@/components/wallet/WalletLayout.tsx';
import { WalletPrimaryButton } from '@/components/wallet/WalletPrimaryButton.tsx';
import { WalletScreenHeader } from '@/components/wallet/WalletScreenHeader.tsx';
import { WalletTextField } from '@/components/wallet/WalletTextField.tsx';

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
        <div className="flex flex-col gap-8 px-5 pb-8 pt-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-wallet-text">设置安全密码</h2>
            <p className="text-sm text-wallet-text-secondary">此密码用于加密您的私钥，请妥善保管</p>
          </div>

          <WalletInfoBanner>
            密码无法找回，请务必牢记。建议使用包含大小写字母、数字和特殊符号的强密码。
          </WalletInfoBanner>

          <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <WalletTextField
              label="设置密码"
              type="password"
              autoComplete="new-password"
              placeholder="至少8位字符"
              value={pw}
              onChange={(ev) => setPw(ev.target.value)}
              error={pwError}
            />
            <WalletTextField
              label="确认密码"
              type="password"
              autoComplete="new-password"
              placeholder="再次输入密码"
              value={confirm}
              onChange={(ev) => setConfirm(ev.target.value)}
              error={matchError}
            />

            <div className="pb-28" />

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
