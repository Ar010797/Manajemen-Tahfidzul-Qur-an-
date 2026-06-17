import React, { useState, useEffect } from 'react';
import { Download, Search, Calendar, FileText, Save, Settings, X, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as htmlToImage from 'html-to-image';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { storage } from '../services/storage';

import { parseAndCalculateTotalHafalan } from '../lib/quranUtils';

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
  const [showTilawah, setShowTilawah] = useState(true);
  const [showUmmi, setShowUmmi] = useState(true);
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
        // Ensure the label clearly shows surah and verse range
        const label = `${surah} ${startStr}${endStr && endStr !== startStr ? `-${endStr}` : ''}`.trim();
        const displayLabel = label || '-';
        
        if (target.awl === '-') target.awl = displayLabel;
        target.akh = displayLabel;
        
        if (!isExcluded) {
          const start = parseInt(startStr);
          const end = parseInt(endStr);
          if (!isNaN(start) && start > 0) {
            // Precise verse count: (End - Start + 1). If end is missing, count is 1.
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

  const [editingStudent, setEditingStudent] = useState<any>(null);

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

        // Set high pixel ratio (4) consistently to get ultra-high-resolution images for WhatsApp sharing and printing without blurriness
        const pixelRatio = 4;

        // Use html-to-image which handles modern CSS (OKLCH, etc) much better
        const canvas = await htmlToImage.toCanvas(element, {
          width: element.scrollWidth,
          height: element.scrollHeight,
          pixelRatio: pixelRatio,
          backgroundColor: '#ffffff',
          style: {
            transform: 'none',
            margin: '0',
            padding: '0',
            borderRadius: '0',
            boxShadow: 'none',
            width: `${element.scrollWidth}px`,
            height: `${element.scrollHeight}px`
          }
        });
        
        const type = format === 'jpg' ? 'image/jpeg' : 'image/png';
        const fileName = `Rekap_${selectedMonth}_${(halaqohs.find(h => h.id === selectedHalaqoh)?.name || 'Halaqoh').replace(/[^a-z0-9]/gi, '_')}.${format}`;

        canvas.toBlob(async (blob) => {
          try {
            if (!blob) throw new Error('Blob creation failed');

            // Median/GoNative bridge support
            const median = (window as any).median || (window as any).gonative;
            if (median) {
              const reader = new FileReader();
              reader.onloadend = () => {
                try {
                  const base64data = reader.result as string;
                  // Try share.download first as requested by user
                  if (median.share && typeof median.share.download === 'function') {
                    median.share.download({ url: base64data, filename: fileName });
                  } else if (median.download && typeof median.download.downloadFile === 'function') {
                    median.download.downloadFile({ url: base64data, filename: fileName });
                  } else if (median.fileDownload && typeof median.fileDownload.download === 'function') {
                    median.fileDownload.download({ url: base64data, filename: fileName });
                  } else {
                    // Fallback if Median exists but common download methods don't
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = fileName;
                    document.body.appendChild(link);
                    link.click();
                    setTimeout(() => {
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    }, 100);
                  }
                } finally {
                  setIsGenerating(false);
                }
              };
              reader.onerror = () => {
                alert('Gagal membaca blob gambar.');
                setIsGenerating(false);
              };
              reader.readAsDataURL(blob);
            } else {
              // Standard Browser Download
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = fileName;
              document.body.appendChild(link);
              link.click();
              setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
              }, 100);
              
              setIsGenerating(false);
            }
          } catch (e: any) {
            console.error(e);
            alert('Gagal memproses gambar: ' + e.message);
            setIsGenerating(false);
          }
        }, type, 1.0);

      } catch (error) {
        console.error('Image Generation Error:', error);
        alert('Gagal mengunduh gambar. Silakan coba lagi.');
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
      // Ensure images and fonts are loaded
      const images = element.getElementsByTagName('img');
      const fontPromise = (document as any).fonts ? (document as any).fonts.ready : Promise.resolve();
      
      await Promise.all([
        fontPromise,
        ...Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      ]);

      // Set high pixel ratio (4) consistently to get ultra-high-resolution images for WhatsApp sharing and printing without blurriness
      const pixelRatio = 4; 

      const dataUrl = await htmlToImage.toPng(element, {
        width: element.scrollWidth,
        height: element.scrollHeight,
        pixelRatio: pixelRatio,
        backgroundColor: '#ffffff',
        style: {
          transform: 'none',
          margin: '0',
          padding: '0',
          borderRadius: '0',
          boxShadow: 'none',
          width: `${element.scrollWidth}px`,
          height: `${element.scrollHeight}px`
        }
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [330, 215], // F4/Folio size
        compress: false // Disable compression to preserve the lossless ultra-high-resolution image perfectly
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Use full page dimensions since element is already A4 size (297x210mm)
      // Use 'NONE' compression to keep the high-resolution PNG image perfectly crisp and lossless
      const imgProps = pdf.getImageProperties(dataUrl);
      const imgRatio = imgProps.width / imgProps.height;
      const pdfRatio = pdfWidth / pdfHeight;
      
      let finalWidth = pdfWidth;
      let finalHeight = pdfHeight;
      
      if (imgRatio < pdfRatio) {
        // Image is taller proportionally -> scale to height
        finalWidth = pdfHeight * imgRatio;
        finalHeight = pdfHeight;
      } else {
        // Image is wider proportionally -> scale to width
        finalWidth = pdfWidth;
        finalHeight = pdfWidth / imgRatio;
      }
      
      const xOffset = (pdfWidth - finalWidth) / 2;
      const yOffset = 0;
      
      pdf.addImage(dataUrl, 'PNG', xOffset, yOffset, finalWidth, finalHeight, undefined, 'NONE');

      const fileName = `Rekap_${selectedMonth}_${(halaqohs.find(h => h.id === selectedHalaqoh)?.name || 'Halaqoh').replace(/[^a-z0-9]/gi, '_')}.pdf`;
      
      // Median/GoNative bridge support
      const median = (window as any).median || (window as any).gonative;
      if (median) {
        const base64PDF = pdf.output('datauristring');
        
        // Try share.download first as requested by user
        if (median.share && typeof median.share.download === 'function') {
          median.share.download({ url: base64PDF, filename: fileName });
        } else if (median.download && typeof median.download.downloadFile === 'function') {
          median.download.downloadFile({ url: base64PDF, filename: fileName });
        } else if (median.fileDownload && typeof median.fileDownload.download === 'function') {
          median.fileDownload.download({ url: base64PDF, filename: fileName });
        } else {
          // Fallback to standard PDF save if median exists but bridge methods missing
          pdf.save(fileName);
        }
      } else {
        // Standard Browser Download
        pdf.save(fileName);
      }
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

  const maxActiveDays = recapData.length > 0 ? Math.max(...recapData.map(s => s.activeDays.size)) : 0;
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
    <div className="space-y-6 md:space-y-10 font-sans">
      <AnimatePresence>
        {editingStudent && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingStudent(null)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-1">Input Data Rekap</p>
                    <h3 className="text-2xl font-display font-black text-stone-950">{editingStudent.name}</h3>
                  </div>
                  <button 
                    onClick={() => setEditingStudent(null)}
                    className="p-3 bg-stone-100 hover:bg-stone-200 rounded-2xl text-stone-400 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Context Data for Reference - Expanded for clarity */}
                  <div className="space-y-3 mb-2">
                    <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Referensi Hafalan Bulan Ini</p>
                        <span className="text-[10px] bg-white px-2 py-0.5 rounded-lg border border-indigo-100 font-bold text-indigo-600">Total: {editingStudent.hafalan.jml} Ayat</span>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="mt-1 p-2 bg-indigo-100/50 rounded-lg">
                            <Calendar size={14} className="text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-[9px] uppercase font-black text-stone-400 leading-tight mb-1">Ayat Awal</p>
                            <p className="text-base font-bold text-stone-900 leading-tight">{editingStudent.hafalan.awl || '-'}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="mt-1 p-2 bg-indigo-100/50 rounded-lg">
                            <FileText size={14} className="text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-[9px] uppercase font-black text-stone-400 leading-tight mb-1">Ayat Akhir</p>
                            <p className="text-base font-bold text-stone-900 leading-tight">{editingStudent.hafalan.akh || '-'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="group">
                      <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1 mb-2">Total Hafalan (Akumulasi)</label>
                      <div className="relative">
                        <input 
                          type="text"
                          autoFocus
                          className={cn(
                            "w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 text-base font-bold focus:outline-none focus:ring-4 transition-all placeholder:text-stone-300",
                            theme.ring
                          )}
                          placeholder="Masukkan total hafalan..."
                          value={recapSettings[editingStudent.id]?.total_hafalan !== undefined && recapSettings[editingStudent.id]?.total_hafalan !== '' ? recapSettings[editingStudent.id].total_hafalan : parseAndCalculateTotalHafalan(editingStudent.hafalan.akh)}
                          onChange={(e) => updateSettings(editingStudent.id, 'total_hafalan', e.target.value)}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300">
                           <Save size={18} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="group">
                      <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1 mb-2">Catatan Perkembangan Guru</label>
                      <textarea 
                        className={cn(
                          "w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-4 transition-all min-h-[120px] placeholder:text-stone-300",
                          theme.ring
                        )}
                        placeholder="Tuliskan catatan kemajuan siswa bulan ini..."
                        value={recapSettings[editingStudent.id]?.notes || ''}
                        onChange={(e) => updateSettings(editingStudent.id, 'notes', e.target.value)}
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => setEditingStudent(null)}
                    className={cn(
                      "w-full py-5 rounded-2xl text-white font-display font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-[0.98] hover:translate-y-[-1px]",
                      theme.bg, theme.shadow
                    )}
                  >
                    Simpan & Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-white p-5 sm:p-10 rounded-[2rem] sm:rounded-[3.5rem] border border-stone-200/50 shadow-2xl shadow-stone-900/5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-display font-black text-stone-950 tracking-tight leading-none">Rekapitulasi Bulanan</h1>
            <p className="text-sm sm:text-base text-stone-500 font-medium">Monitoring progress bulanan dan akumulasi data otomatis.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full lg:w-auto">
            <button 
              onClick={generatePDF}
              disabled={!selectedHalaqoh || recapData.length === 0 || isGenerating}
              className={cn(
                "w-full sm:w-auto text-white px-8 py-4 rounded-xl sm:rounded-2xl font-display font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50 hover:translate-y-[-2px] active:translate-y-[1px]",
                theme.bg, theme.shadow
              )}
            >
              <Download size={18} />
              {isGenerating ? 'Wait...' : 'EXPOR PDF'}
            </button>
            <button 
              onClick={() => generateImage('jpg')}
              disabled={!selectedHalaqoh || recapData.length === 0 || isGenerating}
              className="w-full sm:w-auto bg-stone-950 text-white px-8 py-4 rounded-xl sm:rounded-2xl font-display font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-stone-800 transition-all flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50 hover:translate-y-[-2px] active:translate-y-[1px]"
            >
              <FileText size={18} />
              {isGenerating ? 'Wait...' : 'EXPOR JPG'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-8 sm:mb-12">
          <div className="space-y-2 sm:space-y-3">
            <label className="text-[9px] sm:text-[10px] font-display font-black text-stone-400 uppercase tracking-[0.25em] ml-2 font-black">Pilih Halaqoh</label>
            <div className="relative group">
               <select 
                className={cn("w-full bg-stone-50 border border-stone-200/60 rounded-xl sm:rounded-2xl py-3.5 sm:py-4 px-6 focus:outline-none focus:ring-4 transition-all appearance-none font-bold text-stone-900 cursor-pointer text-sm", theme.ring)}
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
          <div className="space-y-2 sm:space-y-3">
            <label className="text-[9px] sm:text-[10px] font-display font-black text-stone-400 uppercase tracking-[0.25em] ml-2 font-black">Periode Bulan</label>
            <div className="relative group">
              <input 
                type="month"
                className={cn("w-full bg-stone-50 border border-stone-200/60 rounded-xl sm:rounded-2xl py-3.5 sm:py-4 px-6 focus:outline-none focus:ring-4 transition-all font-bold text-stone-900 text-sm", theme.ring)}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-stone-300">
                <Calendar size={18} />
              </div>
            </div>
          </div>
          <div className="flex items-end gap-3 pb-1 md:col-span-2 lg:col-span-2">
            <button 
              onClick={() => setShowTilawah(!showTilawah)}
              className={cn(
                "flex-1 py-4 px-4 rounded-2xl border-2 font-display font-bold text-[10px] uppercase tracking-widest transition-all transition-all",
                showTilawah ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-stone-50 border-stone-200 text-stone-400"
              )}
            >
              {showTilawah ? '✓ Tilawah Aktif' : 'Tilawah Off'}
            </button>
            <button 
              onClick={() => setShowUmmi(!showUmmi)}
              className={cn(
                "flex-1 py-4 px-4 rounded-2xl border-2 font-display font-bold text-[10px] uppercase tracking-widest transition-all",
                showUmmi ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-stone-50 border-stone-200 text-stone-400"
              )}
            >
              {showUmmi ? '✓ Ummi Aktif' : 'Ummi Off'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="w-16 h-16 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin mx-auto mb-6" />
            <p className="text-stone-400 font-display font-black text-xs uppercase tracking-widest">Sychronizing data...</p>
          </div>
        ) : recapData.length > 0 ? (
          <div className="space-y-12">
            <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:mx-0 border border-stone-200/60 lg:rounded-[2rem] shadow-sm custom-scrollbar relative">
              <table className="w-full min-w-[1000px] text-[11px] text-left border-separate border-spacing-0">
                <thead className="bg-stone-50/50 text-stone-400 font-display font-black text-[9px] uppercase tracking-[0.2em] sticky top-0 z-30">
                  <tr className="border-b border-stone-200/60">
                    <th rowSpan={2} className="px-2 py-5 border-r border-b border-stone-200/60 text-center sticky left-0 z-40 bg-stone-50/80 backdrop-blur-md w-12 min-w-[48px] max-w-[48px]">No</th>
                    <th rowSpan={2} className="px-4 py-5 border-r border-b border-stone-200/60 text-center sticky left-12 md:left-12 z-40 bg-stone-50/80 backdrop-blur-md min-w-[140px] md:min-w-[180px] shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)] border-l">Nama Siswa</th>
                    {hasHafalan && <th colSpan={3} className="px-4 py-3 border-r border-b border-stone-200/60 text-center bg-indigo-50/30 text-indigo-900/40">Hafalan Al-Qur'an</th>}
                    {hasTilawah && showTilawah && <th colSpan={3} className="px-4 py-3 border-r border-b border-stone-200/60 text-center bg-blue-50/30 text-blue-900/40">Tilawah Al-Qur'an</th>}
                    {hasUmmi && showUmmi && <th colSpan={3} className="px-4 py-3 border-r border-b border-stone-200/60 text-center bg-emerald-50/30 text-emerald-900/40">Metode Ummi</th>}
                    <th rowSpan={2} className="px-4 py-5 border-r border-b border-stone-200/60 text-center">Aktif Siswa / Bulan</th>
                    <th rowSpan={2} className="px-5 py-5 border-b border-stone-200/60 text-center md:sticky right-[180px] z-40 bg-stone-50/80 backdrop-blur-md border-l">Total</th>
                    <th rowSpan={2} className="px-6 py-5 border-b border-stone-200/60 text-center md:sticky right-0 z-40 bg-stone-50/80 backdrop-blur-md min-w-[180px] border-l">Catatan Guru</th>
                  </tr>
                  <tr className="border-b border-stone-200/60">
                    {hasHafalan && (
                      <>
                        <th className="px-3 py-3 border-r border-b border-stone-200/60 text-center font-normal">AWL</th>
                        <th className="px-3 py-3 border-r border-b border-stone-200/60 text-center font-normal">AKH</th>
                        <th className="px-3 py-3 border-r border-b border-stone-200/60 text-center text-indigo-600">JML</th>
                      </>
                    )}
                    {hasTilawah && showTilawah && (
                      <>
                        <th className="px-3 py-3 border-r border-b border-stone-200/60 text-center font-normal">AWL</th>
                        <th className="px-3 py-3 border-r border-b border-stone-200/60 text-center font-normal">AKH</th>
                        <th className="px-3 py-3 border-r border-b border-stone-200/60 text-center text-blue-600">JML</th>
                      </>
                    )}
                    {hasUmmi && showUmmi && (
                      <>
                        <th className="px-3 py-3 border-r border-b border-stone-200/60 text-center font-normal">AWL</th>
                        <th className="px-3 py-3 border-r border-b border-stone-200/60 text-center font-normal">AKH</th>
                        <th className="px-3 py-3 border-r border-b border-stone-200/60 text-center text-emerald-600">JML</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium text-stone-600">
                  {recapData.map((s, idx) => (
                    <tr 
                      key={`${s.id}-${idx}`} 
                      className="hover:bg-stone-50/5 transition-colors group cursor-pointer"
                      onClick={() => setEditingStudent(s)}
                    >
                      <td className="px-2 py-4 border-r border-stone-100/60 text-center text-stone-400 font-display font-black sticky left-0 z-20 bg-white group-hover:bg-stone-50 transition-colors w-12 min-w-[48px] max-w-[48px]">{idx + 1}</td>
                      <td className="px-6 py-4 border-r border-stone-100/60 font-bold text-stone-900 sticky left-12 md:left-12 z-20 bg-white group-hover:bg-stone-50 transition-colors whitespace-nowrap overflow-hidden text-ellipsis shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)] border-l">
                        <div className="flex items-center justify-between gap-4 max-w-[120px] md:max-w-none">
                           <span className="truncate">{s.name}</span>
                           <ChevronRight size={14} className="text-stone-300 md:hidden" />
                        </div>
                      </td>
                      {hasHafalan && (
                        <>
                          <td className="px-3 py-4 border-r border-stone-100/60 text-center tabular-nums text-[10px] sm:text-[11px] whitespace-nowrap min-w-[80px]">{s.hafalan.awl}</td>
                          <td className="px-3 py-4 border-r border-stone-100/60 text-center tabular-nums text-[10px] sm:text-[11px] whitespace-nowrap min-w-[80px]">{s.hafalan.akh}</td>
                          <td className="px-2 py-4 border-r border-stone-100/60 text-center font-black text-indigo-600 tabular-nums bg-indigo-50/10">{s.hafalan.jml}</td>
                        </>
                      )}
                      {hasTilawah && showTilawah && (
                        <>
                          <td className="px-3 py-4 border-r border-stone-100/60 text-center tabular-nums text-[10px] sm:text-[11px] whitespace-nowrap min-w-[80px]">{s.tilawah.awl}</td>
                          <td className="px-3 py-4 border-r border-stone-100/60 text-center tabular-nums text-[10px] sm:text-[11px] whitespace-nowrap min-w-[80px]">{s.tilawah.akh}</td>
                          <td className="px-2 py-4 border-r border-stone-100/60 text-center font-black text-blue-600 tabular-nums bg-blue-50/10">{s.tilawah.jml}</td>
                        </>
                      )}
                      {hasUmmi && showUmmi && (
                        <>
                          <td className="px-3 py-4 border-r border-stone-100/60 text-center tabular-nums text-[10px] sm:text-[11px] whitespace-nowrap min-w-[80px]">{s.ummi.awl}</td>
                          <td className="px-3 py-4 border-r border-stone-100/60 text-center tabular-nums text-[10px] sm:text-[11px] whitespace-nowrap min-w-[80px]">{s.ummi.akh}</td>
                          <td className="px-2 py-4 border-r border-stone-100/60 text-center font-black text-emerald-600 tabular-nums bg-emerald-50/10">{s.ummi.jml}</td>
                        </>
                      )}
                      <td className={cn("px-4 py-4 border-r border-stone-100/60 text-center font-black tabular-nums whitespace-nowrap", theme.text)}>
                        {s.activeDays.size} / {maxActiveDays}
                      </td>
                      <td className="px-4 py-4 border-stone-100/60 min-w-[180px] md:sticky right-[180px] z-20 bg-white/95 backdrop-blur-sm shadow-[-4px_0_10px_-4px_rgba(0,0,0,0.05)] transition-colors group-hover:bg-stone-50 border-x">
                        <div className="hidden md:block">
                          <input 
                            type="text"
                            placeholder="Isi total..."
                            className="w-full bg-stone-50/50 border border-stone-200/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 ring-stone-900/5 transition-all text-center font-bold text-stone-900 placeholder:text-stone-300"
                            value={recapSettings[s.id]?.total_hafalan !== undefined && recapSettings[s.id]?.total_hafalan !== '' ? recapSettings[s.id].total_hafalan : parseAndCalculateTotalHafalan(s.hafalan.akh)}
                            onChange={(e) => updateSettings(s.id, 'total_hafalan', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className="md:hidden flex flex-col items-center gap-1">
                          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100 truncate max-w-full">
                            {recapSettings[s.id]?.total_hafalan !== undefined && recapSettings[s.id]?.total_hafalan !== '' ? recapSettings[s.id].total_hafalan : (parseAndCalculateTotalHafalan(s.hafalan.akh) || 'Total...')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 min-w-[180px] md:sticky right-0 z-20 bg-white/95 backdrop-blur-sm transition-colors group-hover:bg-stone-50">
                        <div className="hidden md:block text-right">
                          <input 
                            type="text"
                            placeholder="Catatan..."
                            className="w-full bg-stone-50/50 border border-stone-200/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 ring-stone-900/5 transition-all font-medium text-stone-600 placeholder:text-stone-300"
                            value={recapSettings[s.id]?.notes || ''}
                            onChange={(e) => updateSettings(s.id, 'notes', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className="md:hidden">
                           <p className="text-[10px] text-stone-400 line-clamp-1 italic">
                             {recapSettings[s.id]?.notes || 'Catatan...'}
                           </p>
                        </div>
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
                <style dangerouslySetInnerHTML={{ __html: `
                  @media print {
                    @page { size: landscape; margin: 0; }
                    body { margin: 0; padding: 0; }
                    #recap-preview-container { margin: 0 auto !important; box-shadow: none !important; border: none !important; width: 330mm !important; }
                  }
                ` }} />
                <div id="recap-preview-container" className="mx-auto p-[15mm] pt-[15mm] pb-[15mm] relative bg-white flex flex-col items-center justify-start text-stone-950" style={{ width: '330mm', fontFamily: "'Outfit', 'Inter', sans-serif", color: '#000000', margin: '0 auto', boxSizing: 'border-box' }}>
                  {/* Watermark Logo */}
                  {institution?.watermark && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0.1, zIndex: 0 }}>
                      <img 
                        src={institution.watermark} 
                        alt="" 
                        crossOrigin="anonymous"
                        className="w-[140mm] h-[140mm] object-contain" 
                        style={{ backgroundColor: 'transparent' }}
                      />
                    </div>
                  )}

                  {/* Header matches image precisely */}
                  <div className="w-full relative z-10 mb-8 mt-4">
                    <div className="flex items-start justify-center relative">
                      {institution?.logo && (
                        <div className="absolute left-8 top-0">
                          <img 
                            src={institution.logo} 
                            alt="Logo" 
                            crossOrigin="anonymous" 
                            className="w-24 h-24 object-contain" 
                            style={{ backgroundColor: 'transparent' }}
                          />
                        </div>
                      )}
                      <div className="text-center pt-2 px-32">
                        <h1 className="text-3xl font-bold uppercase tracking-tight text-stone-950 leading-none pb-1">REKAPITULASI BULANAN TAHFIDZUL QUR'AN</h1>
                        <h2 className="text-2xl font-bold uppercase leading-tight text-stone-900">{institution?.name || 'SEKOLAH ISLAM MIFTAHUSSALAM'}</h2>
                      </div>
                    </div>
                    {/* Thick Horizontal Line */}
                    <div className="w-full h-1 bg-black mt-6" style={{ height: '3px' }}></div>
                  </div>

                  <div className="w-full grid grid-cols-2 text-sm mb-6 font-medium relative z-10 px-8">
                    <div className="space-y-2">
                      <p className="flex"><span className="w-24 inline-block">Bulan</span> <span>: {format(new Date(selectedMonth), 'MMMM yyyy', { locale: id })}</span></p>
                      <p className="flex"><span className="w-24 inline-block">Halaqoh</span> <span>: {halaqohs.find(h => h.id == selectedHalaqoh)?.name || '-'}</span></p>
                      <p className="flex font-bold"><span className="w-24 inline-block">Aktif Perbulan</span> <span>: {maxActiveDays} Hari</span></p>
                    </div>
                    <div className="text-right space-y-2">
                      <p>Pengampu: {institution?.halaqoh_teacher_name || '-'}</p>
                      <p>Tahun Ajaran: {institution?.academic_year || '2025/2026'}</p>
                    </div>
                  </div>

                  {/* Table with dynamic columns logic */}
                  <table className="w-full border-collapse border border-black text-[9px] leading-tight relative z-10 mb-auto" style={{ borderColor: '#000000', tableLayout: 'fixed' }}>
                    <colgroup>
                      <col style={{ width: '25px' }} />
                      <col style={{ width: '130px' }} />
                      {hasHafalan && (
                        <>
                          <col style={{ width: '75px' }} />
                          <col style={{ width: '75px' }} />
                          <col style={{ width: '30px' }} />
                        </>
                      )}
                      {hasTilawah && (
                        <>
                          <col style={{ width: '75px' }} />
                          <col style={{ width: '75px' }} />
                          <col style={{ width: '30px' }} />
                        </>
                      )}
                      {hasUmmi && (
                        <>
                          <col style={{ width: '75px' }} />
                          <col style={{ width: '75px' }} />
                          <col style={{ width: '30px' }} />
                        </>
                      )}
                      <col style={{ width: '45px' }} />
                      <col style={{ width: '100px' }} />
                      <col style={{ width: 'auto' }} />
                    </colgroup>
                    <thead>
                      <tr className="bg-white">
                        <th rowSpan={2} className="border border-black p-2 text-center font-bold" style={{ borderColor: '#000000' }}>NO</th>
                        <th rowSpan={2} className="border border-black p-2 text-center font-bold" style={{ borderColor: '#000000' }}>NAMA SISWA</th>
                        {hasHafalan && <th colSpan={3} className="border border-black p-1 text-center font-bold" style={{ borderColor: '#000000' }}>HAFALAN AL-QUR'AN</th>}
                        {hasTilawah && <th colSpan={3} className="border border-black p-1 text-center font-bold" style={{ borderColor: '#000000' }}>TILAWAH AL-QUR'AN</th>}
                        {hasUmmi && <th colSpan={3} className="border border-black p-1 text-center font-bold" style={{ borderColor: '#000000' }}>METODE UMMI</th>}
                        <th rowSpan={2} className="border border-black p-1 text-center font-bold" style={{ borderColor: '#000000' }}>HARI AKTIF SISWA / BULAN</th>
                        <th rowSpan={2} className="border border-black p-1 text-center font-bold" style={{ borderColor: '#000000' }}>TOTAL</th>
                        <th rowSpan={2} className="border border-black p-1 text-center font-bold" style={{ borderColor: '#000000' }}>CATATAN</th>
                      </tr>
                      <tr className="bg-white">
                        {hasHafalan && (
                          <>
                            <th className="border border-black px-1 py-1 text-center font-bold" style={{ borderColor: '#000000' }}>AWL</th>
                            <th className="border border-black px-1 py-1 text-center font-bold" style={{ borderColor: '#000000' }}>AKH</th>
                            <th className="border border-black px-1 py-1 text-center font-bold" style={{ borderColor: '#000000' }}>JML</th>
                          </>
                        )}
                        {hasTilawah && (
                          <>
                            <th className="border border-black px-1 py-1 text-center font-bold" style={{ borderColor: '#000000' }}>AWL</th>
                            <th className="border border-black px-1 py-1 text-center font-bold" style={{ borderColor: '#000000' }}>AKH</th>
                            <th className="border border-black px-1 py-1 text-center font-bold" style={{ borderColor: '#000000' }}>JML</th>
                          </>
                        )}
                        {hasUmmi && (
                          <>
                            <th className="border border-black px-1 py-1 text-center font-bold" style={{ borderColor: '#000000' }}>AWL</th>
                            <th className="border border-black px-1 py-1 text-center font-bold" style={{ borderColor: '#000000' }}>AKH</th>
                            <th className="border border-black px-1 py-1 text-center font-bold" style={{ borderColor: '#000000' }}>JML</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {recapData.map((s, i) => (
                        <tr key={`${s.id}-${i}`} className="text-stone-900 h-[40px]">
                          <td className="border border-black p-1 text-center" style={{ borderColor: '#000000' }}>{i + 1}</td>
                          <td className="border border-black p-1 font-bold pl-3 truncate" style={{ borderColor: '#000000' }}>{s.name}</td>
                          {hasHafalan && (
                            <>
                              <td className="border border-black p-1 text-center text-[8px]" style={{ borderColor: '#000000' }}>{s.hafalan.awl}</td>
                              <td className="border border-black p-1 text-center text-[8px]" style={{ borderColor: '#000000' }}>{s.hafalan.akh}</td>
                              <td className="border border-black p-1 text-center font-bold" style={{ borderColor: '#000000' }}>{s.hafalan.jml}</td>
                            </>
                          )}
                          {hasTilawah && (
                            <>
                              <td className="border border-black p-1 text-center text-[8px]" style={{ borderColor: '#000000' }}>{s.tilawah.awl}</td>
                              <td className="border border-black p-1 text-center text-[8px]" style={{ borderColor: '#000000' }}>{s.tilawah.akh}</td>
                              <td className="border border-black p-1 text-center font-bold" style={{ borderColor: '#000000' }}>{s.tilawah.jml}</td>
                            </>
                          )}
                          {hasUmmi && (
                            <>
                              <td className="border border-black p-1 text-center text-[8px]" style={{ borderColor: '#000000' }}>{s.ummi.awl}</td>
                              <td className="border border-black p-1 text-center text-[8px]" style={{ borderColor: '#000000' }}>{s.ummi.akh}</td>
                              <td className="border border-black p-1 text-center font-bold" style={{ borderColor: '#000000' }}>{s.ummi.jml}</td>
                            </>
                          )}
                          <td className="border border-black p-1 text-center font-bold" style={{ borderColor: '#000000' }}>{s.activeDays.size} / {maxActiveDays}</td>
                          <td className="border border-black p-1 text-center font-bold" style={{ borderColor: '#000000' }}>{recapSettings[s.id]?.total_hafalan !== undefined && recapSettings[s.id]?.total_hafalan !== '' ? recapSettings[s.id].total_hafalan : (parseAndCalculateTotalHafalan(s.hafalan.akh) || '-')}</td>
                          <td className="border border-black p-1 px-2 italic text-[9px] leading-tight" style={{ borderColor: '#000000' }}>{recapSettings[s.id]?.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="w-full grid grid-cols-2 text-sm text-center mt-12 px-20 relative z-10 pb-8">
                    <div className="flex flex-col items-center">
                      <p className="mb-0">Mengetahui,</p>
                      <p className="mb-4">Kepala Sekolah</p>
                      <div className="relative flex items-center justify-center h-[100px] w-full mb-2">
                        {institution?.principal_signature && (
                          <img 
                            src={institution.principal_signature} 
                            alt="Principal Signature" 
                            crossOrigin="anonymous"
                            className="object-contain" 
                            style={{ height: `${principalSigSize}px`, width: 'auto' }} 
                          />
                        )}
                      </div>
                      <p className="font-bold underline decoration-1 underline-offset-4">{institution?.principal_name || 'Cikun S.Pd'}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="invisible mb-0">.</p>
                      <p className="mb-4">Koordinator Tahfidz,</p>
                      <div className="relative flex items-center justify-center h-[100px] w-full mb-2">
                        {institution?.coordinator_signature && (
                          <img 
                            src={institution.coordinator_signature} 
                            alt="Coordinator Signature" 
                            crossOrigin="anonymous"
                            className="object-contain" 
                            style={{ height: `${coordinatorSigSize}px`, width: 'auto' }} 
                          />
                        )}
                      </div>
                      <p className="font-bold underline decoration-1 underline-offset-4">{institution?.coordinator_name || 'Abdul Rohman'}</p>
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
