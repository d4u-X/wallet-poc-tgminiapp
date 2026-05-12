import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page.tsx';
import {
  WalletBottomAction,
  WalletFormScreen,
  WalletLayout,
  WalletScreenIntro,
} from '@/components/wallet/WalletLayout.tsx';
import { WalletInfoBanner } from '@/components/wallet/WalletInfoBanner.tsx';
import { WalletPrimaryButton } from '@/components/wallet/WalletPrimaryButton.tsx';
import { WalletScreenHeader } from '@/components/wallet/WalletScreenHeader.tsx';
import { WalletTextField } from '@/components/wallet/WalletTextField.tsx';
import { useI18n } from '@/i18n/I18nProvider.tsx';

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
  const { t } = useI18n();

  useOnboardingGuard('password');

  const pwError = showErrors && pw.length < 8 ? t('common.passwordMinError') : undefined;
  const matchError = showErrors && pw !== confirm ? t('common.passwordMismatchError') : undefined;
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setShowErrors(true);
    if (pw.length < 8 || pw !== confirm) return;
    savePassword(pw);
    navigate('/onboarding/mnemonic/generate');
  };

  return (
    <Page>
      <WalletLayout className="pb-0">
        <WalletScreenHeader title={t('password.header')} />
        <WalletFormScreen onSubmit={onSubmit}>
          <WalletScreenIntro title={t('password.title')} subtitle={t('password.subtitle')} />

          <WalletInfoBanner
            className="mt-6 items-center border-[0.5px] border-wallet-border bg-wallet-surface-muted px-3 py-3"
            textClassName="text-[12px] leading-normal text-wallet-text"
          >
            {t('password.warning')}
          </WalletInfoBanner>

          <div className="mt-10 flex flex-col gap-8">
            <WalletTextField
              label={t('password.setLabel')}
              type="password"
              autoComplete="new-password"
              placeholder={t('password.setPlaceholder')}
              labelClassName="text-[16px] leading-normal"
              inputClassName="h-11 rounded-[12px] border-transparent bg-wallet-surface-muted px-3 text-[16px] focus:border-transparent focus:bg-wallet-surface-muted"
              value={pw}
              onChange={(ev) => setPw(ev.target.value)}
              error={pwError}
            />
            <WalletTextField
              label={t('password.confirmLabel')}
              type="password"
              autoComplete="new-password"
              placeholder={t('password.confirmPlaceholder')}
              labelClassName="text-[16px] leading-normal"
              inputClassName="h-11 rounded-[12px] border-transparent bg-wallet-surface-muted px-3 text-[16px] focus:border-transparent focus:bg-wallet-surface-muted"
              value={confirm}
              onChange={(ev) => setConfirm(ev.target.value)}
              error={matchError}
            />
          </div>

          <WalletBottomAction>
            <WalletPrimaryButton type="submit" className="shadow-none">
              {t('password.submit')}
            </WalletPrimaryButton>
          </WalletBottomAction>
        </WalletFormScreen>
      </WalletLayout>
    </Page>
  );
};
