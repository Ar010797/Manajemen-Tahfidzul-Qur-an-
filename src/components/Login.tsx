import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, User, ArrowRight, Sparkles } from 'lucide-react';
import { setCurrentUser } from '../services/storage';

export default function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('guru');

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
          className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-emerald-500/20 blur-[150px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
            rotate: [0, -90, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-blue-500/20 blur-[150px] rounded-full" 
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
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-[2rem] flex items-center justify-center shadow-[0_20px_40px_rgba(16,185,129,0.4)] relative overflow-hidden">
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
            Manager <span className="text-emerald-400">Tahfidz</span>
          </h1>
          <div className="h-1 w-16 bg-emerald-500/30 rounded-full mt-6 mb-2 overflow-hidden">
            <motion.div 
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="h-full w-1/2 bg-emerald-400"
            />
          </div>
          <p className="text-stone-400 text-[10px] font-black tracking-[0.4em] uppercase opacity-60">Sistem Monitoring Qur'an</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-stone-400 uppercase tracking-[0.2em] ml-2">Nama Pengguna / Guru</label>
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-500 group-focus-within:text-emerald-400 transition-colors w-5 h-5" />
              <input 
                type="text"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/10 transition-all text-lg font-medium"
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
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all appearance-none text-lg font-medium cursor-pointer"
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
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black py-5 rounded-2xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] transition-all mt-6 flex items-center justify-center gap-4 text-lg tracking-tight"
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
