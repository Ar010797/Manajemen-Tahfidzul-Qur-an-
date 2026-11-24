import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface GuruAccount {
  usernameId: string;
  username: string;
  password: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  recoveredAt?: string;
}

const REGISTRY_DOC_ID = '__guru_accounts__';
const LOCAL_CACHE_KEY = 'tahfidz_guru_accounts_cache';

export const normalizeUsernameId = (username: string): string =>
  username.trim().replace(/\s+/g, '_').toLowerCase();

/**
 * Recursively remove undefined fields so Firestore setDoc() never receives
 * "Unsupported field value: undefined".
 */
const stripUndefined = <T>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefined(item)) as unknown as T;
  }
  if (value !== null && typeof value === 'object') {
    const clean: Record<string, unknown> = {};
    Object.entries(value as Record<string, unknown>).forEach(([k, v]) => {
      if (v !== undefined) {
        clean[k] = stripUndefined(v);
      }
    });
    return clean as T;
  }
  return value;
};

const sanitizeAccountsMap = (
  accounts: Record<string, GuruAccount>
): Record<string, GuruAccount> => {
  const clean: Record<string, GuruAccount> = {};
  Object.entries(accounts || {}).forEach(([key, acc]) => {
    if (acc && typeof acc === 'object' && acc.username) {
      clean[key] = stripUndefined(acc);
    }
  });
  return clean;
};

export const getCachedGuruAccounts = (): Record<string, GuruAccount> => {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? sanitizeAccountsMap(parsed) : {};
  } catch {
    return {};
  }
};

const saveCachedGuruAccounts = (accounts: Record<string, GuruAccount>) => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(sanitizeAccountsMap(accounts)));
  } catch (e) {
    console.error('Failed to save guru accounts cache:', e);
  }
};

/**
 * Find any existing localStorage data key matching the username case-insensitively
 * so existing local data is never orphaned or lost.
 */
export const findExistingLocalStorageUsername = (typedUsername: string): string | null => {
  if (typeof localStorage === 'undefined') return null;
  const targetId = normalizeUsernameId(typedUsername);
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('tahfidz_data_')) {
      const storedName = key.slice('tahfidz_data_'.length);
      if (normalizeUsernameId(storedName) === targetId) {
        return storedName;
      }
    }
  }
  return null;
};

/**
 * Fetch all teacher accounts from Firestore registry, merged with local cache.
 */
export const fetchAllGuruAccounts = async (): Promise<Record<string, GuruAccount>> => {
  const localCache = getCachedGuruAccounts();
  try {
    const docRef = doc(db, 'syncs', REGISTRY_DOC_ID);
    const snap = await Promise.race([
      getDoc(docRef),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
    ]);

    if (snap.exists()) {
      const data = snap.data();
      const remoteAccounts: Record<string, GuruAccount> =
        data?.accounts && typeof data.accounts === 'object' ? data.accounts : {};

      // Merge remote & local keeping whichever entry has the newer updatedAt
      const merged: Record<string, GuruAccount> = { ...localCache };
      Object.entries(remoteAccounts).forEach(([key, remoteAcc]) => {
        if (!remoteAcc || !remoteAcc.username) return;
        const localAcc = merged[key];
        if (!localAcc || (remoteAcc.updatedAt || '') >= (localAcc.updatedAt || '')) {
          merged[key] = stripUndefined(remoteAcc);
        }
      });
      const sanitizedMerged = sanitizeAccountsMap(merged);
      saveCachedGuruAccounts(sanitizedMerged);
      return sanitizedMerged;
    }
    return localCache;
  } catch (e) {
    console.warn('Could not fetch guru accounts from cloud, using local cache:', e);
    return localCache;
  }
};

/**
 * Persist the full accounts registry to local cache and Firestore.
 */
