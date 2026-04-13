import React, { useState, useEffect } from 'react';
import { Database, Download, Upload, ClipboardPaste } from 'lucide-react';
import { storage } from '../services/storage';
import { cn } from '../lib/utils';
import ConfirmModal from './ConfirmModal';

export default function Maintenance() {
  const [pasteText, setPasteText] = useState('');
  const [showPasteArea, setShowPasteArea] = useState(false);
  const [themeColor, setThemeColor] = useState('emerald');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isFactoryResetModalOpen, setIsFactoryResetModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importContent, setImportContent] = useState<string | null>(null);

  useEffect(() => {
    const inst = storage.getInstitution();
    setThemeColor(inst.theme_color || 'emerald');
  }, []);

  const theme = {
    text: themeColor === 'emerald' ? 'text-emerald-600' :
          themeColor === 'blue' ? 'text-blue-600' :
          themeColor === 'amber' ? 'text-amber-600' :
          themeColor === 'indigo' ? 'text-indigo-600' :
          themeColor === 'purple' ? 'text-purple-600' :
          themeColor === 'rose' ? 'text-rose-600' :
          'text-slate-600',
    bg: themeColor === 'emerald' ? 'bg-emerald-600' :
        themeColor === 'blue' ? 'bg-blue-600' :
        themeColor === 'amber' ? 'bg-amber-600' :
        themeColor === 'indigo' ? 'bg-indigo-600' :
        themeColor === 'purple' ? 'bg-purple-600' :
        themeColor === 'rose' ? 'bg-rose-600' :
        'bg-slate-600',
    hover: themeColor === 'emerald' ? 'hover:bg-emerald-500' :
           themeColor === 'blue' ? 'hover:bg-blue-500' :
           themeColor === 'amber' ? 'hover:bg-amber-500' :
           themeColor === 'indigo' ? 'hover:bg-indigo-500' :
           themeColor === 'purple' ? 'hover:bg-purple-500' :
           themeColor === 'rose' ? 'hover:bg-rose-500' :
           'hover:bg-slate-500',
    lightBg: themeColor === 'emerald' ? 'bg-emerald-50' :
             themeColor === 'blue' ? 'bg-blue-50' :
             themeColor === 'amber' ? 'bg-amber-50' :
             themeColor === 'indigo' ? 'bg-indigo-50' :
             themeColor === 'purple' ? 'bg-purple-50' :
             themeColor === 'rose' ? 'bg-rose-50' :
             'bg-slate-50',
    lightText: themeColor === 'emerald' ? 'text-emerald-700' :
               themeColor === 'blue' ? 'text-blue-700' :
               themeColor === 'amber' ? 'text-amber-700' :
               themeColor === 'indigo' ? 'text-indigo-700' :
               themeColor === 'purple' ? 'text-purple-700' :
               themeColor === 'rose' ? 'text-rose-700' :
               'text-slate-700',
    border: themeColor === 'emerald' ? 'border-emerald-100' :
            themeColor === 'blue' ? 'border-blue-100' :
            themeColor === 'amber' ? 'border-amber-100' :
            themeColor === 'indigo' ? 'border-indigo-100' :
            themeColor === 'purple' ? 'border-purple-100' :
            themeColor === 'rose' ? 'border-rose-100' :
            'border-slate-100',
    ring: themeColor === 'emerald' ? 'focus:ring-emerald-500/50' :
          themeColor === 'blue' ? 'focus:ring-blue-500/50' :
          themeColor === 'amber' ? 'focus:ring-amber-500/50' :
          themeColor === 'indigo' ? 'focus:ring-indigo-500/50' :
          themeColor === 'purple' ? 'focus:ring-purple-500/50' :
          themeColor === 'rose' ? 'focus:ring-rose-500/50' :
          'focus:ring-slate-500/50',
    shadow: themeColor === 'emerald' ? 'shadow-emerald-500/20' :
            themeColor === 'blue' ? 'shadow-blue-500/20' :
            themeColor === 'amber' ? 'shadow-amber-500/20' :
            themeColor === 'indigo' ? 'shadow-indigo-500/20' :
            themeColor === 'purple' ? 'shadow-purple-500/20' :
            themeColor === 'rose' ? 'shadow-rose-500/20' :
            'shadow-slate-500/20',
  };

  const handleExport = () => {
    const data = storage.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fileName = `tahfidz_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    
    // Add confirmation for the user
    setTimeout(() => {
      alert(`File cadangan "${fileName}" telah dikirim ke folder Download browser Anda. Silakan periksa untuk memastikan file sudah tersimpan.`);
    }, 500);
  };

  const handleCopyToClipboard = () => {
    const data = storage.exportData();
    navigator.clipboard.writeText(data).then(() => {
      alert('Data cadangan telah disalin ke clipboard. Anda dapat menempelkannya (paste) ke aplikasi catatan atau pesan sebagai cadangan tambahan.');
    }).catch(err => {
      console.error('Gagal menyalin:', err);
      alert('Gagal menyalin ke clipboard. Silakan coba unduh file saja.');
    });
  };

  const handlePasteImport = () => {
    if (!pasteText.trim()) {
      alert('Silakan tempel teks cadangan terlebih dahulu.');
      return;
    }
    setImportContent(pasteText);
    setIsImportModalOpen(true);
  };

  const confirmImport = () => {
    if (importContent) {
      const success = storage.importData(importContent);
      if (success) {
        alert('Database berhasil diimpor. Aplikasi akan memuat ulang.');
        window.location.reload();
      } else {
        alert('Gagal mengimpor database. Teks yang Anda tempel mungkin tidak lengkap, salah format, atau memori perangkat penuh.');
      }
    }
  };

  const confirmResetData = () => {
    storage.resetData();
    alert('Data berhasil direset.');
    window.location.reload();
  };

  const confirmFactoryReset = () => {
    storage.factoryReset();
    alert('Sistem berhasil direset total.');
    window.location.href = '/';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
        <h2 className="text-2xl font-bold text-stone-900 mb-8 flex items-center gap-3">
          <Database className={theme.text} />
          Pemeliharaan Sistem
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className={cn("p-8 rounded-3xl border flex flex-col items-center text-center", theme.lightBg, theme.border)}>
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
              <Download className={cn("w-8 h-8", theme.text)} />
            </div>
            <h3 className={cn("text-lg font-bold mb-2", theme.lightText.replace('700', '900'))}>Ekspor Database</h3>
            <p className={cn("text-sm mb-8 opacity-70", theme.lightText)}>
              Unduh salinan database (.json) untuk cadangan manual. Simpan file ini di tempat yang aman.
            </p>
            <div className="grid grid-cols-1 gap-3 w-full">
              <button 
                onClick={handleExport}
                className={cn("w-full text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2", theme.bg, theme.hover)}
              >
                <Download size={18} />
                Unduh Backup (.json)
              </button>
              <button 
                onClick={handleCopyToClipboard}
                className={cn("w-full bg-white border-2 py-3 rounded-xl font-bold transition-colors text-sm", theme.text, theme.border)}
              >
                Salin ke Clipboard (Teks)
              </button>
            </div>
          </div>

          <div className="p-8 bg-stone-50 rounded-3xl border border-stone-200 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
              <Upload className="text-stone-400 w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">Impor Database</h3>
            <p className="text-stone-500 text-sm mb-8">
              Pulihkan data dari file backup (.json atau .txt). Fitur ini akan menimpa data yang ada saat ini.
            </p>
            <input 
              type="file"
              accept=".json,.txt"
              id="import-db"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    const content = reader.result as string;
                    if (!content || content.trim().length === 0) {
                      alert('Gagal mengimpor: File kosong.');
                      return;
                    }
                    setImportContent(content);
                    setIsImportModalOpen(true);
                  };
                  reader.onerror = () => {
                    alert('Gagal membaca file. Silakan coba lagi.');
                  };
                  reader.readAsText(file);
                }
              }}
            />
            <button 
              onClick={() => document.getElementById('import-db')?.click()}
              className="w-full bg-stone-900 text-white py-3 rounded-xl font-bold hover:bg-stone-800 transition-colors mb-3"
            >
              Unggah Backup (.json)
            </button>
            <button 
              onClick={() => setShowPasteArea(!showPasteArea)}
              className="text-stone-500 text-xs font-bold hover:text-stone-700 transition-colors flex items-center gap-1"
            >
              <ClipboardPaste size={14} />
              {showPasteArea ? 'Sembunyikan Area Tempel' : 'Gunakan Teks Cadangan (Alternatif)'}
            </button>
          </div>
        </div>

        {showPasteArea && (
          <div className="mt-8 p-6 bg-stone-50 rounded-3xl border border-stone-200 animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
              <ClipboardPaste size={16} className="text-stone-500" />
              Tempel Teks Cadangan
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Jika unggah file bermasalah, buka file cadangan Anda dengan aplikasi teks, salin isinya, lalu tempel di bawah ini.
            </p>
            <textarea 
              className={cn("w-full h-32 bg-white border border-stone-200 rounded-xl p-4 text-xs font-mono focus:outline-none focus:ring-2 mb-4", theme.ring)}
              placeholder='Tempel teks JSON di sini (diawali dengan {"institution": ...)'
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
            />
            <button 
              onClick={handlePasteImport}
              className="w-full bg-stone-900 text-white py-3 rounded-xl font-bold hover:bg-stone-800 transition-colors"
            >
              Impor dari Teks
            </button>
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-amber-50 rounded-3xl border border-amber-100 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-amber-900 mb-1">Reset Data Saja</h3>
              <p className="text-amber-700/70 text-sm mb-4">
                Menghapus semua data siswa, halaqoh, setoran, dan ujian. Profil lembaga dan tanda tangan tetap disimpan.
              </p>
            </div>
            <button 
              onClick={() => setIsResetModalOpen(true)}
              className={cn("w-full py-3 text-white rounded-xl font-bold transition-all shadow-lg", theme.bg, theme.hover, theme.shadow)}
            >
              Reset Data
            </button>
          </div>

          <div className="p-8 bg-red-50 rounded-3xl border border-red-100 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-red-900 mb-1">Reset Total (Pabrik)</h3>
              <p className="text-red-700/70 text-sm mb-4">
                Menghapus SELURUH data termasuk profil lembaga, logo, tanda tangan, dan mengeluarkan Anda dari sistem.
              </p>
            </div>
            <button 
              onClick={() => setIsFactoryResetModalOpen(true)}
              className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-500 transition-all shadow-lg shadow-red-500/20"
            >
              Reset Total
            </button>
          </div>
        </div>

        <div className="mt-12 p-6 bg-amber-50 rounded-2xl border border-amber-100">
          <h4 className="text-sm font-bold text-amber-900 mb-2">Peringatan Keamanan</h4>
          <p className="text-xs text-amber-800/80 leading-relaxed">
            Database ini berisi data sensitif siswa dan guru. Jangan membagikan file backup kepada pihak yang tidak berwenang. Lakukan backup secara berkala setiap akhir pekan atau akhir bulan.
          </p>
        </div>
      </div>

      <ConfirmModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onConfirm={confirmImport}
        title="Impor Database"
        message="Peringatan: Ini akan menimpa semua data saat ini. Data yang ada akan digantikan dengan data dari file cadangan. Lanjutkan?"
        confirmText="Impor Sekarang"
        themeColor={themeColor}
        variant="warning"
      />

      <ConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={confirmResetData}
        title="Reset Data"
        message="Apakah Anda yakin ingin menghapus semua data siswa, halaqoh, setoran, dan ujian? Profil lembaga dan tanda tangan akan tetap disimpan."
        confirmText="Reset Data"
        themeColor={themeColor}
        variant="danger"
      />

      <ConfirmModal
        isOpen={isFactoryResetModalOpen}
        onClose={() => setIsFactoryResetModalOpen(false)}
        onConfirm={confirmFactoryReset}
        title="Reset Total (Pabrik)"
        message="PERINGATAN: Seluruh data akan dihapus permanen termasuk profil lembaga, logo, dan tanda tangan. Anda akan dikeluarkan dari sistem. Anda yakin ingin melanjutkan?"
        confirmText="Reset Total"
        themeColor={themeColor}
        variant="danger"
      />
    </div>
  );
}
