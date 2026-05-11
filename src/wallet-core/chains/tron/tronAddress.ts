import { getPublicKey } from '@noble/secp256k1';
import { keccak_256 } from '@noble/hashes/sha3.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { base58 } from '@scure/base';

export function tronAddressFromPrivateKey(privateKey: Uint8Array): string {
  const pubUncompressed = getPublicKey(privateKey, false);
  const hash = keccak_256(pubUncompressed.slice(1));
  const evmAddr = hash.slice(-20);
  const tronAddr = new Uint8Array(1 + evmAddr.length);
  tronAddr[0] = 0x41;
  tronAddr.set(evmAddr, 1);

  const checksum = sha256(sha256(tronAddr)).slice(0, 4);
  const payload = new Uint8Array(tronAddr.length + checksum.length);
  payload.set(tronAddr, 0);
  payload.set(checksum, tronAddr.length);
  return base58.encode(payload);
}
