import type { RGB as RGBType } from '@tma.js/sdk-react';
import type { ComponentPropsWithoutRef, FC } from 'react';
import { clsx } from 'clsx';

export type RGBProps = ComponentPropsWithoutRef<'span'> & {
  color: RGBType;
};

export const RGB: FC<RGBProps> = ({ color, className, ...rest }) => (
  <span {...rest} className={clsx('inline-flex items-center gap-1.5', className)}>
    <i
      className="inline-block size-[18px] shrink-0 rounded-full border border-black/20"
      style={{ backgroundColor: color }}
    />
    {color}
  </span>
);
