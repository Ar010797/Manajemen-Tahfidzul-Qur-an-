import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Sparkles } from 'lucide-react';

export default function SplashScreen() {
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
            className="absolute left-1/2 top-1/2 w-32 h-32 bg-emerald-200/30 rounded-full blur-3xl"
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
            className="absolute inset-[-20px] bg-emerald-100/50 rounded-full blur-2xl"
          />
          
          <div className="w-28 h-28 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(5,150,105,0.3)] relative overflow-hidden border border-white/20">
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
                  className="w-1 h-1 bg-emerald-200 rounded-full" 
                />
                <motion.div 
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                  className="w-1 h-1 bg-emerald-200 rounded-full" 
                />
                <motion.div 
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                  className="w-1 h-1 bg-emerald-200 rounded-full" 
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
          <div className="overflow-hidden">
            <motion.h1 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl font-black text-stone-900 tracking-tighter flex items-center gap-2"
            >
              Manager <span className="text-emerald-600">Tahfidz</span>
            </motion.h1>
          </div>
          
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
            className="h-1 bg-emerald-600/10 rounded-full mt-4 relative overflow-hidden"
          >
            <motion.div 
              initial={{ left: "-100%" }}
              animate={{ left: "100%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-emerald-600 to-transparent"
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
