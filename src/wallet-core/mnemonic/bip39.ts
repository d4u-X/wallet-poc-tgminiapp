import { generateMnemonic, validateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english.js';

export function normalizeMnemonicWords(value: string): string[] {
  return value.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

export function createMnemonicWords(wordCount: 12 | 24 = 12): string[] {
  const strength = wordCount === 24 ? 256 : 128;
  return generateMnemonic(wordlist, strength).split(' ');
}

export function validateMnemonicWords(words: string[]): boolean {
  if (words.length !== 12 && words.length !== 24) {
    return false;
  }

  return validateMnemonic(words.join(' '), wordlist);
}
