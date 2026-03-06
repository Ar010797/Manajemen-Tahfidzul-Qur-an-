import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, User, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 sm:p-6 font-sans overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 sm:p-12 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/40 mb-8"
          >
            <ShieldCheck className="text-white w-12 h-12" />
          </motion.div>
          <h1 className="text-4xl font-black text-white tracking-tighter text-center leading-none">Tahfidz Manager</h1>
          <div className="h-1 w-12 bg-emerald-500 rounded-full mt-4 mb-2" />
          <p className="text-stone-400 text-[10px] font-black tracking-[0.3em] uppercase">Local Access Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] ml-2">Nama Pengguna / Guru</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 group-focus-within:text-emerald-500 transition-colors w-5 h-5" />
              <input 
                type="text"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white/10 transition-all"
                placeholder="Masukkan Nama Anda"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] ml-2">Jabatan</label>
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all appearance-none"
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="guru" className="bg-stone-900">Guru Halaqoh</option>
              <option value="admin" className="bg-stone-900">Administrator</option>
            </select>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black py-5 rounded-2xl shadow-2xl shadow-emerald-500/30 transition-all mt-4 flex items-center justify-center gap-3"
          >
            <span>MASUK KE SISTEM</span>
            <ArrowRight size={20} />
          </motion.button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-stone-500 text-[10px] font-bold leading-relaxed">
            Data Anda akan disimpan secara lokal di perangkat ini.<br/>
            Gunakan nama yang sama untuk mengakses data Anda kembali.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
