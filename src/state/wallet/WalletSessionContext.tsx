import {
  createContext,
  type FC,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { translate } from '@/i18n/I18nProvider.tsx';
import { decryptVaultSecret } from '@/wallet-core/vault/vaultService.ts';
import { clearVaultRecords, getPrimaryVaultRecord } from '@/wallet-core/vault/vaultRepository.ts';
import type { WalletVaultRecord } from '@/wallet-core/vault/vaultTypes.ts';

type WalletSessionStatus = 'loading' | 'no_wallet' | 'locked' | 'unlocked';

interface WalletSessionContextValue {
  status: WalletSessionStatus;
  unlock: (params: { password: string; record?: WalletVaultRecord }) => Promise<void>;
  lock: () => void;
  refresh: () => Promise<void>;
  clearVault: () => Promise<void>;
}

const WalletSessionContext = createContext<WalletSessionContextValue | null>(null);

const AUTO_LOCK_MS = 5 * 60 * 1000;

export const WalletSessionProvider: FC<PropsWithChildren> = ({ children }) => {
  const [status, setStatus] = useState<WalletSessionStatus>('loading');
  const lastActiveAtRef = useRef<number>(Date.now());
  const autoLockTimerRef = useRef<number | null>(null);

  const clearAutoLockTimer = useCallback(() => {
    if (autoLockTimerRef.current !== null) {
      window.clearTimeout(autoLockTimerRef.current);
      autoLockTimerRef.current = null;
    }
  }, []);

  const lock = useCallback(() => {
    clearAutoLockTimer();
    lastActiveAtRef.current = Date.now();
    setStatus((prev) => (prev === 'no_wallet' ? prev : 'locked'));
  }, [clearAutoLockTimer]);

  const scheduleAutoLock = useCallback(() => {
    clearAutoLockTimer();
    autoLockTimerRef.current = window.setTimeout(() => {
      lock();
    }, AUTO_LOCK_MS);
  }, [clearAutoLockTimer, lock]);

  const refresh = useCallback(async () => {
    const record = await getPrimaryVaultRecord();
    setStatus(record ? 'locked' : 'no_wallet');
  }, []);

  const unlock = useCallback(
    async ({ password, record }: { password: string; record?: WalletVaultRecord }) => {
      const target = record ?? (await getPrimaryVaultRecord());
      if (!target) {
        setStatus('no_wallet');
        throw new Error(translate('errors.noWallet'));
      }

      try {
        await decryptVaultSecret({ record: target, password });
      } catch {
        throw new Error(translate('errors.wrongPassword'));
      }

      lastActiveAtRef.current = Date.now();
      setStatus('unlocked');
      scheduleAutoLock();
    },
    [scheduleAutoLock],
  );

  const clearVault = useCallback(async () => {
    clearAutoLockTimer();
    await clearVaultRecords();
    lastActiveAtRef.current = Date.now();
    setStatus('no_wallet');
  }, [clearAutoLockTimer]);

  useEffect(() => {
    refresh().catch(() => {
      setStatus('no_wallet');
    });
  }, [refresh]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        lock();
      }
    };

    const onPointerDown = () => {
      lastActiveAtRef.current = Date.now();
      if (status === 'unlocked') {
        scheduleAutoLock();
      }
    };

    const onKeyDown = () => {
      lastActiveAtRef.current = Date.now();
      if (status === 'unlocked') {
        scheduleAutoLock();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lock, scheduleAutoLock, status]);

  useEffect(() => {
    if (status !== 'unlocked') {
      clearAutoLockTimer();
      return;
    }

    const elapsed = Date.now() - lastActiveAtRef.current;
    if (elapsed >= AUTO_LOCK_MS) {
      lock();
      return;
    }

    scheduleAutoLock();
  }, [clearAutoLockTimer, lock, scheduleAutoLock, status]);

  const value = useMemo(
    () => ({
      status,
      unlock,
      lock,
      refresh,
      clearVault,
    }),
    [clearVault, lock, refresh, status, unlock],
  );

  return <WalletSessionContext.Provider value={value}>{children}</WalletSessionContext.Provider>;
};

export function useWalletSession(): WalletSessionContextValue {
  const ctx = useContext(WalletSessionContext);
  if (!ctx) {
    throw new Error('useWalletSession must be used within WalletSessionProvider');
  }
  return ctx;
}

export function useWalletSessionGuard(
  options: {
    requireUnlocked?: boolean;
    redirectTo?: string;
  } = {},
): WalletSessionStatus {
  const { requireUnlocked = true, redirectTo = '/unlock' } = options;
  const navigate = useNavigate();
  const { status } = useWalletSession();

  useEffect(() => {
    if (!requireUnlocked) {
      return;
    }

    if (status === 'locked') {
      navigate(redirectTo, { replace: true });
      return;
    }

    if (status === 'no_wallet') {
      navigate('/', { replace: true });
    }
  }, [navigate, redirectTo, requireUnlocked, status]);

  return status;
}
