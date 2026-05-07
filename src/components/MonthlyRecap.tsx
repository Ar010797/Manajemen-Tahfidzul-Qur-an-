import React, { useState, useEffect } from 'react';
import { Download, Search, Calendar, FileText, Save, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as htmlToImage from 'html-to-image';
import { cn } from '../lib/utils';
import { storage } from '../services/storage';

export default function MonthlyRecap() {
  const [halaqohs, setHalaqohs] = useState<any[]>([]);
  const [selectedHalaqoh, setSelectedHalaqoh] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [recapData, setRecapData] = useState<any[]>([]);
  const [recapSettings, setRecapSettings] = useState<Record<string, any>>({});
  const [institution, setInstitution] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [principalSigSize, setPrincipalSigSize] = useState(80);
  const [coordinatorSigSize, setCoordinatorSigSize] = useState(80);
  const [themeColor, setThemeColor] = useState('emerald');

  useEffect(() => {
    const inst = storage.getInstitution();
    setThemeColor(inst.theme_color || 'emerald');
    setPrincipalSigSize(inst.principal_signature_size || 80);
    setCoordinatorSigSize(inst.coordinator_signature_size || 80);
  }, []);

  const handlePrincipalSigSizeChange = (newSize: number) => {
    setPrincipalSigSize(newSize);
    storage.updateInstitution({ principal_signature_size: newSize });
  };

  const handleCoordinatorSigSizeChange = (newSize: number) => {
    setCoordinatorSigSize(newSize);
    storage.updateInstitution({ coordinator_signature_size: newSize });
  };

  useEffect(() => {
    const fetchData = () => {
      const hData = storage.getHalaqoh();
      setHalaqohs(hData);
      setInstitution(storage.getInstitution());
    };
    fetchData();
  }, [selectedHalaqoh, selectedMonth]);

  const fetchRecap = () => {
    if (!selectedHalaqoh) return;
    setLoading(true);
    
    const data = storage.getMonthlyRecapData(selectedMonth, selectedHalaqoh);
    
    // Sort data by date ascending to ensure AWL is truly the first and AKH is truly the last
    const sortedData = [...data].sort((a, b) => a.date.localeCompare(b.date));
    
    // Group by student
    const grouped = sortedData.reduce((acc: any, curr: any) => {
      if (!acc[curr.student_id]) {
        acc[curr.student_id] = {
          id: curr.student_id,
          name: curr.student_name,
          hafalan: { awl: '-', akh: '-', jml: 0 },
          ummi: { awl: '-', akh: '-', jml: 0 },
          tilawah: { awl: '-', akh: '-', jml: 0 },
          activeDays: new Set()
        };
      }
      const details = curr.details || {};
      const target = acc[curr.student_id][curr.type];
      
      const grade = details.grade || '';
      
      // Check if there is a grade to count as active day
      if (grade !== '') {
        acc[curr.student_id].activeDays.add(curr.date);
      }
      
      // CRITICAL: Exclude BL and C from ALL calculations as requested
      const isExcluded = grade === 'BL' || grade === 'C';
      
      if (curr.type === 'hafalan') {
        const surah = details.surah || '';
        const startStr = details.verse_start || '';
        const endStr = details.verse_end || '';
        const label = `${surah} ${startStr}${endStr && endStr !== startStr ? `-${endStr}` : ''}`.trim() || '-';
        
        if (target.awl === '-') target.awl = label;
        target.akh = label;
        
        if (!isExcluded) {
          const start = parseInt(startStr);
          const end = parseInt(endStr);
          if (!isNaN(start) && start > 0) {
            // If end is provided and valid, count the range. Otherwise count as 1 verse.
            const count = (!isNaN(end) && end >= start) ? (end - start + 1) : 1;
            target.jml += count;
          }
        }
      } else if (curr.type === 'ummi') {
        const level = details.level || '';
        const startStr = details.page_start || '';
        const endStr = details.page_end || '';
        
        // Improved label logic for Ummi to avoid empty "J H"
        let label = '-';
        if (level && startStr) {
          label = `J${level} H${startStr}${endStr && endStr !== startStr ? `-${endStr}` : ''}`;
        } else if (level) {
          label = `J${level}`;
        } else if (startStr) {
          label = `H${startStr}${endStr && endStr !== startStr ? `-${endStr}` : ''}`;
        }
          
        if (target.awl === '-') target.awl = label;
        target.akh = label;
        
        if (!isExcluded) {
          const start = parseInt(startStr);
          const end = parseInt(endStr);
          if (!isNaN(start) && start > 0) {
            target.jml += (!isNaN(end) && end >= start) ? (end - start + 1) : 1;
          } else if (level && isNaN(start)) {
            // If level is provided but page is text (like Muroja'ah), don't count
            // Only count if level is provided and page is empty or numeric
          } else if (level && !startStr) {
            target.jml += 1;
          }
        }
      } else if (curr.type === 'tilawah') {
        const juz = details.juz || '';
        const surah = details.surah || '';
        const startStr = details.verse_start || '';
        const endStr = details.verse_end || '';
        const label = startStr 
          ? `${juz ? `J${juz} ` : ''}${surah} ${startStr}${endStr && endStr !== startStr ? `-${endStr}` : ''}` 
          : (surah || (juz ? `Juz ${juz}` : '-'));
          
        if (target.awl === '-') target.awl = label;
        target.akh = label;
        
        if (!isExcluded) {
          const start = parseInt(startStr);
          const end = parseInt(endStr);
          if (!isNaN(start) && start > 0) {
            target.jml += (!isNaN(end) && end >= start) ? (end - start + 1) : 1;
          } else if (surah && isNaN(start)) {
            // If surah is provided but verse is text, don't count
          } else if (surah && !startStr) {
            target.jml += 1;
          }
        }
      }
      
      return acc;
    }, {});

    const studentList = Object.values(grouped);
    
    // Sort studentList based on the original students order (order_index)
    const allStudents = storage.getStudents();
    const sortedStudentList = studentList.sort((a: any, b: any) => {
      const studentA = allStudents.find(s => s.id === a.id);
      const studentB = allStudents.find(s => s.id === b.id);
      if (studentA && studentB) {
        return studentA.order_index - studentB.order_index;
      }
      return a.name.localeCompare(b.name);
    });

    setRecapData(sortedStudentList);

    // Fetch settings for each student
    const settings: Record<string, any> = {};
    for (const student of studentList as any[]) {
      settings[student.id] = storage.getRecapSettings(student.id, selectedMonth);
    }
    setRecapSettings(settings);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecap();
    
    // Refresh data when window gets focus (e.g. after editing in another tab or returning to this tab)
    window.addEventListener('focus', fetchRecap);
    return () => window.removeEventListener('focus', fetchRecap);
  }, [selectedHalaqoh, selectedMonth]);

  const updateSettings = (studentId: string, field: string, value: string) => {
    const current = recapSettings[studentId] || { total_hafalan: '', notes: '' };
    const newSettings = { ...current, [field]: value };
    setRecapSettings({ ...recapSettings, [studentId]: newSettings });

    storage.saveRecapSettings(
      studentId,
      selectedMonth,
      newSettings.total_hafalan,
      newSettings.notes
    );
  };

  const generateImage = async (format: 'jpg' | 'png') => {
    if (!selectedHalaqoh || recapData.length === 0 || isGenerating) return;

    const element = document.getElementById('recap-preview-container');
    if (!element) return;

    setIsGenerating(true);
    
    // Small delay to ensure UI is stable
    setTimeout(async () => {
      try {
        // Ensure images are loaded
        const images = element.getElementsByTagName('img');
        await Promise.all(Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }));

        // Use html-to-image which handles modern CSS (OKLCH, etc) much better
        const canvas = await htmlToImage.toCanvas(element, {
          width: element.scrollWidth,
          height: element.scrollHeight,
          pixelRatio: 4, // Ultra-high resolution
          cacheBust: true,
          backgroundColor: '#ffffff',
          style: {
            transform: 'none',
            margin: '0',
            padding: '0'
          }
        });
        
        const dataUrl = canvas.toDataURL(format === 'jpg' ? 'image/jpeg' : 'image/png', 1.0);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `Rekap_${selectedMonth}_${halaqohs.find(h => h.id === selectedHalaqoh)?.name || 'Halaqoh'}.${format}`;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(dataUrl);
        }, 100);
      } catch (error) {
        console.error('Image Generation Error:', error);
        alert('Gagal mengunduh gambar. Silakan coba lagi.');
      } finally {
        setIsGenerating(false);
      }
    }, 500);
  };

  const generatePDF = async () => {
    if (!selectedHalaqoh || recapData.length === 0 || isGenerating) return;
    
    const element = document.getElementById('recap-preview-container');
    if (!element) return;

    setIsGenerating(true);
    
    try {
      // Ensure images are loaded
      const images = element.getElementsByTagName('img');
      await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }));

      // Use html-to-image which handles modern CSS (OKLCH, etc) much better
      const canvas = await htmlToImage.toCanvas(element, {
        width: element.scrollWidth,
        height: element.scrollHeight,
        pixelRatio: 4, // Ultra-high resolution
        cacheBust: true,
        backgroundColor: '#ffffff',
        style: {
          transform: 'none',
          margin: '0',
          padding: '0'
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const ratio = imgProps.width / imgProps.height;
      const width = pdfWidth;
      const height = pdfWidth / ratio;
      
      let finalWidth = width;
      let finalHeight = height;
      
      if (finalHeight > pdfHeight) {
        finalHeight = pdfHeight;
        finalWidth = pdfHeight * ratio;
      }
      
      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;
      
      pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
      const fileName = `Rekap_${selectedMonth}_${halaqohs.find(h => h.id === selectedHalaqoh)?.name || 'Halaqoh'}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('Gagal mengunduh PDF. Silakan coba lagi.');
    } finally {
      setIsGenerating(false);
    }
  };

  const hasHafalan = recapData.some(s => s.hafalan.awl !== '-' || s.hafalan.akh !== '-' || s.hafalan.jml > 0);
  const hasTilawah = recapData.some(s => s.tilawah.awl !== '-' || s.tilawah.akh !== '-' || s.tilawah.jml > 0);
  const hasUmmi = recapData.some(s => s.ummi.awl !== '-' || s.ummi.akh !== '-' || s.ummi.jml > 0);

  const activeDaysCount = storage.getActiveDays(selectedMonth, selectedHalaqoh);

  const theme = {
    text: themeColor === 'emerald' ? 'text-emerald-600' :
          themeColor === 'blue' ? 'text-blue-600' :
          themeColor === 'amber' ? 'text-amber-600' :
          themeColor === 'indigo' ? 'text-indigo-600' :
          themeColor === 'purple' ? 'text-purple-600' :
          themeColor === 'rose' ? 'text-rose-600' :
          'text-slate-600',
    bg: themeColor === 'emerald' ? 'bg-emerald-600' :
        themeColor === 'blue' ? 'bg-blue-600' :
        themeColor === 'amber' ? 'bg-amber-600' :
        themeColor === 'indigo' ? 'bg-indigo-600' :
        themeColor === 'purple' ? 'bg-purple-600' :
        themeColor === 'rose' ? 'bg-rose-600' :
        'bg-slate-600',
    lightBg: themeColor === 'emerald' ? 'bg-emerald-50' :
             themeColor === 'blue' ? 'bg-blue-50' :
             themeColor === 'amber' ? 'bg-amber-50' :
             themeColor === 'indigo' ? 'bg-indigo-50' :
             themeColor === 'purple' ? 'bg-purple-50' :
             themeColor === 'rose' ? 'bg-rose-50' :
             'bg-slate-50',
    lightText: themeColor === 'emerald' ? 'text-emerald-700' :
               themeColor === 'blue' ? 'text-blue-700' :
               themeColor === 'amber' ? 'text-amber-700' :
               themeColor === 'indigo' ? 'text-indigo-700' :
               themeColor === 'purple' ? 'text-purple-700' :
               themeColor === 'rose' ? 'text-rose-700' :
               'text-slate-700',
    ring: themeColor === 'emerald' ? 'focus:ring-emerald-500/50' :
          themeColor === 'blue' ? 'focus:ring-blue-500/50' :
          themeColor === 'amber' ? 'focus:ring-amber-500/50' :
          themeColor === 'indigo' ? 'focus:ring-indigo-500/50' :
          themeColor === 'purple' ? 'focus:ring-purple-500/50' :
          themeColor === 'rose' ? 'focus:ring-rose-500/50' :
          'focus:ring-slate-500/50',
    shadow: themeColor === 'emerald' ? 'shadow-emerald-500/10' :
            themeColor === 'blue' ? 'shadow-blue-500/10' :
            themeColor === 'amber' ? 'shadow-amber-500/10' :
            themeColor === 'indigo' ? 'shadow-indigo-500/10' :
            themeColor === 'purple' ? 'shadow-purple-500/10' :
            themeColor === 'rose' ? 'shadow-rose-500/10' :
            'shadow-slate-500/10',
  };

  return (
    <div className="space-y-10 font-sans">
      <div className="bg-white p-10 rounded-[3rem] border border-stone-200/50 shadow-2xl shadow-stone-900/5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-display font-black text-stone-950 tracking-tight leading-none">Rekapitulasi Bulanan</h1>
            <p className="text-stone-500 font-medium">Monitoring progress bulanan dan akumulasi data otomatis.</p>
          </div>
          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <button 
              onClick={generatePDF}
              disabled={!selectedHalaqoh || recapData.length === 0 || isGenerating}
              className={cn(
                "flex-1 lg:flex-none text-white px-8 py-4 rounded-2xl font-display font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50 hover:translate-y-[-2px] active:translate-y-[1px]",
                theme.bg, theme.shadow
              )}
            >
              <Download size={18} />
              {isGenerating ? 'Wait...' : 'EXPOR PDF'}
            </button>
            <button 
              onClick={() => generateImage('jpg')}
              disabled={!selectedHalaqoh || recapData.length === 0 || isGenerating}
              className="flex-1 lg:flex-none bg-stone-950 text-white px-8 py-4 rounded-2xl font-display font-black text-xs uppercase tracking-widest hover:bg-stone-800 transition-all flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50 hover:translate-y-[-2px] active:translate-y-[1px]"
            >
              <FileText size={18} />
              {isGenerating ? 'Wait...' : 'EXPOR JPG'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-3">
            <label className="text-[10px] font-display font-black text-stone-400 uppercase tracking-[0.25em] ml-2">Pilih Halaqoh</label>
            <div className="relative group">
               <select 
                className={cn("w-full bg-stone-50 border border-stone-200/60 rounded-2xl py-4 px-6 focus:outline-none focus:ring-4 transition-all appearance-none font-bold text-stone-900 cursor-pointer", theme.ring)}
                value={selectedHalaqoh}
                onChange={(e) => setSelectedHalaqoh(e.target.value)}
              >
                <option value="">-- Semua Halaqoh --</option>
                {halaqohs.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-stone-300">
                <Search size={18} />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-display font-black text-stone-400 uppercase tracking-[0.25em] ml-2">Periode Bulan</label>
            <div className="relative group">
              <input 
                type="month"
                className={cn("w-full bg-stone-50 border border-stone-200/60 rounded-2xl py-4 px-6 focus:outline-none focus:ring-4 transition-all font-bold text-stone-900", theme.ring)}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-stone-300">
                <Calendar size={18} />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="w-16 h-16 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin mx-auto mb-6" />
            <p className="text-stone-400 font-display font-black text-xs uppercase tracking-widest">Sychronizing data...</p>
          </div>
        ) : recapData.length > 0 ? (
          <div className="space-y-12">
            <div className="overflow-hidden border border-stone-200/60 rounded-[2rem] shadow-sm">
              <table className="w-full text-[11px] text-left border-collapse">
                <thead className="bg-stone-50/50 text-stone-400 font-display font-black text-[9px] uppercase tracking-[0.2em]">
                  <tr className="border-b border-stone-200/60">
                    <th rowSpan={2} className="px-6 py-5 border-r border-stone-200/60 text-center">No</th>
                    <th rowSpan={2} className="px-6 py-5 border-r border-stone-200/60">Nama Siswa</th>
                    {hasHafalan && <th colSpan={3} className="px-6 py-3 border-r border-stone-200/60 text-center bg-stone-100/30">Hafalan Al-Qur'an</th>}
                    {hasTilawah && <th colSpan={3} className="px-6 py-3 border-r border-stone-200/60 text-center bg-stone-100/30">Tilawah Al-Qur'an</th>}
                    {hasUmmi && <th colSpan={3} className="px-6 py-3 border-r border-stone-200/60 text-center bg-stone-100/30">Metode Ummi</th>}
                    <th rowSpan={2} className="px-6 py-5 border-r border-stone-200/60 text-center">Aktif</th>
                    <th rowSpan={2} className="px-6 py-5 border-r border-stone-200/60 text-center">Total</th>
                    <th rowSpan={2} className="px-6 py-5 text-center">Catatan Guru</th>
                  </tr>
                  <tr className="border-b border-stone-200/60">
                    {hasHafalan && (
                      <>
                        <th className="px-3 py-3 border-r border-stone-200/60 text-center font-normal">AWL</th>
                        <th className="px-3 py-3 border-r border-stone-200/60 text-center font-normal">AKH</th>
                        <th className="px-3 py-3 border-r border-stone-200/60 text-center">JML</th>
                      </>
                    )}
                    {hasTilawah && (
                      <>
                        <th className="px-3 py-3 border-r border-stone-200/60 text-center font-normal">AWL</th>
                        <th className="px-3 py-3 border-r border-stone-200/60 text-center font-normal">AKH</th>
                        <th className="px-3 py-3 border-r border-stone-200/60 text-center">JML</th>
                      </>
                    )}
                    {hasUmmi && (
                      <>
                        <th className="px-3 py-3 border-r border-stone-200/60 text-center font-normal">AWL</th>
                        <th className="px-3 py-3 border-r border-stone-200/60 text-center font-normal">AKH</th>
                        <th className="px-3 py-3 border-r border-stone-200/60 text-center">JML</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium text-stone-600">
                  {recapData.map((s, idx) => (
                    <tr key={s.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-6 py-4 border-r border-stone-100/60 text-center text-stone-400 font-display font-black">{idx + 1}</td>
                      <td className="px-6 py-4 border-r border-stone-100/60 font-bold text-stone-900">{s.name}</td>
                      {hasHafalan && (
                        <>
                          <td className="px-3 py-4 border-r border-stone-100/60 text-center tabular-nums">{s.hafalan.awl}</td>
                          <td className="px-3 py-4 border-r border-stone-100/60 text-center tabular-nums">{s.hafalan.akh}</td>
                          <td className="px-3 py-4 border-r border-stone-100/60 text-center font-black text-stone-900 tabular-nums">{s.hafalan.jml}</td>
                        </>
                      )}
                      {hasTilawah && (
                        <>
                          <td className="px-3 py-4 border-r border-stone-100/60 text-center tabular-nums">{s.tilawah.awl}</td>
                          <td className="px-3 py-4 border-r border-stone-100/60 text-center tabular-nums">{s.tilawah.akh}</td>
                          <td className="px-3 py-4 border-r border-stone-100/60 text-center font-black text-stone-900 tabular-nums">{s.tilawah.jml}</td>
                        </>
                      )}
                      {hasUmmi && (
                        <>
                          <td className="px-3 py-4 border-r border-stone-100/60 text-center tabular-nums">{s.ummi.awl}</td>
                          <td className="px-3 py-4 border-r border-stone-100/60 text-center tabular-nums">{s.ummi.akh}</td>
                          <td className="px-3 py-4 border-r border-stone-100/60 text-center font-black text-stone-900 tabular-nums">{s.ummi.jml}</td>
                        </>
                      )}
                      <td className={cn("px-6 py-4 border-r border-stone-100/60 text-center font-black tabular-nums", theme.text)}>{activeDaysCount}</td>
                      <td className="px-6 py-4 border-r border-stone-100/60 min-w-[140px]">
                        <input 
                          type="text"
                          placeholder="Nilai..."
                          className="w-full bg-stone-50 border border-stone-200/60 rounded-xl px-4 py-2.5 text-[10px] focus:outline-none focus:ring-4 ring-stone-900/5 transition-all text-center font-bold"
                          value={recapSettings[s.id]?.total_hafalan || ''}
                          onChange={(e) => updateSettings(s.id, 'total_hafalan', e.target.value)}
                        />
                      </td>
                      <td className="px-6 py-4 min-w-[200px]">
                        <input 
                          type="text"
                          placeholder="Tambahkan catatan..."
                          className="w-full bg-stone-50 border border-stone-200/60 rounded-xl px-4 py-2.5 text-[10px] focus:outline-none focus:ring-4 ring-stone-900/5 transition-all"
                          value={recapSettings[s.id]?.notes || ''}
                          onChange={(e) => updateSettings(s.id, 'notes', e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Preview for Export */}
            <div className="mt-20 space-y-10">
              <div className="flex items-center gap-6 justify-center">
                 <div className="h-px bg-stone-200 flex-1" />
                 <h3 className="text-[10px] font-display font-black text-stone-400 uppercase tracking-[0.4em]">EXPORT PREVIEW</h3>
                 <div className="h-px bg-stone-200 flex-1" />
              </div>
              
              {/* Signature Size Controls (Outside Capture Area) */}
              <div className="max-w-7xl mx-auto bg-stone-50 p-8 rounded-[2.5rem] border border-stone-200/40 flex flex-col xl:flex-row items-center gap-10">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md">
                    <Settings size={28} className="text-stone-900" />
                  </div>
                  <div>
                    <h4 className="text-lg font-display font-black text-stone-950 tracking-tight">Image Tuning</h4>
                    <p className="text-xs text-stone-500 font-medium">Atur skala tanda tangan sebelum diekspor.</p>
                  </div>
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-display font-black text-stone-400 uppercase tracking-widest">KEPALA SEKOLAH</span>
                      <span className="font-display font-black text-sm text-stone-900">{principalSigSize}PX</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <button onClick={() => handlePrincipalSigSizeChange(Math.max(40, principalSigSize - 10))} className="p-2 bg-white rounded-xl shadow-sm text-stone-400 hover:text-stone-900 active:scale-95 transition-all">
                          <Search size={14} className="scale-[-1]" />
                       </button>
                       <input 
                        type="range" 
                        min="40" 
                        max="300" 
                        value={principalSigSize} 
                        onChange={e => handlePrincipalSigSizeChange(parseInt(e.target.value))}
                        className="flex-1 h-2 bg-white rounded-lg appearance-none cursor-pointer accent-stone-950"
                      />
                       <button onClick={() => handlePrincipalSigSizeChange(Math.min(300, principalSigSize + 10))} className="p-2 bg-white rounded-xl shadow-sm text-stone-400 hover:text-stone-900 active:scale-95 transition-all">
                          <Search size={14} />
                       </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-display font-black text-stone-400 uppercase tracking-widest">KOORDINATOR TAHFIDZ</span>
                      <span className="font-display font-black text-sm text-stone-900">{coordinatorSigSize}PX</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <button onClick={() => handleCoordinatorSigSizeChange(Math.max(40, coordinatorSigSize - 10))} className="p-2 bg-white rounded-xl shadow-sm text-stone-400 hover:text-stone-900 active:scale-95 transition-all">
                          <Search size={14} className="scale-[-1]" />
                       </button>
                       <input 
                        type="range" 
                        min="40" 
                        max="300" 
                        value={coordinatorSigSize} 
                        onChange={e => handleCoordinatorSigSizeChange(parseInt(e.target.value))}
                        className="flex-1 h-2 bg-white rounded-lg appearance-none cursor-pointer accent-stone-950"
                      />
                       <button onClick={() => handleCoordinatorSigSizeChange(Math.min(300, coordinatorSigSize + 10))} className="p-2 bg-white rounded-xl shadow-sm text-stone-400 hover:text-stone-900 active:scale-95 transition-all">
                          <Search size={14} />
                       </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto p-12 bg-white rounded-[3.5rem] shadow-2xl border border-stone-200/40">
                <div id="recap-preview-container" className="mx-auto p-[20mm] relative bg-white" style={{ width: '297mm', minHeight: '210mm', fontFamily: "'Outfit', 'Inter', sans-serif", color: '#1c1917' }}>
                  {/* Watermark */}
                  {institution?.watermark && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0.04 }}>
                      <img 
                        src={institution.watermark} 
                        alt="" 
                        crossOrigin="anonymous"
                        className="w-[120mm] h-[120mm] object-contain" 
                      />
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-center border-b-2 border-black pb-4 mb-8 relative" style={{ borderBottomColor: '#000000' }}>
                    {institution?.logo && (
                      <img 
                        src={institution.logo} 
                        alt="Logo" 
                        crossOrigin="anonymous" 
                        className="absolute left-0 top-0 w-24 h-24 object-contain" 
                        style={{ backgroundColor: '#ffffff' }}
                      />
                    )}
                    <div className="flex-1 text-center pl-24">
                      <h1 className="text-2xl font-bold uppercase tracking-tight">REKAPITULASI BULANAN TAHFIDZUL QUR'AN</h1>
                      <h2 className="text-xl font-bold uppercase mt-1">{institution?.name || 'SEKOLAH ISLAM MIFTAHUSSALAM'}</h2>
                      <p className="text-[11px] leading-tight mt-2 italic">{institution?.address}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 text-sm mb-8 font-medium">
                    <div className="space-y-2">
                      <p><span className="w-24 inline-block">Bulan</span>: {format(new Date(selectedMonth), 'MMMM yyyy', { locale: id })}</p>
                      <p><span className="w-24 inline-block">Halaqoh</span>: {halaqohs.find(h => h.id == selectedHalaqoh)?.name || '-'}</p>
                    </div>
                    <div className="text-right space-y-2">
                      <p>Pengampu: {institution?.halaqoh_teacher_name || '-'}</p>
                      <p>Tahun Ajaran: {institution?.academic_year || '-'}</p>
                    </div>
                  </div>

                  <table className="w-full border-collapse border border-black text-[9px] leading-normal" style={{ borderColor: '#000000', tableLayout: 'fixed' }}>
                    <colgroup>
                      <col style={{ width: '30px' }} />
                      <col style={{ width: '120px' }} />
                      {hasHafalan && (
                        <>
                          <col style={{ width: '60px' }} />
                          <col style={{ width: '60px' }} />
                          <col style={{ width: '30px' }} />
                        </>
                      )}
                      {hasTilawah && (
                        <>
                          <col style={{ width: '60px' }} />
                          <col style={{ width: '60px' }} />
                          <col style={{ width: '30px' }} />
                        </>
                      )}
                      {hasUmmi && (
                        <>
                          <col style={{ width: '60px' }} />
                          <col style={{ width: '60px' }} />
                          <col style={{ width: '30px' }} />
                        </>
                      )}
                      <col style={{ width: '40px' }} />
                      <col style={{ width: '60px' }} />
                      <col style={{ width: '80px' }} />
                    </colgroup>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc' }}>
                        <th rowSpan={2} className="border border-black px-1 py-2 text-center align-middle" style={{ borderColor: '#000000', color: '#000000', fontWeight: 'bold' }}>
                          <div className="flex items-center justify-center min-h-[40px]">NO</div>
                        </th>
                        <th rowSpan={2} className="border border-black px-2 py-2 text-center align-middle" style={{ borderColor: '#000000', color: '#000000', fontWeight: 'bold' }}>
                          <div className="flex items-center justify-center min-h-[40px]">NAMA SISWA</div>
                        </th>
                        {hasHafalan && <th colSpan={3} className="border border-black px-1 py-1 text-center align-middle" style={{ borderColor: '#000000', color: '#000000', fontWeight: 'bold' }}>HAFALAN AL-QUR'AN</th>}
                        {hasTilawah && <th colSpan={3} className="border border-black px-1 py-1 text-center align-middle" style={{ borderColor: '#000000', color: '#000000', fontWeight: 'bold' }}>TILAWAH AL-QUR'AN</th>}
                        {hasUmmi && <th colSpan={3} className="border border-black px-1 py-1 text-center align-middle" style={{ borderColor: '#000000', color: '#000000', fontWeight: 'bold' }}>TILAWAH UMMI</th>}
                        <th rowSpan={2} className="border border-black px-1 py-2 text-center align-middle" style={{ borderColor: '#000000', color: '#000000', fontWeight: 'bold' }}>
                          <div className="flex items-center justify-center min-h-[40px]">HARI AKTIF</div>
                        </th>
                        <th rowSpan={2} className="border border-black px-1 py-2 text-center align-middle" style={{ borderColor: '#000000', color: '#000000', fontWeight: 'bold' }}>
                          <div className="flex items-center justify-center min-h-[40px]">TOTAL</div>
                        </th>
                        <th rowSpan={2} className="border border-black px-2 py-2 text-center align-middle" style={{ borderColor: '#000000', color: '#000000', fontWeight: 'bold' }}>
                          <div className="flex items-center justify-center min-h-[40px]">CATATAN</div>
                        </th>
                      </tr>
                      <tr style={{ backgroundColor: '#f8fafc' }}>
                        {hasHafalan && (
                          <>
                            <th className="border border-black px-1 py-1 text-center align-middle" style={{ borderColor: '#000000', color: '#000000', fontWeight: 'bold' }}>AWL</th>
                            <th className="border border-black px-1 py-1 text-center align-middle" style={{ borderColor: '#000000', color: '#000000', fontWeight: 'bold' }}>AKH</th>
                            <th className="border border-black px-1 py-1 text-center align-middle" style={{ borderColor: '#000000', color: '#000000', fontWeight: 'bold' }}>JML</th>
                          </>
                        )}
                        {hasTilawah && (
                          <>
                            <th className="border border-black px-1 py-1 text-center align-middle" style={{ borderColor: '#000000', color: '#000000', fontWeight: 'bold' }}>AWL</th>
                            <th className="border border-black px-1 py-1 text-center align-middle" style={{ borderColor: '#000000', color: '#000000', fontWeight: 'bold' }}>AKH</th>
                            <th className="border border-black px-1 py-1 text-center align-middle" style={{ borderColor: '#000000', color: '#000000', fontWeight: 'bold' }}>JML</th>
                          </>
                        )}
                        {hasUmmi && (
                          <>
                            <th className="border border-black px-1 py-1 text-center align-middle" style={{ borderColor: '#000000', color: '#000000', fontWeight: 'bold' }}>AWL</th>
                            <th className="border border-black px-1 py-1 text-center align-middle" style={{ borderColor: '#000000', color: '#000000', fontWeight: 'bold' }}>AKH</th>
                            <th className="border border-black px-1 py-1 text-center align-middle" style={{ borderColor: '#000000', color: '#000000', fontWeight: 'bold' }}>JML</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {recapData.map((s, i) => (
                        <tr key={s.id}>
                          <td className="border border-black px-1 py-2 text-center align-middle" style={{ borderColor: '#000000', color: '#000000' }}>{i + 1}</td>
                          <td className="border border-black px-2 py-2 text-left align-middle font-bold overflow-hidden" style={{ borderColor: '#000000', color: '#000000', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{s.name}</td>
                          {hasHafalan && (
                            <>
                              <td className="border border-black px-1 py-2 text-center align-middle" style={{ borderColor: '#000000', color: '#000000' }}>{s.hafalan.awl}</td>
                              <td className="border border-black px-1 py-2 text-center align-middle" style={{ borderColor: '#000000', color: '#000000' }}>{s.hafalan.akh}</td>
                              <td className="border border-black px-1 py-2 text-center align-middle font-bold" style={{ borderColor: '#000000', color: '#000000' }}>{s.hafalan.jml}</td>
                            </>
                          )}
                          {hasTilawah && (
                            <>
                              <td className="border border-black px-1 py-2 text-center align-middle" style={{ borderColor: '#000000', color: '#000000' }}>{s.tilawah.awl}</td>
                              <td className="border border-black px-1 py-2 text-center align-middle" style={{ borderColor: '#000000', color: '#000000' }}>{s.tilawah.akh}</td>
                              <td className="border border-black px-1 py-2 text-center align-middle font-bold" style={{ borderColor: '#000000', color: '#000000' }}>{s.tilawah.jml}</td>
                            </>
                          )}
                          {hasUmmi && (
                            <>
                              <td className="border border-black px-1 py-2 text-center align-middle" style={{ borderColor: '#000000', color: '#000000' }}>{s.ummi.awl}</td>
                              <td className="border border-black px-1 py-2 text-center align-middle" style={{ borderColor: '#000000', color: '#000000' }}>{s.ummi.akh}</td>
                              <td className="border border-black px-1 py-2 text-center align-middle font-bold" style={{ borderColor: '#000000', color: '#000000' }}>{s.ummi.jml}</td>
                            </>
                          )}
                          <td className="border border-black px-1 py-2 text-center align-middle font-bold" style={{ borderColor: '#000000', color: '#000000' }}>{activeDaysCount}</td>
                          <td className="border border-black px-2 py-2 text-center align-middle" style={{ borderColor: '#000000', color: '#000000' }}>{recapSettings[s.id]?.total_hafalan || '-'}</td>
                          <td className="border border-black px-2 py-2 text-center align-middle" style={{ borderColor: '#000000', color: '#000000' }}>{recapSettings[s.id]?.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="grid grid-cols-2 text-sm text-center mt-6">
                    <div>
                      <p>Mengetahui,</p>
                      <p className="mb-6">Kepala Sekolah</p>
                      <div className="relative flex items-center justify-center h-20" style={{ height: '80px' }}>
                        {institution?.principal_signature && (
                          <img 
                            src={institution.principal_signature} 
                            alt="Principal Signature" 
                            crossOrigin="anonymous"
                            className="object-contain" 
                            style={{ height: `${principalSigSize}px`, width: 'auto', display: 'block' }} 
                          />
                        )}
                      </div>
                      <p className="font-bold underline">{institution?.principal_name || '( .............................. )'}</p>
                    </div>
                    <div>
                      <p className="invisible">.</p>
                      <p className="mb-6">Koordinator Tahfidz,</p>
                      <div className="relative flex items-center justify-center h-20" style={{ height: '80px' }}>
                        {institution?.coordinator_signature && (
                          <img 
                            src={institution.coordinator_signature} 
                            alt="Coordinator Signature" 
                            crossOrigin="anonymous"
                            className="object-contain" 
                            style={{ height: `${coordinatorSigSize}px`, width: 'auto', display: 'block' }} 
                          />
                        )}
                      </div>
                      <p className="font-bold underline">{institution?.coordinator_name || '( .............................. )'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center text-stone-400">
            <FileText size={48} className="mx-auto mb-4 opacity-20" />
            <p>Tidak ada data setoran untuk bulan dan halaqoh ini.</p>
          </div>
        )}
      </div>
      {/* No more hidden capture element, we use the preview container */}
    </div>
  );
}
