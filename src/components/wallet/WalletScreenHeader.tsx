import type { FC, ReactNode } from 'react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';

import { useI18n } from '@/i18n/I18nProvider.tsx';

interface WalletScreenHeaderProps {
  title: string;
  onBack?: () => void;
  rightSlot?: ReactNode;
  rightSlotClassName?: string;
  titleClassName?: string;
}

export const WalletScreenHeader: FC<WalletScreenHeaderProps> = ({
  title,
  onBack,
  rightSlot,
  rightSlotClassName,
  titleClassName,
}) => {
  const navigate = useNavigate();
  const { t } = useI18n();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    navigate(-1);
  };

  return (
    <header className="grid h-11 shrink-0 grid-cols-[32px_1fr_32px] items-center gap-2 px-5">
      <button
        type="button"
        onClick={handleBack}
        className="flex size-8 items-center justify-center rounded-full text-wallet-text active:bg-white/5"
        aria-label={t('common.back')}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M15 5.5L9 12L15 18.5"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="square"
          />
        </svg>
      </button>
      <h1
        className={clsx(
          'min-w-0 truncate text-center text-[18px] font-semibold leading-none text-wallet-text',
          titleClassName,
        )}
      >
        {title}
      </h1>
      <div className={clsx('flex min-w-8 items-center justify-end', rightSlotClassName)}>
        {rightSlot}
      </div>
    </header>
  );
};
