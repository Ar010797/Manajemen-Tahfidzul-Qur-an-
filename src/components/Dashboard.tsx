import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, BookOpen, GraduationCap, TrendingUp, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { storage } from '../services/storage';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    halaqoh: 0,
    deposits: 0,
    exams: 0
  });

  useEffect(() => {
    const fetchStats = () => {
      const students = storage.getStudents();
      const halaqoh = storage.getHalaqoh();
      
      setStats({
        students: students.length,
        halaqoh: halaqoh.length,
        deposits: 0, // Placeholder
        exams: 0 // Placeholder
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Siswa', value: stats.students, icon: Users, color: 'emerald', gradient: 'from-emerald-500 to-teal-600' },
    { label: 'Total Halaqoh', value: stats.halaqoh, icon: BookOpen, color: 'blue', gradient: 'from-blue-500 to-indigo-600' },
    { label: 'Setoran Hari Ini', value: '12', icon: TrendingUp, color: 'amber', gradient: 'from-amber-500 to-orange-600' },
    { label: 'Ujian Selesai', value: '4', icon: GraduationCap, color: 'purple', gradient: 'from-purple-500 to-pink-600' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Selamat Datang, Guru</h1>
          <p className="text-stone-500 mt-1">Pantau perkembangan tahfidz siswa Anda hari ini.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white border border-stone-200 rounded-2xl shadow-sm">
          <Calendar className="text-emerald-600 w-5 h-5" />
          <span className="font-semibold text-stone-700">
            {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: id })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative"
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

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex items-start gap-4">
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

        <div className="bg-emerald-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-900/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
          <h2 className="text-xl font-bold mb-4 relative z-10">Tips Hari Ini</h2>
          <p className="text-emerald-100/80 text-sm leading-relaxed relative z-10">
            "Sebaik-baik kalian adalah orang yang belajar Al-Qur'an dan mengajarkannya."
            <br /><br />
            Pastikan setiap setoran dicatat dengan detail untuk memudahkan pembuatan rapor di akhir semester.
          </p>
          <button className="mt-8 px-6 py-3 bg-white text-emerald-900 font-bold rounded-xl text-sm hover:bg-emerald-50 transition-colors relative z-10">
            Lihat Panduan
          </button>
        </div>
      </div>
    </div>
  );
}
