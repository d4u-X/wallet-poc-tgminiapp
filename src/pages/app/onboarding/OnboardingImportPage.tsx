import type { FC, FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page.tsx';
import { WalletHomeIndicator } from '@/components/wallet/WalletHomeIndicator.tsx';
import { WalletInfoBanner } from '@/components/wallet/WalletInfoBanner.tsx';
import { WalletLayout } from '@/components/wallet/WalletLayout.tsx';
import { WalletPrimaryButton } from '@/components/wallet/WalletPrimaryButton.tsx';
import { WalletScreenHeader } from '@/components/wallet/WalletScreenHeader.tsx';
import { WalletTextField } from '@/components/wallet/WalletTextField.tsx';
import { FIGMA_WELCOME } from '@/pages/app/onboarding/figmaAssets.ts';
import { useOnboardingMock } from '@/pages/app/onboarding/OnboardingMockContext.tsx';

function normalizeMnemonic(value: string): string[] {
  return value.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

export const OnboardingImportPage: FC = () => {
  const navigate = useNavigate();
  const { onboardingComplete, importWallet } = useOnboardingMock();
  const [mnemonicInput, setMnemonicInput] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (onboardingComplete) {
      navigate('/home', { replace: true });
    }
  }, [navigate, onboardingComplete]);

  const mnemonicWords = useMemo(() => normalizeMnemonic(mnemonicInput), [mnemonicInput]);
  const mnemonicError =
    showErrors && mnemonicWords.length !== 12 && mnemonicWords.length !== 24
      ? '请输入 12 或 24 个助记词'
      : undefined;
  const passwordError = showErrors && password.length < 8 ? '密码至少需要 8 位字符' : undefined;
  const confirmError =
    showErrors && password !== confirmPassword ? '两次输入的密码不一致' : undefined;

  const canSubmit =
    (mnemonicWords.length === 12 || mnemonicWords.length === 24) &&
    password.length >= 8 &&
    password === confirmPassword;

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setShowErrors(true);
    if (!canSubmit) return;
    importWallet(password);
    navigate('/home', { replace: true });
  };

  return (
    <Page>
      <WalletLayout>
        <WalletScreenHeader title="导入钱包" />
        <form className="flex min-h-[calc(100vh-44px)] flex-col px-5 pb-8 pt-2" onSubmit={onSubmit}>
          <WalletInfoBanner
            iconSrc={FIGMA_WELCOME.warning}
            className="border-[rgba(255,255,255,0.08)] bg-wallet-surface-soft shadow-[0_-8px_28px_rgba(255,255,255,0.018)]"
            textClassName="text-[12px] leading-[17px]"
          >
            当前先接通导入交互与产品流程。真实助记词校验、解密与链上钱包恢复将在后续接入。
          </WalletInfoBanner>

          <div className="relative mt-8 flex flex-col gap-[9px]">
            <div
              className="pointer-events-none absolute left-0 top-[-10px] h-[74px] w-[228px] rounded-[999px] bg-[radial-gradient(circle_at_0%_50%,rgba(255,255,255,0.05),rgba(255,255,255,0)_78%)] blur-[22px]"
              aria-hidden
            />
            <h2 className="text-[32px] font-semibold leading-[34px] text-wallet-text">
              导入已有钱包
            </h2>
            <p className="max-w-[280px] text-sm leading-5 text-wallet-text-secondary">
              输入助记词并设置钱包密码，完成后将直接进入首页。
            </p>
          </div>

          <div className="mt-8 flex flex-1 flex-col">
            <div className="relative rounded-[20px] bg-[linear-gradient(180deg,rgba(255,255,255,0.022)_0%,rgba(255,255,255,0)_100%)] px-3 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
              <div
                className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.16),rgba(255,255,255,0))]"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute left-1/2 top-0 h-10 w-[220px] -translate-x-1/2 rounded-[999px] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.04),rgba(255,255,255,0)_72%)] blur-[16px]"
                aria-hidden
              />

              <div className="flex flex-col gap-3">
                <label htmlFor="import-mnemonic" className="text-[16px] leading-5 text-wallet-text">
                  助记词
                </label>
                <div className="group relative">
                  <div
                    className="pointer-events-none absolute inset-0 rounded-[16px] bg-[linear-gradient(180deg,rgba(255,255,255,0.035)_0%,rgba(255,255,255,0)_100%)] transition-opacity duration-150 group-focus-within:opacity-0"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute inset-0 rounded-[16px] opacity-0 shadow-[0_0_0_1px_rgba(255,255,255,0.16),0_0_24px_rgba(255,255,255,0.05)] transition-opacity duration-150 group-focus-within:opacity-100"
                    aria-hidden
                  />
                  <textarea
                    id="import-mnemonic"
                    rows={4}
                    autoComplete="off"
                    spellCheck={false}
                    value={mnemonicInput}
                    onChange={(event) => setMnemonicInput(event.target.value)}
                    placeholder="请输入 12 或 24 个助记词，使用空格分隔"
                    className="relative min-h-[116px] w-full resize-none rounded-[16px] border border-wallet-border bg-wallet-surface-muted px-4 py-3 text-[15px] leading-6 text-wallet-text outline-none transition-[border-color,background-color] duration-150 placeholder:text-wallet-text-muted focus:border-wallet-border-strong focus:bg-[rgba(255,255,255,0.06)]"
                  />
                </div>
                {mnemonicError ? (
                  <p className="text-xs text-wallet-danger" role="alert">
                    {mnemonicError}
                  </p>
                ) : (
                  <p className="text-xs leading-[17px] text-wallet-text-muted">
                    当前版本支持 12 或 24 个单词的导入占位流程。
                  </p>
                )}
              </div>

              <WalletTextField
                className="mt-8"
                label="设置密码"
                type="password"
                autoComplete="new-password"
                placeholder="至少8位字符"
                labelClassName="text-[16px] leading-5"
                inputClassName="h-12 rounded-[14px] px-4 text-[16px]"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                error={passwordError}
              />

              <WalletTextField
                className="mt-8"
                label="确认密码"
                type="password"
                autoComplete="new-password"
                placeholder="再次输入密码"
                labelClassName="text-[16px] leading-5"
                inputClassName="h-12 rounded-[14px] px-4 text-[16px]"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                error={confirmError}
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
                导入成功后会直接进入首页；当前版本仅打通产品路径，不会执行真实的助记词恢复。
              </WalletInfoBanner>
            </div>
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
            <WalletPrimaryButton type="submit" className="max-w-[303px]" disabled={!canSubmit}>
              导入钱包
            </WalletPrimaryButton>
            <WalletHomeIndicator />
          </div>
        </form>
      </WalletLayout>
    </Page>
  );
};
