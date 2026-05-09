import type { FC, ReactNode } from 'react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';

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

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    navigate(-1);
  };

  return (
    <header className="relative flex h-11 shrink-0 items-center justify-between px-5">
      <button
        type="button"
        onClick={handleBack}
        className="z-[1] flex size-8 items-center justify-center rounded-full text-wallet-text active:bg-white/5"
        aria-label="返回"
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
          'pointer-events-none absolute left-1/2 top-1/2 max-w-[180px] -translate-x-1/2 -translate-y-1/2 truncate text-center text-[18px] font-semibold leading-none text-wallet-text',
          titleClassName,
        )}
      >
        {title}
      </h1>
      <div className={clsx('z-[1] flex min-w-8 items-center justify-end', rightSlotClassName)}>
        {rightSlot}
      </div>
    </header>
  );
};
