import {
  createContext,
  type FC,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { createMnemonicWords, validateMnemonicWords } from '@/wallet-core/mnemonic/bip39.ts';
import { getPrimaryVaultRecord, saveVaultRecord } from '@/wallet-core/vault/vaultRepository.ts';
import { createVaultRecord } from '@/wallet-core/vault/vaultService.ts';
import { useWalletSession } from '@/state/wallet/WalletSessionContext.tsx';

const STORAGE_KEY = 'wallet-onboarding-state-v2';

type OnboardingGate = 'password' | 'generate' | 'backup' | 'verify' | 'home';

interface PersistedOnboardingState {
  passwordSet: boolean;
  randomVerifyIndices: readonly number[];
  mnemonicRevealed: boolean;
  mnemonicBackedUp: boolean;
  onboardingComplete: boolean;
}

interface OnboardingMockContextValue {
  ready: boolean;
  mnemonic: readonly string[] | null;
  passwordSet: boolean;
  mnemonicRevealed: boolean;
  mnemonicBackedUp: boolean;
  onboardingComplete: boolean;
  beginOnboarding: () => void;
  importWallet: (params: { mnemonicWords: string[]; password: string }) => Promise<void>;
  savePassword: (value: string) => void;
  /** Indices (0-based) for “random word” verification tab; stable after generation. */
  randomVerifyIndices: readonly number[];
  ensureMnemonic: () => void;
  revealMnemonic: () => void;
  markMnemonicBackedUp: () => void;
  markOnboardingComplete: () => Promise<void>;
  resetOnboarding: () => void;
}

const OnboardingMockContext = createContext<OnboardingMockContextValue | null>(null);

const INITIAL_STATE: PersistedOnboardingState = {
  passwordSet: false,
  randomVerifyIndices: [],
  mnemonicRevealed: false,
  mnemonicBackedUp: false,
  onboardingComplete: false,
};

function readStoredState(): PersistedOnboardingState {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return INITIAL_STATE;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<PersistedOnboardingState>;
    return {
      ...INITIAL_STATE,
      ...parsed,
      randomVerifyIndices: Array.isArray(parsed.randomVerifyIndices)
        ? parsed.randomVerifyIndices
            .filter((v): v is number => typeof v === 'number' && v >= 0 && v < 12)
            .slice(0, 3)
        : [],
    };
  } catch {
    return INITIAL_STATE;
  }
}

