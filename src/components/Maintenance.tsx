import React, { useState } from 'react';
import { Database, Download, Upload, ClipboardPaste } from 'lucide-react';
import { storage } from '../services/storage';

export default function Maintenance() {
  const [pasteText, setPasteText] = useState('');
  const [showPasteArea, setShowPasteArea] = useState(false);

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

    if (confirm('Peringatan: Ini akan menimpa semua data saat ini. Lanjutkan?')) {
      const success = storage.importData(pasteText);
      if (success) {
        alert('Database berhasil diimpor dari teks. Aplikasi akan memuat ulang.');
        window.location.reload();
      } else {
        alert('Gagal mengimpor database. Teks yang Anda tempel mungkin tidak lengkap, salah format, atau memori perangkat penuh.');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
        <h2 className="text-2xl font-bold text-stone-900 mb-8 flex items-center gap-3">
          <Database className="text-emerald-600" />
          Pemeliharaan Sistem
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
              <Download className="text-emerald-600 w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-emerald-900 mb-2">Ekspor Database</h3>
            <p className="text-emerald-700/70 text-sm mb-8">
              Unduh salinan database (.json) untuk cadangan manual. Simpan file ini di tempat yang aman.
            </p>
            <div className="grid grid-cols-1 gap-3 w-full">
              <button 
                onClick={handleExport}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Unduh Backup (.json)
              </button>
              <button 
                onClick={handleCopyToClipboard}
                className="w-full bg-white text-emerald-600 border-2 border-emerald-100 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors text-sm"
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
                if (file && confirm('Peringatan: Ini akan menimpa semua data saat ini. Lanjutkan?')) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    const content = reader.result as string;
                    if (!content || content.trim().length === 0) {
                      alert('Gagal mengimpor: File kosong.');
                      return;
                    }
                    const success = storage.importData(content);
                    if (success) {
                      alert('Database berhasil diimpor. Aplikasi akan memuat ulang.');
                      window.location.reload();
                    } else {
                      alert('Gagal mengimpor database. File mungkin rusak, bukan format JSON yang benar, atau memori perangkat penuh. Pastikan Anda mengunggah file .json yang diunduh dari aplikasi ini.');
                    }
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
              className="w-full h-32 bg-white border border-stone-200 rounded-xl p-4 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-stone-500/50 mb-4"
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
              onClick={() => {
                if (confirm('Apakah Anda yakin ingin menghapus semua data siswa dan setoran? Profil lembaga akan tetap ada.')) {
                  storage.resetData();
                  alert('Data berhasil direset.');
                  window.location.reload();
                }
              }}
              className="w-full py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-500 transition-all shadow-lg shadow-amber-500/20"
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
              onClick={() => {
                if (confirm('PERINGATAN: Seluruh data akan dihapus permanen dan Anda akan dikeluarkan. Anda yakin ingin melanjutkan?')) {
                  storage.factoryReset();
                  alert('Sistem berhasil direset total.');
                  window.location.href = '/';
                }
              }}
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
    </div>
  );
}
