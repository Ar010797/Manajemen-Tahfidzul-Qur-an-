import React, { useState, useEffect } from 'react';
import { Download, Search, Calendar, FileText, Save, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
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
    const institution = storage.getInstitution();
    setThemeColor(institution.theme_color || 'emerald');
  }, []);

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
          tilawah: { awl: '-', akh: '-', jml: 0 }
        };
      }
      const details = curr.details || {};
      const target = acc[curr.student_id][curr.type];
      
      // CRITICAL: Exclude BL and C from ALL calculations as requested
      const grade = details.grade || '';
      const isExcluded = grade === 'BL' || grade === 'C';
      
      if (curr.type === 'hafalan') {
        const surah = details.surah || '';
        const startStr = details.verse_start || '';
        const endStr = details.verse_end || '';
        const label = `${surah} ${startStr}${endStr && endStr !== startStr ? `-${endStr}` : ''}`.trim() || '-';
        
        if (target.awl === '-') target.awl = label;
        target.akh = label;
        
        if (!isExcluded) {
          const start = parseInt(startStr) || 0;
          const end = parseInt(endStr) || 0;
          if (start > 0) {
            target.jml += (end >= start) ? (end - start + 1) : 1;
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
          const start = parseInt(startStr) || 0;
          const end = parseInt(endStr) || 0;
          if (start > 0) {
            target.jml += (end >= start) ? (end - start + 1) : 1;
          } else if (level) {
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
          const start = parseInt(startStr) || 0;
          const end = parseInt(endStr) || 0;
          if (start > 0) {
            target.jml += (end >= start) ? (end - start + 1) : 1;
          } else if (surah) {
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

        const canvas = await html2canvas(element, {
          scale: 4, // Ultra-high resolution
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          imageTimeout: 0,
          onclone: (clonedDoc) => {
            const clonedElement = clonedDoc.getElementById('recap-preview-container');
            if (clonedElement) {
              clonedElement.style.width = '297mm';
              clonedElement.style.height = 'auto';
              clonedElement.style.minHeight = '210mm';
              clonedElement.style.transform = 'none';
              clonedElement.style.margin = '0';
              clonedElement.style.boxShadow = 'none';
              clonedElement.style.backgroundColor = '#ffffff';
              clonedElement.style.color = '#000000';
              clonedElement.style.fontFamily = "'Times New Roman', Times, serif";
            }

            // Workaround for oklab/oklch colors and table rendering issues
            const allElements = clonedDoc.getElementsByTagName('*');
            for (let i = 0; i < allElements.length; i++) {
              const el = allElements[i] as HTMLElement;
              if (el.style) {
                const computed = window.getComputedStyle(el);
                
                // Catch-all for any oklch/oklab colors
                if (computed.color.includes('okl')) el.style.color = '#000000';
                if (computed.backgroundColor.includes('okl')) el.style.backgroundColor = '#ffffff';
                if (computed.borderColor.includes('okl')) el.style.borderColor = '#000000';

                if (el.tagName === 'TH' || el.tagName === 'TD') {
                  el.style.borderColor = '#000000';
                  el.style.color = '#000000';
                  el.style.opacity = '1';
                  el.style.visibility = 'visible';
                  el.style.verticalAlign = 'middle';
                  el.style.lineHeight = '1.2';
                  el.style.boxSizing = 'border-box';
                  el.style.overflow = 'visible';
                  el.style.wordBreak = 'break-word';
                  el.style.position = 'relative';
                  el.style.zIndex = '1';
                }

                if (el.tagName === 'TH') {
                  el.style.fontWeight = 'bold';
                  el.style.backgroundColor = '#f8fafc';
                  el.style.zIndex = '10';
                }

                // Specific overrides for better accuracy
                if (el.classList.contains('text-emerald-600')) el.style.color = '#059669';
                if (el.classList.contains('bg-emerald-50')) el.style.backgroundColor = '#ecfdf5';
                if (el.classList.contains('border-emerald-200')) el.style.borderColor = '#a7f3d0';
                if (el.classList.contains('bg-stone-50')) el.style.backgroundColor = '#fafaf9';
                if (el.classList.contains('bg-stone-100')) el.style.backgroundColor = '#f5f5f4';
                if (el.classList.contains('text-stone-900')) el.style.color = '#000000';
                if (el.classList.contains('text-stone-500')) el.style.color = '#78716c';
                if (el.classList.contains('text-stone-400')) el.style.color = '#a8a29e';
                if (el.classList.contains('border-stone-200')) el.style.borderColor = '#e7e5e4';
                if (el.classList.contains('border-stone-100')) el.style.borderColor = '#f5f5f4';
                if (el.classList.contains('border-black')) el.style.borderColor = '#000000';
              }
            }
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

      const canvas = await html2canvas(element, {
        scale: 4, // Ultra-high resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('recap-preview-container');
          if (clonedElement) {
            clonedElement.style.width = '297mm';
            clonedElement.style.height = 'auto';
            clonedElement.style.minHeight = '210mm';
            clonedElement.style.transform = 'none';
            clonedElement.style.margin = '0';
            clonedElement.style.boxShadow = 'none';
            clonedElement.style.backgroundColor = '#ffffff';
            clonedElement.style.color = '#000000';
          }

          const allElements = clonedDoc.getElementsByTagName('*');
          for (let i = 0; i < allElements.length; i++) {
            const el = allElements[i] as HTMLElement;
            if (el.style) {
              const computed = window.getComputedStyle(el);
              if (computed.color.includes('okl')) el.style.color = '#000000';
              if (computed.backgroundColor.includes('okl')) el.style.backgroundColor = '#ffffff';
              if (computed.borderColor.includes('okl')) el.style.borderColor = '#000000';

              if (el.tagName === 'TH' || el.tagName === 'TD') {
                el.style.borderColor = '#000000';
                el.style.color = '#000000';
                el.style.opacity = '1';
                el.style.visibility = 'visible';
                el.style.verticalAlign = 'middle';
                el.style.lineHeight = '1.2';
                el.style.boxSizing = 'border-box';
                el.style.overflow = 'visible';
                el.style.wordBreak = 'break-word';
                el.style.position = 'relative';
                el.style.zIndex = '1';
              }

              if (el.tagName === 'TH') {
                el.style.fontWeight = 'bold';
                el.style.backgroundColor = '#f8fafc';
                el.style.zIndex = '10';
              }

              if (el.classList.contains('text-emerald-600')) el.style.color = '#059669';
              if (el.classList.contains('bg-emerald-50')) el.style.backgroundColor = '#ecfdf5';
              if (el.classList.contains('border-emerald-200')) el.style.borderColor = '#a7f3d0';
              if (el.classList.contains('bg-stone-50')) el.style.backgroundColor = '#fafaf9';
              if (el.classList.contains('bg-stone-100')) el.style.backgroundColor = '#f5f5f4';
              if (el.classList.contains('text-stone-900')) el.style.color = '#000000';
              if (el.classList.contains('text-stone-500')) el.style.color = '#78716c';
              if (el.classList.contains('text-stone-400')) el.style.color = '#a8a29e';
              if (el.classList.contains('border-stone-200')) el.style.borderColor = '#e7e5e4';
              if (el.classList.contains('border-stone-100')) el.style.borderColor = '#f5f5f4';
              if (el.classList.contains('border-black')) el.style.borderColor = '#000000';
            }
          }
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
    <div className="space-y-8">
      <div className="bg-white p-4 sm:p-8 rounded-3xl border border-stone-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">Rekapitulasi Bulanan</h2>
            <p className="text-stone-500 text-sm">Akumulasi otomatis dengan kolom catatan kustom</p>
          </div>
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <button 
              onClick={generatePDF}
              disabled={!selectedHalaqoh || recapData.length === 0 || isGenerating}
              className={cn(
                "flex-1 lg:flex-none text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50",
                theme.bg, "hover:opacity-90", theme.shadow.replace('10', '20')
              )}
              title="Unduh PDF Kualitas Tinggi (HDR)"
            >
              <Download size={20} />
              {isGenerating ? '...' : 'PDF HDR'}
            </button>
            <button 
              onClick={() => generateImage('jpg')}
              disabled={!selectedHalaqoh || recapData.length === 0 || isGenerating}
              className="flex-1 lg:flex-none bg-amber-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
              title="Unduh Gambar Kualitas Tinggi (HDR)"
            >
              <FileText size={20} />
              {isGenerating ? '...' : 'JPG HDR'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Pilih Halaqoh</label>
            <select 
              className={cn("w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2", theme.ring)}
              value={selectedHalaqoh}
              onChange={(e) => setSelectedHalaqoh(e.target.value)}
            >
              <option value="">-- Pilih Halaqoh --</option>
              {halaqohs.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Pilih Bulan</label>
            <input 
              type="month"
              className={cn("w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2", theme.ring)}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-stone-400">Memuat data...</div>
        ) : recapData.length > 0 ? (
          <div className="space-y-8">
            <div className="overflow-x-auto border border-stone-200 rounded-2xl">
              <table className="w-full text-[11px] text-left border-collapse">
                <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider">
                  <tr className="border-b border-stone-200">
                    <th rowSpan={2} className="px-4 py-3 border-r border-stone-200 text-center">No</th>
                    <th rowSpan={2} className="px-4 py-3 border-r border-stone-200">Nama</th>
                    {hasHafalan && <th colSpan={3} className="px-4 py-2 border-r border-stone-200 text-center">Hafalan</th>}
                    {hasTilawah && <th colSpan={3} className="px-4 py-2 border-r border-stone-200 text-center">Tilawah Al-Qur'an</th>}
                    {hasUmmi && <th colSpan={3} className="px-4 py-2 border-r border-stone-200 text-center">Ummi</th>}
                    <th rowSpan={2} className="px-4 py-3 border-r border-stone-200 text-center">Hari Aktif</th>
                    <th rowSpan={2} className="px-4 py-3 border-r border-stone-200 text-center">Total Hafalan</th>
                    <th rowSpan={2} className="px-4 py-3 text-center">Catatan Bulanan</th>
                  </tr>
                  <tr className="border-b border-stone-200">
                    {hasHafalan && (
                      <>
                        <th className="px-2 py-2 border-r border-stone-200 text-center">Awl</th>
                        <th className="px-2 py-2 border-r border-stone-200 text-center">Akh</th>
                        <th className="px-2 py-2 border-r border-stone-200 text-center">Jml</th>
                      </>
                    )}
                    {hasTilawah && (
                      <>
                        <th className="px-2 py-2 border-r border-stone-200 text-center">Awl</th>
                        <th className="px-2 py-2 border-r border-stone-200 text-center">Akh</th>
                        <th className="px-2 py-2 border-r border-stone-200 text-center">Jml</th>
                      </>
                    )}
                    {hasUmmi && (
                      <>
                        <th className="px-2 py-2 border-r border-stone-200 text-center">Awl</th>
                        <th className="px-2 py-2 border-r border-stone-200 text-center">Akh</th>
                        <th className="px-2 py-2 border-r border-stone-200 text-center">Jml</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {recapData.map((s, idx) => (
                    <tr key={s.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-4 py-3 border-r border-stone-100 text-center">{idx + 1}</td>
                      <td className="px-4 py-3 border-r border-stone-100 font-bold text-stone-800">{s.name}</td>
                      {hasHafalan && (
                        <>
                          <td className="px-2 py-3 border-r border-stone-100 text-center">{s.hafalan.awl}</td>
                          <td className="px-2 py-3 border-r border-stone-100 text-center">{s.hafalan.akh}</td>
                          <td className="px-2 py-3 border-r border-stone-100 text-center font-bold">{s.hafalan.jml}</td>
                        </>
                      )}
                      {hasTilawah && (
                        <>
                          <td className="px-2 py-3 border-r border-stone-100 text-center">{s.tilawah.awl}</td>
                          <td className="px-2 py-3 border-r border-stone-100 text-center">{s.tilawah.akh}</td>
                          <td className="px-2 py-3 border-r border-stone-100 text-center font-bold">{s.tilawah.jml}</td>
                        </>
                      )}
                      {hasUmmi && (
                        <>
                          <td className="px-2 py-3 border-r border-stone-100 text-center">{s.ummi.awl}</td>
                          <td className="px-2 py-3 border-r border-stone-100 text-center">{s.ummi.akh}</td>
                          <td className="px-2 py-3 border-r border-stone-100 text-center font-bold">{s.ummi.jml}</td>
                        </>
                      )}
                      <td className={cn("px-4 py-3 border-r border-stone-100 text-center font-bold", theme.text)}>{activeDaysCount}</td>
                      <td className="px-4 py-3 border-r border-stone-100">
                        <input 
                          type="text"
                          className="w-full bg-white border border-stone-200 rounded px-2 py-1 text-[10px]"
                          value={recapSettings[s.id]?.total_hafalan || ''}
                          onChange={(e) => updateSettings(s.id, 'total_hafalan', e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input 
                          type="text"
                          className="w-full bg-white border border-stone-200 rounded px-2 py-1 text-[10px]"
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
            <div className="mt-12 border-t pt-12">
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6 text-center">Pratinjau Hasil Ekspor</h3>
              
              {/* Signature Size Controls (Outside Capture Area) */}
              <div className="max-w-[297mm] mx-auto mb-6 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <Settings size={18} className="text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Pengaturan Ukuran Tanda Tangan</h4>
                    <p className="text-[10px] text-stone-500">Sesuaikan ukuran gambar ttd sebelum diunduh</p>
                  </div>
                </div>
                
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                  <div>
                    <div className="flex justify-between text-[10px] mb-2">
                      <span className="text-stone-500 font-medium">Kepala Sekolah</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setPrincipalSigSize(Math.max(40, principalSigSize - 10))} className="p-1 hover:bg-stone-100 rounded text-stone-400 hover:text-emerald-600 transition-colors">
                          <Search size={12} className="scale-[-1]" />
                        </button>
                        <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded min-w-[40px] text-center">{principalSigSize}px</span>
                        <button onClick={() => setPrincipalSigSize(Math.min(300, principalSigSize + 10))} className="p-1 hover:bg-stone-100 rounded text-stone-400 hover:text-emerald-600 transition-colors">
                          <Search size={12} />
                        </button>
                      </div>
                    </div>
                    <input 
                      type="range" 
                      min="40" 
                      max="300" 
                      value={principalSigSize} 
                      onChange={e => setPrincipalSigSize(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] mb-2">
                      <span className="text-stone-500 font-medium">Koordinator Tahfidz</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setCoordinatorSigSize(Math.max(40, coordinatorSigSize - 10))} className="p-1 hover:bg-stone-100 rounded text-stone-400 hover:text-emerald-600 transition-colors">
                          <Search size={12} className="scale-[-1]" />
                        </button>
                        <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded min-w-[40px] text-center">{coordinatorSigSize}px</span>
                        <button onClick={() => setCoordinatorSigSize(Math.min(300, coordinatorSigSize + 10))} className="p-1 hover:bg-stone-100 rounded text-stone-400 hover:text-emerald-600 transition-colors">
                          <Search size={12} />
                        </button>
                      </div>
                    </div>
                    <input 
                      type="range" 
                      min="40" 
                      max="300" 
                      value={coordinatorSigSize} 
                      onChange={e => setCoordinatorSigSize(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto p-4 bg-stone-100 rounded-3xl shadow-inner">
                <div id="recap-preview-container" className="bg-white shadow-2xl mx-auto p-[15mm] relative overflow-hidden" style={{ width: '297mm', minHeight: '210mm', fontFamily: "'Times New Roman', Times, serif", color: '#1c1917', backgroundColor: '#ffffff' }}>
                  {/* Watermark */}
                  {institution?.watermark && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0.04 }}>
                      <img src={institution.watermark} alt="" className="w-[120mm] h-[120mm] object-contain" />
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-center border-b-2 border-black pb-4 mb-8 relative" style={{ borderBottomColor: '#000000' }}>
                    {institution?.logo && (
                      <img src={institution.logo} alt="Logo" className="absolute left-0 top-0 w-24 h-24 object-contain" />
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
                            alt="" 
                            className="object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
                            style={{ height: `${principalSigSize}px`, maxWidth: 'none' }} 
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
                            alt="" 
                            className="object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
                            style={{ height: `${coordinatorSigSize}px`, maxWidth: 'none' }} 
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
