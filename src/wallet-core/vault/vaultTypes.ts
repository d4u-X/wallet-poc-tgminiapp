import type { Argon2idConfig } from '@/wallet-core/crypto/argon2id.ts';

export type SupportedChain = 'eth' | 'bsc' | 'tron';

export interface VaultAddressRecord {
  chain: SupportedChain;
  address: string;
  derivationPath: string;
  index: number;
}

export interface VaultCiphertext {
  algorithm: 'aes-256-gcm';
  iv: string;
  ciphertext: string;
}

export interface VaultSecretPayloadV1 {
  mnemonic: string;
}

export interface VaultRecordV1 {
  id: 'primary';
  version: 1;
  createdAt: number;
  updatedAt: number;
  imported: boolean;
  kdf: Argon2idConfig;
  salt: string;
  mnemonic: VaultCiphertext;
  addresses: VaultAddressRecord[];
}

export type WalletVaultRecord = VaultRecordV1;
