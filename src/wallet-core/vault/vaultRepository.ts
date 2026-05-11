import type { WalletVaultRecord } from '@/wallet-core/vault/vaultTypes.ts';

const WALLET_VAULT_DB_NAME = 'wallet-vault-db';
const WALLET_VAULT_DB_VERSION = 1;
const WALLET_VAULT_STORE_NAME = 'vaults';
const PRIMARY_VAULT_ID = 'primary';

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed.'));
  });
}

function transactionToPromise(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () =>
      reject(transaction.error ?? new Error('IndexedDB transaction failed.'));
    transaction.onabort = () =>
      reject(transaction.error ?? new Error('IndexedDB transaction aborted.'));
  });
}

async function openWalletVaultDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(WALLET_VAULT_DB_NAME, WALLET_VAULT_DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(WALLET_VAULT_STORE_NAME)) {
        db.createObjectStore(WALLET_VAULT_STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error('Failed to open wallet vault database.'));
  });
}

export async function getPrimaryVaultRecord(): Promise<WalletVaultRecord | null> {
  const db = await openWalletVaultDb();
  try {
    const transaction = db.transaction(WALLET_VAULT_STORE_NAME, 'readonly');
    const store = transaction.objectStore(WALLET_VAULT_STORE_NAME);
    const record = await requestToPromise(
      store.get(PRIMARY_VAULT_ID) as IDBRequest<WalletVaultRecord | undefined>,
    );
    await transactionToPromise(transaction);
    return record ?? null;
  } finally {
    db.close();
  }
}

export async function saveVaultRecord(record: WalletVaultRecord): Promise<void> {
  const db = await openWalletVaultDb();
  try {
    const transaction = db.transaction(WALLET_VAULT_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(WALLET_VAULT_STORE_NAME);
    store.put(record);
    await transactionToPromise(transaction);
  } finally {
    db.close();
  }
}

export async function clearVaultRecords(): Promise<void> {
  const db = await openWalletVaultDb();
  try {
    const transaction = db.transaction(WALLET_VAULT_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(WALLET_VAULT_STORE_NAME);
    store.clear();
    await transactionToPromise(transaction);
  } finally {
    db.close();
  }
}
