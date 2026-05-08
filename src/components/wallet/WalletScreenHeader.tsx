import type { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface WalletScreenHeaderProps {
  title: string;
  onBack?: () => void;
  rightSlot?: ReactNode;
}

export const WalletScreenHeader: FC<WalletScreenHeaderProps> = ({ title, onBack, rightSlot }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    navigate(-1);
  };

  return (
    <header className="relative grid h-11 shrink-0 grid-cols-[2rem_1fr_2rem] items-center px-5">
      <button
        type="button"
        onClick={handleBack}
        className="flex size-8 items-center justify-center text-wallet-text"
        aria-label="返回"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="m14 6-6 6 6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <h1 className="truncate text-center text-lg font-semibold">{title}</h1>
      <div className="flex justify-end">{rightSlot}</div>
    </header>
  );
};
