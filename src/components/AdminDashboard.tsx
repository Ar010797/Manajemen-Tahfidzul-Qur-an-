import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  RefreshCw,
  Download,
  Users,
  FileText,
  CheckCircle,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  AlertTriangle,
  KeyRound,
  UserPlus,
  Copy,
  Check,
  Search,
  RotateCcw,
  Edit2,
  X,
  Database
} from 'lucide-react';
import LZString from 'lz-string';
import { safeJsonParse } from '../utils/jsonUtils';
import { storage, setCurrentUser } from '../services/storage';
import { db } from '../services/firebase';
import { collection, getDocs, doc, deleteDoc, writeBatch } from 'firebase/firestore';
import ConfirmModal from './ConfirmModal';
import { AdminProgressReport } from './AdminProgressReport';
import {
  GuruAccount,
  fetchAllGuruAccounts,
  upsertGuruAccount,
  updateGuruPassword,
  removeGuruAccountCredential,
  normalizeUsernameId
} from '../services/guruAccounts';
import { cn } from '../lib/utils';

interface UnifiedGuruRow {
  usernameId: string;
  displayName: string;
  account: GuruAccount | null;
  cloudData: any | null;
  localData: any | null;
  lastSyncAt: string | null;
}

const generateEasyPassword = () => {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `tahfidz${num}`;
};

