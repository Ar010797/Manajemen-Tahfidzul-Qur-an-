import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, BookOpen, GraduationCap, TrendingUp, Calendar, Edit2, Save, X } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, parse } from 'date-fns';
import { id } from 'date-fns/locale';
import { storage } from '../services/storage';
import { cn } from '../lib/utils';
import ConfirmModal from './ConfirmModal';
import { HADITHS } from '../constants/hadiths';

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

  // Stable daily index based on date string
  const dateStr = format(currentDate, 'yyyyMMdd');
  const hash = dateStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const currentHadith = HADITHS[hash % HADITHS.length];

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Selamat Datang, Guru</h1>
          <p className="text-stone-500 mt-1">Pantau perkembangan tahfidz siswa Anda hari ini.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white border border-stone-200 rounded-2xl shadow-sm">
          <Calendar className={cn("w-5 h-5", theme.text)} />
          <span className="font-semibold text-stone-700">
            {format(currentDate, 'EEEE, dd MMMM yyyy', { locale: id })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className={cn("rounded-3xl p-8 text-white relative overflow-hidden shadow-xl", theme.mainBg, theme.mainShadow)}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 blur-2xl rounded-full -ml-24 -mb-24" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <BookOpen size={18} className="text-white" />
              </div>
              <h2 className="text-xl font-bold">Hadits Hari Ini</h2>
            </div>

            <div className="space-y-6">
              {currentHadith.arabic && (
                <p 
                  className="text-2xl md:text-3xl font-serif text-right leading-loose tracking-wide" 
                  style={{ direction: 'rtl' }}
                >
                  {currentHadith.arabic}
                </p>
              )}
              
              <div className="space-y-2">
                <p className={cn("text-lg md:text-xl font-medium leading-relaxed italic", theme.mainLightText)}>
                  "{currentHadith.content}"
                </p>
                <p className="text-sm font-bold opacity-80 flex items-center gap-2">
                  <span className="w-4 h-px bg-white/40" />
                  {currentHadith.source}
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <a 
                href="https://wa.me/6285869372879" 
                target="_blank" 
                rel="noopener noreferrer"
                className={cn("px-6 py-3 bg-white font-bold rounded-xl text-sm hover:opacity-90 transition-all hover:scale-105 active:scale-95", theme.mainBtn)}
              >
                Hubungi Bantuan
              </a>
              <button 
                onClick={() => setIsResetModalOpen(true)}
                className="px-6 py-3 bg-red-500/20 text-white border border-red-500/30 font-bold rounded-xl text-sm hover:bg-red-500/40 transition-all hover:scale-105 active:scale-95"
              >
                Reset Total
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: idx * 0.1,
              ease: [0.16, 1, 0.3, 1]
            }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative"
          >
            <div className={cn(
              "absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-[0.03] rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500",
              card.gradient
            )} />
            
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-transparent group-hover:shadow-current/10",
              card.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
              card.color === 'blue' ? 'bg-blue-50 text-blue-600' :
              card.color === 'amber' ? 'bg-amber-50 text-amber-600' :
              'bg-purple-50 text-purple-600'
            )}>
              <card.icon size={24} />
            </div>
            <p className="text-stone-400 text-sm font-medium">{card.label}</p>
            <p className="text-3xl font-bold text-stone-900 mt-1">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-xl", theme.lightBg)}>
                <Calendar className={cn("w-5 h-5", theme.text)} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900">Hari Aktif Belajar</h3>
                <p className="text-stone-500 text-xs">Tahun Ajaran {academicYear}</p>
              </div>
            </div>
            
            <div className="w-full sm:w-48">
              <select 
                className={cn("w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2", theme.ring)}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Semester 1 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Semester 1 (Ganjil)</h4>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Total: {calculateTotal(semester1)} Hari
                </span>
              </div>
              <div className="space-y-2">
                {semester1.map(m => (
                  <div key={m.value} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-100 group">
                    <span className="text-sm font-medium text-stone-700">{m.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-stone-900">{activeDays[m.value] || 0} Hari</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Semester 2 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Semester 2 (Genap)</h4>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  Total: {calculateTotal(semester2)} Hari
                </span>
              </div>
              <div className="space-y-2">
                {semester2.map(m => (
                  <div key={m.value} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-100 group">
                    <span className="text-sm font-medium text-stone-700">{m.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-stone-900">{activeDays[m.value] || 0} Hari</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex items-start gap-4 h-fit">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
            <Calendar size={24} />
          </div>
          <div>
            <h3 className="text-amber-900 font-bold">Penyimpanan Lokal Aktif</h3>
            <p className="text-amber-800/70 text-sm mt-1">
              Data Anda saat ini disimpan di browser ini. Untuk menghindari kehilangan data, pastikan Anda melakukan backup secara berkala melalui menu <strong>Pengaturan &gt; Pemeliharaan</strong>.
            </p>
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
