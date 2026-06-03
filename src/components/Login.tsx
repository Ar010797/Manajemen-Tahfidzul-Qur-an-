import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, User, ArrowRight, Sparkles } from 'lucide-react';
import { setCurrentUser, storage } from '../services/storage';
import { cn } from '../lib/utils';

export default function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
    shadow: themeColor === 'emerald' ? 'shadow-emerald-500/20' :
            themeColor === 'blue' ? 'shadow-blue-500/20' :
            themeColor === 'amber' ? 'shadow-amber-500/20' :
            themeColor === 'indigo' ? 'shadow-indigo-500/20' :
            themeColor === 'purple' ? 'shadow-purple-500/20' :
            themeColor === 'rose' ? 'shadow-rose-500/20' :
            'shadow-slate-500/20',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    if (role === 'admin' && password !== 'Bismillah') {
      alert('Password Admin salah!');
      return;
    }

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
            <div className={cn("w-28 h-28 bg-gradient-to-br rounded-[2.5rem] flex items-center justify-center relative overflow-hidden", theme.bg)} style={{ boxShadow: `0 30px 60px ${theme.glow}` }}>
              <motion.div 
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              />
              <BookOpen className="text-white w-14 h-14 relative z-10" />
            </div>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2 bg-amber-400 p-2.5 rounded-2xl shadow-xl border-2 border-[#1e293b]"
            >
              <Sparkles className="text-white w-5 h-5" />
            </motion.div>
          </motion.div>
          
          <h1 className="text-4xl font-display font-black text-white tracking-tight text-center leading-none uppercase">
            Manager <span className={theme.text}>Tahfidz</span>
          </h1>
          <div className={cn("h-1.5 w-20 rounded-full mt-8 mb-3 overflow-hidden", theme.bgBlur.replace('20', '30'))}>
            <motion.div 
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className={cn("h-full w-1/2", theme.text.replace('text', 'bg'))}
            />
          </div>
          <p className="text-stone-500 text-[10px] font-display font-black tracking-[0.5em] uppercase">PROFESSIONAL MONITORING</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-display font-black text-stone-500 uppercase tracking-[0.3em] ml-2">Identitas Pengajar</label>
            <div className="relative group">
              <User className={cn("absolute left-6 top-1/2 -translate-y-1/2 text-stone-600 transition-colors w-6 h-6", `group-focus-within:${theme.text}`)} />
              <input 
                type="text"
                required
                className={cn("w-full bg-white/5 border border-white/10 rounded-[1.75rem] py-6 pl-16 pr-8 text-white placeholder:text-stone-700 focus:outline-none focus:ring-4 focus:bg-white/10 transition-all text-xl font-bold tracking-tight", theme.ring)}
                placeholder="Nama Lengkap Anda"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-display font-black text-stone-500 uppercase tracking-[0.3em] ml-2">Role Akses</label>
            <div className="relative">
              <select 
                className={cn("w-full bg-white/5 border border-white/10 rounded-[1.75rem] py-6 px-8 text-white focus:outline-none focus:ring-4 transition-all appearance-none text-xl font-bold tracking-tight cursor-pointer", theme.ring)}
                value={role}
                onChange={e => setRole(e.target.value)}
              >
                <option value="guru" className="bg-stone-950 font-bold">Guru Halaqoh</option>
                <option value="admin" className="bg-stone-950 font-bold">Administrator</option>
              </select>
              <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-stone-600">
                <ArrowRight size={24} className="rotate-90" />
              </div>
            </div>
          </div>

          {role === 'admin' && (
            <div className="space-y-3">
              <label className="text-[10px] font-display font-black text-stone-500 uppercase tracking-[0.3em] ml-2">Password Admin</label>
              <input 
                type="password"
                required
                className={cn("w-full bg-white/5 border border-white/10 rounded-[1.75rem] py-6 px-8 text-white placeholder:text-stone-700 focus:outline-none focus:ring-4 focus:bg-white/10 transition-all text-xl font-bold tracking-tight", theme.ring)}
                placeholder="Masukkan Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          )}

          <motion.button 
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className={cn("w-full bg-stone-950 hover:bg-stone-900 border border-white/10 text-white font-display font-black py-7 rounded-[2rem] transition-all mt-10 flex items-center justify-center gap-6 text-xl tracking-[0.2em] shadow-2xl", theme.shadow?.replace('shadow-', 'shadow-stone-950/'))}
          >
            <span>MASUK</span>
            <ArrowRight size={24} />
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