export const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'accounts'>('overview');
  const [globalData, setGlobalData] = useState<Record<string, any>>({});
  const [syncMetadata, setSyncMetadata] = useState<Record<string, any>>({});
  const [docIds, setDocIds] = useState<Record<string, string>>({});
  const [guruAccounts, setGuruAccounts] = useState<Record<string, GuruAccount>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success'>('idle');
  const [impersonateTarget, setImpersonateTarget] = useState<string | null>(null);

  // Account Manager UI States
  const [accountSearch, setAccountSearch] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Add / Edit / Recover Password Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAccountForm, setNewAccountForm] = useState({ username: '', password: '', note: '' });
  const [editPasswordTarget, setEditPasswordTarget] = useState<UnifiedGuruRow | null>(null);
  const [editPasswordValue, setEditPasswordValue] = useState('');
  const [editNoteValue, setEditNoteValue] = useState('');
  const [recoverTarget, setRecoverTarget] = useState<UnifiedGuruRow | null>(null);
  const [recoverNewPassword, setRecoverNewPassword] = useState('');
  const [isSavingAccount, setIsSavingAccount] = useState(false);

  // Confirm Deletion States
  const [deleteCredentialTarget, setDeleteCredentialTarget] = useState<UnifiedGuruRow | null>(null);
  const [deleteSyncTarget, setDeleteSyncTarget] = useState<string | null>(null);
  const [isBroadcastConfirmOpen, setIsBroadcastConfirmOpen] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  const fetchGlobalData = async () => {
    setIsLoading(true);
    try {
      const [querySnapshot, accountsMap] = await Promise.all([
        getDocs(collection(db, 'syncs')),
        fetchAllGuruAccounts()
      ]);

      const newData: Record<string, any> = {};
      const newDocIds: Record<string, string> = {};
      const newMetadata: Record<string, any> = {};

      for (const document of querySnapshot.docs) {
        if (document.id === '__guru_accounts__') continue;
        const data = document.data();
        if (data?.isRegistry) continue;

        if (data.username) {
          try {
            let rawJsonString = data.data || '';

            if (data.isChunked) {
              const chunksSnapshot = await getDocs(collection(db, `syncs/${document.id}/chunks`));
              let chunksData = chunksSnapshot.docs.map(c => c.data());
              if (data.numChunks) {
                chunksData = chunksData.filter(c => c.chunkIndex < data.numChunks);
                if (chunksData.length !== data.numChunks) {
                  console.warn(`Incomplete chunks for ${data.username}. Expected ${data.numChunks}, got ${chunksData.length}.`);
                }
              }
              if (chunksData.length === data.numChunks && data.numChunks > 0) {
                chunksData.sort((a, b) => a.chunkIndex - b.chunkIndex);
                rawJsonString = chunksData.map(c => c.chunkData).join('');
              } else if (chunksData.length > 0 && !data.data) {
                chunksData.sort((a, b) => a.chunkIndex - b.chunkIndex);
                rawJsonString = chunksData.map(c => c.chunkData).join('');
              }
            }

            const probablyCompressed =
              data.isCompressed ||
              (rawJsonString && typeof rawJsonString === 'string' && rawJsonString.startsWith('N4Ig'));

            if (probablyCompressed && rawJsonString) {
              const decompressed =
                LZString.decompressFromBase64(rawJsonString) ||
                LZString.decompressFromUTF16(rawJsonString) ||
                LZString.decompressFromEncodedURIComponent(rawJsonString) ||
                LZString.decompress(rawJsonString);
              if (decompressed) {
                rawJsonString = decompressed;
              }
            }
            if (rawJsonString) {
              newData[data.username] = safeJsonParse(rawJsonString);
              newMetadata[data.username] = { updatedAt: data.updatedAt };
              newDocIds[data.username] = document.id;
            }
          } catch (err) {
            console.error(`Failed to parse data for ${data.username}`, err);
          }
        }
      }

      setGlobalData(newData);
      setSyncMetadata(newMetadata);
      setDocIds(newDocIds);
      setGuruAccounts(accountsMap);
    } catch (e: any) {
      console.error('Failed to fetch data', e);
      setToast({
        type: 'error',
        message: `Gagal mengambil data dari server: ${e.message || e.toString()}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalData();
  }, []);

  // Gather any local tahfidz_data_* partitions on this browser so Admin can also see local guru data
  const localGuruPartitions = useMemo(() => {
    const result: Record<string, { username: string; data: any }> = {};
    if (typeof localStorage === 'undefined') return result;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('tahfidz_data_')) {
        const uname = key.slice('tahfidz_data_'.length);
        const uid = normalizeUsernameId(uname);
        if (uid === 'admin' || uid === 'default' || !uid) continue;
        try {
          const parsed = safeJsonParse(localStorage.getItem(key) || '');
          if (parsed && typeof parsed === 'object') {
            result[uid] = { username: uname, data: parsed };
          }
        } catch {
          // ignore malformed local entry
        }
      }
    }
    return result;
  }, [globalData, guruAccounts]);

  // Unified list of all teachers across Accounts Registry, Cloud Syncs, and Local Partitions
  const unifiedGuruRows = useMemo<UnifiedGuruRow[]>(() => {
    const map: Record<string, UnifiedGuruRow> = {};

    // 1. Registered accounts
    (Object.values(guruAccounts) as GuruAccount[]).forEach(acc => {
      const uid = acc.usernameId || normalizeUsernameId(acc.username);
      if (uid === 'admin') return;
      map[uid] = {
        usernameId: uid,
        displayName: acc.username,
        account: acc,
        cloudData: null,
        localData: null,
        lastSyncAt: null
      };
    });

    // 2. Cloud synced datasets
    Object.entries(globalData).forEach(([uname, cData]) => {
      const uid = normalizeUsernameId(uname);
      if (uid === 'admin') return;
      const existing = map[uid];
      map[uid] = {
        usernameId: uid,
        displayName: existing?.displayName || uname,
        account: existing?.account || null,
        cloudData: cData,
        localData: existing?.localData || null,
        lastSyncAt: syncMetadata[uname]?.updatedAt || null
      };
    });

    // 3. Local partitions
    (Object.entries(localGuruPartitions) as Array<[string, { username: string; data: any }]>).forEach(([uid, entry]) => {
      const existing = map[uid];
      map[uid] = {
        usernameId: uid,
        displayName: existing?.displayName || entry.username,
        account: existing?.account || null,
        cloudData: existing?.cloudData || null,
        localData: entry.data,
        lastSyncAt: existing?.lastSyncAt || null
      };
    });

    return Object.values(map).sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [guruAccounts, globalData, syncMetadata, localGuruPartitions]);

  const filteredAccountRows = useMemo(() => {
    const q = accountSearch.trim().toLowerCase();
    if (!q) return unifiedGuruRows;
    return unifiedGuruRows.filter(
      r =>
        r.displayName.toLowerCase().includes(q) ||
        (r.account?.note && r.account.note.toLowerCase().includes(q))
    );
  }, [unifiedGuruRows, accountSearch]);

  const copyText = async (text: string, keyId: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(keyId);
      setToast({ type: 'success', message: `${label} berhasil disalin ke clipboard.` });
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      setToast({ type: 'error', message: 'Gagal menyalin teks ke clipboard.' });
    }
  };

  const handleCreateGuruAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = newAccountForm.username.trim();
    const cleanPass = newAccountForm.password.trim();
    if (!cleanUser || !cleanPass) {
      setToast({ type: 'error', message: 'Username dan password wajib diisi.' });
      return;
    }
    if (normalizeUsernameId(cleanUser) === 'admin') {
      setToast({ type: 'error', message: 'Gunakan username selain "admin" untuk akun guru.' });
      return;
    }

    setIsSavingAccount(true);
    try {
      const { account, cloudSynced } = await upsertGuruAccount({
        username: cleanUser,
        password: cleanPass,
        note: newAccountForm.note
      });
      setGuruAccounts(prev => ({ ...prev, [account.usernameId]: account }));
      setNewAccountForm({ username: '', password: '', note: '' });
      setIsAddModalOpen(false);
      setToast({
        type: 'success',
        message: cloudSynced
          ? `Akun guru "${account.username}" berhasil disimpan & disinkronkan ke server.`
          : `Akun guru "${account.username}" tersimpan di perangkat ini (server offline).`
      });
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Gagal membuat akun guru.' });
    } finally {
      setIsSavingAccount(false);
    }
  };

  const openEditPasswordModal = (row: UnifiedGuruRow) => {
    setEditPasswordTarget(row);
    setEditPasswordValue(row.account?.password || '');
    setEditNoteValue(row.account?.note || '');
  };

  const handleSaveEditedPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPasswordTarget) return;
    const cleanPass = editPasswordValue.trim();
    if (!cleanPass) {
      setToast({ type: 'error', message: 'Password baru tidak boleh kosong.' });
      return;
    }

    setIsSavingAccount(true);
    try {
      const { account, cloudSynced } = await upsertGuruAccount({
        username: editPasswordTarget.displayName,
        password: cleanPass,
        note: editNoteValue
      });
      setGuruAccounts(prev => ({ ...prev, [account.usernameId]: account }));
      setEditPasswordTarget(null);
      setToast({
        type: 'success',
        message:
          `Password untuk "${account.username}" berhasil diperbarui.` +
          (cloudSynced ? ' Data terakhir santri & ujian tetap aman.' : ' Tersimpan lokal (offline).')
      });
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Gagal memperbarui password.' });
    } finally {
      setIsSavingAccount(false);
    }
  };

  const openRecoverModal = (row: UnifiedGuruRow) => {
    setRecoverTarget(row);
    setRecoverNewPassword(row.account?.password || generateEasyPassword());
  };

  const handleConfirmRecoveryPassword = async () => {
    if (!recoverTarget) return;
    const cleanPass = recoverNewPassword.trim();
    if (!cleanPass) {
      setToast({ type: 'error', message: 'Masukkan password pemulihan terlebih dahulu.' });
      return;
    }

    setIsSavingAccount(true);
    try {
      const { account, cloudSynced } = await updateGuruPassword(recoverTarget.displayName, cleanPass, true);
      setGuruAccounts(prev => ({ ...prev, [account.usernameId]: account }));
      setRecoverTarget(prev => (prev ? { ...prev, account } : null));
      setToast({
        type: 'success',
        message:
          `Akun "${account.username}" siap dipulihkan dengan password baru tanpa kehilangan data terakhir.` +
          (cloudSynced ? '' : ' (Tersimpan lokal)')
      });
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Gagal memulihkan password.' });
    } finally {
      setIsSavingAccount(false);
    }
  };

  const handleCopyRecoveryWA = (row: UnifiedGuruRow, passwordToShare: string) => {
    const activeData = row.cloudData || row.localData;
    const studentCount = activeData?.students?.length || 0;
    const halaqohCount = activeData?.halaqoh?.length || 0;
    const depositCount = activeData?.daily_deposits?.length || 0;
    const text =
      `Assalamualaikum Warahmatullahi Wabarakatuh\n\n` +
      `*PEMULIHAN AKUN MANAGER TAHFIDZ*\n` +
      `Username : ${row.displayName}\n` +
      `Password : ${passwordToShare}\n` +
      `Status Data Terakhir : Aman (${studentCount} Santri, ${halaqohCount} Halaqoh, ${depositCount} Setoran)\n\n` +
      `Silakan masuk kembali melalui halaman login Guru Halaqoh menggunakan username dan password di atas. Data Anda otomatis terjaga.`;
    copyText(text, `recover_wa_${row.usernameId}`, 'Pesan pemulihan WA');
  };

  const confirmDeleteAccountCredential = async () => {
    if (!deleteCredentialTarget) return;
    try {
      await removeGuruAccountCredential(deleteCredentialTarget.usernameId);
      setGuruAccounts(prev => {
        const next = { ...prev };
        delete next[deleteCredentialTarget.usernameId];
        return next;
      });
      setToast({
        type: 'success',
        message: `Kredensial login "${deleteCredentialTarget.displayName}" dihapus. Data setoran/santri di server tidak dihapus.`
      });
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Gagal menghapus kredensial akun.' });
    } finally {
      setDeleteCredentialTarget(null);
    }
  };

  const handleDownloadAll = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(globalData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', `tahfidz_all_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleSyncMyData = async () => {
    setSyncStatus('syncing');
    try {
      const username = localStorage.getItem('current_username') || 'admin';
      const myData = storage.exportData();

      const compressedData = LZString.compressToBase64(myData);
      const CHUNK_SIZE = 800000;
      const numChunks = Math.ceil(compressedData.length / CHUNK_SIZE);
      const usernameId = username.trim().replace(/\s+/g, '_').toLowerCase();

      const batch = writeBatch(db);
      for (let i = 0; i < numChunks; i++) {
        const chunkDoc = doc(db, `syncs/${usernameId}/chunks`, `chunk_${i}`);
        batch.set(chunkDoc, {
          chunkData: compressedData.substring(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE),
          chunkIndex: i
        });
      }

      const nowIso = new Date().toISOString();
      localStorage.setItem('localUpdatedAt', nowIso);
      localStorage.setItem(`localUpdatedAt_${usernameId}`, nowIso);

      batch.set(
        doc(db, 'syncs', usernameId),
        {
          username,
          isCompressed: true,
          isChunked: true,
          numChunks,
          updatedAt: nowIso
        },
        { merge: true }
      );

      await batch.commit();

      setSyncStatus('success');
      fetchGlobalData();
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (e: any) {
      console.error(e);
      setSyncStatus('idle');
      setToast({ type: 'error', message: `Gagal melakukan sinkronisasi: ${e.message || e.toString()}` });
    }
  };

  const confirmDeleteGuruSync = async () => {
    if (!deleteSyncTarget) return;
    const guru = deleteSyncTarget;
    try {
      const usernameId = docIds[guru] || normalizeUsernameId(guru);
      try {
        const chunksSnapshot = await getDocs(collection(db, `syncs/${usernameId}/chunks`));
        const deletePromises = chunksSnapshot.docs.map(c => deleteDoc(c.ref));
        await Promise.all(deletePromises);
      } catch (ex) {
        console.error('Failed to cleanup chunks', ex);
      }

      await deleteDoc(doc(db, 'syncs', usernameId));
      setToast({ type: 'success', message: `Data sinkronisasi server untuk "${guru}" telah dihapus.` });
      fetchGlobalData();
    } catch (e: any) {
      console.error('Failed to delete data', e);
      setToast({ type: 'error', message: `Gagal menghapus data: ${e.message || e.toString()}` });
    } finally {
      setDeleteSyncTarget(null);
    }
  };

  const confirmBroadcastProfilLembaga = async () => {
    setIsBroadcastConfirmOpen(false);
    setIsBroadcasting(true);
    try {
      const myInstitution = storage.getInstitution();
      const gurusList = Object.keys(globalData);

      for (const guru of gurusList) {
        const d = globalData[guru];
        d.institution = { ...myInstitution };
        const compressedData = LZString.compressToBase64(JSON.stringify(d));
        const CHUNK_SIZE = 800000;
        const numChunks = Math.ceil(compressedData.length / CHUNK_SIZE);
        const usernameId = docIds[guru] || normalizeUsernameId(guru);

        const batch = writeBatch(db);
        for (let i = 0; i < numChunks; i++) {
          const chunkDoc = doc(db, `syncs/${usernameId}/chunks`, `chunk_${i}`);
          batch.set(chunkDoc, {
            chunkData: compressedData.substring(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE),
            chunkIndex: i
          });
        }

        batch.set(
          doc(db, 'syncs', usernameId),
          {
            username: guru,
            isCompressed: true,
            isChunked: true,
            numChunks,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        );

        await batch.commit();
      }
      setToast({ type: 'success', message: `Berhasil mengirim Profil Lembaga ke ${gurusList.length} akun guru!` });
      await fetchGlobalData();
    } catch (e: any) {
      console.error(e);
      setToast({ type: 'error', message: `Gagal broadcast: ${e.message}` });
    } finally {
      setIsBroadcasting(false);
    }
  };

  const gurus = Object.keys(globalData);
  const currentMonthStr = new Date().toISOString().substring(0, 7);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-stone-900 flex items-center gap-3">
            <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600 shrink-0" />
            Panel Khusus Admin
          </h1>
          <p className="text-stone-500 mt-1 text-sm">
            Pantau sinkronisasi data & kelola akun username/password guru Miftahussalam.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={fetchGlobalData}
            className="min-h-[42px] flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold text-sm transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleDownloadAll}
            disabled={gurus.length === 0}
            className="min-h-[42px] flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Backup Global
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={cn(
            'p-4 rounded-2xl border flex items-start justify-between gap-3 text-sm',
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          )}
        >
          <div className="flex items-start gap-2.5">
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <p className="font-medium">{toast.message}</p>
          </div>
          <button type="button" onClick={() => setToast(null)} className="p-1 rounded-lg hover:bg-black/5">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-100 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setActiveSection('overview')}
          className={cn(
            'min-h-[42px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap',
            activeSection === 'overview'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          )}
        >
          <Database size={16} />
          <span>Data & Laporan Guru ({gurus.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('accounts')}
          className={cn(
            'min-h-[42px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap',
            activeSection === 'accounts'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          )}
        >
          <KeyRound size={16} />
          <span>Pengelola Guru · Username & Password ({unifiedGuruRows.length})</span>
        </button>
      </div>

      {/* SECTION: PENGELOLA GURU (USERNAME, PASSWORD & RECOVERY) */}
      {activeSection === 'accounts' && (
        <div className="space-y-6">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-display font-bold text-stone-900 flex items-center gap-2.5">
                  <KeyRound className="w-5 h-5 text-indigo-600" />
                  Pengelola Akun Guru (Username & Password)
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Lihat username dan password guru, pulihkan akun saat lupa password, atau ubah password tanpa menghapus data terakhir guru.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNewAccountForm({ username: '', password: generateEasyPassword(), note: '' });
                  setIsAddModalOpen(true);
                }}
                className="min-h-[44px] px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 whitespace-nowrap"
              >
                <UserPlus size={17} />
                <span>Tambah Akun Guru</span>
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={17} />
              <input
                type="text"
                placeholder="Cari username atau keterangan guru..."
                value={accountSearch}
                onChange={e => setAccountSearch(e.target.value)}
                className="w-full min-h-[44px] bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            {isLoading ? (
              <div className="py-10 text-center text-stone-400 font-medium">Memuat daftar akun guru...</div>
            ) : filteredAccountRows.length === 0 ? (
              <div className="py-10 text-center text-stone-400 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                <p className="font-semibold text-stone-600">Belum ada akun guru terdaftar</p>
                <p className="text-xs mt-1">Klik "Tambah Akun Guru" atau tunggu guru login pertama kali.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAccountRows.map(row => {
                  const hasPassword = Boolean(row.account?.password);
                  const isVisible = Boolean(visiblePasswords[row.usernameId]);
                  const activeData = row.cloudData || row.localData;
                  const studentCount = activeData?.students?.length || 0;
                  const halaqohCount = activeData?.halaqoh?.length || 0;
                  const depositCount = activeData?.daily_deposits?.length || 0;
                  const examCount = (activeData?.exams_hafalan?.length || 0) + (activeData?.exams_ummi?.length || 0);

                  return (
                    <div
                      key={row.usernameId}
                      className="p-4 sm:p-5 rounded-2xl border border-stone-200/80 bg-white hover:border-indigo-200 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm uppercase shrink-0">
                            {row.displayName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-bold text-stone-900 text-base truncate">{row.displayName}</h3>
                              <button
                                type="button"
                                onClick={() => copyText(row.displayName, `user_${row.usernameId}`, 'Username')}
                                className="p-1 text-stone-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50"
                                title="Salin Username"
                              >
                                {copiedKey === `user_${row.usernameId}` ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                              </button>
                            </div>
                            {row.account?.note && (
                              <p className="text-xs text-stone-500">{row.account.note}</p>
                            )}
                          </div>
                        </div>

                        {/* Password Display Box */}
                        <div className="flex flex-wrap items-center gap-2 pl-11">
                          <span className="text-xs font-semibold text-stone-500">Password:</span>
                          {hasPassword ? (
                            <div className="inline-flex items-center gap-1.5 bg-stone-100 border border-stone-200 px-3 py-1 rounded-lg">
                              <span className="font-mono text-xs sm:text-sm font-bold text-stone-900 select-all">
                                {isVisible ? row.account!.password : '••••••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setVisiblePasswords(prev => ({
                                    ...prev,
                                    [row.usernameId]: !prev[row.usernameId]
                                  }))
                                }
                                className="p-1 text-stone-500 hover:text-stone-900"
                                title={isVisible ? 'Sembunyikan' : 'Lihat Password'}
                              >
                                {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  copyText(row.account!.password, `pass_${row.usernameId}`, 'Password')
                                }
                                className="p-1 text-stone-500 hover:text-indigo-600"
                                title="Salin Password"
                              >
                                {copiedKey === `pass_${row.usernameId}` ? (
                                  <Check size={14} className="text-emerald-600" />
                                ) : (
                                  <Copy size={14} />
                                )}
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                              Belum diatur — klik Edit / Pulihkan untuk buat password
                            </span>
                          )}
                        </div>

                        {/* Data Preservation Verification Line */}
                        <div className="pl-11 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500 tabular-nums">
                          <span className="font-semibold text-stone-700">Data Terakhir:</span>
                          {activeData ? (
                            <>
                              <span>{halaqohCount} Halaqoh</span>
                              <span>·</span>
                              <span>{studentCount} Santri</span>
                              <span>·</span>
                              <span>{depositCount} Setoran</span>
                              <span>·</span>
                              <span>{examCount} Ujian</span>
                              {row.lastSyncAt && (
                                <>
                                  <span>·</span>
                                  <span className="text-emerald-700 font-medium">
                                    Server:{' '}
                                    {new Date(row.lastSyncAt).toLocaleDateString('id-ID', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </>
                              )}
                            </>
                          ) : (
                            <span>Belum ada data setoran tersimpan</span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 pl-11 lg:pl-0 shrink-0">
                        <button
                          type="button"
                          onClick={() => openEditPasswordModal(row)}
                          className="min-h-[40px] px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Edit2 size={14} />
                          <span>Edit Password</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => openRecoverModal(row)}
                          className="min-h-[40px] px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                        >
                          <RotateCcw size={14} />
                          <span>Pulihkan Akun</span>
                        </button>

                        {row.cloudData && (
                          <button
                            type="button"
                            onClick={() => setImpersonateTarget(row.displayName)}
                            className="min-h-[40px] px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                            title="Buka & periksa data terakhir guru ini"
                          >
                            <Eye size={14} />
                            <span>Buka Data</span>
                          </button>
                        )}

                        {row.account && (
                          <button
                            type="button"
                            onClick={() => setDeleteCredentialTarget(row)}
                            className="min-h-[40px] px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold inline-flex items-center gap-1 transition-colors"
                            title="Hapus kredensial login saja"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION: EXISTING OVERVIEW & SYNCED DATA */}
      {activeSection === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-500 uppercase tracking-widest">Total Akun</p>
                <p className="text-3xl font-black text-stone-900 tabular-nums">{unifiedGuruRows.length}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm col-span-1 md:col-span-2 flex flex-col justify-center">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-stone-800">Sinkronisasi Data Anda</h3>
                  <p className="text-xs text-stone-500 mt-1">Sebagai admin, Anda juga bisa push data lokal ke server.</p>
                </div>
                <button
                  type="button"
                  onClick={handleSyncMyData}
                  disabled={syncStatus === 'syncing'}
                  className="flex items-center gap-2 px-5 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-sm transition-colors shrink-0"
                >
                  {syncStatus === 'syncing' ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : syncStatus === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    'Push Data Lokal'
                  )}
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-center">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-purple-800">Bagi Profil</h3>
                  <p className="text-xs text-purple-600/70 mt-1">Timpa profil semua guru.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBroadcastConfirmOpen(true)}
                  disabled={isBroadcasting}
                  title="Timpa profil lembaga (Kop, TTD, Logo) semua guru dengan profil Admin saat ini."
                  className="flex items-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm transition-colors"
                >
                  {isBroadcasting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4 hidden sm:block" />}
                  Kirim
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-stone-100 bg-stone-50/50 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-bold text-stone-800 text-lg">Daftar Data Guru</h2>
              <button
                type="button"
                onClick={() => setActiveSection('accounts')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5"
              >
                <KeyRound size={14} />
                <span>Kelola Username & Password Guru →</span>
              </button>
            </div>
            <div className="divide-y divide-stone-100">
              {isLoading ? (
                <div className="p-8 text-center text-stone-400 font-medium animate-pulse">Memuat data dari server...</div>
              ) : gurus.length === 0 ? (
                <div className="p-8 text-center text-stone-400 font-medium">Belum ada data guru yang tersinkronisasi.</div>
              ) : (
                gurus.map(guru => {
                  const d = globalData[guru];
                  const studentCount = d.students?.length || 0;
                  const lastSync = syncMetadata[guru]?.updatedAt;
                  let isSyncedThisMonth = false;
                  let syncText = 'Belum sinkron';
                  let statusColor = 'bg-stone-100 text-stone-500 border-stone-200';
                  let SyncIcon = Clock;

                  if (lastSync) {
                    const syncDate = new Date(lastSync);
                    isSyncedThisMonth = lastSync.substring(0, 7) === currentMonthStr;
                    syncText = syncDate.toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    if (isSyncedThisMonth) {
                      statusColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                      SyncIcon = CheckCircle;
                    } else {
                      statusColor = 'bg-amber-50 text-amber-700 border-amber-200';
                      SyncIcon = AlertTriangle;
                      syncText = 'Bulan ini belum: ' + syncText;
                    }
                  }

                  const halaqohCount = d.halaqoh?.length || 0;
                  const rowMatch = unifiedGuruRows.find(r => r.usernameId === normalizeUsernameId(guru));

                  return (
                    <div key={guru} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg uppercase shrink-0">
                          {guru.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-stone-900 text-lg">{guru}</h3>
                          <div className={`mt-1 mb-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
                            <SyncIcon className="w-3 h-3" />
                            {syncText}
                          </div>
                          <p className="text-sm text-stone-500 flex flex-wrap gap-x-4 gap-y-1 mt-1">
                            <span>
                              <FileText className="w-3 h-3 inline mr-1" /> {halaqohCount} Halaqoh
                            </span>
                            <span>
                              <Users className="w-3 h-3 inline mr-1" /> {studentCount} Santri
                            </span>
                            <span>
                              <KeyRound className="w-3 h-3 inline mr-1" />
                              {rowMatch?.account?.password ? 'Password Terdaftar' : 'Password Belum Diatur'}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        {rowMatch && (
                          <button
                            type="button"
                            onClick={() => openRecoverModal(rowMatch)}
                            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-1.5"
                            title="Lihat / Pulihkan Username & Password Guru"
                          >
                            <KeyRound className="w-4 h-4" /> Akun & Password
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setImpersonateTarget(guru)}
                          className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                          title="Buka akun ini untuk melihat atau mengunduh Rapot / Rekap"
                        >
                          <Eye className="w-4 h-4" /> Buka Data
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(d, null, 2));
                            const a = document.createElement('a');
                            a.setAttribute('href', dataStr);
                            a.setAttribute('download', `data_guru_${guru}.json`);
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                          }}
                          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                          title="Unduh seluruh data mentah JSON"
                        >
                          <Download className="w-4 h-4" /> Mentah
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteSyncTarget(guru)}
                          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Hapus
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {!isLoading && (
            <AdminProgressReport
              globalData={
                gurus.length > 0
                  ? globalData
                  : { [localStorage.getItem('current_username') || 'Lokal']: safeJsonParse(storage.exportData()) }
              }
            />
          )}
        </>
      )}

      {/* MODAL: TAMBAH AKUN GURU BARU */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl border border-stone-200 shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-display font-bold text-stone-900 flex items-center gap-2">
                <UserPlus size={20} className="text-indigo-600" />
                Tambah Akun Guru
              </h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="p-2 text-stone-400 hover:text-stone-700 rounded-xl">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateGuruAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1.5">Username / Nama Pengajar</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ustadz Ahmad"
                  value={newAccountForm.username}
                  onChange={e => setNewAccountForm({ ...newAccountForm, username: e.target.value })}
                  className="w-full min-h-[44px] bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-600">Password</label>
                  <button
                    type="button"
                    onClick={() => setNewAccountForm({ ...newAccountForm, password: generateEasyPassword() })}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    Buat Acak
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Masukkan password guru"
                  value={newAccountForm.password}
                  onChange={e => setNewAccountForm({ ...newAccountForm, password: e.target.value })}
                  className="w-full min-h-[44px] bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1.5">Catatan / Keterangan Halaqoh (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Pengampu Halaqoh Abu Bakar"
                  value={newAccountForm.note}
                  onChange={e => setNewAccountForm({ ...newAccountForm, note: e.target.value })}
                  className="w-full min-h-[44px] bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 min-h-[44px] bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingAccount}
                  className="flex-1 min-h-[44px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl"
                >
                  {isSavingAccount ? 'Menyimpan...' : 'Simpan Akun'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PASSWORD GURU */}
      {editPasswordTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl border border-stone-200 shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-display font-bold text-stone-900 flex items-center gap-2">
                <Edit2 size={18} className="text-indigo-600" />
                Edit Password Guru
              </h3>
              <button type="button" onClick={() => setEditPasswordTarget(null)} className="p-2 text-stone-400 hover:text-stone-700 rounded-xl">
                <X size={18} />
              </button>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-xs space-y-1">
              <p className="text-stone-500">
                Username Login: <span className="font-bold text-stone-900">{editPasswordTarget.displayName}</span>
              </p>
              <p className="text-emerald-700 font-medium">
                Data terakhir santri, setoran, dan ujian tidak akan hilang saat password diubah.
              </p>
            </div>

            <form onSubmit={handleSaveEditedPassword} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-600">Password Baru</label>
                  <button
                    type="button"
                    onClick={() => setEditPasswordValue(generateEasyPassword())}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    Buat Acak
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={editPasswordValue}
                  onChange={e => setEditPasswordValue(e.target.value)}
                  placeholder="Masukkan password baru"
                  className="w-full min-h-[44px] bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1.5">Catatan (Opsional)</label>
                <input
                  type="text"
                  value={editNoteValue}
                  onChange={e => setEditNoteValue(e.target.value)}
                  placeholder="Contoh: Guru Kelas 2"
                  className="w-full min-h-[44px] bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditPasswordTarget(null)}
                  className="flex-1 min-h-[44px] bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingAccount}
                  className="flex-1 min-h-[44px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl"
                >
                  {isSavingAccount ? 'Menyimpan...' : 'Simpan Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PULIHKAN AKUN GURU (LUPA PASSWORD) */}
      {recoverTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-stone-200 shadow-2xl p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-display font-bold text-stone-900 flex items-center gap-2">
                <RotateCcw size={18} className="text-indigo-600" />
                Pemulihan Akun & Password Guru
              </h3>
              <button type="button" onClick={() => setRecoverTarget(null)} className="p-2 text-stone-400 hover:text-stone-700 rounded-xl">
                <X size={18} />
              </button>
            </div>

            <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-800">Username Guru</span>
                <button
                  type="button"
                  onClick={() => copyText(recoverTarget.displayName, `rec_u_${recoverTarget.usernameId}`, 'Username')}
                  className="text-xs font-bold text-indigo-700 hover:underline inline-flex items-center gap-1"
                >
                  <Copy size={12} /> Salin
                </button>
              </div>
              <p className="text-base font-bold text-stone-900">{recoverTarget.displayName}</p>
              {recoverTarget.account?.password ? (
                <p className="text-xs text-stone-700">
                  Password Tersimpan Saat Ini:{' '}
                  <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-indigo-200 select-all">
                    {recoverTarget.account.password}
                  </span>
                </p>
              ) : (
                <p className="text-xs text-amber-700 font-semibold">
                  Guru ini belum memiliki password tercatat. Simpan password pemulihan di bawah agar bisa login kembali.
                </p>
              )}
            </div>

            {/* Latest Data Safety Guarantee Box */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-1.5">
              <p className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle size={15} className="text-emerald-600" />
                Verifikasi Data Terakhir Guru (Tetap Aman)
              </p>
              {(() => {
                const activeData = recoverTarget.cloudData || recoverTarget.localData;
                if (!activeData) {
                  return <p className="text-xs text-stone-600">Belum ada data setoran tersimpan untuk akun ini.</p>;
                }
                return (
                  <p className="text-xs text-emerald-800 leading-relaxed tabular-nums">
                    Data terakhir tersedia ({activeData.halaqoh?.length || 0} Halaqoh · {activeData.students?.length || 0} Santri ·{' '}
                    {activeData.daily_deposits?.length || 0} Setoran ·{' '}
                    {(activeData.exams_hafalan?.length || 0) + (activeData.exams_ummi?.length || 0)} Ujian). Saat guru masuk kembali dengan username & password ini, seluruh data terakhir tidak hilang dan otomatis dipulihkan dari server jika login di perangkat baru.
                  </p>
                );
              })()}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-600">Password Pemulihan / Baru</label>
                <button
                  type="button"
                  onClick={() => setRecoverNewPassword(generateEasyPassword())}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  Generate Password Baru
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={recoverNewPassword}
                  onChange={e => setRecoverNewPassword(e.target.value)}
                  className="flex-1 min-h-[44px] bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
                <button
                  type="button"
                  onClick={handleConfirmRecoveryPassword}
                  disabled={isSavingAccount}
                  className="min-h-[44px] px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shrink-0"
                >
                  {isSavingAccount ? 'Menyimpan...' : 'Terapkan Password'}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => handleCopyRecoveryWA(recoverTarget, recoverNewPassword || recoverTarget.account?.password || '')}
                className="flex-1 min-h-[44px] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl inline-flex items-center justify-center gap-2"
              >
                <Copy size={15} />
                <span>Salin Info Pemulihan (WA)</span>
              </button>
              <button
                type="button"
                onClick={() => setRecoverTarget(null)}
                className="min-h-[44px] px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM: BUKA DATA GURU (IMPERSONATE WITHOUT DELETING OTHER LOCAL DATA) */}
      <ConfirmModal
        isOpen={!!impersonateTarget}
        onClose={() => setImpersonateTarget(null)}
        onConfirm={() => {
          if (impersonateTarget) {
            const guru = impersonateTarget;
            const d = globalData[guru];
            if (d) {
              const adminUser = localStorage.getItem('current_username') || 'admin';
              localStorage.setItem('admin_return_username', adminUser);
              setCurrentUser(guru);
              const success = storage.importData(JSON.stringify(d));
              if (success) {
                const uid = normalizeUsernameId(guru);
                const serverTs = syncMetadata[guru]?.updatedAt || new Date().toISOString();
                localStorage.setItem('localUpdatedAt', serverTs);
                localStorage.setItem(`localUpdatedAt_${uid}`, serverTs);
                localStorage.setItem(
                  'user',
                  JSON.stringify({
                    id: 'admin_impersonate',
                    username: guru,
                    role: 'admin'
                  })
                );
                window.location.reload();
              } else {
                setToast({
                  type: 'error',
                  message: `Gagal memuat data guru "${guru}". Memori penyimpanan perangkat penuh.`
                });
              }
            }
          }
        }}
        title="Buka Data Guru"
        message={`Buka data guru "${impersonateTarget}"? Data lokal guru lain di perangkat ini tetap aman, dan Anda dapat kembali ke Admin kapan saja.`}
        confirmText="Buka"
        cancelText="Batal"
        themeColor="indigo"
        variant="info"
      />

      {/* CONFIRM: HAPUS KREDENSIAL AKUN SAJA */}
      <ConfirmModal
        isOpen={!!deleteCredentialTarget}
        onClose={() => setDeleteCredentialTarget(null)}
        onConfirm={confirmDeleteAccountCredential}
        title="Hapus Kredensial Login Guru?"
        message={
          deleteCredentialTarget
            ? `Catatan username & password untuk "${deleteCredentialTarget.displayName}" akan dihapus dari daftar login. Data setoran, santri, dan ujian yang sudah disinkronkan tetap aman dan tidak ikut dihapus.`
            : ''
        }
        confirmText="Hapus Kredensial"
        themeColor="indigo"
        variant="danger"
      />

      {/* CONFIRM: HAPUS DATA SINKRONISASI SERVER */}
      <ConfirmModal
        isOpen={!!deleteSyncTarget}
        onClose={() => setDeleteSyncTarget(null)}
        onConfirm={confirmDeleteGuruSync}
        title="Hapus Data Sinkronisasi Server?"
        message={`Apakah Anda yakin ingin menghapus data sinkronisasi guru "${deleteSyncTarget}" dari server? Data aslinya di perangkat guru tersebut tidak akan hilang.`}
        confirmText="Hapus Data Server"
        themeColor="indigo"
        variant="danger"
      />

      {/* CONFIRM: BROADCAST PROFIL LEMBAGA */}
      <ConfirmModal
        isOpen={isBroadcastConfirmOpen}
        onClose={() => setIsBroadcastConfirmOpen(false)}
        onConfirm={confirmBroadcastProfilLembaga}
        title="Bagi Profil Lembaga ke Semua Guru?"
        message="Profil Lembaga (Kop, TTD, Logo, Warna Tema) milik semua guru akan diperbarui sesuai Profil Admin ini. Data santri, setoran, dan password guru tetap aman."
        confirmText="Kirim Sekarang"
        cancelText="Batal"
        themeColor="indigo"
        variant="warning"
      />
    </div>
  );
};
