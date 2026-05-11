import { decryptAesGcm, encryptAesGcm } from '@/wallet-core/crypto/aesGcm.ts';
import {
  DEFAULT_ARGON2ID_CONFIG,
  deriveArgon2idKey,
  type Argon2idConfig,
} from '@/wallet-core/crypto/argon2id.ts';
import {
  base64ToBytes,
  bytesToBase64,
  bytesToUtf8,
  randomBytes,
  utf8ToBytes,
} from '@/wallet-core/crypto/vaultEncoding.ts';
import type {
  VaultAddressRecord,
  VaultSecretPayloadV1,
  WalletVaultRecord,
} from '@/wallet-core/vault/vaultTypes.ts';

export async function createVaultRecord(params: {
  mnemonic: string;
  password: string;
  addresses: VaultAddressRecord[];
  imported: boolean;
  kdf?: Argon2idConfig;
}): Promise<WalletVaultRecord> {
  const { mnemonic, password, addresses, imported, kdf = DEFAULT_ARGON2ID_CONFIG } = params;
  const now = Date.now();
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const keyBytes = await deriveArgon2idKey({ password, salt, config: kdf });
  const secretPayload: VaultSecretPayloadV1 = { mnemonic };
  const plaintext = utf8ToBytes(JSON.stringify(secretPayload));
  const encrypted = await encryptAesGcm({ plaintext, keyBytes, iv });

  return {
    id: 'primary',
    version: 1,
    createdAt: now,
    updatedAt: now,
    imported,
    kdf,
    salt: bytesToBase64(salt),
    mnemonic: {
      algorithm: 'aes-256-gcm',
      iv: bytesToBase64(encrypted.iv),
      ciphertext: bytesToBase64(encrypted.ciphertext),
    },
    addresses,
  };
}

export async function decryptVaultSecret(params: {
  record: WalletVaultRecord;
  password: string;
}): Promise<VaultSecretPayloadV1> {
  const { record, password } = params;
  const salt = base64ToBytes(record.salt);
  const iv = base64ToBytes(record.mnemonic.iv);
  const ciphertext = base64ToBytes(record.mnemonic.ciphertext);
  const keyBytes = await deriveArgon2idKey({
    password,
    salt,
    config: record.kdf,
  });
  const plaintext = await decryptAesGcm({ ciphertext, keyBytes, iv });

  return JSON.parse(bytesToUtf8(plaintext)) as VaultSecretPayloadV1;
}
