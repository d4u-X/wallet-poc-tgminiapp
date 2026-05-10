import type { ButtonHTMLAttributes, FC } from 'react';
import { clsx } from 'clsx';

export const WalletPrimaryButton: FC<
  ButtonHTMLAttributes<HTMLButtonElement> & { fullWidth?: boolean }
> = ({ className, fullWidth = true, disabled, children, ...rest }) => (
  <button
    type="button"
    disabled={disabled}
    className={clsx(
      'flex h-12 items-center justify-center rounded-[var(--radius-wallet-pill)] bg-wallet-primary-btn px-4 text-base font-semibold text-wallet-primary-btn-text transition-[transform,opacity,box-shadow,filter] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30',
      fullWidth && 'w-full',
      disabled && 'cursor-not-allowed opacity-40 saturate-0',
      !disabled &&
        'shadow-[0_12px_30px_rgba(255,255,255,0.04)] hover:brightness-[1.02] active:scale-[0.985] active:opacity-95 active:shadow-[0_8px_20px_rgba(255,255,255,0.035)]',
      className,
    )}
    {...rest}
  >
    {children}
  </button>
);
