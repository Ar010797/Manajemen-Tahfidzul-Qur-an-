import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Download, Copy, Check, Quote, Camera, Sparkles } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { getAdviceForDay, getDayOfYear, DailyAdvice } from '../constants/dailyAdvice';
import { cn } from '../lib/utils';
import { storage } from '../services/storage';

export default function DailyAdviceCard() {
  const [advice, setAdvice] = useState<DailyAdvice | null>(null);
  const [dayNumber, setDayNumber] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [themeColor, setThemeColor] = useState('emerald');
  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const today = new Date();
    const day = getDayOfYear(today);
    setDayNumber(day);
    setAdvice(getAdviceForDay(day));
    
    const institution = storage.getInstitution();
    setThemeColor(institution.theme_color || 'emerald');
  }, []);

  const handleCopy = () => {
    if (!advice) return;
    
    const text = `📌 Hari ke-${dayNumber}\n✨ ${advice.title.toUpperCase()}\n\n💬 Penjelasan:\n${advice.explanation}\n\n📖 Sumber:\n${advice.quranSource ? `• Al-Qur'an: ${advice.quranSource}` : ''}${advice.hadithSource ? `• Hadits: ${advice.hadithSource}` : ''}`;
    
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleDownloadImage = async () => {
    if (!captureRef.current) return;
    
    setIsCapturing(true);
    try {
      // Small delay to ensure state updates reach the DOM and fonts are ready
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const element = captureRef.current;
      // Get the actual height with scroll to ensure nothing is cut off
      const width = 1080;
      const height = Math.max(1920, element.scrollHeight);

      // Use html-to-image to generate a high-quality image
      const dataUrl = await htmlToImage.toPng(element, {
        width,
        height,
        pixelRatio: 2.5, // Even higher quality for clear text
        cacheBust: true,
        style: {
          transform: 'none',
          margin: '0',
          padding: '0',
          visibility: 'visible',
          display: 'flex',
          left: '0',
          top: '0',
          height: `${height}px`, // Force height in style too
        }
      });
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.setAttribute('download', `Nasihat_Hari_${dayNumber}.png`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Capture failed:', err);
      alert('Gagal menyimpan gambar. Silakan coba lagi atau gunakan fitur bagikan.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleShare = async () => {
    if (!advice) return;
    
    const text = `📌 *Nasihat Harian - Hari ke-${dayNumber}*\n✨ *${advice.title.toUpperCase()}*\n\n"${advice.explanation}"\n\n📖 *Sumber:*\n${advice.quranSource ? `• Al-Qur'an: ${advice.quranSource}` : ''}${advice.hadithSource ? `• Hadits: ${advice.hadithSource}` : ''}\n\n_Semoga bermanfaat._`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Nasihat Harian - Hari ke-${dayNumber}`,
          text: text,
        });
      } else {
        handleCopy();
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  if (!advice) return null;

  const themes = {
    emerald: {
      from: 'from-emerald-950',
      to: 'to-emerald-900',
      fromHex: '#064e3b',
      toHex: '#065f46',
      pattern: '#10b981',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-50',
      accent: 'bg-emerald-500',
      light: 'text-emerald-400',
      glow: 'shadow-emerald-500/20'
    },
    blue: {
      from: 'from-slate-950',
      to: 'to-blue-900',
      fromHex: '#020617',
      toHex: '#1e3a8a',
      pattern: '#3b82f6',
      bg: 'bg-blue-500/10',
      text: 'text-blue-50',
      accent: 'bg-blue-600',
      light: 'text-blue-400',
      glow: 'shadow-blue-500/20'
    },
    amber: {
      from: 'from-stone-950',
      to: 'to-amber-900',
      fromHex: '#1c1917',
      toHex: '#78350f',
      pattern: '#f59e0b',
      bg: 'bg-amber-500/10',
      text: 'text-amber-50',
      accent: 'bg-amber-600',
      light: 'text-amber-400',
      glow: 'shadow-amber-500/20'
    },
    purple: {
      from: 'from-zinc-950',
      to: 'to-purple-900',
      fromHex: '#09090b',
      toHex: '#581c87',
      pattern: '#a855f7',
      bg: 'bg-purple-500/10',
      text: 'text-purple-50',
      accent: 'bg-purple-600',
      light: 'text-purple-400',
      glow: 'shadow-purple-500/20'
    }
  };

  const currentTheme = themes[themeColor as keyof typeof themes] || themes.emerald;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 font-sans">
      {/* Capture Element (Hidden) */}
      <div className="fixed -left-[5000px] top-0 pointer-events-none">
        <div 
          ref={captureRef}
          className="w-[1080px] min-h-[1920px] h-fit flex flex-col p-20 text-white relative overflow-visible font-sans"
          style={{ 
            background: `radial-gradient(circle at 0% 0%, ${currentTheme.fromHex} 0%, ${currentTheme.toHex} 100%)`,
            backgroundColor: currentTheme.fromHex 
          }}
        >
          {/* Professional Background Motifs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 blur-[120px] rounded-full -mr-40 -mt-40" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-black/20 blur-[100px] rounded-full -ml-30 -mb-30" />
            <svg width="100%" height="100%" className="absolute inset-0 opacity-[0.03]">
              <pattern id="gridCapture" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#gridCapture)" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col h-full gap-16">
            {/* Header Area */}
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-display font-black tracking-widest uppercase">Miftahussalam</h2>
                    <p className="text-xl font-medium text-white/60 tracking-[0.2em] uppercase">Daily Nasihah</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-9xl font-display font-black opacity-10 leading-none tabular-nums">
                  {String(dayNumber).padStart(2, '0')}
                </div>
                <p className="text-2xl font-bold tracking-widest uppercase text-white/40 mt-2">HARI KE-{dayNumber}</p>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col justify-center items-center py-10">
              <div className="w-full text-center space-y-16">
                <div className="space-y-4">
                  <span className="inline-block px-8 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-2xl font-black uppercase tracking-[0.3em]">
                    Focus of the Day
                  </span>
                  <h1 className="text-[140px] font-display font-black leading-[0.9] tracking-tighter uppercase drop-shadow-2xl">
                    {advice.title}
                  </h1>
                </div>

                {advice.arabic && (
                  <div className="relative w-full py-16 px-12 bg-white/5 backdrop-blur-md rounded-[80px] border border-white/10 shadow-2xl">
                    <p className="text-[110px] font-serif leading-[1.8] text-center drop-shadow-xl ArabicFont" dir="rtl">
                      {advice.arabic}
                    </p>
                  </div>
                )}

                <div className="relative max-w-[900px] mx-auto">
                  <Quote className="absolute -top-12 -left-12 w-32 h-32 text-white/10 -rotate-12" />
                  <p className="text-7xl font-display font-bold leading-[1.3] text-white tracking-tight italic">
                    "{advice.explanation}"
                  </p>
                  <Quote className="absolute -bottom-12 -right-12 w-32 h-32 text-white/10 rotate-[168deg]" />
                </div>
              </div>
            </div>

            {/* Source & Footer */}
            <div className="space-y-12">
              <div className="flex justify-center gap-8">
                {advice.quranSource && (
                  <div className="px-10 py-5 bg-white text-black rounded-3xl flex items-center gap-4 shadow-2xl">
                    <span className="text-3xl">📖</span>
                    <span className="text-3xl font-display font-black uppercase tracking-wider">QS. {advice.quranSource}</span>
                  </div>
                )}
                {advice.hadithSource && (
                  <div className="px-10 py-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl flex items-center gap-4">
                    <span className="text-3xl">📚</span>
                    <span className="text-3xl font-display font-black uppercase tracking-wider">HR. {advice.hadithSource}</span>
                  </div>
                )}
              </div>

              <div className="pt-12 border-t border-white/10 flex justify-between items-end">
                <div className="space-y-2">
                  <p className="text-2xl font-display font-black tracking-[0.4em] uppercase text-white/50">Nasihah Al-Yaum</p>
                  <p className="text-xl font-medium text-white/30">Membangun Karakter Melalui Wahyu</p>
                </div>
                <div className="text-right">
                   <p className="text-xl font-bold tracking-widest text-white/40 uppercase">Aplikasi Tahfidz Digital</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main UI Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "relative overflow-hidden rounded-[3rem] p-8 md:p-14 text-white shadow-2xl transition-all duration-500",
          "bg-gradient-to-br",
          currentTheme.from,
          currentTheme.to,
          currentTheme.glow
        )}
      >
        {/* Artistic Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full -ml-24 -mb-24" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Content Area */}
          <div className="lg:col-span-7 space-y-10">
            <div className="flex items-center gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 shadow-inner">
                <Sparkles size={20} className="text-white animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-display font-black tracking-[.3em] uppercase text-white/60">Insight Harian</p>
                <p className="text-sm font-bold tracking-tight">HARI KE-{dayNumber}</p>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent ml-4" />
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-display font-black leading-[0.95] tracking-tighter uppercase transition-all">
                {advice.title}
              </h1>
              
              {advice.arabic && (
                <div className="group relative">
                  <div className="absolute -inset-2 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="relative text-3xl md:text-5xl font-serif leading-[1.8] text-white/90 drop-shadow-sm transition-all" dir="rtl">
                    {advice.arabic}
                  </p>
                </div>
              )}
            </div>

            <div className="relative">
              <Quote className="absolute -left-4 -top-4 w-10 h-10 text-white/10 -rotate-12" />
              <p className="relative text-xl md:text-2xl font-medium leading-relaxed italic text-white/95 pl-8">
                "{advice.explanation}"
              </p>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              {advice.quranSource && (
                <div className="group flex items-center gap-3 px-6 py-3 bg-white text-black rounded-2xl font-display font-black text-xs uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95 cursor-default">
                  <span className="text-lg">📖</span>
                  QS. {advice.quranSource}
                </div>
              )}
              {advice.hadithSource && (
                <div className="group flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl font-display font-black text-xs uppercase tracking-widest transition-all hover:bg-white/20 cursor-default">
                  <span className="text-lg">📚</span>
                  HR. {advice.hadithSource}
                </div>
              )}
            </div>
          </div>

          {/* Right Action Area */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="rounded-[2rem] bg-white/10 backdrop-blur-2xl border border-white/20 p-8 shadow-2xl relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              <div className="relative space-y-8">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-display font-black tracking-tight">KONTROL PANEL</h3>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-white/40">Bagikan Kebaikan Hari Ini</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <button 
                    onClick={handleShare}
                    className="group relative flex items-center justify-center gap-4 w-full py-5 bg-white text-black rounded-[1.25rem] font-display font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all hover:translate-y-[-2px] active:translate-y-[1px]"
                  >
                    <Share2 size={18} className="transition-transform group-hover:rotate-12" />
                    Share Sekarang
                  </button>
                  
                  <button 
                    onClick={handleDownloadImage}
                    disabled={isCapturing}
                    className="flex items-center justify-center gap-4 w-full py-5 bg-white/10 border border-white/20 hover:bg-white/20 active:bg-white/5 rounded-[1.25rem] font-display font-black text-xs uppercase tracking-[0.2em] backdrop-blur-sm transition-all disabled:opacity-50"
                  >
                    {isCapturing ? (
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Camera size={18} />
                    )}
                    Unduh HD Poster {isCapturing ? '...' : ''}
                  </button>

                  <button 
                    onClick={handleCopy}
                    className={cn(
                      "flex items-center justify-center gap-4 w-full py-5 rounded-[1.25rem] font-display font-black text-xs uppercase tracking-[0.2em] transition-all",
                      isCopied ? "bg-green-500 text-white" : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                    )}
                  >
                    {isCopied ? <Check size={18} /> : <Copy size={18} />}
                    {isCopied ? 'Tersalin !' : 'Copy Quotes'}
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 flex items-center justify-center gap-4">
              <div className="h-px bg-white/10 flex-1" />
              <p className="text-[11px] font-bold text-white/30 text-center uppercase tracking-widest whitespace-nowrap">
                Amalan & Syiar Digital
              </p>
              <div className="h-px bg-white/10 flex-1" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
