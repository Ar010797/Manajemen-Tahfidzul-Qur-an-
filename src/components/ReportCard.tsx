import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Printer, Search, Download, Eye, GraduationCap, ChevronLeft, Settings, Edit2, X, Save } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { cn } from '../lib/utils';
import { storage } from '../services/storage';

export default function ReportCard() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [semester, setSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');
  const [examData, setExamData] = useState<any>(null);
  const [institution, setInstitution] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [recapSettings, setRecapSettings] = useState<any>(null);
  const [showListOnMobile, setShowListOnMobile] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [principalSigSize, setPrincipalSigSize] = useState(80);
  const [coordinatorSigSize, setCoordinatorSigSize] = useState(80);
  const [editingExam, setEditingExam] = useState<{ type: 'ummi' | 'hafalan', data: any } | null>(null);

  useEffect(() => {
    const fetchData = () => {
      const sData = storage.getStudents();
      setStudents(sData);
      setInstitution(storage.getInstitution());
    };
    fetchData();
  }, [selectedStudent]);

  const groupedStudents = useMemo(() => {
    const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
    const groups: Record<string, any[]> = {};
    
    filtered.forEach(s => {
      const groupName = s.halaqoh_name || 'Tanpa Halaqoh';
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(s);
    });
    
    return Object.keys(groups)
      .sort((a, b) => {
        if (a === 'Tanpa Halaqoh') return 1;
        if (b === 'Tanpa Halaqoh') return -1;
        return a.localeCompare(b);
      })
      .reduce((acc, key) => {
        acc[key] = groups[key];
        return acc;
      }, {} as Record<string, any[]>);
  }, [students, search]);

  const fetchExamData = (student: any) => {
    const eData = storage.getStudentExams(student.id);
    const sData = storage.getRecapSettings(student.id, format(new Date(), 'yyyy-MM'));
    
    setExamData(eData);
    setRecapSettings(sData);
    setSelectedStudent(student);
    setShowListOnMobile(false);
  };

  const resetExam = (type: 'ummi' | 'hafalan', id: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus data ujian ${type} ini? Data yang sudah dihapus tidak dapat dikembalikan.`)) return;
    
    storage.deleteExam(type, id);
    alert('Data ujian berhasil dihapus.');
    if (selectedStudent) fetchExamData(selectedStudent);
  };

  const handleUpdateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExam) return;

    if (editingExam.type === 'ummi') {
      storage.updateUmmiExam(editingExam.data.id, editingExam.data);
    } else {
      storage.updateHafalanExam(editingExam.data.id, editingExam.data);
    }

    alert('Data ujian berhasil diperbarui.');
    setEditingExam(null);
    if (selectedStudent) fetchExamData(selectedStudent);
  };

  const teacherNotes = useMemo(() => {
    if (!examData?.hafalan) return '';
    const notes = examData.hafalan
      .filter((e: any) => e.semester === semester && e.note)
      .map((e: any) => e.note);
    return notes.length > 0 ? notes.join('; ') : '-';
  }, [examData, semester]);

  const generateImage = async (imgFormat: 'jpg' | 'png') => {
    if (!selectedStudent || !examData || isGenerating) return;

    const element = document.getElementById('report-card-preview');
    if (!element) {
      alert('Elemen rapor tidak ditemukan.');
      return;
    }

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

      // Small delay to ensure rendering is stable
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(element, {
        scale: 3, // High resolution (Retina quality)
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('report-card-preview');
          if (clonedElement) {
            clonedElement.style.width = '210mm';
            clonedElement.style.height = 'auto'; // Allow full height capture
            clonedElement.style.minHeight = '297mm';
            clonedElement.style.transform = 'none';
            clonedElement.style.margin = '0';
            clonedElement.style.boxShadow = 'none';
            clonedElement.style.backgroundColor = '#ffffff';
            clonedElement.style.color = '#000000';
          }
          
          // Workaround for oklab/oklch colors that html2canvas doesn't support
          const allElements = clonedDoc.getElementsByTagName('*');
          for (let i = 0; i < allElements.length; i++) {
            const el = allElements[i] as HTMLElement;
            if (el.style) {
              const computed = window.getComputedStyle(el);
              
              // Catch-all for any oklch/oklab colors
              if (computed.color.includes('okl')) el.style.color = '#1c1917';
              if (computed.backgroundColor.includes('okl')) el.style.backgroundColor = '#ffffff';
              if (computed.borderColor.includes('okl')) el.style.borderColor = '#e7e5e4';

              if (el.classList.contains('text-emerald-600')) el.style.color = '#059669';
              if (el.classList.contains('bg-emerald-50')) el.style.backgroundColor = '#ecfdf5';
              if (el.classList.contains('border-emerald-200')) el.style.borderColor = '#a7f3d0';
              if (el.classList.contains('bg-stone-50')) el.style.backgroundColor = '#fafaf9';
              if (el.classList.contains('bg-stone-100')) el.style.backgroundColor = '#f5f5f4';
              if (el.classList.contains('text-stone-900')) el.style.color = '#1c1917';
              if (el.classList.contains('text-stone-500')) el.style.color = '#78716c';
              if (el.classList.contains('text-stone-400')) el.style.color = '#a8a29e';
              if (el.classList.contains('border-stone-200')) el.style.borderColor = '#e7e5e4';
              if (el.classList.contains('border-stone-100')) el.style.borderColor = '#f5f5f4';
            }
          }
        }
      });
      
      canvas.toBlob((blob) => {
        if (!blob) {
          alert('Gagal membuat file gambar.');
          setIsGenerating(false);
          return;
        }
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const safeName = selectedStudent.name.replace(/[^a-z0-9]/gi, '_');
        link.download = `Rapor_${safeName}.${imgFormat}`;
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          setIsGenerating(false);
          alert('Unduhan gambar berhasil dimulai.');
        }, 100);
      }, imgFormat === 'jpg' ? 'image/jpeg' : 'image/png', 1.0); // Maximum quality

    } catch (error: any) {
      console.error('Image Generation Error:', error);
      alert('Gagal mengunduh gambar: ' + (error.message || 'Terjadi kesalahan teknis'));
      setIsGenerating(false);
    }
  };

  const generatePDF = async () => {
    if (!selectedStudent || !examData || isGenerating) return;

    const element = document.getElementById('report-card-preview');
    if (!element) {
      alert('Elemen rapor tidak ditemukan.');
      return;
    }

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

      // Small delay to ensure rendering is stable
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(element, {
        scale: 3, // High resolution
        useCORS: true,
        logging: false,
        imageTimeout: 0,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('report-card-preview');
          if (clonedElement) {
            clonedElement.style.width = '210mm';
            clonedElement.style.height = 'auto'; // Allow height to be dynamic for capture
            clonedElement.style.minHeight = '297mm';
            clonedElement.style.transform = 'none';
            clonedElement.style.margin = '0';
            clonedElement.style.boxShadow = 'none';
            clonedElement.style.backgroundColor = '#ffffff';
            clonedElement.style.color = '#000000';
          }

          // Workaround for oklab/oklch colors that html2canvas doesn't support
          const allElements = clonedDoc.getElementsByTagName('*');
          for (let i = 0; i < allElements.length; i++) {
            const el = allElements[i] as HTMLElement;
            if (el.style) {
              const computed = window.getComputedStyle(el);
              
              // Catch-all for any oklch/oklab colors
              if (computed.color.includes('okl')) el.style.color = '#1c1917';
              if (computed.backgroundColor.includes('okl')) el.style.backgroundColor = '#ffffff';
              if (computed.borderColor.includes('okl')) el.style.borderColor = '#e7e5e4';

              if (el.classList.contains('text-emerald-600')) el.style.color = '#059669';
              if (el.classList.contains('bg-emerald-50')) el.style.backgroundColor = '#ecfdf5';
              if (el.classList.contains('border-emerald-200')) el.style.borderColor = '#a7f3d0';
              if (el.classList.contains('bg-stone-50')) el.style.backgroundColor = '#fafaf9';
              if (el.classList.contains('bg-stone-100')) el.style.backgroundColor = '#f5f5f4';
              if (el.classList.contains('text-stone-900')) el.style.color = '#1c1917';
              if (el.classList.contains('text-stone-500')) el.style.color = '#78716c';
              if (el.classList.contains('text-stone-400')) el.style.color = '#a8a29e';
              if (el.classList.contains('border-stone-200')) el.style.borderColor = '#e7e5e4';
              if (el.classList.contains('border-stone-100')) el.style.borderColor = '#f5f5f4';
            }
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate scaling to fit the page
      const ratio = imgProps.width / imgProps.height;
      const width = pdfWidth;
      const height = pdfWidth / ratio;
      
      // If height is still more than page height, scale down further
      let finalWidth = width;
      let finalHeight = height;
      
      if (finalHeight > pdfHeight) {
        finalHeight = pdfHeight;
        finalWidth = pdfHeight * ratio;
      }
      
      // Center the image on the page
      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;
      
      pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
      const safeName = selectedStudent.name.replace(/[^a-z0-9]/gi, '_');
      
      const pdfBlob = pdf.output('blob');
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Rapor_${safeName}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        setIsGenerating(false);
        alert('Unduhan PDF berhasil dimulai.');
      }, 100);

    } catch (error: any) {
      console.error('PDF Generation Error:', error);
      alert('Gagal mengunduh rapor: ' + (error.message || 'Terjadi kesalahan teknis'));
      setIsGenerating(false);
    }
  };

  const renderUmmiTable = () => {
    const filteredUmmi = examData.ummi.filter((e: any) => e.semester === semester);
    const targetUmmi = filteredUmmi[0]?.target || `Ummi jilid ${filteredUmmi[0]?.level || '-'}`;
    
    return (
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-bold uppercase tracking-wide">TARGET TAJWID: {targetUmmi}</p>
        </div>
        <table className="w-full border-collapse border-2 border-black text-[10px]" style={{ borderColor: '#000000' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <th className="border border-black p-3 w-12 text-center align-middle" style={{ borderColor: '#000000' }}>Jilid</th>
              <th className="border border-black p-3 text-center align-middle" style={{ borderColor: '#000000' }}>Materi Tajwid</th>
              <th className="border border-black p-3 w-12 text-center align-middle" style={{ borderColor: '#000000' }}>Nilai</th>
            </tr>
          </thead>
          <tbody>
            {filteredUmmi.length > 0 ? filteredUmmi.map((exam: any) => {
              const scores = typeof exam.scores === 'string' ? JSON.parse(exam.scores) : exam.scores;
              return Object.entries(scores || {}).filter(([_, v]) => v).map(([k, v], i) => (
                <tr key={`${exam.id}-${i}`}>
                  <td className="border border-black p-3 text-center align-middle" style={{ borderColor: '#000000', color: '#000000' }}>{exam.level === 7 ? 'Tilawah' : exam.level}</td>
                  <td className="border border-black p-3 text-center align-middle" style={{ borderColor: '#000000', color: '#000000' }}>{k}</td>
                  <td className="border border-black p-3 text-center font-bold align-middle" style={{ borderColor: '#000000', color: '#000000' }}>{v as string}</td>
                </tr>
              ));
            }) : (
              <tr><td colSpan={3} className="border border-black p-6 text-center italic" style={{ borderColor: '#000000', color: '#a8a29e' }}>Belum ada data semester ini</td></tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const renderHafalanTable = () => {
    const filteredHafalan = examData.hafalan.filter((e: any) => e.semester === semester);
    const targetHafalan = filteredHafalan[0]?.target || 'Juz 30';
    
    let counter = 1;
    return (
      <div className="mt-4">
        <p className="text-[11px] font-bold mb-2 uppercase tracking-wide">TARGET HAFALAN: {targetHafalan}</p>
        <table className="w-full border-collapse border-2 border-black text-[10px]" style={{ borderColor: '#000000' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <th className="border border-black p-3 w-10 text-center align-middle" style={{ borderColor: '#000000' }}>No</th>
              <th className="border border-black p-3 text-center align-middle" style={{ borderColor: '#000000' }}>Surat / Ayat</th>
              <th className="border border-black p-3 w-12 text-center align-middle" style={{ borderColor: '#000000' }}>Nilai</th>
              <th className="border border-black p-3 w-20 text-center align-middle" style={{ borderColor: '#000000' }}>Predikat</th>
            </tr>
          </thead>
          <tbody>
            {filteredHafalan.length > 0 ? filteredHafalan.flatMap((exam: any) => {
              const surahs = typeof exam.surahs === 'string' ? JSON.parse(exam.surahs) : exam.surahs;
              return (surahs || []).map((s: any, i: number) => (
                <tr key={`${exam.id}-${i}`}>
                  <td className="border border-black p-3 text-center align-middle" style={{ borderColor: '#000000', color: '#000000' }}>{counter++}</td>
                  <td className="border border-black p-3 text-center align-middle" dir="auto" style={{ borderColor: '#000000', color: '#000000', fontFamily: "'Amiri', serif", letterSpacing: '0', fontVariantLigatures: 'common-ligatures' }}>{s.name}</td>
                  <td className="border border-black p-3 text-center font-bold align-middle" style={{ borderColor: '#000000', color: '#000000' }}>{s.grade}</td>
                  <td className="border border-black p-3 text-center align-middle" style={{ borderColor: '#000000', color: '#000000' }}>{s.predicate}</td>
                </tr>
              ));
            }) : (
              <tr><td colSpan={4} className="border border-black p-6 text-center italic" style={{ borderColor: '#000000', color: '#a8a29e' }}>Belum ada data semester ini</td></tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
      <div className={cn(
        "lg:col-span-1 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm h-fit lg:sticky lg:top-8 z-10",
        !showListOnMobile && "hidden lg:block"
      )}>
        <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
          <Search size={18} className="text-emerald-600" />
          Cari Siswa
        </h3>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text"
            placeholder="Nama siswa..."
            className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-6 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
          {Object.entries(groupedStudents).map(([halaqohName, halaqohStudents]: [string, any[]]) => (
            <div key={halaqohName} className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  {halaqohName}
                </h4>
                <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                  {halaqohStudents.length} Siswa
                </span>
              </div>
              
              <div className="space-y-2">
                {halaqohStudents.map((s: any) => (
                  <button
                    key={s.id}
                    onClick={() => fetchExamData(s)}
                    className={cn(
                      "w-full text-left p-3 rounded-xl transition-all border group",
                      selectedStudent?.id === s.id 
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-bold shadow-sm shadow-emerald-100" 
                        : "bg-white border-stone-100 hover:border-emerald-200 hover:bg-stone-50 text-stone-600"
                    )}
                  >
                    <p className="text-sm group-hover:translate-x-1 transition-transform">{s.name}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {Object.keys(groupedStudents).length === 0 && (
            <div className="text-center py-8 text-stone-400">
              <p className="text-sm italic">Siswa tidak ditemukan</p>
            </div>
          )}
        </div>
      </div>

      <div className={cn(
        "lg:col-span-2",
        showListOnMobile && "hidden lg:block"
      )}>
        {selectedStudent && examData ? (
          <div className="bg-white p-6 lg:p-8 rounded-3xl border border-stone-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowListOnMobile(true)}
                  className="lg:hidden flex items-center gap-1 px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-600 transition-colors text-xs font-bold"
                >
                  <ChevronLeft size={16} />
                  Daftar
                </button>
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-stone-900 leading-tight">{selectedStudent.name}</h2>
                  <p className="text-stone-500 text-sm">Pratinjau Rapor Hasil Ujian</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 bg-stone-100 p-1.5 rounded-xl">
                <button
                  onClick={() => setSemester('Ganjil')}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                    semester === 'Ganjil' ? "bg-white text-emerald-600 shadow-sm" : "text-stone-500 hover:text-stone-700"
                  )}
                >
                  Ganjil
                </button>
                <button
                  onClick={() => setSemester('Genap')}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                    semester === 'Genap' ? "bg-white text-emerald-600 shadow-sm" : "text-stone-500 hover:text-stone-700"
                  )}
                >
                  Genap
                </button>
              </div>

              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button 
                  onClick={generatePDF}
                  disabled={isGenerating}
                  className="flex-1 sm:flex-none bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  <Download size={18} />
                  {isGenerating ? '...' : 'PDF'}
                </button>
                <button 
                  onClick={() => generateImage('jpg')}
                  disabled={isGenerating}
                  className="flex-1 sm:flex-none bg-amber-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-amber-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  <Eye size={18} />
                  {isGenerating ? '...' : 'JPG'}
                </button>
              </div>
            </div>

            <div className="space-y-8">
              {/* Reset Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <h4 className="text-xs font-bold text-stone-500 uppercase mb-3">Reset Data Ujian Ummi</h4>
                  <div className="space-y-2">
                    {examData.ummi.filter((e: any) => e.semester === semester).map((e: any) => (
                      <div key={e.id} className="flex items-center justify-between bg-white p-2 rounded-lg border border-stone-100 text-xs">
                        <span>Jilid {e.level} ({e.date})</span>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingExam({ type: 'ummi', data: { ...e } })} className="text-emerald-600 hover:text-emerald-700 font-bold">Edit</button>
                          <button onClick={() => resetExam('ummi', e.id)} className="text-red-500 hover:text-red-700 font-bold">Hapus</button>
                        </div>
                      </div>
                    ))}
                    {examData.ummi.filter((e: any) => e.semester === semester).length === 0 && <p className="text-xs italic text-stone-400">Tidak ada data</p>}
                  </div>
                </div>
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <h4 className="text-xs font-bold text-stone-500 uppercase mb-3">Reset Data Ujian Hafalan</h4>
                  <div className="space-y-2">
                    {examData.hafalan.filter((e: any) => e.semester === semester).map((e: any) => (
                      <div key={e.id} className="flex items-center justify-between bg-white p-2 rounded-lg border border-stone-100 text-xs">
                        <span>Hafalan ({e.date})</span>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingExam({ type: 'hafalan', data: { ...e } })} className="text-emerald-600 hover:text-emerald-700 font-bold">Edit</button>
                          <button onClick={() => resetExam('hafalan', e.id)} className="text-red-500 hover:text-red-700 font-bold">Hapus</button>
                        </div>
                      </div>
                    ))}
                    {examData.hafalan.filter((e: any) => e.semester === semester).length === 0 && <p className="text-xs italic text-stone-400">Tidak ada data</p>}
                  </div>
                </div>
              </div>

              {/* Signature Size Controls (Toolbar - Outside Capture Area) */}
            <div className="mb-8 p-6 bg-stone-50 rounded-3xl border border-stone-100 flex flex-col sm:flex-row items-center gap-8 no-print print:hidden">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Settings size={18} className="text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Ukuran Tanda Tangan</h4>
                  <p className="text-[10px] text-stone-500">Sesuaikan ukuran gambar ttd</p>
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
                      className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
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
                      className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>
                </div>
            </div>

            {/* Report Card Preview (HTML) */}
              <div className="border border-stone-200 rounded-2xl overflow-x-auto shadow-inner bg-stone-100 p-4 lg:p-12">
                <div id="report-card-preview" className="bg-white shadow-2xl mx-auto p-[10mm] sm:p-[15mm] relative" style={{ width: '210mm', minHeight: '297mm', fontFamily: "'Times New Roman', Times, serif", color: '#000000' }}>
                  {/* Watermark */}
                  {institution?.watermark && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0.04 }}>
                      <img src={institution.watermark} alt="" className="w-[140mm] h-[140mm] object-contain" />
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-center border-b-4 border-black pb-4 mb-6 relative" style={{ borderBottomColor: '#000000' }}>
                    {institution?.logo && (
                      <img src={institution.logo} alt="Logo" className="absolute left-0 top-0 w-20 h-20 sm:w-24 sm:h-24 object-contain" />
                    )}
                    <div className="flex-1 text-center pl-20 sm:pl-24">
                      <p className="text-3xl mb-2" dir="rtl" style={{ fontFamily: "'Amiri', serif", fontWeight: 400, letterSpacing: '0', fontVariantLigatures: 'common-ligatures', textRendering: 'optimizeLegibility' }}>
                        <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>شهادة حفظ القرآن الكريم</span>
                      </p>
                      <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight">{institution?.name || 'SEKOLAH ISLAM MIFTAHUSSALAM'}</h1>
                      <p className="text-[10px] sm:text-[11px] leading-tight mt-2 italic">{institution?.address}</p>
                      <div className="mt-4 text-xs sm:text-sm font-bold border-t border-black pt-2 inline-block px-4">
                        <p>UJIAN TAHFIDZUL QUR'AN SEMESTER {semester.toUpperCase()}</p>
                        <p>TAHUN AJARAN {institution?.academic_year || '2025/2026'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Student Info */}
                  <div className="grid grid-cols-2 text-xs sm:text-sm mb-6 font-medium">
                    <div className="space-y-2">
                      <div className="flex">
                        <span className="w-24 sm:w-28">Nama Siswa</span>
                        <span>: <span className="font-bold uppercase">{selectedStudent.name}</span></span>
                      </div>
                      <div className="flex">
                        <span className="w-24 sm:w-28">Halaqoh / Kelas</span>
                        <span>: {selectedStudent.halaqoh_name}</span>
                      </div>
                      <div className="flex">
                        <span className="w-24 sm:w-28">Guru Pengampu</span>
                        <span>: {institution?.halaqoh_teacher_name || '-'}</span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col justify-end">
                      <p className="font-bold text-base sm:text-lg uppercase">SEMESTER: {semester === 'Ganjil' ? '1 (GANJIL)' : '2 (GENAP)'}</p>
                    </div>
                  </div>

                  {/* Title Box */}
                  <div className="border-2 border-black py-2 flex items-center justify-center font-bold text-base sm:text-lg mb-6 uppercase tracking-[0.2em]" style={{ borderColor: '#000000', backgroundColor: '#fafaf9', color: '#000000', minHeight: '2.5rem' }}>
                    LAPORAN PENCAPAIAN TAHFIDZ
                  </div>

                  {/* Tables Container */}
                  <div className="grid grid-cols-2 gap-8 sm:gap-12 mb-8">
                    {renderHafalanTable()}
                    {renderUmmiTable()}
                  </div>

                  {/* Footer Box - Catatan Guru */}
                  <div className="border-2 border-black mb-6" style={{ borderColor: '#000000', color: '#000000' }}>
                    <div className="border-b-2 border-black px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-center" style={{ backgroundColor: '#f8fafc', borderBottomColor: '#000000', color: '#000000' }}>Catatan & Motivasi Guru</div>
                    <div className="p-3 min-h-[20mm] text-xs sm:text-sm italic leading-relaxed" style={{ color: '#000000' }}>
                      {teacherNotes || 'Alhamdulillah, terus tingkatkan hafalannya dan jaga murajaahnya. Semoga Allah memberkahi setiap langkahmu dalam menghafal Al-Qur\'an.'}
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="grid grid-cols-3 text-[10px] sm:text-xs text-center">
                    <div>
                      <p className="mb-10 sm:mb-12">Orang Tua/Wali,</p>
                      <p className="font-bold underline">( .............................. )</p>
                    </div>
                    <div>
                      <p className="mb-2">Mengetahui,</p>
                      <p className="mb-6 sm:mb-8">Kepala Sekolah</p>
                      <div className="relative flex items-center justify-center h-16 sm:h-20" style={{ height: '80px' }}>
                        {institution?.principal_signature && (
                          <img 
                            src={institution.principal_signature} 
                            alt="" 
                            className="object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
                            style={{ height: `${principalSigSize}px`, maxWidth: 'none' }} 
                          />
                        )}
                      </div>
                      <p className="font-bold underline">{institution?.principal_name || 'Cikun, S.Pd'}</p>
                    </div>
                    <div>
                      <p className="mb-2 text-[9px] sm:text-[11px]">
                        {institution?.report_date || `Cikunir, ${format(new Date(), 'dd MMMM yyyy', { locale: id })}`}
                      </p>
                      <p className="mb-6 sm:mb-8">Koordinator Tahfidz,</p>
                      <div className="relative flex items-center justify-center h-16 sm:h-20" style={{ height: '80px' }}>
                        {institution?.coordinator_signature && (
                          <img 
                            src={institution.coordinator_signature} 
                            alt="" 
                            className="object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
                            style={{ height: `${coordinatorSigSize}px`, maxWidth: 'none' }} 
                          />
                        )}
                      </div>
                      <p className="font-bold underline">{institution?.coordinator_name || 'Abdul Rohman'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-stone-200 border-dashed text-stone-400">
            <GraduationCap size={48} className="mb-4 opacity-20" />
            <p className="font-medium">Pilih siswa untuk melihat pratinjau rapor.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingExam && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                  <Edit2 size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900">Edit Nilai Ujian</h3>
                  <p className="text-xs text-stone-500">{editingExam.type === 'ummi' ? 'Ujian Ummi / Tilawah' : 'Ujian Hafalan'}</p>
                </div>
              </div>
              <button onClick={() => setEditingExam(null)} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
                <X size={20} className="text-stone-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <form id="edit-exam-form" onSubmit={handleUpdateExam} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Tanggal</label>
                    <input 
                      type="date"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-sm"
                      value={editingExam.data.date}
                      onChange={e => setEditingExam({ ...editingExam, data: { ...editingExam.data, date: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Target / Jilid</label>
                    <input 
                      type="text"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-sm"
                      value={editingExam.data.target || ''}
                      onChange={e => setEditingExam({ ...editingExam, data: { ...editingExam.data, target: e.target.value } })}
                    />
                  </div>
                </div>

                {editingExam.type === 'ummi' ? (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-stone-900 border-b border-stone-100 pb-2">Detail Nilai Jilid {editingExam.data.level}</h4>
                    <div className="grid gap-3">
                      {Object.entries(editingExam.data.scores).map(([indicator, score]: [string, any]) => (
                        <div key={indicator} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-100">
                          <span className="text-sm font-medium text-stone-700">{indicator}</span>
                          <div className="flex gap-1">
                            {['A', 'B', 'C'].map(grade => (
                              <button
                                key={grade}
                                type="button"
                                onClick={() => {
                                  const newScores = { ...editingExam.data.scores, [indicator]: grade };
                                  setEditingExam({ ...editingExam, data: { ...editingExam.data, scores: newScores } });
                                }}
                                className={cn(
                                  "w-8 h-8 rounded-lg font-bold text-xs transition-all",
                                  score === grade 
                                    ? "bg-emerald-600 text-white shadow-md" 
                                    : "bg-white text-stone-400 border border-stone-200"
                                )}
                              >
                                {grade}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-stone-900 border-b border-stone-100 pb-2">Daftar Surat</h4>
                      <div className="space-y-3">
                        {editingExam.data.surahs.map((surah: any, idx: number) => (
                          <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-stone-50 p-3 rounded-xl border border-stone-100">
                            <div className="col-span-7">
                              <input 
                                type="text"
                                className="w-full bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs"
                                value={surah.name}
                                onChange={e => {
                                  const newSurahs = [...editingExam.data.surahs];
                                  newSurahs[idx].name = e.target.value;
                                  setEditingExam({ ...editingExam, data: { ...editingExam.data, surahs: newSurahs } });
                                }}
                              />
                            </div>
                            <div className="col-span-5">
                              <select 
                                className="w-full bg-white border border-stone-200 rounded-lg px-2 py-1.5 text-xs font-bold text-emerald-700"
                                value={surah.grade}
                                onChange={e => {
                                  const newSurahs = [...editingExam.data.surahs];
                                  newSurahs[idx].grade = e.target.value;
                                  const predicates: any = { 'A+': 'MUMTAAZ', 'A': 'JAYYID JIDDAN', 'B+': 'JAYYID', 'B': 'MAQBUL', 'C': 'DHOIF' };
                                  newSurahs[idx].predicate = predicates[e.target.value] || '';
                                  setEditingExam({ ...editingExam, data: { ...editingExam.data, surahs: newSurahs } });
                                }}
                              >
                                {['A+', 'A', 'B+', 'B', 'C'].map(g => <option key={g} value={g}>{g}</option>)}
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Catatan Guru</label>
                      <textarea 
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-sm min-h-[80px]"
                        value={editingExam.data.note || ''}
                        onChange={e => setEditingExam({ ...editingExam, data: { ...editingExam.data, note: e.target.value } })}
                      />
                    </div>
                  </div>
                )}
              </form>
            </div>

            <div className="p-6 border-t border-stone-100 bg-stone-50 flex gap-3">
              <button 
                onClick={() => setEditingExam(null)}
                className="flex-1 py-3 border border-stone-200 text-stone-600 font-bold rounded-xl hover:bg-stone-100 transition-colors"
              >
                Batal
              </button>
              <button 
                form="edit-exam-form"
                type="submit"
                className="flex-[2] py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Simpan Perubahan
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
