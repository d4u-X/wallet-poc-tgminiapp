import { mnemonicToSeedSync } from '@scure/bip39';
import { HDKey } from '@scure/bip32';

import type { VaultAddressRecord } from '@/wallet-core/vault/vaultTypes.ts';
import { evmAddressFromPrivateKey } from '@/wallet-core/chains/evm/evmAddress.ts';
import { tronAddressFromPrivateKey } from '@/wallet-core/chains/tron/tronAddress.ts';

function derivePrivateKey(seed: Uint8Array, derivationPath: string): Uint8Array {
  const node = HDKey.fromMasterSeed(seed).derive(derivationPath);
  const pk = node.privateKey;
  if (!pk) {
    throw new Error('Failed to derive private key.');
  }
  return pk;
}

export function deriveDefaultAddresses(params: { mnemonic: string }): VaultAddressRecord[] {
  const seed = mnemonicToSeedSync(params.mnemonic);

  const evmPath = `m/44'/60'/0'/0/0`;
  const tronPath = `m/44'/195'/0'/0/0`;

  const evmPrivateKey = derivePrivateKey(seed, evmPath);
  const tronPrivateKey = derivePrivateKey(seed, tronPath);

  const evmAddress = evmAddressFromPrivateKey(evmPrivateKey);
  const tronAddress = tronAddressFromPrivateKey(tronPrivateKey);

  return [
    { chain: 'eth', address: evmAddress, derivationPath: evmPath, index: 0 },
    { chain: 'bsc', address: evmAddress, derivationPath: evmPath, index: 0 },
    { chain: 'tron', address: tronAddress, derivationPath: tronPath, index: 0 },
  ];
}
