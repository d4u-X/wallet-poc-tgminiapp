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

const STORAGE_KEY = 'wallet-onboarding-state-v1';

/** Fixed mock mnemonic — replace with real BIP39 generation in production. */
export const MOCK_MNEMONIC_WORDS = [
  'apple',
  'bridge',
  'canyon',
  'delta',
  'ember',
  'forest',
  'galaxy',
  'harbor',
  'ivory',
  'jungle',
  'kernel',
  'lotus',
] as const;

type OnboardingGate = 'password' | 'generate' | 'backup' | 'verify' | 'home';

interface PersistedOnboardingState {
  passwordSet: boolean;
  mnemonicGenerated: boolean;
  randomVerifyIndices: readonly number[];
  mnemonicRevealed: boolean;
  mnemonicBackedUp: boolean;
  onboardingComplete: boolean;
}

interface OnboardingMockContextValue {
  mnemonic: readonly string[] | null;
  passwordSet: boolean;
  mnemonicRevealed: boolean;
  mnemonicBackedUp: boolean;
  onboardingComplete: boolean;
  beginOnboarding: () => void;
  importWallet: (password: string) => void;
  savePassword: (value: string) => void;
  /** Indices (0-based) for “random word” verification tab; stable after generation. */
  randomVerifyIndices: readonly number[];
  ensureMnemonic: () => void;
  revealMnemonic: () => void;
  markMnemonicBackedUp: () => void;
  markOnboardingComplete: () => void;
  resetOnboarding: () => void;
}

const OnboardingMockContext = createContext<OnboardingMockContextValue | null>(null);

const INITIAL_STATE: PersistedOnboardingState = {
  passwordSet: false,
  mnemonicGenerated: false,
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
  const [state, setState] = useState<PersistedOnboardingState>(() => readStoredState());

  const updateState = useCallback(
    (updater: (prev: PersistedOnboardingState) => PersistedOnboardingState) => {
      setState((prev) => persistState(updater(prev)));
    },
    [],
  );

  const beginOnboarding = useCallback(() => {
    setState(() => persistState(INITIAL_STATE));
  }, []);

  const savePassword = useCallback(
    (_value: string) => {
      // In production this should hand off to secure wallet creation logic instead of local state.
      updateState((prev) => ({
        ...prev,
        passwordSet: true,
      }));
    },
    [updateState],
  );

  const importWallet = useCallback(
    (_password: string) => {
      // Import flow is still mocked; this only marks the product path as completed.
      updateState((prev) => ({
        ...prev,
        passwordSet: true,
        onboardingComplete: true,
      }));
    },
    [updateState],
  );

  const ensureMnemonic = useCallback(() => {
    updateState((prev) => ({
      ...prev,
      mnemonicGenerated: true,
      randomVerifyIndices:
        prev.randomVerifyIndices.length >= 3
          ? prev.randomVerifyIndices
          : pickThreeDistinctIndices(),
    }));
  }, [updateState]);

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
    updateState((prev) => ({
      ...prev,
      onboardingComplete: true,
    }));
  }, [updateState]);

  const resetOnboarding = useCallback(() => {
    setState(() => persistState(INITIAL_STATE));
  }, []);

  const value = useMemo(
    () => ({
      mnemonic: state.mnemonicGenerated ? MOCK_MNEMONIC_WORDS : null,
      passwordSet: state.passwordSet,
      mnemonicRevealed: state.mnemonicRevealed,
      mnemonicBackedUp: state.mnemonicBackedUp,
      onboardingComplete: state.onboardingComplete,
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
      state,
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
    'passwordSet' | 'mnemonic' | 'mnemonicRevealed' | 'mnemonicBackedUp' | 'onboardingComplete'
  >,
): string | null {
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
    return '/onboarding/mnemonic/generate';
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
  const { passwordSet, mnemonic, mnemonicRevealed, mnemonicBackedUp, onboardingComplete } =
    useOnboardingMock();

  useEffect(() => {
    const redirect = resolveGateRedirect(gate, {
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
    passwordSet,
    mnemonic,
    mnemonicRevealed,
    mnemonicBackedUp,
    onboardingComplete,
  ]);
}
