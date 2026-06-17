import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Download, Copy, Check, Quote, Camera, Sparkles, RefreshCw } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { getAdviceForDay, getDayOfYear, DailyAdvice, DAILY_ADVICE } from '../constants/dailyAdvice';
import { cn } from '../lib/utils';
import { storage } from '../services/storage';

export default function DailyAdviceCard() {
  const [advice, setAdvice] = useState<DailyAdvice | null>(null);
  const [dayNumber, setDayNumber] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [themeColor, setThemeColor] = useState('emerald');
  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const today = new Date();
    const day = getDayOfYear(today);
    setDayNumber(day);
    
    // Default to a random advice so it's fresh every time
    handleShuffle();
    
    const institution = storage.getInstitution();
    setThemeColor(institution.theme_color || 'emerald');
  }, []);

  const handleShuffle = () => {
    setIsRefreshing(true);
    let randomIndex = Math.floor(Math.random() * DAILY_ADVICE.length);
    
    // Attempt to find a different advice title to increase variety
    let attempts = 0;
    while (
      advice && 
      DAILY_ADVICE[randomIndex].title === advice.title && 
      attempts < 10
    ) {
      randomIndex = Math.floor(Math.random() * DAILY_ADVICE.length);
      attempts++;
    }
    
    setAdvice(DAILY_ADVICE[randomIndex]);
    setTimeout(() => setIsRefreshing(false), 500);
  };

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
      // Dimensions for 9:16 (WhatsApp Status/Story standard)
      const width = 1080;
      const height = 1920; 

      const dataUrl = await htmlToImage.toPng(element, {
        width,
        height,
        pixelRatio: 2,
        cacheBust: true,
        style: {
          transform: 'none',
          margin: '0',
          padding: '0',
          width: `${width}px`,
          height: `${height}px`,
        }
      });
      
      // Secondary check to ensure it's not a blank image
      if (dataUrl.length < 1000) {
        throw new Error('Image generation resulted in empty data');
      }
      
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
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 font-sans">
      {/* Capture Element (Hidden) */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none select-none">
        <div 
          ref={captureRef}
          className="w-[1080px] h-[1920px] flex flex-col p-20 text-white relative font-sans"
          style={{ 
            background: `linear-gradient(135deg, ${currentTheme.fromHex} 0%, ${currentTheme.toHex} 100%)`,
            backgroundColor: currentTheme.fromHex,
          }}
        >
          {/* Dashboard-style Background Motifs */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[1200px] h-[1200px] bg-white/10 blur-[180px] rounded-full -mr-60 -mt-60" />
            <div className="absolute bottom-0 left-0 w-[900px] h-[900px] bg-white/5 blur-[150px] rounded-full -ml-40 -mb-40" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 2px, transparent 2px)', backgroundSize: '80px 80px' }} />
          </div>

          <div className="relative z-10 flex flex-col h-full justify-between">
            {/* Header Area */}
            <div className="flex justify-between items-start pt-10">
              <div className="flex items-center gap-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 border border-white/30 shadow-2xl">
                  <Sparkles size={36} className="text-white" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-lg font-display font-black tracking-[.4em] uppercase text-white/60">Nasihah Al-Yaum</p>
                  <p className="text-4xl font-bold tracking-tight uppercase">Hari Ke-{dayNumber}</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-4xl font-display font-black tracking-widest uppercase">Miftahussalam</h2>
                <p className="text-lg font-medium text-white/40 tracking-[0.2em] uppercase">Daily Nasihah</p>
              </div>
            </div>

            {/* Main Content Area - Optimized for variable length */}
            <div className="flex-1 flex flex-col justify-center py-10 px-6">
              <div className="space-y-12 text-center">
                <div className="space-y-6">
                  <div className="h-1.5 w-32 bg-white/20 mx-auto rounded-full" />
                  <h1 className="text-[90px] font-display font-black leading-[1.05] tracking-tighter uppercase drop-shadow-2xl break-words whitespace-normal px-8">
                    {advice.title}
                  </h1>
                </div>
                
                {advice.arabic && (
                  <div className="relative py-12 px-12 bg-white/10 rounded-[4rem] border border-white/20 shadow-2xl mx-auto max-w-[960px]">
                    <p className="text-[75px] font-serif leading-[1.6] text-center drop-shadow-xl text-white whitespace-normal break-words" dir="rtl">
                      {advice.arabic}
                    </p>
                  </div>
                )}

                <div className="relative px-20">
                  <Quote className="absolute -left-2 -top-12 w-24 h-24 text-white/10 -rotate-12" />
                  <p className="text-5xl font-display font-bold leading-[1.4] italic text-white/95 whitespace-normal break-words drop-shadow-md">
                    "{advice.explanation}"
                  </p>
                  <Quote className="absolute -right-2 -bottom-12 w-24 h-24 text-white/10 rotate-180" />
                </div>
              </div>
            </div>

            {/* Footer Area */}
            <div className="space-y-12 pb-12">
              <div className="flex flex-wrap gap-8 justify-center">
                {advice.quranSource && (
                  <div className="flex items-center gap-4 px-12 py-6 bg-white text-black rounded-[2.5rem] font-display font-black text-2xl uppercase tracking-widest shadow-2xl">
                    <span className="text-4xl">📖</span>
                    QS. {advice.quranSource}
                  </div>
                )}
                {advice.hadithSource && (
                  <div className="flex items-center gap-4 px-12 py-6 bg-white/20 border border-white/20 rounded-[2.5rem] font-display font-black text-2xl uppercase tracking-widest shadow-xl">
                    <span className="text-4xl">📚</span>
                    HR. {advice.hadithSource}
                  </div>
                )}
              </div>

              <div className="pt-12 border-t border-white/20 flex flex-col items-center gap-4 opacity-50 px-6">
                <p className="text-2xl font-black uppercase tracking-[0.4em]">Amalan & Syiar Digital</p>
                <div className="h-1 w-20 bg-white/20 rounded-full" />
                <p className="text-xl font-bold tracking-[0.3em] uppercase">Membangun Karakter Melalui Wahyu</p>
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
          "relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] p-6 sm:p-10 md:p-16 text-white shadow-2xl transition-all duration-500",
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

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left Content Area */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-8 md:space-y-12">
            <div className="flex items-center gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 shadow-inner shrink-0">
                <Sparkles size={20} className="text-white animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-display font-black tracking-[.3em] uppercase text-white/60">Insight Harian</p>
                <p className="text-sm font-bold tracking-tight">HARI KE-{dayNumber}</p>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent ml-4 hidden sm:block" />
            </div>

            <div className="space-y-4 md:space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-black leading-[0.95] tracking-tighter uppercase transition-all break-words">
                {advice.title}
              </h1>
              
              {advice.arabic && (
                <div className="group relative">
                  <div className="absolute -inset-2 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="relative text-2xl sm:text-3xl md:text-5xl font-serif leading-[1.6] text-white/90 drop-shadow-sm transition-all text-center lg:text-left whitespace-normal h-auto py-2" dir="rtl">
                    {advice.arabic}
                  </p>
                </div>
              )}
            </div>

            <div className="relative">
              <Quote className="absolute -left-2 sm:-left-4 -top-6 w-10 h-10 text-white/10 -rotate-12" />
              <p className="relative text-lg sm:text-xl md:text-2xl font-medium leading-relaxed italic text-white/95 pl-6 sm:pl-10">
                "{advice.explanation}"
              </p>
            </div>

            <div className="pt-4 flex flex-wrap gap-3 sm:gap-6">
              {advice.quranSource && (
                <div className="group flex items-center gap-3 px-5 py-3 sm:px-8 sm:py-4 bg-white text-black rounded-2xl font-display font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95 cursor-default">
                  <span className="text-base sm:text-xl">📖</span>
                  QS. {advice.quranSource}
                </div>
              )}
              {advice.hadithSource && (
                <div className="group flex items-center gap-3 px-5 py-3 sm:px-8 sm:py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl font-display font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all hover:bg-white/20 cursor-default">
                  <span className="text-base sm:text-xl">📚</span>
                  HR. {advice.hadithSource}
                </div>
              )}
            </div>
          </div>

          {/* Right Action Area */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-between space-y-8">
            <div className="rounded-[2.5rem] bg-stone-900/40 backdrop-blur-3xl border border-white/10 p-6 sm:p-10 shadow-2xl relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="relative space-y-8 sm:space-y-10">
                <div className="text-center space-y-1">
                  <h3 className="text-base sm:text-lg font-display font-black tracking-tight uppercase">SYIAR DIGITAL</h3>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-white/30">Tebar Kebaikan Lewat Bagikan</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
                  <button 
                    onClick={handleShuffle}
                    disabled={isRefreshing}
                    className="group relative flex items-center justify-center gap-4 w-full py-5 sm:py-6 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-[1.5rem] font-display font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all disabled:opacity-50"
                  >
                    <RefreshCw size={18} className={cn("transition-transform group-hover:rotate-180", isRefreshing && "animate-spin")} />
                    Insight Lainnya
                  </button>

                  <button 
                    onClick={handleShare}
                    className="group relative flex items-center justify-center gap-4 w-full py-5 sm:py-6 bg-white text-black rounded-[1.5rem] font-display font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all hover:translate-y-[-4px] active:translate-y-[2px]"
                  >
                    <Share2 size={18} className="transition-transform group-hover:rotate-12" />
                    Share Pesan
                  </button>
                  
                  <button 
                    onClick={handleDownloadImage}
                    disabled={isCapturing}
                    className="flex items-center justify-center gap-4 w-full py-5 sm:py-6 bg-white/5 border border-white/10 hover:bg-white/10 active:bg-white/5 rounded-[1.5rem] font-display font-black text-xs uppercase tracking-[0.2em] backdrop-blur-sm transition-all disabled:opacity-50"
                  >
                    {isCapturing ? (
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Camera size={20} />
                    )}
                    Unduh Poster {isCapturing ? '...' : 'HD'}
                  </button>

                  <button 
                    onClick={handleCopy}
                    className={cn(
                      "flex items-center justify-center gap-4 w-full py-5 sm:py-6 rounded-[1.5rem] font-display font-black text-xs uppercase tracking-[0.2em] transition-all",
                      isCopied ? "bg-green-500 text-white" : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                    )}
                  >
                    {isCopied ? <Check size={20} /> : <Copy size={20} />}
                    {isCopied ? 'Tersalin' : 'Salin Teks'}
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 flex items-center justify-center gap-4 opacity-40">
              <div className="h-px bg-white/20 flex-1" />
              <p className="text-[10px] font-black text-white text-center uppercase tracking-[0.3em] whitespace-nowrap">
                Amalan & Syiar Digital
              </p>
              <div className="h-px bg-white/20 flex-1" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
