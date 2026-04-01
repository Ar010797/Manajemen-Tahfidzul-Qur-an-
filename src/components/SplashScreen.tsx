import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';

export default function SplashScreen() {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FDFCFB]"
    >
      <div className="flex flex-col items-center gap-6">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ 
            duration: 1, 
            ease: [0.16, 1, 0.3, 1],
            delay: 0.2
          }}
          className="w-24 h-24 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-200 relative overflow-hidden"
        >
          <motion.div 
            animate={{ 
              x: ["-100%", "100%"],
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "linear",
              delay: 1
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
          />
          <ShieldCheck className="text-white w-12 h-12 relative z-10" />
        </motion.div>

        <div className="flex flex-col items-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="text-3xl font-black text-stone-900 tracking-tighter"
          >
            Tracking <span className="text-emerald-600">Tahfidz</span>
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.2, delay: 0.8, ease: "easeInOut" }}
            className="h-1 bg-emerald-600/20 rounded-full mt-2 overflow-hidden"
          >
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
              className="h-full bg-emerald-600 w-full"
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold mt-4"
          >
            Lembaga Tahfidz Qur'an © 2026
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
