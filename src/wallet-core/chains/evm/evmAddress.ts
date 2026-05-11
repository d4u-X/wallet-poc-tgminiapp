import { getPublicKey } from '@noble/secp256k1';
import { keccak_256 } from '@noble/hashes/sha3';

import { bytesToHex } from '@/wallet-core/crypto/hex.ts';
import { utf8ToBytes } from '@/wallet-core/crypto/vaultEncoding.ts';

function checksumEip55(lowercaseHexNoPrefix: string): string {
  const hash = bytesToHex(keccak_256(utf8ToBytes(lowercaseHexNoPrefix)));
  let out = '';
  for (let i = 0; i < lowercaseHexNoPrefix.length; i += 1) {
    const c = lowercaseHexNoPrefix[i] ?? '';
    const h = Number.parseInt(hash[i] ?? '0', 16);
    out += h >= 8 ? c.toUpperCase() : c;
  }
  return out;
}

export function evmAddressFromPrivateKey(privateKey: Uint8Array): string {
  const pubUncompressed = getPublicKey(privateKey, false);
  const hash = keccak_256(pubUncompressed.slice(1));
  const addrBytes = hash.slice(-20);
  const lower = bytesToHex(addrBytes);
  return `0x${checksumEip55(lower)}`;
}
