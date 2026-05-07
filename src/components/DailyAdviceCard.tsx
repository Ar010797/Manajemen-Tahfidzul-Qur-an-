import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Download, Copy, Check, Quote, Camera, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';
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
      // Small delay to ensure state updates reach the DOM
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(captureRef.current, {
        scale: 3, // High quality
        backgroundColor: null,
        useCORS: true,
        logging: false,
      });
      
      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = `Nasihat_Hari_${dayNumber}.png`;
      link.click();
    } catch (err) {
      console.error('Capture failed:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleShare = async () => {
    if (!advice) return;
    
    const shareData = {
      title: `Nasihat Harian - Hari ke-${dayNumber}`,
      text: `✨ ${advice.title}\n\n${advice.explanation}\n\nSumber: ${advice.quranSource || advice.hadithSource}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
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
      from: 'from-emerald-500',
      to: 'to-teal-600',
      bg: 'bg-emerald-50',
      text: 'text-emerald-900',
      accent: 'bg-emerald-600',
      light: 'text-emerald-600'
    },
    blue: {
      from: 'from-blue-500',
      to: 'to-indigo-600',
      bg: 'bg-blue-50',
      text: 'text-blue-900',
      accent: 'bg-blue-600',
      light: 'text-blue-600'
    },
    amber: {
      from: 'from-amber-500',
      to: 'to-orange-600',
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      accent: 'bg-amber-600',
      light: 'text-amber-600'
    },
    purple: {
      from: 'from-purple-500',
      to: 'to-pink-600',
      bg: 'bg-purple-50',
      text: 'text-purple-900',
      accent: 'bg-purple-600',
      light: 'text-purple-600'
    }
  };

  const currentTheme = themes[themeColor as keyof typeof themes] || themes.emerald;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Visual Preview Container */}
      <div className="relative group">
        {/* Hidden Story Format for Capture */}
        <div className="fixed -left-[2000px] top-0 pointer-events-none">
          <div 
            ref={captureRef}
            className={cn(
              "w-[1080px] h-[1920px] flex flex-col items-center justify-center p-20 text-white relative bg-gradient-to-br",
              currentTheme.from,
              currentTheme.to
            )}
          >
            {/* Background Ornaments */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/10 blur-[150px] rounded-full -mr-40 -mt-40" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-black/10 blur-[120px] rounded-full -ml-30 -mb-30" />
            
            {/* Poster Content */}
            <div className="relative z-10 w-full flex flex-col items-center text-center space-y-12">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <div className="h-px w-20 bg-white/40" />
                  <span className="px-8 py-3 bg-white/20 backdrop-blur-md rounded-full text-3xl font-bold tracking-[0.2em] uppercase">
                    Daily Nasiha
                  </span>
                  <div className="h-px w-20 bg-white/40" />
                </div>
                <p className="text-5xl font-medium opacity-90 tracking-tight">Hari ke-{dayNumber}</p>
              </div>

              <div className="flex flex-col items-center gap-8">
                 <h1 className="text-[120px] font-black tracking-tighter leading-[0.9] uppercase drop-shadow-2xl">
                    {advice.title}
                 </h1>
                 <div className="h-2 w-48 bg-white/60 rounded-full" />
              </div>

              {advice.arabic && (
                <div className="py-10">
                  <p className="text-8xl font-serif leading-[1.6] px-10 drop-shadow-lg text-white" dir="rtl">
                    {advice.arabic}
                  </p>
                </div>
              )}

              <div className="relative py-16 px-16 bg-white/10 backdrop-blur-xl rounded-[80px] border border-white/20 shadow-2xl">
                <Quote className="absolute -top-12 -left-6 w-32 h-32 text-white/10 rotate-12" />
                <p className="text-6xl font-semibold leading-[1.5] text-white tracking-wide max-w-[900px]">
                  "{advice.explanation}"
                </p>
              </div>

              <div className="pt-16 flex flex-col items-center gap-10">
                <div className="flex flex-col items-center gap-6">
                  {advice.quranSource && (
                    <div className="flex items-center gap-4 text-4xl font-bold bg-white/20 px-10 py-5 rounded-[40px] border border-white/10">
                      <span>📖</span>
                      <span className="opacity-60 text-2xl uppercase tracking-widest mr-2">Al-Qur'an</span>
                      <span>{advice.quranSource}</span>
                    </div>
                  )}
                  {advice.hadithSource && (
                    <div className="flex items-center gap-4 text-4xl font-bold bg-white/20 px-10 py-5 rounded-[40px] border border-white/10">
                      <span>📚</span>
                      <span className="opacity-60 text-2xl uppercase tracking-widest mr-2">Hadits</span>
                      <span>{advice.hadithSource}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-32 w-full pt-12 border-t border-white/10 flex flex-col items-center gap-4">
                <p className="text-3xl font-black tracking-[0.4em] uppercase text-white/40">
                  Miftahussalam Tahfidz
                </p>
                <div className="flex items-center gap-2 text-white/30 text-xl font-bold italic">
                  <Sparkles size={24} />
                  Amalkan & Sebarkan Kebaikan
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live UI Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl bg-gradient-to-br",
            currentTheme.from,
            currentTheme.to
          )}
        >
          {/* Background Effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 blur-2xl rounded-full -ml-24 -mb-24" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-12">
            {/* Left side: Content */}
            <div className="flex-1 space-y-8">
              <div className="flex items-center gap-4">
                <div className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-widest uppercase">
                  📌 Hari ke-{dayNumber}
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <Sparkles size={14} className="animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Nasihat Harian</span>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none uppercase">
                  {advice.title}
                </h2>
                {advice.arabic && (
                  <p className="text-2xl md:text-3xl font-serif text-white/90 leading-loose" dir="rtl">
                    {advice.arabic}
                  </p>
                )}
              </div>

              <div className="relative pl-6 border-l-4 border-white/30">
                <p className="text-lg md:text-xl font-medium leading-relaxed italic text-white/95">
                  "{advice.explanation}"
                </p>
              </div>

              <div className="pt-6 space-y-3">
                <p className="text-xs font-bold tracking-widest uppercase text-white/60">Sumber Belajar:</p>
                <div className="flex flex-wrap gap-3">
                  {advice.quranSource && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                      <span className="text-sm font-bold">📖 {advice.quranSource}</span>
                    </div>
                  )}
                  {advice.hadithSource && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                      <span className="text-sm font-bold">📚 {advice.hadithSource}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right side: Actions */}
            <div className="md:w-64 flex flex-col gap-4">
              <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 space-y-6">
                <p className="text-sm font-bold text-center text-white/80">Bagikan Kebaikan</p>
                
                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={handleShare}
                    className="flex items-center justify-center gap-3 w-full py-4 bg-white text-emerald-900 rounded-2xl font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <Share2 size={18} />
                    Share ke Media
                  </button>
                  
                  <button 
                    onClick={handleDownloadImage}
                    disabled={isCapturing}
                    className="flex items-center justify-center gap-3 w-full py-4 bg-white/20 border border-white/30 text-white rounded-2xl font-bold text-sm backdrop-blur-md hover:bg-white/30 transition-all disabled:opacity-50"
                  >
                    {isCapturing ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Camera size={18} />
                    )}
                    Simpan Gambar {isCapturing ? '...' : ''}
                  </button>

                  <button 
                    onClick={handleCopy}
                    className={cn(
                      "flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-sm transition-all",
                      isCopied ? "bg-green-500 text-white" : "bg-white/10 border border-white/20 text-white hover:bg-white/20"
                    )}
                  >
                    {isCopied ? <Check size={18} /> : <Copy size={18} />}
                    {isCopied ? 'Tersalin!' : 'Salin Teks'}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-black/10 rounded-2xl">
                <p className="text-[10px] text-white/50 text-center leading-relaxed">
                  "Barangsiapa yang menunjukkan kepada kebaikan, maka ia akan mendapatkan pahala seperti orang yang melakukannya." (HR. Muslim)
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
