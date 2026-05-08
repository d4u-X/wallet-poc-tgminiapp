import type { PropsWithChildren } from 'react';
import { clsx } from 'clsx';

export function WalletLayout({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        'min-h-screen bg-wallet-canvas text-wallet-text antialiased',
        'pb-[max(12px,env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)]',
        className,
      )}
    >
      <div className="mx-auto min-h-screen w-full max-w-[375px]">{children}</div>
    </div>
  );
}
