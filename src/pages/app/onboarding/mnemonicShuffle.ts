/** Fisher–Yates shuffle (deterministic enough for UI option order). */
export function shuffle<T>(items: readonly T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Three distractors for random-verify: correct word + two distinct wrong words from the mnemonic. */
export function threeMnemonicOptions(correct: string, allWords: readonly string[]): string[] {
  const pool = allWords.filter((w) => w !== correct);
  if (pool.length < 2) return shuffle([correct, ...pool]);

  const pick = (): string => {
    const i = Math.floor(Math.random() * pool.length);
    const w = pool[i];
    return w ?? pool[0] ?? correct;
  };

  let a = pick();
  let b = pick();
  let guard = 0;
  while (b === a && guard++ < 24) {
    b = pick();
  }
  return shuffle([correct, a, b]);
}
