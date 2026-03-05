import React, { useState, useEffect } from 'react';
import { Settings, Upload, Save } from 'lucide-react';

export default function InstitutionProfile() {
  const [profile, setProfile] = useState({
    name: '',
    address: '',
    principal_name: '',
    coordinator_name: '',
    halaqoh_teacher_name: '',
    academic_year: '',
    logo: '',
    watermark: '',
    principal_signature: '',
    coordinator_signature: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch('/api/institution');
      const data = await res.json();
      if (data) setProfile({
        ...data,
        principal_signature: data.principal_signature || '',
        coordinator_signature: data.coordinator_signature || ''
      });
    };
    fetchProfile();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'watermark' | 'principal_signature' | 'coordinator_signature') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await fetch('/api/institution', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(profile)
    });
    alert('Profil lembaga berhasil diperbarui!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
        <h2 className="text-2xl font-bold text-stone-900 mb-8 flex items-center gap-3">
          <Settings className="text-emerald-600" />
          Profil Lembaga & Pengesahan
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">Nama Instansi</label>
                <input 
                  type="text"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                  value={profile.name}
                  onChange={e => setProfile({...profile, name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">Alamat Lengkap</label>
                <textarea 
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 min-h-[100px]"
                  value={profile.address}
                  onChange={e => setProfile({...profile, address: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">Nama Kepala Sekolah</label>
                <input 
                  type="text"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                  value={profile.principal_name}
                  onChange={e => setProfile({...profile, principal_name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">Koordinator Tahfidz</label>
                <input 
                  type="text"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                  value={profile.coordinator_name}
                  onChange={e => setProfile({...profile, coordinator_name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">Nama Pengampu Halaqoh</label>
                <input 
                  type="text"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                  value={profile.halaqoh_teacher_name}
                  onChange={e => setProfile({...profile, halaqoh_teacher_name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">Tahun Ajaran</label>
                <input 
                  type="text"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                  placeholder="Contoh: 2025/2026"
                  value={profile.academic_year}
                  onChange={e => setProfile({...profile, academic_year: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-stone-100">
            <div className="space-y-4">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">Logo Lembaga (Kop Surat)</label>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-stone-50 border-2 border-dashed border-stone-200 rounded-2xl flex items-center justify-center overflow-hidden">
                  {profile.logo ? <img src={profile.logo} alt="Logo" className="w-full h-full object-contain" /> : <Upload className="text-stone-300" />}
                </div>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={e => handleFileUpload(e, 'logo')}
                  className="text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">Watermark Rapor</label>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-stone-50 border-2 border-dashed border-stone-200 rounded-2xl flex items-center justify-center overflow-hidden">
                  {profile.watermark ? <img src={profile.watermark} alt="Watermark" className="w-full h-full object-contain opacity-50" /> : <Upload className="text-stone-300" />}
                </div>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={e => handleFileUpload(e, 'watermark')}
                  className="text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">TTD Kepala Sekolah</label>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-stone-50 border-2 border-dashed border-stone-200 rounded-2xl flex items-center justify-center overflow-hidden">
                  {profile.principal_signature ? <img src={profile.principal_signature} alt="TTD Kepsek" className="w-full h-full object-contain" /> : <Upload className="text-stone-300" />}
                </div>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={e => handleFileUpload(e, 'principal_signature')}
                  className="text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">TTD Koordinator Tahfidz</label>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-stone-50 border-2 border-dashed border-stone-200 rounded-2xl flex items-center justify-center overflow-hidden">
                  {profile.coordinator_signature ? <img src={profile.coordinator_signature} alt="TTD Koord" className="w-full h-full object-contain" /> : <Upload className="text-stone-300" />}
                </div>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={e => handleFileUpload(e, 'coordinator_signature')}
                  className="text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
          >
            <Save size={20} />
            Simpan Perubahan Profil
          </button>
        </form>
      </div>
    </div>
  );
}
