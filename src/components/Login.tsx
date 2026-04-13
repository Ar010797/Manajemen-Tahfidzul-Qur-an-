import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, User, ArrowRight, Sparkles } from 'lucide-react';
import { setCurrentUser, storage } from '../services/storage';
import { cn } from '../lib/utils';

export default function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('guru');
  const [themeColor, setThemeColor] = useState('emerald');

  useEffect(() => {
    const inst = storage.getInstitution();
    setThemeColor(inst.theme_color || 'emerald');
  }, []);

  const theme = {
    text: themeColor === 'emerald' ? 'text-emerald-400' :
          themeColor === 'blue' ? 'text-blue-400' :
          themeColor === 'amber' ? 'text-amber-400' :
          themeColor === 'indigo' ? 'text-indigo-400' :
          themeColor === 'purple' ? 'text-purple-400' :
          themeColor === 'rose' ? 'text-rose-400' :
          'text-slate-400',
    bg: themeColor === 'emerald' ? 'from-emerald-400 to-emerald-600' :
        themeColor === 'blue' ? 'from-blue-400 to-blue-600' :
        themeColor === 'amber' ? 'from-amber-400 to-amber-600' :
        themeColor === 'indigo' ? 'from-indigo-400 to-indigo-600' :
        themeColor === 'purple' ? 'from-purple-400 to-purple-600' :
        themeColor === 'rose' ? 'from-rose-400 to-rose-600' :
        'from-slate-400 to-slate-600',
    glow: themeColor === 'emerald' ? 'rgba(16,185,129,0.4)' :
          themeColor === 'blue' ? 'rgba(59,130,246,0.4)' :
          themeColor === 'amber' ? 'rgba(245,158,11,0.4)' :
          themeColor === 'indigo' ? 'rgba(99,102,241,0.4)' :
          themeColor === 'purple' ? 'rgba(168,85,247,0.4)' :
          themeColor === 'rose' ? 'rgba(244,63,94,0.4)' :
          'rgba(100,116,139,0.4)',
    ring: themeColor === 'emerald' ? 'focus:ring-emerald-500/40' :
          themeColor === 'blue' ? 'focus:ring-blue-500/40' :
          themeColor === 'amber' ? 'focus:ring-amber-500/40' :
          themeColor === 'indigo' ? 'focus:ring-indigo-500/40' :
          themeColor === 'purple' ? 'focus:ring-purple-500/40' :
          themeColor === 'rose' ? 'focus:ring-rose-500/40' :
          'focus:ring-slate-500/40',
    btn: themeColor === 'emerald' ? 'from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-[0_20px_40px_rgba(16,185,129,0.3)]' :
         themeColor === 'blue' ? 'from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-[0_20px_40px_rgba(59,130,246,0.3)]' :
         themeColor === 'amber' ? 'from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-[0_20px_40px_rgba(245,158,11,0.3)]' :
         themeColor === 'indigo' ? 'from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 shadow-[0_20px_40px_rgba(99,102,241,0.3)]' :
         themeColor === 'purple' ? 'from-purple-500 to-fuchsia-600 hover:from-purple-400 hover:to-fuchsia-500 shadow-[0_20px_40px_rgba(168,85,247,0.3)]' :
         themeColor === 'rose' ? 'from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 shadow-[0_20px_40px_rgba(244,63,94,0.3)]' :
         'from-slate-500 to-slate-600 hover:from-slate-400 hover:to-slate-500 shadow-[0_20px_40px_rgba(100,116,139,0.3)]',
    bgBlur: themeColor === 'emerald' ? 'bg-emerald-500/20' :
            themeColor === 'blue' ? 'bg-blue-500/20' :
            themeColor === 'amber' ? 'bg-amber-500/20' :
            themeColor === 'indigo' ? 'bg-indigo-500/20' :
            themeColor === 'purple' ? 'bg-purple-500/20' :
            themeColor === 'rose' ? 'bg-rose-500/20' :
            'bg-slate-500/20',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    const user = { 
      id: Date.now().toString(), 
      username: username.trim(), 
      role 
    };
    
    // Set storage partition
    setCurrentUser(user.username);
    
    // Save session
    localStorage.setItem('token', 'local-session-' + user.id);
    localStorage.setItem('user', JSON.stringify(user));
    
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 sm:p-6 font-sans overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className={cn("absolute top-[-20%] left-[-10%] w-[80%] h-[80%] blur-[150px] rounded-full", theme.bgBlur)} 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
            rotate: [0, -90, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className={cn("absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] blur-[150px] rounded-full", theme.bgBlur.replace('20', '15'))} 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 sm:p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] relative z-10"
      >
        <div className="flex flex-col items-center mb-12">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="relative mb-8"
          >
            <div className={cn("w-24 h-24 bg-gradient-to-br rounded-[2rem] flex items-center justify-center relative overflow-hidden", theme.bg)} style={{ boxShadow: `0 20px 40px ${theme.glow}` }}>
              <motion.div 
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              />
              <BookOpen className="text-white w-12 h-12 relative z-10" />
            </div>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2 bg-amber-400 p-2 rounded-xl shadow-lg"
            >
              <Sparkles className="text-white w-4 h-4" />
            </motion.div>
          </motion.div>
          
          <h1 className="text-4xl font-black text-white tracking-tighter text-center leading-none">
            Manager <span className={theme.text}>Tahfidz</span>
          </h1>
          <div className={cn("h-1 w-16 rounded-full mt-6 mb-2 overflow-hidden", theme.bgBlur.replace('20', '30'))}>
            <motion.div 
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className={cn("h-full w-1/2", theme.text.replace('text', 'bg'))}
            />
          </div>
          <p className="text-stone-400 text-[10px] font-black tracking-[0.4em] uppercase opacity-60">Sistem Monitoring Qur'an</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-stone-400 uppercase tracking-[0.2em] ml-2">Nama Pengguna / Guru</label>
            <div className="relative group">
              <User className={cn("absolute left-5 top-1/2 -translate-y-1/2 text-stone-500 transition-colors w-5 h-5", `group-focus-within:${theme.text}`)} />
              <input 
                type="text"
                required
                className={cn("w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:bg-white/10 transition-all text-lg font-medium", theme.ring)}
                placeholder="Masukkan Nama Anda"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-stone-400 uppercase tracking-[0.2em] ml-2">Jabatan</label>
            <div className="relative">
              <select 
                className={cn("w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white focus:outline-none focus:ring-2 transition-all appearance-none text-lg font-medium cursor-pointer", theme.ring)}
                value={role}
                onChange={e => setRole(e.target.value)}
              >
                <option value="guru" className="bg-stone-900">Guru Halaqoh</option>
                <option value="admin" className="bg-stone-900">Administrator</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500">
                <ArrowRight size={20} className="rotate-90" />
              </div>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className={cn("w-full bg-gradient-to-r text-white font-black py-5 rounded-2xl transition-all mt-6 flex items-center justify-center gap-4 text-lg tracking-tight", theme.btn)}
          >
            <span>MASUK KE SISTEM</span>
            <ArrowRight size={22} />
          </motion.button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-stone-500 text-[11px] font-bold leading-relaxed opacity-60">
            Data Anda disimpan secara lokal di browser ini.<br/>
            Gunakan nama yang sama untuk mengakses data kembali.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
