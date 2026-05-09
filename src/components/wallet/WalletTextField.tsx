import type { FC, InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface WalletTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  labelClassName?: string;
  inputClassName?: string;
}

export const WalletTextField: FC<WalletTextFieldProps> = ({
  label,
  error,
  labelClassName,
  inputClassName,
  className,
  id,
  ...rest
}) => {
  const inputId = id ?? label.replace(/\s/g, '-');

  return (
    <div className={clsx('flex w-full flex-col gap-3', className)}>
      <label htmlFor={inputId} className={clsx('text-base text-wallet-text', labelClassName)}>
        {label}
      </label>
      <div className="relative">
        <div
          className={clsx(
            'pointer-events-none absolute inset-0 rounded-[var(--radius-wallet-field)] bg-[linear-gradient(180deg,rgba(255,255,255,0.035)_0%,rgba(255,255,255,0)_100%)]',
            error && 'hidden',
          )}
          aria-hidden
        />
        <input
          id={inputId}
          className={clsx(
            'relative h-11 w-full rounded-[var(--radius-wallet-field)] border border-wallet-border bg-wallet-surface-muted px-3 text-base text-wallet-text outline-none placeholder:text-wallet-text-muted transition-colors focus:border-wallet-border-strong',
            error && 'border-wallet-danger',
            inputClassName,
          )}
          {...rest}
        />
      </div>
      {error ? (
        <p className="text-xs text-wallet-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
};
