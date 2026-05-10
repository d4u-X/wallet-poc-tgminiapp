import type { ButtonHTMLAttributes, FC } from 'react';
import { clsx } from 'clsx';

export const WalletSecondaryButton: FC<
  ButtonHTMLAttributes<HTMLButtonElement> & { fullWidth?: boolean }
> = ({ className, fullWidth = true, disabled, children, ...rest }) => (
  <button
    type="button"
    disabled={disabled}
    className={clsx(
      'flex h-12 items-center justify-center rounded-[var(--radius-wallet-pill)] bg-wallet-surface-icon px-4 text-base font-semibold text-wallet-text transition-[transform,opacity,background-color,box-shadow] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20',
      fullWidth && 'w-full',
      disabled && 'cursor-not-allowed opacity-40',
      !disabled &&
        'shadow-[0_10px_24px_rgba(255,255,255,0.015)] hover:bg-[rgba(255,255,255,0.12)] active:scale-[0.985] active:opacity-95 active:shadow-[0_8px_18px_rgba(255,255,255,0.02)]',
      className,
    )}
    {...rest}
  >
    {children}
  </button>
);
