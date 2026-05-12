import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, BookOpen, GraduationCap, TrendingUp, Calendar, Edit2, Save, X } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, parse } from 'date-fns';
import { id } from 'date-fns/locale';
import { storage } from '../services/storage';
import { cn } from '../lib/utils';
import DailyAdviceCard from './DailyAdviceCard';
import ConfirmModal from './ConfirmModal';

export default function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    halaqoh: 0,
    deposits: 0,
    exams: 0
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeDays, setActiveDays] = useState<Record<string, number>>({});
  const [halaqohs, setHalaqohs] = useState<any[]>([]);
  const [selectedHalaqoh, setSelectedHalaqoh] = useState('');
  const [themeColor, setThemeColor] = useState('emerald');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  useEffect(() => {
    const fetchStats = () => {
      const students = storage.getStudents();
      const halaqoh = storage.getHalaqoh();
      setHalaqohs(halaqoh);
      const today = format(new Date(), 'yyyy-MM-dd');
      const deposits = storage.getDailyDepositsCount(today);
      const exams = storage.getExamsCount();
      const institution = storage.getInstitution();
      setThemeColor(institution.theme_color || 'emerald');
      
      setStats({
        students: students.length,
        halaqoh: halaqoh.length,
        deposits,
        exams
      });

      setActiveDays(storage.getAllActiveDays(selectedHalaqoh));
    };

    fetchStats();

    // Refresh stats every 30 seconds to keep it updated
    const interval = setInterval(() => {
      fetchStats();
      const now = new Date();
      if (now.getDate() !== currentDate.getDate()) {
        setCurrentDate(now);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentDate, selectedHalaqoh]);

  const confirmResetTotal = () => {
    storage.factoryReset();
    window.location.reload();
  };

  const cards = [
    { label: 'Total Siswa', value: stats.students, icon: Users, color: 'emerald', gradient: 'from-emerald-500 to-teal-600' },
    { label: 'Total Halaqoh', value: stats.halaqoh, icon: BookOpen, color: 'blue', gradient: 'from-blue-500 to-indigo-600' },
    { label: 'Setoran Hari Ini', value: stats.deposits, icon: TrendingUp, color: 'amber', gradient: 'from-amber-500 to-orange-600' },
    { label: 'Total Ujian', value: stats.exams, icon: GraduationCap, color: 'purple', gradient: 'from-purple-500 to-pink-600' },
  ];

  const academicYear = storage.getInstitution().academic_year || '2025/2026';
  const [yearStart, yearEnd] = academicYear.split('/').map(y => parseInt(y));
  
  const months = [
    { name: 'Juli', value: `${yearStart}-07` },
    { name: 'Agustus', value: `${yearStart}-08` },
    { name: 'September', value: `${yearStart}-09` },
    { name: 'Oktober', value: `${yearStart}-10` },
    { name: 'November', value: `${yearStart}-11` },
    { name: 'Desember', value: `${yearStart}-12` },
    { name: 'Januari', value: `${yearEnd}-01` },
    { name: 'Februari', value: `${yearEnd}-02` },
    { name: 'Maret', value: `${yearEnd}-03` },
    { name: 'April', value: `${yearEnd}-04` },
    { name: 'Mei', value: `${yearEnd}-05` },
    { name: 'Juni', value: `${yearEnd}-06` },
  ];

  const semester1 = months.slice(0, 6);
  const semester2 = months.slice(6, 12);

  const calculateTotal = (monthList: typeof months) => {
    return monthList.reduce((acc, m) => acc + (activeDays[m.value] || 0), 0);
  };

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
    ring: themeColor === 'emerald' ? 'focus:ring-emerald-500/50' :
          themeColor === 'blue' ? 'focus:ring-blue-500/50' :
          themeColor === 'amber' ? 'focus:ring-amber-500/50' :
          themeColor === 'indigo' ? 'focus:ring-indigo-500/50' :
          themeColor === 'purple' ? 'focus:ring-purple-500/50' :
          themeColor === 'rose' ? 'focus:ring-rose-500/50' :
          'focus:ring-slate-500/50',
    mainBg: themeColor === 'emerald' ? 'bg-emerald-900' :
            themeColor === 'blue' ? 'bg-blue-900' :
            themeColor === 'amber' ? 'bg-amber-900' :
            themeColor === 'indigo' ? 'bg-indigo-900' :
            themeColor === 'purple' ? 'bg-purple-900' :
            themeColor === 'rose' ? 'bg-rose-900' :
            'bg-slate-900',
    mainLightText: themeColor === 'emerald' ? 'text-emerald-100/80' :
                   themeColor === 'blue' ? 'text-blue-100/80' :
                   themeColor === 'amber' ? 'text-amber-100/80' :
                   themeColor === 'indigo' ? 'text-indigo-100/80' :
                   themeColor === 'purple' ? 'text-purple-100/80' :
                   themeColor === 'rose' ? 'text-rose-100/80' :
                   'text-slate-100/80',
    mainBtn: themeColor === 'emerald' ? 'text-emerald-900' :
             themeColor === 'blue' ? 'text-blue-900' :
             themeColor === 'amber' ? 'text-amber-900' :
             themeColor === 'indigo' ? 'text-indigo-900' :
             themeColor === 'purple' ? 'text-purple-900' :
             themeColor === 'rose' ? 'text-rose-900' :
             'text-slate-900',
    mainShadow: themeColor === 'emerald' ? 'shadow-emerald-900/20' :
                themeColor === 'blue' ? 'shadow-blue-900/20' :
                themeColor === 'amber' ? 'shadow-amber-900/20' :
                themeColor === 'indigo' ? 'shadow-indigo-900/20' :
                themeColor === 'purple' ? 'shadow-purple-900/20' :
                themeColor === 'rose' ? 'shadow-rose-900/20' :
                'shadow-slate-900/20',
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-stone-950 tracking-tight leading-none">Dashboard</h1>
          <p className="text-xs sm:text-sm text-stone-500 font-medium tracking-tight">Selamat Datang kembali di Pusat Kendali Tahfidz.</p>
        </div>
        <div className="flex items-center gap-4 p-1.5 bg-white border border-stone-200/60 rounded-[1.5rem] shadow-sm">
           <div className={cn("px-4 py-2.5 rounded-[1.25rem] border border-stone-100 shadow-sm flex items-center gap-3", theme.lightBg)}>
             <Calendar className={cn("w-4 h-4", theme.text)} />
             <span className={cn("font-display font-black text-xs uppercase tracking-wider", theme.text)}>
              {format(currentDate, 'dd MMMM yyyy', { locale: id })}
            </span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <DailyAdviceCard />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: idx * 0.1,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="group relative bg-white p-8 rounded-[2.5rem] border border-stone-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.06)] transition-all duration-500 overflow-hidden"
          >
            <div className={cn(
              "absolute -right-4 -top-4 w-32 h-32 bg-gradient-to-br opacity-[0.03] rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700",
              card.gradient
            )} />
            
            <div className="space-y-6 relative z-10">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
                card.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                card.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                card.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                'bg-purple-50 text-purple-600'
              )}>
                <card.icon size={28} />
              </div>
              <div className="space-y-1">
                <p className="text-stone-400 text-xs font-display font-black uppercase tracking-[0.2em]">{card.label}</p>
                <p className="text-4xl font-display font-black text-stone-950 tracking-tighter tabular-nums">{card.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 bg-white p-10 rounded-[3rem] border border-stone-200/50 shadow-2xl shadow-stone-900/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-12">
            <div className="flex items-center gap-6">
              <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center shadow-xl", theme.bg, theme.mainShadow)}>
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-black text-stone-950 tracking-tight leading-tight">Timeline Akademik</h3>
                <p className="text-stone-500 font-medium">Monitoring kehadiran dan hari aktif pengajian.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-stone-50 p-2 rounded-3xl border border-stone-200/40">
              <select 
                className={cn("bg-transparent appearance-none font-display font-black text-xs uppercase tracking-wider py-3 px-8 focus:outline-none cursor-pointer", theme.text)}
                value={selectedHalaqoh}
                onChange={(e) => setSelectedHalaqoh(e.target.value)}
              >
                <option value="">Semua Halaqoh</option>
                {halaqohs.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Semester 1 */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-[10px] font-display font-black text-stone-400 uppercase tracking-[0.3em]">Semester 1 (Ganjil)</h4>
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs font-display font-black text-emerald-900 uppercase">
                      {calculateTotal(semester1)} HARI
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {semester1.map(m => (
                    <div key={m.value} className="flex flex-col justify-between p-5 bg-stone-50/50 hover:bg-white transition-all duration-300 rounded-3xl border border-stone-100 hover:shadow-xl hover:border-emerald-100 group/item">
                      <span className="text-xs font-display font-black text-stone-400 uppercase tracking-widest mb-4">{m.name}</span>
                      <span className="text-2xl font-display font-black text-stone-950 group-hover/item:text-emerald-600 transition-colors">{activeDays[m.value] || 0}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Semester 2 */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-[10px] font-display font-black text-stone-400 uppercase tracking-[0.3em]">Semester 2 (Genap)</h4>
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-xs font-display font-black text-blue-900 uppercase">
                      {calculateTotal(semester2)} HARI
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {semester2.map(m => (
                    <div key={m.value} className="flex flex-col justify-between p-5 bg-stone-50/50 hover:bg-white transition-all duration-300 rounded-3xl border border-stone-100 hover:shadow-xl hover:border-blue-100 group/item">
                      <span className="text-xs font-display font-black text-stone-400 uppercase tracking-widest mb-4">{m.name}</span>
                      <span className="text-2xl font-display font-black text-stone-950 group-hover/item:text-blue-600 transition-colors">{activeDays[m.value] || 0}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-stone-200/50 shadow-xl group hover:shadow-2xl transition-all duration-500 hover:translate-y-[-4px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
               <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center text-white shadow-2xl transition-transform group-hover:rotate-12", theme.bg)}>
                  <Users size={32} />
               </div>
               <div className="space-y-1">
                  <h3 className="text-2xl font-display font-black text-stone-950 tracking-tight">Pusat Bantuan</h3>
                  <p className="text-stone-500 font-medium">Alami kendala? Kami siap membantu Anda.</p>
               </div>
            </div>
            <a 
              href="https://wa.me/6285869372879" 
              target="_blank" 
              rel="noopener noreferrer"
              className={cn("px-10 py-5 bg-stone-900 text-white font-display font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl")}
            >
              CHAT ADMIN
            </a>
          </div>
        </div>
        
        <div className="bg-rose-50 p-10 rounded-[3rem] border border-rose-100/50 shadow-xl group hover:shadow-rose-100/50 transition-all duration-500 hover:translate-y-[-4px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
               <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center bg-rose-600 text-white shadow-2xl transition-transform group-hover:scale-90 group-hover:rotate-[-8deg]">
                  <X size={32} />
               </div>
               <div className="space-y-1">
                  <h3 className="text-2xl font-display font-black text-rose-950 tracking-tight">Factory Reset</h3>
                  <p className="text-rose-900/60 font-medium">Muat ulang seluruh ekosistem data.</p>
               </div>
            </div>
            <button 
              onClick={() => setIsResetModalOpen(true)}
              className="px-10 py-5 bg-rose-600 text-white font-display font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-rose-700 hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              RESET SISTEM
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={confirmResetTotal}
        title="Reset Total (Pabrik)"
        message="Apakah Anda yakin ingin menghapus SEMUA data (termasuk profil lembaga) dan mereset total sistem? Tindakan ini tidak dapat dibatalkan."
        confirmText="Reset Sekarang"
        themeColor={themeColor}
        variant="danger"
      />
    </div>
  );
}
