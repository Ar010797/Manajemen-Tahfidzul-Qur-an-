import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Sparkles } from 'lucide-react';
import { storage } from '../services/storage';
import { cn } from '../lib/utils';

export default function SplashScreen() {
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
    bg: themeColor === 'emerald' ? 'from-emerald-600 via-emerald-700 to-teal-800' :
        themeColor === 'blue' ? 'from-blue-600 via-blue-700 to-indigo-800' :
        themeColor === 'amber' ? 'from-amber-600 via-amber-700 to-orange-800' :
        themeColor === 'indigo' ? 'from-indigo-600 via-indigo-700 to-violet-800' :
        themeColor === 'purple' ? 'from-purple-600 via-purple-700 to-fuchsia-800' :
        themeColor === 'rose' ? 'from-rose-600 via-rose-700 to-pink-800' :
        'from-slate-600 via-slate-700 to-slate-800',
    glow: themeColor === 'emerald' ? 'rgba(5,150,105,0.3)' :
          themeColor === 'blue' ? 'rgba(37,99,235,0.3)' :
          themeColor === 'amber' ? 'rgba(217,119,6,0.3)' :
          themeColor === 'indigo' ? 'rgba(79,70,229,0.3)' :
          themeColor === 'purple' ? 'rgba(147,51,234,0.3)' :
          themeColor === 'rose' ? 'rgba(225,29,72,0.3)' :
          'rgba(71,85,105,0.3)',
    lightBg: themeColor === 'emerald' ? 'bg-emerald-200/30' :
             themeColor === 'blue' ? 'bg-blue-200/30' :
             themeColor === 'amber' ? 'bg-amber-200/30' :
             themeColor === 'indigo' ? 'bg-indigo-200/30' :
             themeColor === 'purple' ? 'bg-purple-200/30' :
             themeColor === 'rose' ? 'bg-rose-200/30' :
             'bg-slate-200/30',
    glowBg: themeColor === 'emerald' ? 'bg-emerald-100/50' :
            themeColor === 'blue' ? 'bg-blue-100/50' :
            themeColor === 'amber' ? 'bg-amber-100/50' :
            themeColor === 'indigo' ? 'bg-indigo-100/50' :
            themeColor === 'purple' ? 'bg-purple-100/50' :
            themeColor === 'rose' ? 'bg-rose-100/50' :
            'bg-slate-100/50',
    dot: themeColor === 'emerald' ? 'bg-emerald-200' :
         themeColor === 'blue' ? 'bg-blue-200' :
         themeColor === 'amber' ? 'bg-amber-200' :
         themeColor === 'indigo' ? 'bg-indigo-200' :
         themeColor === 'purple' ? 'bg-purple-200' :
         themeColor === 'rose' ? 'bg-rose-200' :
         'bg-slate-200',
    arabic: themeColor === 'emerald' ? 'text-emerald-700/80' :
            themeColor === 'blue' ? 'text-blue-700/80' :
            themeColor === 'amber' ? 'text-amber-700/80' :
            themeColor === 'indigo' ? 'text-indigo-700/80' :
            themeColor === 'purple' ? 'text-purple-700/80' :
            themeColor === 'rose' ? 'text-rose-700/80' :
            'text-slate-700/80',
    progress: themeColor === 'emerald' ? 'via-emerald-600' :
              themeColor === 'blue' ? 'via-blue-600' :
              themeColor === 'amber' ? 'via-amber-600' :
              themeColor === 'indigo' ? 'via-indigo-600' :
              themeColor === 'purple' ? 'via-purple-600' :
              themeColor === 'rose' ? 'via-rose-600' :
              'via-slate-600',
  };

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FDFCFB] overflow-hidden"
    >
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.15, 0],
              scale: [0.5, 1.2, 0.8],
              x: [0, (i % 2 === 0 ? 100 : -100) * (i + 1)],
              y: [0, (i < 3 ? -100 : 100) * (i + 1)],
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              delay: i * 0.5,
              ease: "easeInOut" 
            }}
            className={cn("absolute left-1/2 top-1/2 w-32 h-32 rounded-full blur-3xl", theme.lightBg)}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-8 relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ 
            duration: 1.2, 
            ease: [0.16, 1, 0.3, 1],
            delay: 0.2
          }}
          className="relative"
        >
          {/* Outer Glow */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className={cn("absolute inset-[-20px] rounded-full blur-2xl", theme.glowBg)}
          />
          
          <div className={cn("w-28 h-28 bg-gradient-to-br rounded-[2.5rem] flex items-center justify-center relative overflow-hidden border border-white/20", theme.bg)} style={{ boxShadow: `0 20px 50px ${theme.glow}` }}>
            <motion.div 
              animate={{ 
                x: ["-100%", "200%"],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                repeatDelay: 1
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
            />
            <div className="relative z-10 flex flex-col items-center">
              <BookOpen className="text-white w-12 h-12 mb-1" />
              <div className="flex gap-0.5">
                <motion.div 
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={cn("w-1 h-1 rounded-full", theme.dot)} 
                />
                <motion.div 
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                  className={cn("w-1 h-1 rounded-full", theme.dot)} 
                />
                <motion.div 
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                  className={cn("w-1 h-1 rounded-full", theme.dot)} 
                />
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute -top-2 -right-2 bg-amber-400 p-1.5 rounded-lg shadow-lg"
          >
            <Sparkles className="text-white w-4 h-4" />
          </motion.div>
        </motion.div>

        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            className="mb-4"
          >
            <p className={cn("text-2xl sm:text-3xl font-arabic tracking-normal leading-relaxed", theme.arabic)}>
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </p>
          </motion.div>
          
          <div className="overflow-hidden">
            <motion.h1 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl font-black text-stone-900 tracking-tighter flex items-center gap-2"
            >
              Manager <span className={theme.text}>Tahfidz</span>
            </motion.h1>
          </div>
          
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
            className={cn("h-1 rounded-full mt-4 relative overflow-hidden", theme.text.replace('text', 'bg') + '/10')}
          >
            <motion.div 
              initial={{ left: "-100%" }}
              animate={{ left: "100%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className={cn("absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent to-transparent", theme.progress)}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="text-[11px] uppercase tracking-[0.4em] text-stone-400 font-black mt-6"
          >
            Lembaga Tahfidz Qur'an © 2026
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
