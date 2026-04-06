import React from 'react';
import { Database, Download, Upload } from 'lucide-react';
import { storage } from '../services/storage';

export default function Maintenance() {
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
                  reader.onloadend = () => {
                    const success = storage.importData(reader.result as string);
                    if (success) {
                      alert('Database berhasil diimpor. Aplikasi akan memuat ulang.');
                      window.location.reload();
                    } else {
                      alert('Gagal mengimpor database. Format file tidak valid.');
                    }
                  };
                  reader.readAsText(file);
                }
              }}
            />
            <button 
              onClick={() => document.getElementById('import-db')?.click()}
              className="w-full bg-stone-900 text-white py-3 rounded-xl font-bold hover:bg-stone-800 transition-colors"
            >
              Unggah Backup (.json)
            </button>
          </div>
        </div>

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
