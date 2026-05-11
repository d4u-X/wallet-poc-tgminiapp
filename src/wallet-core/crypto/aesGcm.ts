export interface AesGcmResult {
  iv: Uint8Array;
  ciphertext: Uint8Array;
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return Uint8Array.from(bytes).buffer;
}

async function importAesGcmKey(keyBytes: Uint8Array): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', toArrayBuffer(keyBytes), 'AES-GCM', false, [
    'encrypt',
    'decrypt',
  ]);
}

export async function encryptAesGcm(params: {
  plaintext: Uint8Array;
  keyBytes: Uint8Array;
  iv: Uint8Array;
}): Promise<AesGcmResult> {
  const { plaintext, keyBytes, iv } = params;
  const key = await importAesGcmKey(keyBytes);
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: toArrayBuffer(iv) },
    key,
    toArrayBuffer(plaintext),
  );

  return {
    iv,
    ciphertext: new Uint8Array(ciphertext),
  };
}

export async function decryptAesGcm(params: {
  ciphertext: Uint8Array;
  keyBytes: Uint8Array;
  iv: Uint8Array;
}): Promise<Uint8Array> {
  const { ciphertext, keyBytes, iv } = params;
  const key = await importAesGcmKey(keyBytes);
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: toArrayBuffer(iv) },
    key,
    toArrayBuffer(ciphertext),
  );

  return new Uint8Array(plaintext);
}