function persistState(state: PersistedOnboardingState): PersistedOnboardingState {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

function pickThreeDistinctIndices(): number[] {
  const idx: number[] = [];
  while (idx.length < 3) {
    const i = Math.floor(Math.random() * 12);
    if (!idx.includes(i)) idx.push(i);
  }
  return idx.sort((a, b) => a - b);
}

export const OnboardingMockProvider: FC<PropsWithChildren> = ({ children }) => {
  const { unlock } = useWalletSession();
  const [state, setState] = useState<PersistedOnboardingState>(() => readStoredState());
  const [ready, setReady] = useState(false);
  const [hasPersistedVault, setHasPersistedVault] = useState(false);
  const [mnemonic, setMnemonic] = useState<readonly string[] | null>(null);
  const [pendingPassword, setPendingPassword] = useState<string | null>(null);

  const updateState = useCallback(
    (updater: (prev: PersistedOnboardingState) => PersistedOnboardingState) => {
      setState((prev) => persistState(updater(prev)));
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;

    getPrimaryVaultRecord()
      .then((record) => {
        if (cancelled) {
          return;
        }

        const hasVault = Boolean(record);
        setHasPersistedVault(hasVault);
        if (hasVault) {
          setState((prev) =>
            persistState({
              ...prev,
              onboardingComplete: true,
            }),
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (state.passwordSet && !state.onboardingComplete && (!pendingPassword || !mnemonic)) {
      setState(() => persistState(INITIAL_STATE));
    }
  }, [mnemonic, pendingPassword, ready, state.onboardingComplete, state.passwordSet]);

  const beginOnboarding = useCallback(() => {
    setState(() => persistState(INITIAL_STATE));
    setMnemonic(null);
    setPendingPassword(null);
  }, []);

  const savePassword = useCallback(
    (value: string) => {
      const nextMnemonic = createMnemonicWords(12);
      setPendingPassword(value);
      setMnemonic(nextMnemonic);
      updateState((prev) => ({
        ...prev,
        passwordSet: true,
        randomVerifyIndices:
          prev.randomVerifyIndices.length >= 3
            ? prev.randomVerifyIndices
            : pickThreeDistinctIndices(),
      }));
    },
    [updateState],
  );

  const importWallet = useCallback(
    async ({ mnemonicWords, password }: { mnemonicWords: string[]; password: string }) => {
      if (!validateMnemonicWords(mnemonicWords)) {
        throw new Error('助记词格式无效，请检查单词内容和顺序。');
      }

      const record = await createVaultRecord({
        mnemonic: mnemonicWords.join(' '),
        password,
        addresses: [],
        imported: true,
      });
      await saveVaultRecord(record);
      await unlock({ password, record });
      setHasPersistedVault(true);
      setMnemonic(null);
      setPendingPassword(null);
      updateState((prev) => ({
        ...prev,
        passwordSet: true,
        onboardingComplete: true,
        mnemonicRevealed: false,
        mnemonicBackedUp: false,
        randomVerifyIndices: [],
      }));
    },
    [unlock, updateState],
  );

  const ensureMnemonic = useCallback(() => {
    if (!pendingPassword || !mnemonic) {
      return;
    }

    updateState((prev) => ({
      ...prev,
      randomVerifyIndices:
        prev.randomVerifyIndices.length >= 3
          ? prev.randomVerifyIndices
          : pickThreeDistinctIndices(),
    }));
  }, [mnemonic, pendingPassword, updateState]);

  const revealMnemonic = useCallback(() => {
    updateState((prev) => ({
      ...prev,
      mnemonicRevealed: true,
    }));
  }, [updateState]);

  const markMnemonicBackedUp = useCallback(() => {
    updateState((prev) => ({
      ...prev,
      mnemonicBackedUp: true,
    }));
  }, [updateState]);

  const markOnboardingComplete = useCallback(() => {
    return (async () => {
      if (!mnemonic || !pendingPassword) {
        throw new Error('当前创建流程已失效，请重新设置密码并生成助记词。');
      }

      const record = await createVaultRecord({
        mnemonic: mnemonic.join(' '),
        password: pendingPassword,
        addresses: [],
        imported: false,
      });
      await saveVaultRecord(record);
      await unlock({ password: pendingPassword, record });
      setHasPersistedVault(true);
      setMnemonic(null);
      setPendingPassword(null);
      updateState((prev) => ({
        ...prev,
        onboardingComplete: true,
      }));
    })();
  }, [mnemonic, pendingPassword, unlock, updateState]);

  const resetOnboarding = useCallback(() => {
    setState(() => persistState(INITIAL_STATE));
    setMnemonic(null);
    setPendingPassword(null);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      mnemonic,
      passwordSet: state.passwordSet,
      mnemonicRevealed: state.mnemonicRevealed,
      mnemonicBackedUp: state.mnemonicBackedUp,
      onboardingComplete: state.onboardingComplete || hasPersistedVault,
      beginOnboarding,
      importWallet,
      savePassword,
      randomVerifyIndices: state.randomVerifyIndices,
      ensureMnemonic,
      revealMnemonic,
      markMnemonicBackedUp,
      markOnboardingComplete,
      resetOnboarding,
    }),
    [
      ready,
      mnemonic,
      state,
      hasPersistedVault,
      beginOnboarding,
      importWallet,
      savePassword,
      ensureMnemonic,
      revealMnemonic,
      markMnemonicBackedUp,
      markOnboardingComplete,
      resetOnboarding,
    ],
  );

  return <OnboardingMockContext.Provider value={value}>{children}</OnboardingMockContext.Provider>;
};

export function useOnboardingMock(): OnboardingMockContextValue {
  const ctx = useContext(OnboardingMockContext);
  if (!ctx) {
    throw new Error('useOnboardingMock must be used within OnboardingMockProvider');
  }
  return ctx;
}

export function readOnboardingCompleteFlag(): boolean {
  return readStoredState().onboardingComplete;
}

export function clearOnboardingCompleteFlag(): void {
  persistState(INITIAL_STATE);
}

function resolveGateRedirect(
  gate: OnboardingGate,
  state: Pick<
    OnboardingMockContextValue,
    | 'ready'
    | 'passwordSet'
    | 'mnemonic'
    | 'mnemonicRevealed'
    | 'mnemonicBackedUp'
    | 'onboardingComplete'
  >,
): string | null {
  if (!state.ready) {
    return null;
  }

  if (state.onboardingComplete) {
    return gate === 'home' ? null : '/home';
  }

  if (gate === 'home') {
    return '/';
  }

  if (gate === 'password') {
    return null;
  }

  if (!state.passwordSet) {
    return '/onboarding/password';
  }

  if (gate === 'generate') {
    return null;
  }

  if (!state.mnemonic) {
    return '/onboarding/password';
  }

  if (!state.mnemonicRevealed) {
    return '/onboarding/mnemonic/generate';
  }

  if (gate === 'backup') {
    return null;
  }

  if (!state.mnemonicBackedUp) {
    return '/onboarding/mnemonic/backup';
  }

  return null;
}

export function useOnboardingGuard(gate: OnboardingGate): void {
  const navigate = useNavigate();
  const { ready, passwordSet, mnemonic, mnemonicRevealed, mnemonicBackedUp, onboardingComplete } =
    useOnboardingMock();

  useEffect(() => {
    const redirect = resolveGateRedirect(gate, {
      ready,
      passwordSet,
      mnemonic,
      mnemonicRevealed,
      mnemonicBackedUp,
      onboardingComplete,
    });

    if (redirect) {
      navigate(redirect, { replace: true });
    }
  }, [
    gate,
    navigate,
    ready,
    passwordSet,
    mnemonic,
    mnemonicRevealed,
    mnemonicBackedUp,
    onboardingComplete,
  ]);
}
