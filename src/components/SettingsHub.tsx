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
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
            <LayoutGrid size={20} />
          </div>
          <h1 className="text-3xl font-bold text-stone-900">Pengaturan Sistem</h1>
        </div>
        <p className="text-stone-500 ml-11">Kelola infrastruktur data dan profil lembaga Anda di sini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsOptions.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setActiveSubTab(option.id)}
            className="flex items-start gap-6 p-8 bg-white rounded-[2rem] border border-stone-200 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 hover:border-emerald-200 transition-all text-left group relative overflow-hidden"
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${option.color} group-hover:scale-110 duration-300`}>
              <option.icon size={32} />
            </div>
            <div className="flex-1 pr-8">
              <h3 className="text-xl font-bold text-stone-900 group-hover:text-emerald-700 transition-colors mb-1">{option.label}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{option.description}</p>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
              <ChevronRight className="text-emerald-500" size={24} />
            </div>
            
            {/* Subtle background decoration */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity ${option.color.split(' ')[0]}`} />
          </motion.button>
        ))}
      </div>

      <div className="mt-12 p-8 bg-stone-900 rounded-[2.5rem] text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold mb-2">Butuh Bantuan?</h2>
            <p className="text-stone-400 text-sm leading-relaxed">
              Jika Anda mengalami kesulitan dalam mengelola data atau memerlukan fitur tambahan, silakan hubungi tim pengembang sistem.
            </p>
          </div>
          <a 
            href="https://wa.me/6285869372879" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 whitespace-nowrap flex items-center gap-2"
          >
            <span>Hubungi Support</span>
          </a>
        </div>
        
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 blur-[60px] rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>
    </div>
  );
}
