import type { FC, ReactNode } from 'react';
import { clsx } from 'clsx';

interface WalletInfoBannerProps {
  children: ReactNode;
  iconSrc?: string;
  className?: string;
  textClassName?: string;
}

export const WalletInfoBanner: FC<WalletInfoBannerProps> = ({
  children,
  iconSrc,
  className,
  textClassName,
}) => (
  <div
    className={clsx(
      'flex gap-2.5 rounded-[var(--radius-wallet-card)] border border-wallet-border bg-wallet-surface-muted px-3 py-3.5',
      className,
    )}
  >
    {iconSrc ? (
      <img src={iconSrc} alt="" className="mt-0.5 size-4 shrink-0 object-contain" aria-hidden />
    ) : (
      <span
        className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-wallet-primary-btn"
        aria-hidden
      >
        <span className="text-[10px] font-bold text-wallet-primary-btn-text">!</span>
      </span>
    )}
    <p className={clsx('flex-1 text-xs leading-[1.4] text-wallet-text', textClassName)}>
      {children}
    </p>
  </div>
);
