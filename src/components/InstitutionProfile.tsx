import React, { useState, useEffect } from 'react';
import { Settings, Upload, Save } from 'lucide-react';
import { cn } from '../lib/utils';
import { storage } from '../services/storage';

export default function InstitutionProfile() {
  const [profile, setProfile] = useState({
    name: '',
    address: '',
    principal_name: '',
    coordinator_name: '',
    halaqoh_teacher_name: '',
    academic_year: '',
    report_date: '',
    logo: '',
    watermark: '',
    principal_signature: '',
    coordinator_signature: '',
    theme_color: 'emerald' as const,
    reminder_enabled: false,
    reminder_time: '15:00'
  });

  useEffect(() => {
    const fetchProfile = () => {
      const data = storage.getInstitution();
      if (data) setProfile({
        ...data,
        principal_signature: data.principal_signature || '',
        coordinator_signature: data.coordinator_signature || '',
        theme_color: data.theme_color || 'emerald',
        reminder_enabled: data.reminder_enabled ?? false,
        reminder_time: data.reminder_time || '15:00'
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storage.updateInstitution(profile);
    alert('Profil lembaga berhasil diperbarui!');
    window.location.reload(); // Reload to apply theme changes globally
  };

  const themeColors = [
    { name: 'Emerald', value: 'emerald', class: 'bg-emerald-500' },
    { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
    { name: 'Amber', value: 'amber', class: 'bg-amber-500' },
    { name: 'Indigo', value: 'indigo', class: 'bg-indigo-500' },
    { name: 'Purple', value: 'purple', class: 'bg-purple-500' },
    { name: 'Rose', value: 'rose', class: 'bg-rose-500' },
    { name: 'Slate', value: 'slate', class: 'bg-slate-500' },
  ];

  const theme = {
    text: profile.theme_color === 'emerald' ? 'text-emerald-600' :
          profile.theme_color === 'blue' ? 'text-blue-600' :
          profile.theme_color === 'amber' ? 'text-amber-600' :
          profile.theme_color === 'indigo' ? 'text-indigo-600' :
          profile.theme_color === 'purple' ? 'text-purple-600' :
          profile.theme_color === 'rose' ? 'text-rose-600' :
          'text-slate-600',
    bg: profile.theme_color === 'emerald' ? 'bg-emerald-600' :
        profile.theme_color === 'blue' ? 'bg-blue-600' :
        profile.theme_color === 'amber' ? 'bg-amber-600' :
        profile.theme_color === 'indigo' ? 'bg-indigo-600' :
        profile.theme_color === 'purple' ? 'bg-purple-600' :
        profile.theme_color === 'rose' ? 'bg-rose-600' :
        'bg-slate-600',
    hover: profile.theme_color === 'emerald' ? 'hover:bg-emerald-500' :
           profile.theme_color === 'blue' ? 'hover:bg-blue-500' :
           profile.theme_color === 'amber' ? 'hover:bg-amber-500' :
           profile.theme_color === 'indigo' ? 'hover:bg-indigo-500' :
           profile.theme_color === 'purple' ? 'hover:bg-purple-500' :
           profile.theme_color === 'rose' ? 'hover:bg-rose-500' :
           'hover:bg-slate-500',
    lightBg: profile.theme_color === 'emerald' ? 'bg-emerald-50' :
             profile.theme_color === 'blue' ? 'bg-blue-50' :
             profile.theme_color === 'amber' ? 'bg-amber-50' :
             profile.theme_color === 'indigo' ? 'bg-indigo-50' :
             profile.theme_color === 'purple' ? 'bg-purple-50' :
             profile.theme_color === 'rose' ? 'bg-rose-50' :
             'bg-slate-50',
    lightText: profile.theme_color === 'emerald' ? 'text-emerald-700' :
               profile.theme_color === 'blue' ? 'text-blue-700' :
               profile.theme_color === 'amber' ? 'text-amber-700' :
               profile.theme_color === 'indigo' ? 'text-indigo-700' :
               profile.theme_color === 'purple' ? 'text-purple-700' :
               profile.theme_color === 'rose' ? 'text-rose-700' :
               'text-slate-700',
    shadow: profile.theme_color === 'emerald' ? 'shadow-emerald-500/10' :
            profile.theme_color === 'blue' ? 'shadow-blue-500/10' :
            profile.theme_color === 'amber' ? 'shadow-amber-500/10' :
            profile.theme_color === 'indigo' ? 'shadow-indigo-500/10' :
            profile.theme_color === 'purple' ? 'shadow-purple-500/10' :
            profile.theme_color === 'rose' ? 'shadow-rose-500/10' :
            'shadow-slate-500/10',
    ring: profile.theme_color === 'emerald' ? 'focus:ring-emerald-500/50' :
          profile.theme_color === 'blue' ? 'focus:ring-blue-500/50' :
          profile.theme_color === 'amber' ? 'focus:ring-amber-500/50' :
          profile.theme_color === 'indigo' ? 'focus:ring-indigo-500/50' :
          profile.theme_color === 'purple' ? 'focus:ring-purple-500/50' :
          profile.theme_color === 'rose' ? 'focus:ring-rose-500/50' :
          'focus:ring-slate-500/50',
    border: profile.theme_color === 'emerald' ? 'border-emerald-200' :
            profile.theme_color === 'blue' ? 'border-blue-200' :
            profile.theme_color === 'amber' ? 'border-amber-200' :
            profile.theme_color === 'indigo' ? 'border-indigo-200' :
            profile.theme_color === 'purple' ? 'border-purple-200' :
            profile.theme_color === 'rose' ? 'border-rose-200' :
            'border-slate-200',
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
        <h2 className="text-2xl font-bold text-stone-900 mb-8 flex items-center gap-3">
          <Settings className={theme.text} />
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
                  value={profile.name || ''}
                  onChange={e => setProfile({...profile, name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">Alamat Lengkap</label>
                <textarea 
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 min-h-[100px]"
                  value={profile.address || ''}
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
                  value={profile.principal_name || ''}
                  onChange={e => setProfile({...profile, principal_name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">Koordinator Tahfidz</label>
                <input 
                  type="text"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                  value={profile.coordinator_name || ''}
                  onChange={e => setProfile({...profile, coordinator_name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">Nama Pengampu Halaqoh</label>
                <input 
                  type="text"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                  value={profile.halaqoh_teacher_name || ''}
                  onChange={e => setProfile({...profile, halaqoh_teacher_name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">Tahun Ajaran</label>
                <input 
                  type="text"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                  placeholder="Contoh: 2025/2026"
                  value={profile.academic_year || ''}
                  onChange={e => setProfile({...profile, academic_year: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">Tanggal Rapor (Opsional)</label>
                <input 
                  type="text"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                  placeholder="Contoh: Cikunir, 20 Juni 2025"
                  value={profile.report_date || ''}
                  onChange={e => setProfile({...profile, report_date: e.target.value})}
                />
                <p className="text-[10px] text-stone-400 ml-1 italic">Jika dikosongkan, akan menggunakan tanggal hari ini otomatis.</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-stone-100">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1 mb-4 block">Pengingat Input Harian</label>
            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-stone-800">Aktifkan Pengingat</h4>
                  <p className="text-xs text-stone-500">Munculkan notifikasi jika ada siswa yang belum setor pada jam tertentu.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, reminder_enabled: !profile.reminder_enabled })}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    profile.reminder_enabled ? theme.bg : "bg-stone-300"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                    profile.reminder_enabled ? "right-1" : "left-1"
                  )} />
                </button>
              </div>
              
              {profile.reminder_enabled && (
                <div className="pt-4 border-t border-stone-200 flex items-center gap-4">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider ml-1">Waktu Pengingat</label>
                    <input 
                      type="time"
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2 text-sm"
                      value={profile.reminder_time || ''}
                      onChange={e => setProfile({...profile, reminder_time: e.target.value})}
                    />
                  </div>
                  <div className="flex-[2] text-xs text-stone-500 italic pt-4">
                    Sistem akan mengecek setiap menit dan memberikan peringatan jika sudah melewati jam ini dan masih ada siswa yang belum memiliki catatan setoran hari ini.
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-8 border-t border-stone-100">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1 mb-4 block">Tema Warna Aplikasi</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
              {themeColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setProfile({ ...profile, theme_color: color.value as any })}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                    profile.theme_color === color.value 
                      ? 'border-stone-900 bg-stone-50 scale-105' 
                      : 'border-transparent hover:bg-stone-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full shadow-sm ${color.class}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{color.name}</span>
                </button>
              ))}
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
                  className={cn(
                    "text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold cursor-pointer",
                    `file:${theme.lightBg} file:${theme.lightText} hover:file:opacity-80`
                  )}
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
                  className={cn(
                    "text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold cursor-pointer",
                    `file:${theme.lightBg} file:${theme.lightText} hover:file:opacity-80`
                  )}
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
                  className={cn(
                    "text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold cursor-pointer",
                    `file:${theme.lightBg} file:${theme.lightText} hover:file:opacity-80`
                  )}
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
                  className={cn(
                    "text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold cursor-pointer",
                    `file:${theme.lightBg} file:${theme.lightText} hover:file:opacity-80`
                  )}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className={cn(
              "w-full text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg",
              theme.bg, theme.hover, theme.shadow
            )}
          >
            <Save size={20} />
            Simpan Perubahan Profil
          </button>
        </form>
      </div>
    </div>
  );
}
