import type { FC, FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page.tsx';
import { WalletHomeIndicator } from '@/components/wallet/WalletHomeIndicator.tsx';
import { WalletInfoBanner } from '@/components/wallet/WalletInfoBanner.tsx';
import { WalletLayout } from '@/components/wallet/WalletLayout.tsx';
import { WalletPrimaryButton } from '@/components/wallet/WalletPrimaryButton.tsx';
import { WalletScreenHeader } from '@/components/wallet/WalletScreenHeader.tsx';
import { WalletTextField } from '@/components/wallet/WalletTextField.tsx';
import { FIGMA_WELCOME } from '@/pages/app/onboarding/figmaAssets.ts';
import { useWalletSession } from '@/state/wallet/WalletSessionContext.tsx';

export const UnlockPage: FC = () => {
  const navigate = useNavigate();
  const { status, unlock } = useWalletSession();
  const [password, setPassword] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unlocked') {
      navigate('/home', { replace: true });
    }
    if (status === 'no_wallet') {
      navigate('/', { replace: true });
    }
  }, [navigate, status]);

  const passwordError = showErrors && password.length < 8 ? '密码至少需要 8 位字符' : undefined;

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setShowErrors(true);
    setSubmitError(null);
    if (password.length < 8 || submitting) return;

    try {
      setSubmitting(true);
      await unlock({ password });
      navigate('/home', { replace: true });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '解锁失败，请稍后重试。');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Page>
      <WalletLayout>
        <WalletScreenHeader title="解锁钱包" />
        <form className="flex min-h-[calc(100vh-44px)] flex-col px-5 pb-8 pt-2" onSubmit={onSubmit}>
          <WalletInfoBanner
            iconSrc={FIGMA_WELCOME.warning}
            className="border-[rgba(255,255,255,0.08)] bg-wallet-surface-soft shadow-[0_-8px_28px_rgba(255,255,255,0.018)]"
            textClassName="text-[12px] leading-[17px]"
          >
            钱包密码仅用于本地解密金库，不会上传到任何服务器。
          </WalletInfoBanner>

          <div className="relative mt-8 flex flex-col gap-[9px]">
            <div
              className="pointer-events-none absolute left-0 top-[-10px] h-[74px] w-[228px] rounded-[999px] bg-[radial-gradient(circle_at_0%_50%,rgba(255,255,255,0.05),rgba(255,255,255,0)_78%)] blur-[22px]"
              aria-hidden
            />
            <h2 className="text-[32px] font-semibold leading-[34px] text-wallet-text">
              输入钱包密码
            </h2>
            <p className="max-w-[280px] text-sm leading-5 text-wallet-text-secondary">
              切到后台会自动锁定，需要再次输入密码解锁。
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

              <WalletTextField
                label="钱包密码"
                type="password"
                autoComplete="current-password"
                placeholder="请输入密码"
                labelClassName="text-[16px] leading-5"
                inputClassName="h-12 rounded-[14px] px-4 text-[16px]"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                error={passwordError}
              />

              {submitError ? (
                <p className="mt-3 text-sm text-wallet-danger" role="alert">
                  {submitError}
                </p>
              ) : null}
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
                如果忘记密码，将无法解密本地金库。请妥善保管。
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
            <WalletPrimaryButton
              type="submit"
              className="max-w-[303px]"
              disabled={password.length < 8 || submitting || status !== 'locked'}
            >
              解锁钱包
            </WalletPrimaryButton>
            <WalletHomeIndicator />
          </div>
        </form>
      </WalletLayout>
    </Page>
  );
};
