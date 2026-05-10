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
  const hasError = Boolean(error);

  return (
    <div className={clsx('flex w-full flex-col gap-3', className)}>
      <label htmlFor={inputId} className={clsx('text-base text-wallet-text', labelClassName)}>
        {label}
      </label>
      <div className="group relative">
        <div
          className={clsx(
            'pointer-events-none absolute inset-0 rounded-[var(--radius-wallet-field)] bg-[linear-gradient(180deg,rgba(255,255,255,0.035)_0%,rgba(255,255,255,0)_100%)] transition-opacity duration-150',
            hasError ? 'opacity-0' : 'opacity-100 group-focus-within:opacity-0',
          )}
          aria-hidden
        />
        <div
          className={clsx(
            'pointer-events-none absolute inset-0 rounded-[var(--radius-wallet-field)] opacity-0 shadow-[0_0_0_1px_rgba(255,255,255,0.16),0_0_24px_rgba(255,255,255,0.05)] transition-opacity duration-150 group-focus-within:opacity-100',
            hasError &&
              'shadow-[0_0_0_1px_rgba(255,69,58,0.6),0_0_24px_rgba(255,69,58,0.08)] group-focus-within:opacity-100',
          )}
          aria-hidden
        />
        <input
          id={inputId}
          className={clsx(
            'relative h-11 w-full rounded-[var(--radius-wallet-field)] border border-wallet-border bg-wallet-surface-muted px-3 text-base text-wallet-text outline-none placeholder:text-wallet-text-muted transition-[border-color,background-color,box-shadow] duration-150 focus:border-wallet-border-strong focus:bg-[rgba(255,255,255,0.06)]',
            hasError && 'border-wallet-danger',
            inputClassName,
          )}
          {...rest}
        />
      </div>
      {hasError ? (
        <p className="text-xs text-wallet-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
};
