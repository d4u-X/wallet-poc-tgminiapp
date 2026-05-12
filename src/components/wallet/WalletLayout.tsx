import type { FormHTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import { clsx } from 'clsx';

export function WalletLayout({
  children,
  className,
  contentClassName,
}: PropsWithChildren<{ className?: string; contentClassName?: string }>) {
  return (
    <div
      className={clsx(
        'min-h-dvh overflow-x-hidden bg-wallet-canvas text-wallet-text antialiased',
        className,
      )}
    >
      <div
        className={clsx('mx-auto flex min-h-dvh w-full max-w-[375px] flex-col', contentClassName)}
      >
        {children}
      </div>
    </div>
  );
}

export function WalletFormScreen({
  children,
  className,
  ...props
}: PropsWithChildren<FormHTMLAttributes<HTMLFormElement>>) {
  return (
    <form
      className={clsx('flex min-h-[calc(100dvh-44px)] flex-col px-5 pb-[50px] pt-7', className)}
      {...props}
    >
      {children}
    </form>
  );
}

export function WalletScreenIntro({
  title,
  subtitle,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      <h2 className="text-[24px] font-semibold leading-normal text-wallet-text">{title}</h2>
      {subtitle ? <p className="text-sm leading-normal text-wallet-text">{subtitle}</p> : null}
    </div>
  );
}

export function WalletBottomAction({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={clsx('mt-auto flex flex-col items-center gap-4 pt-8', className)}>
      {children}
    </div>
  );
}
