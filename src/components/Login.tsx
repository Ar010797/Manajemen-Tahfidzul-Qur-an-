import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, User, Lock, Eye, EyeOff, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { setCurrentUser, storage } from '../services/storage';
import { verifyOrRegisterGuruLogin } from '../services/guruAccounts';
import { cn } from '../lib/utils';

export default function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('guru');
  const [themeColor, setThemeColor] = useState('emerald');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const trimmedUser = username.trim();
    if (!trimmedUser) {
      setErrorMsg('Masukkan username / nama lengkap Anda.');
      return;
    }

    if (role === 'admin') {
      if (password !== 'Bismillah') {
        setErrorMsg('Password Admin salah!');
        return;
      }

      const user = {
        id: Date.now().toString(),
        username: trimmedUser,
        role
      };
      setCurrentUser(user.username);
      localStorage.setItem('token', 'local-session-' + user.id);
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(user);
      return;
    }

    // Role: Guru Halaqoh -> verify or register password cleanly while preserving data
    setIsSubmitting(true);
    try {
      const result = await verifyOrRegisterGuruLogin(trimmedUser, password);
      if (!result.ok) {
        setErrorMsg(result.error || 'Username atau password tidak sesuai.');
        setIsSubmitting(false);
        return;
      }

      const finalUsername = result.canonicalUsername || trimmedUser;

      // Preserve existing local data if user typed a different casing previously
      if (
        finalUsername !== trimmedUser &&
        !localStorage.getItem(`tahfidz_data_${finalUsername}`) &&
        localStorage.getItem(`tahfidz_data_${trimmedUser}`)
      ) {
        localStorage.setItem(
          `tahfidz_data_${finalUsername}`,
          localStorage.getItem(`tahfidz_data_${trimmedUser}`)!
        );
      }

      const user = {
        id: Date.now().toString(),
        username: finalUsername,
        role: 'guru'
      };

      setCurrentUser(user.username);
      localStorage.setItem('token', 'local-session-' + user.id);
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(user);
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMsg(err?.message || 'Terjadi kendala saat masuk. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
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
        className="w-full max-w-md bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 sm:p-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="relative mb-6"
          >
            <div className={cn("w-24 h-24 bg-gradient-to-br rounded-[2rem] flex items-center justify-center relative overflow-hidden", theme.bg)} style={{ boxShadow: `0 30px 60px ${theme.glow}` }}>
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
              className="absolute -top-2 -right-2 bg-amber-400 p-2 rounded-2xl shadow-xl border-2 border-[#1e293b]"
            >
              <Sparkles className="text-white w-4 h-4" />
            </motion.div>
          </motion.div>
          
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight text-center leading-none uppercase">
            Manager <span className={theme.text}>Tahfidz</span>
          </h1>
          <div className={cn("h-1.5 w-20 rounded-full mt-6 mb-2.5 overflow-hidden", theme.bgBlur.replace('20', '30'))}>
            <motion.div 
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className={cn("h-full w-1/2", theme.text.replace('text', 'bg'))}
            />
          </div>
          <p className="text-stone-500 text-[10px] font-display font-black tracking-[0.5em] uppercase">PROFESSIONAL MONITORING</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="bg-red-500/15 border border-red-400/30 rounded-2xl p-3.5 flex items-start gap-2.5 text-red-200 text-xs leading-relaxed">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-display font-black text-stone-400 uppercase tracking-[0.25em] ml-2">
              {role === 'admin' ? 'Username Admin' : 'Username / Nama Pengajar'}
            </label>
            <div className="relative group">
              <User className={cn("absolute left-5 top-1/2 -translate-y-1/2 text-stone-500 transition-colors w-5 h-5", `group-focus-within:${theme.text}`)} />
              <input 
                type="text"
                required
                className={cn("w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-stone-600 focus:outline-none focus:ring-4 focus:bg-white/10 transition-all text-base sm:text-lg font-bold tracking-tight", theme.ring)}
                placeholder={role === 'admin' ? 'Nama Admin' : 'Contoh: Ustadz Ahmad'}
                value={username}
                onChange={e => {
                  setUsername(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-display font-black text-stone-400 uppercase tracking-[0.25em] ml-2">Role Akses</label>
            <div className="relative">
              <select 
                className={cn("w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-4 transition-all appearance-none text-base sm:text-lg font-bold tracking-tight cursor-pointer", theme.ring)}
                value={role}
                onChange={e => {
                  setRole(e.target.value);
                  setErrorMsg('');
                }}
              >
                <option value="guru" className="bg-stone-950 font-bold">Guru Halaqoh</option>
                <option value="admin" className="bg-stone-950 font-bold">Administrator</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500">
                <ArrowRight size={20} className="rotate-90" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-display font-black text-stone-400 uppercase tracking-[0.25em] ml-2">
              {role === 'admin' ? 'Password Admin' : 'Password Guru'}
            </label>
            <div className="relative group">
              <Lock className={cn("absolute left-5 top-1/2 -translate-y-1/2 text-stone-500 transition-colors w-5 h-5", `group-focus-within:${theme.text}`)} />
              <input 
                type={showPassword ? 'text' : 'password'}
                required
                className={cn("w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-14 text-white placeholder:text-stone-600 focus:outline-none focus:ring-4 focus:bg-white/10 transition-all text-base sm:text-lg font-bold tracking-tight", theme.ring)}
                placeholder={role === 'admin' ? 'Masukkan Password Admin' : 'Masukkan / Buat Password'}
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-stone-400 hover:text-white transition-colors"
                aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "w-full bg-stone-950 hover:bg-stone-900 border border-white/10 text-white font-display font-black py-5 rounded-2xl transition-all mt-4 flex items-center justify-center gap-4 text-lg tracking-[0.15em] shadow-2xl",
              theme.shadow?.replace('shadow-', 'shadow-stone-950/'),
              isSubmitting && "opacity-60 cursor-not-allowed"
            )}
          >
            <span>{isSubmitting ? 'MEMERIKSA...' : 'MASUK'}</span>
            <ArrowRight size={22} />
          </motion.button>
        </form>

        <div className="mt-8 text-center space-y-2">
          <p className="text-stone-400 text-[11px] font-medium leading-relaxed">
            {role === 'guru'
              ? 'Lupa password? Hubungi Admin untuk melihat atau memulihkan password melalui Panel Admin tanpa menghapus data Anda.'
              : 'Masuk sebagai Administrator untuk memantau data & mengelola akun guru.'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
