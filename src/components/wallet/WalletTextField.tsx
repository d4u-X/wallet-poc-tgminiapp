import type { FC, InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface WalletTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const WalletTextField: FC<WalletTextFieldProps> = ({
  label,
  error,
  className,
  id,
  ...rest
}) => {
  const inputId = id ?? label.replace(/\s/g, '-');

  return (
    <div className={clsx('flex w-full flex-col gap-3', className)}>
      <label htmlFor={inputId} className="text-base text-wallet-text">
        {label}
      </label>
      <input
        id={inputId}
        className={clsx(
          'h-11 w-full rounded-[var(--radius-wallet-field)] bg-wallet-surface-muted px-3 text-base text-wallet-text outline-none ring-1 ring-transparent placeholder:text-wallet-text-muted focus:ring-wallet-border',
          error && 'ring-wallet-danger',
        )}
        {...rest}
      />
      {error ? (
        <p className="text-xs text-wallet-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
};
