import type { FC, FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { clsx } from 'clsx';

import { Page } from '@/components/Page.tsx';
import { WalletHomeIndicator } from '@/components/wallet/WalletHomeIndicator.tsx';
import { WalletLayout } from '@/components/wallet/WalletLayout.tsx';
import { WalletScreenHeader } from '@/components/wallet/WalletScreenHeader.tsx';

import {
  useOnboardingGuard,
  useOnboardingMock,
} from '@/pages/app/onboarding/OnboardingMockContext.tsx';
import { threeMnemonicOptions } from '@/pages/app/onboarding/mnemonicShuffle.ts';

type VerifyTab = 'random' | 'full';

export const MnemonicVerifyPage: FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab: VerifyTab = searchParams.get('tab') === 'full' ? 'full' : 'random';

  useOnboardingGuard('verify');

  const { mnemonic, randomVerifyIndices, markOnboardingComplete, ensureMnemonic } =
    useOnboardingMock();

  useEffect(() => {
    ensureMnemonic();
  }, [ensureMnemonic]);

  const words = mnemonic ?? [];

  const randomOptions = useMemo(() => {
    const m: Record<number, string[]> = {};
    const list = mnemonic ?? [];
    if (list.length !== 12) return m;
    for (const i of randomVerifyIndices) {
      const w = list[i];
      if (w === undefined) continue;
      m[i] = threeMnemonicOptions(w, list);
    }
    return m;
  }, [mnemonic, randomVerifyIndices]);

  const [randomPicks, setRandomPicks] = useState<Record<number, string>>({});
  const [fullInputs, setFullInputs] = useState<string[]>(() => Array(12).fill(''));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRandomPicks({});
  }, [randomVerifyIndices, tab]);

  const setTab = (next: VerifyTab) => {
    setSearchParams(next === 'full' ? { tab: 'full' } : { tab: 'random' }, { replace: true });
    setError(null);
  };

  const randomFilled =
    words.length === 12 &&
    randomVerifyIndices.length > 0 &&
    randomVerifyIndices.every((i) => Boolean(randomPicks[i]));

  const fullFilled = words.length === 12 && fullInputs.every((v) => (v ?? '').trim().length > 0);

  const canSubmit = tab === 'random' ? randomFilled : fullFilled;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!canSubmit) return;

    if (words.length !== 12) {
      setError('助记词未就绪，请返回上一步重试。');
      return;
    }

    if (tab === 'random') {
      for (const i of randomVerifyIndices) {
        if ((randomPicks[i] ?? '').toLowerCase() !== words[i]) {
          setError('随机验证未通过，请重新选择对应位置的单词。');
          return;
        }
      }
    } else {
      for (let i = 0; i < 12; i++) {
        const v = (fullInputs[i] ?? '').trim().toLowerCase();
        if (v !== words[i]) {
          setError('完整验证未通过，请按顺序核对全部单词。');
          return;
        }
      }
    }

    markOnboardingComplete();
    navigate('/home', { replace: true });
  };

  return (
    <Page>
      <WalletLayout>
        <WalletScreenHeader
          title="助记词验证"
          rightSlotClassName="min-w-[44px]"
          rightSlot={
            <button
              type="button"
              disabled
              className="select-none text-[16px] font-semibold leading-none text-wallet-text-muted opacity-80"
              aria-disabled="true"
            >
              跳过
            </button>
          }
        />

        <form className="flex flex-col" onSubmit={onSubmit}>
          <div className="flex flex-col px-5 pb-44 pt-2">
            <div className="relative flex border-b border-wallet-border bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0)_100%)]">
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.22),rgba(255,255,255,0))]"
                aria-hidden
              />
              <button
                type="button"
                onClick={() => setTab('random')}
                className={clsx(
                  '-mb-px w-[72px] border-b-2 pb-2.5 text-base font-semibold transition-colors',
                  tab === 'random'
                    ? 'border-white text-wallet-text'
                    : 'border-transparent text-wallet-text-muted',
                )}
              >
                随机验证
              </button>
              <button
                type="button"
                onClick={() => setTab('full')}
                className={clsx(
                  '-mb-px ml-8 w-[72px] border-b-2 pb-2.5 text-base font-semibold transition-colors',
                  tab === 'full'
                    ? 'border-white text-wallet-text'
                    : 'border-transparent text-wallet-text-muted',
                )}
              >
                完整验证
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-6">
              {tab === 'random' ? (
                <div className="relative rounded-[16px] bg-[linear-gradient(180deg,rgba(255,255,255,0.024)_0%,rgba(255,255,255,0)_100%)] px-1 py-2">
                  <div
                    className="pointer-events-none absolute left-1/2 top-0 h-[42px] w-[190px] -translate-x-1/2 rounded-[999px] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.07),rgba(255,255,255,0)_75%)] blur-[18px]"
                    aria-hidden
                  />
                  <div className="flex flex-col gap-8">
                    {randomVerifyIndices.map((i) => (
                      <div key={i} className="flex flex-col gap-3">
                        <p className="text-base font-semibold text-wallet-text">第{i + 1}个单词</p>
                        <div className="flex gap-[13px]">
                          {(randomOptions[i] ?? []).map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() =>
                                setRandomPicks((prev) => ({
                                  ...prev,
                                  [i]: opt,
                                }))
                              }
                              className={clsx(
                                'relative min-h-[42px] flex-1 overflow-hidden rounded-[10px] border px-2 py-2.5 text-center text-base font-semibold capitalize transition-colors',
                                randomPicks[i] === opt
                                  ? 'border-white bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.06)_100%)] text-wallet-text'
                                  : 'border-wallet-choice-border bg-[rgba(255,255,255,0.02)] text-wallet-text',
                              )}
                            >
                              <span
                                className="pointer-events-none absolute inset-x-2 top-0 h-px bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.18),rgba(255,255,255,0))]"
                                aria-hidden
                              />
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="relative rounded-[16px] bg-[linear-gradient(180deg,rgba(255,255,255,0.024)_0%,rgba(255,255,255,0)_100%)] px-1 py-2">
                  <div
                    className="pointer-events-none absolute left-1/2 top-0 h-[42px] w-[190px] -translate-x-1/2 rounded-[999px] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.07),rgba(255,255,255,0)_75%)] blur-[18px]"
                    aria-hidden
                  />
                  <div className="flex flex-col gap-4">
                    {Array.from({ length: 6 }, (_, row) => (
                      <div key={row} className="flex gap-4">
                        {[0, 1].map((col) => {
                          const idx = row * 2 + col;
                          return (
                            <div
                              key={idx}
                              className="relative flex h-11 flex-1 items-center gap-2 overflow-hidden rounded-[10px] border-[0.5px] border-wallet-border-strong bg-[rgba(255,255,255,0.015)] px-2"
                            >
                              <div
                                className="pointer-events-none absolute inset-x-2 top-0 h-px bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.18),rgba(255,255,255,0))]"
                                aria-hidden
                              />
                              <span className="w-5 shrink-0 text-center text-sm text-wallet-text-muted">
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                              <div className="h-4 w-px shrink-0 bg-white/20" aria-hidden />
                              <input
                                autoComplete="off"
                                spellCheck={false}
                                inputMode="text"
                                aria-label={`第 ${idx + 1} 个单词`}
                                className="min-w-0 flex-1 bg-transparent text-base font-semibold capitalize text-wallet-text outline-none placeholder:text-wallet-text-muted"
                                placeholder=""
                                value={fullInputs[idx] ?? ''}
                                onChange={(ev) =>
                                  setFullInputs((prev) => {
                                    const next = [...prev];
                                    next[idx] = ev.target.value;
                                    return next;
                                  })
                                }
                              />
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error ? (
                <p className="text-sm text-wallet-danger" role="alert">
                  {error}
                </p>
              ) : null}
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 z-10 flex flex-col items-center bg-wallet-canvas pb-[env(safe-area-inset-bottom)] pt-3">
            <button
              type="submit"
              disabled={!canSubmit}
              className={clsx(
                'flex h-12 w-full max-w-[303px] items-center justify-center rounded-[var(--radius-wallet-pill)] text-base font-semibold transition-colors',
                canSubmit
                  ? 'bg-wallet-primary-btn text-wallet-primary-btn-text'
                  : 'cursor-not-allowed bg-white/5 text-[rgba(255,255,255,0.2)]',
              )}
            >
              完成验证，进入钱包
            </button>
            <WalletHomeIndicator />
          </div>
        </form>
      </WalletLayout>
    </Page>
  );
};