const persistAccountsRegistry = async (accounts: Record<string, GuruAccount>): Promise<{ cloudSynced: boolean }> => {
  const sanitized = sanitizeAccountsMap(accounts);
  saveCachedGuruAccounts(sanitized);
  try {
    await setDoc(
      doc(db, 'syncs', REGISTRY_DOC_ID),
      {
        isRegistry: true,
        accounts: sanitized,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
    return { cloudSynced: true };
  } catch (e) {
    console.error('Failed to sync guru accounts registry to Firestore:', e);
    return { cloudSynced: false };
  }
};

/**
 * Create or update a teacher account (username + password) without modifying their tahfidz data.
 */
export const upsertGuruAccount = async (params: {
  username: string;
  password: string;
  note?: string;
  isRecovery?: boolean;
  isLogin?: boolean;
}): Promise<{ account: GuruAccount; cloudSynced: boolean }> => {
  const cleanUsername = params.username.trim();
  const usernameId = normalizeUsernameId(cleanUsername);
  const current = await fetchAllGuruAccounts();
  const existing = current[usernameId];
  const now = new Date().toISOString();

  const updatedAccount: GuruAccount = {
    usernameId,
    username: existing?.username || cleanUsername,
    password: params.password.trim(),
    note: params.note !== undefined ? params.note.trim() : existing?.note || '',
    createdAt: existing?.createdAt || now,
    updatedAt: now
  };

  const resolvedLastLoginAt = params.isLogin ? now : existing?.lastLoginAt;
  if (resolvedLastLoginAt) {
    updatedAccount.lastLoginAt = resolvedLastLoginAt;
  }

  const resolvedRecoveredAt = params.isRecovery ? now : existing?.recoveredAt;
  if (resolvedRecoveredAt) {
    updatedAccount.recoveredAt = resolvedRecoveredAt;
  }

  const next = {
    ...current,
    [usernameId]: updatedAccount
  };

  const { cloudSynced } = await persistAccountsRegistry(next);
  return { account: updatedAccount, cloudSynced };
};

/**
 * Update only the password for an existing or previously-synced teacher without touching their data.
 */
export const updateGuruPassword = async (
  username: string,
  newPassword: string,
  isRecovery = false
): Promise<{ account: GuruAccount; cloudSynced: boolean }> => {
  return upsertGuruAccount({
    username,
    password: newPassword,
    isRecovery
  });
};

/**
 * Remove login credentials from registry (does NOT delete teacher's synced data).
 */
export const removeGuruAccountCredential = async (
  usernameId: string
): Promise<{ cloudSynced: boolean }> => {
  const current = await fetchAllGuruAccounts();
  if (!current[usernameId]) return { cloudSynced: true };
  const next = { ...current };
  delete next[usernameId];
  const sanitized = sanitizeAccountsMap(next);
  saveCachedGuruAccounts(sanitized);
  try {
    await setDoc(
      doc(db, 'syncs', REGISTRY_DOC_ID),
      {
        isRegistry: true,
        accounts: sanitized,
        updatedAt: new Date().toISOString()
      }
    );
    return { cloudSynced: true };
  } catch (e) {
    console.error('Failed to remove account credential from Firestore:', e);
    return { cloudSynced: false };
  }
};

/**
 * Verify teacher login credentials against registry, preserving existing canonical username & data.
 * If account exists in legacy syncs or local storage without a password yet, registers the password cleanly.
 */
export const verifyOrRegisterGuruLogin = async (
  typedUsername: string,
  typedPassword: string
): Promise<{
  ok: boolean;
  canonicalUsername: string;
  error?: string;
  isFirstPasswordSetup?: boolean;
}> => {
  const cleanTyped = typedUsername.trim();
  const cleanPassword = typedPassword.trim();
  if (!cleanTyped) {
    return { ok: false, canonicalUsername: '', error: 'Masukkan username atau nama pengajar.' };
  }
  if (!cleanPassword) {
    return { ok: false, canonicalUsername: cleanTyped, error: 'Masukkan password akun guru Anda.' };
  }

  const usernameId = normalizeUsernameId(cleanTyped);
  const accounts = await fetchAllGuruAccounts();
  const existingAccount = accounts[usernameId];

  // If account already has a password configured, enforce exact password check
  if (existingAccount && existingAccount.password) {
    if (cleanPassword !== existingAccount.password) {
      return {
        ok: false,
        canonicalUsername: existingAccount.username,
        error: 'Password salah! Jika lupa password, hubungi Admin untuk melihat atau memulihkan password Anda.'
      };
    }

    // Update lastLoginAt in background without blocking login
    const now = new Date().toISOString();
    const updated = {
      ...accounts,
      [usernameId]: {
        ...existingAccount,
        lastLoginAt: now
      }
    };
    persistAccountsRegistry(updated).catch(() => {});

    return {
      ok: true,
      canonicalUsername: existingAccount.username,
      isFirstPasswordSetup: false
    };
  }

  // Account does not have a password yet (new guru or legacy pre-password guru).
  // Preserve exact casing from existing localStorage key or Firestore sync doc if present.
  let canonicalUsername = existingAccount?.username || findExistingLocalStorageUsername(cleanTyped) || cleanTyped;

  try {
    const syncSnap = await Promise.race([
      getDoc(doc(db, 'syncs', usernameId)),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3500))
    ]);
    if (syncSnap.exists() && syncSnap.data()?.username) {
      canonicalUsername = syncSnap.data().username;
    }
  } catch {
    // Offline fallback - keep local/typed canonical username
  }

  await upsertGuruAccount({
    username: canonicalUsername,
    password: cleanPassword,
    isLogin: true
  });

  return {
    ok: true,
    canonicalUsername,
    isFirstPasswordSetup: true
  };
};
