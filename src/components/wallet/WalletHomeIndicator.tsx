import type { FC } from 'react';

/** iOS-style home indicator — matches Figma bottom tab area. */
export const WalletHomeIndicator: FC = () => (
  <div className="flex h-[34px] w-full shrink-0 items-end justify-center pb-2">
    <div className="h-[5px] w-[134px] rounded-full bg-[#676767]" aria-hidden />
  </div>
);
