import React from 'react';
import { Database, Download, Upload } from 'lucide-react';

export default function Maintenance() {
  const handleExport = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/maintenance/export', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tahfidz_backup_${new Date().toISOString().split('T')[0]}.db`;
    document.body.appendChild(a);
    a.click();
    a.remove();
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
              Unduh salinan database (.db) untuk cadangan manual. Simpan file ini di tempat yang aman.
            </p>
            <button 
              onClick={handleExport}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-500 transition-colors"
            >
              Unduh Backup (.db)
            </button>
          </div>

          <div className="p-8 bg-stone-50 rounded-3xl border border-stone-200 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
              <Upload className="text-stone-400 w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">Impor Database</h3>
            <p className="text-stone-500 text-sm mb-8">
              Pulihkan data dari file backup (.db). Fitur ini akan menimpa data yang ada saat ini.
            </p>
            <input 
              type="file"
              accept=".db"
              id="import-db"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file && confirm('Peringatan: Ini akan menimpa semua data saat ini. Lanjutkan?')) {
                  const reader = new FileReader();
                  reader.onloadend = async () => {
                    const token = localStorage.getItem('token');
                    const res = await fetch('/api/maintenance/import', {
                      method: 'POST',
                      headers: { 
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                      },
                      body: JSON.stringify({ database: reader.result })
                    });
                    const data = await res.json();
                    if (data.success) {
                      alert('Database berhasil diimpor. Aplikasi akan memuat ulang.');
                      window.location.reload();
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <button 
              onClick={() => document.getElementById('import-db')?.click()}
              className="w-full bg-stone-900 text-white py-3 rounded-xl font-bold hover:bg-stone-800 transition-colors"
            >
              Unggah Backup (.db)
            </button>
          </div>
        </div>

        <div className="mt-12 p-8 bg-red-50 rounded-3xl border border-red-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-900 mb-1">Reset Seluruh Data</h3>
            <p className="text-red-700/70 text-sm">
              Tindakan ini akan menghapus permanen seluruh data siswa, halaqoh, setoran, dan ujian. Pastikan Anda sudah melakukan backup.
            </p>
          </div>
          <button 
            onClick={async () => {
              if (confirm('PERINGATAN: Seluruh data akan dihapus permanen. Anda yakin ingin melanjutkan?')) {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/maintenance/reset', {
                  method: 'POST',
                  headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                  alert('Seluruh data berhasil direset.');
                  window.location.reload();
                } else {
                  const data = await res.json();
                  alert(data.error || 'Gagal mereset data.');
                }
              }
            }}
            className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-500 transition-all shadow-lg shadow-red-500/20 whitespace-nowrap"
          >
            Reset Sekarang
          </button>
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
