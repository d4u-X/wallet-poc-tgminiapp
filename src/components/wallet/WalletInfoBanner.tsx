import type { FC, ReactNode } from 'react';

interface WalletInfoBannerProps {
  children: ReactNode;
}

export const WalletInfoBanner: FC<WalletInfoBannerProps> = ({ children }) => (
  <div className="flex gap-2.5 rounded-[var(--radius-wallet-card)] border border-wallet-border bg-wallet-surface-muted p-3">
    <span
      className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-wallet-primary-btn"
      aria-hidden
    >
      <span className="text-[10px] font-bold text-wallet-primary-btn-text">!</span>
    </span>
    <p className="flex-1 text-xs leading-normal text-wallet-text">{children}</p>
  </div>
);
