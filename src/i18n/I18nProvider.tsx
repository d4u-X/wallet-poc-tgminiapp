import {
  createContext,
  type FC,
  type PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';

import { DEFAULT_LOCALE, type Locale, messages } from '@/i18n/messages.ts';

type I18nValues = Record<string, string | number>;

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, values?: I18nValues) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);
let activeLocale: Locale = DEFAULT_LOCALE;

function formatMessage(template: string, values?: I18nValues): string {
  if (!values) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match));
}

export function translate(key: string, values?: I18nValues, locale: Locale = activeLocale): string {
  const template = messages[locale][key] ?? messages[DEFAULT_LOCALE][key] ?? key;
  return formatMessage(template, values);
}

function resolveInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }

  const stored = window.localStorage.getItem('wallet-locale');
  if (stored === 'en-US' || stored === 'zh-CN') {
    activeLocale = stored;
    return stored;
  }

  activeLocale = navigator.language.toLowerCase().startsWith('en') ? 'en-US' : DEFAULT_LOCALE;
  return activeLocale;
}

export const I18nProvider: FC<PropsWithChildren> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => resolveInitialLocale());

  const value = useMemo<I18nContextValue>(() => {
    const setLocale = (next: Locale) => {
      activeLocale = next;
      window.localStorage.setItem('wallet-locale', next);
      setLocaleState(next);
    };

    return {
      locale,
      setLocale,
      t: (key, values) => translate(key, values, locale),
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}
