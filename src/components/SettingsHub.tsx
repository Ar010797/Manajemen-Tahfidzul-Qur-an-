import React, { useState, useEffect } from 'react';
import { Users, UserCircle, Settings, Database, ChevronRight, LayoutGrid } from 'lucide-react';
import HalaqohManager from './HalaqohManager';
import StudentManager from './StudentManager';
import InstitutionProfile from './InstitutionProfile';
import Maintenance from './Maintenance';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { storage } from '../services/storage';

export default function SettingsHub() {
  const [activeSubTab, setActiveSubTab] = useState<string | null>(null);
  const [themeColor, setThemeColor] = useState('emerald');

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
    lightBg: themeColor === 'emerald' ? 'bg-emerald-50' :
             themeColor === 'blue' ? 'bg-blue-50' :
             themeColor === 'amber' ? 'bg-amber-50' :
             themeColor === 'indigo' ? 'bg-indigo-50' :
             themeColor === 'purple' ? 'bg-purple-50' :
             themeColor === 'rose' ? 'bg-rose-50' :
             'bg-slate-50',
    shadow: themeColor === 'emerald' ? 'shadow-emerald-500/20' :
            themeColor === 'blue' ? 'shadow-blue-500/20' :
            themeColor === 'amber' ? 'shadow-amber-500/20' :
            themeColor === 'indigo' ? 'shadow-indigo-500/20' :
            themeColor === 'purple' ? 'shadow-purple-500/20' :
            themeColor === 'rose' ? 'shadow-rose-500/20' :
            'shadow-slate-500/20',
  };

  const settingsOptions = [
    { 
      id: 'halaqoh', 
      label: 'Manajemen Halaqoh', 
      description: 'Tambah, edit, atau hapus kelompok halaqoh', 
      icon: Users, 
      component: HalaqohManager,
      color: 'bg-blue-50 text-blue-600'
    },
    { 
      id: 'students', 
      label: 'Manajemen Siswa', 
      description: 'Kelola data siswa dan penempatan halaqoh', 
      icon: UserCircle, 
      component: StudentManager,
      color: 'bg-emerald-50 text-emerald-600'
    },
    { 
      id: 'profile', 
      label: 'Profil Lembaga', 
      description: 'Atur nama instansi, logo, dan pengesahan', 
      icon: Settings, 
      component: InstitutionProfile,
      color: 'bg-purple-50 text-purple-600'
    },
    { 
      id: 'maintenance', 
      label: 'Pemeliharaan', 
      description: 'Backup data, reset sistem, dan log aktivitas', 
      icon: Database, 
      component: Maintenance,
      color: 'bg-amber-50 text-amber-600'
    },
  ];

  if (activeSubTab) {
    const activeOption = settingsOptions.find(opt => opt.id === activeSubTab);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setActiveSubTab(null)}
            className={cn("flex items-center gap-2 transition-colors font-medium group", theme.text)}
          >
            <div className={cn("p-2 rounded-lg transition-colors", `group-hover:${theme.lightBg}`)}>
              <ChevronRight className="rotate-180" size={20} />
            </div>
            Kembali ke Pengaturan Utama
          </button>
          <div className="flex items-center gap-2 text-stone-400 text-sm">
            <span>Pengaturan</span>
            <ChevronRight size={14} />
            <span className="font-bold text-stone-900">{activeOption?.label}</span>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeOption && <activeOption.component />}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto font-sans space-y-12">
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-stone-950 rounded-2xl flex items-center justify-center text-white shadow-2xl">
            <LayoutGrid size={24} />
          </div>
          <h1 className="text-4xl font-display font-black text-stone-950 tracking-tight leading-none uppercase">Pengaturan Sistem</h1>
        </div>
        <p className="text-stone-500 font-medium ml-16">Konfigurasi infrastruktur data dan identitas lembaga Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 sm:px-0">
        {settingsOptions.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ y: -6, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSubTab(option.id)}
            className="flex flex-col md:flex-row items-center md:items-start gap-8 p-10 bg-white rounded-[3rem] border border-stone-200/60 shadow-lg shadow-stone-900/5 hover:shadow-2xl hover:shadow-stone-900/10 hover:border-stone-300 transition-all text-center md:text-left group relative overflow-hidden"
          >
            <div className={`w-20 h-20 shrink-0 rounded-3xl flex items-center justify-center transition-all duration-500 shadow-inner ${option.color} group-hover:scale-110 group-hover:rotate-6`}>
              <option.icon size={36} />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-2xl font-display font-black text-stone-950 tracking-tight transition-colors group-hover:text-stone-900 uppercase">{option.label}</h3>
              <p className="text-stone-500 font-medium leading-relaxed max-w-sm mx-auto md:mx-0">{option.description}</p>
            </div>
            <div className="md:absolute right-8 top-1/2 md:-translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
               <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg", theme.bg)}>
                <ChevronRight size={20} />
               </div>
            </div>
            
            {/* Subtle background decoration */}
            <div className={cn("absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-[0.03] group-hover:opacity-[0.1] transition-opacity", theme.bg)} />
          </motion.button>
        ))}
      </div>

      <div className="p-12 bg-stone-950 rounded-[4rem] text-white relative overflow-hidden shadow-2xl shadow-stone-950/20">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-xl text-center lg:text-left space-y-4">
            <h2 className="text-3xl font-display font-black tracking-tight uppercase leading-none">Butuh Bantuan?</h2>
            <p className="text-stone-400 font-medium leading-relaxed">
              Jika Anda memerlukan bantuan teknis, penyesuaian fitur, atau konsultasi sistem, tim pengembang kami siap membantu Anda meningkatkan efisiensi operasional lembaga.
            </p>
          </div>
          <a 
            href="https://wa.me/6285869372879" 
            target="_blank" 
            rel="noopener noreferrer"
            className={cn("px-10 py-5 text-white font-display font-black text-xs uppercase tracking-widest rounded-[1.5rem] transition-all shadow-2xl hover:scale-105 active:scale-95 whitespace-nowrap flex items-center gap-3", theme.bg, theme.shadow)}
          >
            <span>Hubungi Expert Support</span>
            <ChevronRight size={16} />
          </a>
        </div>
        
        {/* Premium background effects */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-stone-100/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}
