import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, User, HelpCircle } from 'lucide-react';

export default function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'guru',
    security_question: 'Apa nama hewan peliharaan pertama Anda?',
    security_answer: '',
    new_password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const endpoint = isRegistering ? '/api/auth/register' : isResetting ? '/api/auth/reset-password' : '/api/auth/login';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json().catch(() => ({ error: 'Terjadi kesalahan pada server (Format tidak valid)' }));
      
      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan pada server');
      }
      
      if (isRegistering) {
        setIsRegistering(false);
        alert('Registrasi berhasil! Silakan masuk menggunakan akun Anda.');
      } else if (isResetting) {
        setIsResetting(false);
        alert('Password berhasil direset. Silakan masuk menggunakan password baru.');
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
      }
    } catch (e: any) {
      setError(e.message);
    }
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
          <h1 className="text-4xl font-black text-white tracking-tighter text-center">Tahfidz Manager</h1>
          <div className="h-1 w-12 bg-emerald-500 rounded-full mt-4 mb-2" />
          <p className="text-stone-400 text-sm font-medium tracking-wide uppercase">Professional System 2026</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl text-center"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] ml-2">Username</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 group-focus-within:text-emerald-500 transition-colors w-5 h-5" />
              <input 
                type="text"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white/10 transition-all"
                placeholder="Username Anda"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
            </div>
          </div>

          {!isResetting && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] ml-2">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 group-focus-within:text-emerald-500 transition-colors w-5 h-5" />
                <input 
                  type="password"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white/10 transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>
          )}

          {isRegistering && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] ml-2">Role</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all appearance-none"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="guru" className="bg-stone-900">Guru Halaqoh</option>
                  <option value="admin" className="bg-stone-900">Administrator</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] ml-2">Pertanyaan Keamanan</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all appearance-none"
                  value={formData.security_question}
                  onChange={e => setFormData({...formData, security_question: e.target.value})}
                >
                  <option value="Apa nama hewan peliharaan pertama Anda?" className="bg-stone-900">Hewan peliharaan pertama?</option>
                  <option value="Siapa nama guru favorit Anda?" className="bg-stone-900">Guru favorit Anda?</option>
                  <option value="Di kota mana Anda lahir?" className="bg-stone-900">Kota kelahiran Anda?</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] ml-2">Jawaban</label>
                <input 
                  type="text"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                  placeholder="Jawaban Rahasia"
                  value={formData.security_answer}
                  onChange={e => setFormData({...formData, security_answer: e.target.value})}
                />
              </div>
            </motion.div>
          )}

          {isResetting && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] ml-2">Jawaban Keamanan</label>
                <div className="relative group">
                  <HelpCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 group-focus-within:text-emerald-500 transition-colors w-5 h-5" />
                  <input 
                    type="text"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                    placeholder="Jawaban keamanan Anda"
                    value={formData.security_answer}
                    onChange={e => setFormData({...formData, security_answer: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] ml-2">Password Baru</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 group-focus-within:text-emerald-500 transition-colors w-5 h-5" />
                  <input 
                    type="password"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                    placeholder="••••••••"
                    value={formData.new_password}
                    onChange={e => setFormData({...formData, new_password: e.target.value})}
                  />
                </div>
              </div>
            </motion.div>
          )}

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black py-5 rounded-2xl shadow-2xl shadow-emerald-500/30 transition-all mt-4"
          >
            {isRegistering ? 'DAFTAR SEKARANG' : isResetting ? 'RESET PASSWORD' : 'MASUK KE SISTEM'}
          </motion.button>
        </form>

        <div className="mt-10 flex flex-col items-center gap-4">
          {!isResetting && (
            <button 
              onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
              className="text-stone-500 hover:text-emerald-400 text-xs font-bold transition-colors tracking-widest"
            >
              {isRegistering ? 'SUDAH PUNYA AKUN? LOGIN' : 'BELUM PUNYA AKUN? DAFTAR'}
            </button>
          )}
          {!isRegistering && (
            <button 
              onClick={() => { setIsResetting(!isResetting); setError(''); }}
              className="text-stone-500 hover:text-emerald-400 text-xs font-bold transition-colors tracking-widest"
            >
              {isResetting ? 'KEMBALI KE LOGIN' : 'LUPA PASSWORD? RESET'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
