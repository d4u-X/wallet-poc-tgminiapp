import type { FC, ReactNode } from 'react';

import { Link } from '@/components/Link/Link.tsx';
import { Page } from '@/components/Page.tsx';
import { useI18n } from '@/i18n/I18nProvider.tsx';

import tonSvg from './ton.svg';

const ChevronRight: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-tg-hint"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

interface NavCellProps {
  to: string;
  title: string;
  subtitle: string;
  icon?: ReactNode;
  isLast?: boolean;
}

const NavCell: FC<NavCellProps> = ({ to, title, subtitle, icon, isLast }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-4 py-3 no-underline hover:bg-black/5 active:bg-black/10 transition-colors"
  >
    {icon && (
      <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl">
        {icon}
      </div>
    )}
    <div className="min-w-0 flex-1">
      <p className="text-[15px] font-medium text-tg-text">{title}</p>
      <p className="truncate text-[13px] text-tg-subtitle">{subtitle}</p>
    </div>
    <ChevronRight />
    {!isLast && (
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-tg-separator" />
    )}
  </Link>
);

/** Template demo hub — kept under `/demo` while product UI is built from Figma. */
export const DemoHubPage: FC = () => {
  const { t } = useI18n();

  return (
    <Page back={false}>
      <div className="space-y-6 py-4">
        <p className="px-4 text-center text-[12px] text-tg-hint">
          {t('demo.hubTitle')} <code className="text-tg-text">/demo</code>
        </p>
        <section>
          <p className="px-4 pb-1.5 text-[13px] font-medium uppercase tracking-wide text-tg-subtitle">
            Features
          </p>
          <div className="relative mx-4 overflow-hidden rounded-xl bg-tg-section-bg">
            <NavCell
              to="/demo/ton-connect"
              title="TON Connect"
              subtitle="Connect your TON wallet"
              isLast
              icon={
                <div className="flex size-9 items-center justify-center rounded-xl bg-[#007AFF]">
                  <img src={tonSvg} className="size-6" alt="TON" />
                </div>
              }
            />
          </div>
          <p className="px-4 pt-2 text-[13px] text-tg-hint">
            Pages to learn about Telegram Mini Apps features and useful integrations.
          </p>
        </section>

        <section>
          <p className="px-4 pb-1.5 text-[13px] font-medium uppercase tracking-wide text-tg-subtitle">
            Application Launch Data
          </p>
          <div className="relative mx-4 overflow-hidden rounded-xl bg-tg-section-bg divide-y divide-tg-separator">
            <NavCell
              to="/demo/init-data"
              title="Init Data"
              subtitle="User data, chat information, technical data"
            />
            <NavCell
              to="/demo/launch-params"
              title="Launch Parameters"
              subtitle="Platform identifier, Mini Apps version, etc."
            />
            <NavCell
              to="/demo/theme-params"
              title="Theme Parameters"
              subtitle="Telegram application palette information"
              isLast
            />
          </div>
          <p className="px-4 pt-2 text-[13px] text-tg-hint">
            These pages help developers learn about the current launch environment.
          </p>
        </section>
      </div>
    </Page>
  );
};
