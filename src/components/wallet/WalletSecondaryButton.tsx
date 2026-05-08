import type { ButtonHTMLAttributes, FC } from 'react';
import { clsx } from 'clsx';

export const WalletSecondaryButton: FC<
  ButtonHTMLAttributes<HTMLButtonElement> & { fullWidth?: boolean }
> = ({ className, fullWidth = true, disabled, children, ...rest }) => (
  <button
    type="button"
    disabled={disabled}
    className={clsx(
      'flex h-12 items-center justify-center rounded-[var(--radius-wallet-pill)] bg-wallet-surface-icon px-4 text-base font-semibold text-wallet-text transition-opacity',
      fullWidth && 'w-full',
      disabled && 'cursor-not-allowed opacity-40',
      !disabled && 'active:opacity-90',
      className,
    )}
    {...rest}
  >
    {children}
  </button>
);
