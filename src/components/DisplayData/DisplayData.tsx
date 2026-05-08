import { isRGB } from '@tma.js/sdk-react';
import type { FC, ReactNode } from 'react';
import { clsx } from 'clsx';

import { RGB } from '@/components/RGB/RGB.tsx';
import { Link } from '@/components/Link/Link.tsx';

export type DisplayDataRow = { title: string } & (
  | { type: 'link'; value?: string }
  | { value: ReactNode }
);

export interface DisplayDataProps {
  header?: ReactNode;
  footer?: ReactNode;
  rows: DisplayDataRow[];
}

export const DisplayData: FC<DisplayDataProps> = ({ header, rows }) => (
  <div className="mb-4 last:mb-0">
    {header && <p className="px-4 pb-1.5 text-[13px] font-medium text-tg-subtitle">{header}</p>}
    <div className="mx-4 overflow-hidden rounded-xl bg-tg-section-bg">
      {rows.map((item, idx) => {
        let valueNode: ReactNode;

        if (item.value === undefined) {
          valueNode = <i className="text-tg-hint">empty</i>;
        } else if ('type' in item) {
          valueNode = (
            <Link to={item.value ?? ''} className="text-tg-link">
              Open
            </Link>
          );
        } else if (typeof item.value === 'string') {
          valueNode = isRGB(item.value) ? <RGB color={item.value} /> : item.value;
        } else if (typeof item.value === 'boolean') {
          valueNode = (
            <span
              className={clsx(
                'rounded px-1.5 py-0.5 text-xs font-semibold',
                item.value
                  ? 'bg-green-500/15 text-green-600 dark:text-green-400'
                  : 'bg-red-500/15 text-red-600 dark:text-red-400',
              )}
            >
              {String(item.value)}
            </span>
          );
        } else {
          valueNode = item.value;
        }

        return (
          <div
            key={idx}
            className={clsx(
              'flex items-start gap-3 px-4 py-3',
              idx < rows.length - 1 && 'border-b border-tg-separator',
            )}
          >
            <span className="min-w-0 flex-1 text-[13px] text-tg-subtitle">{item.title}</span>
            <span className="min-w-0 flex-[2] break-all text-right text-[13px] text-tg-text">
              {valueNode}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);
