import { argon2id } from 'hash-wasm';

export interface Argon2idConfig {
  algorithm: 'argon2id';
  iterations: number;
  memoryKiB: number;
  parallelism: number;
  hashLength: number;
}

export const DEFAULT_ARGON2ID_CONFIG: Argon2idConfig = {
  algorithm: 'argon2id',
  iterations: 3,
  memoryKiB: 19456,
  parallelism: 1,
  hashLength: 32,
};

export async function deriveArgon2idKey(params: {
  password: string;
  salt: Uint8Array;
  config?: Argon2idConfig;
}): Promise<Uint8Array> {
  const { password, salt, config = DEFAULT_ARGON2ID_CONFIG } = params;

  return argon2id({
    password,
    salt,
    iterations: config.iterations,
    parallelism: config.parallelism,
    memorySize: config.memoryKiB,
    hashLength: config.hashLength,
    outputType: 'binary',
  });
}
