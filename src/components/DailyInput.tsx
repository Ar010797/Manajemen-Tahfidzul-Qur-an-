import React, { useState, useEffect, useMemo } from 'react';
import { ClipboardCheck, Save, Search, GripVertical, ChevronLeft, Trash2, ChevronRight, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { motion, Reorder, useDragControls } from 'motion/react';
import { cn } from '../lib/utils';
import { storage } from '../services/storage';
import { SURAH_LIST } from '../constants/surahs';
import ConfirmModal from './ConfirmModal';

function StudentReorderItem({ s, selectedStudent, theme, handleSelectStudent }: any) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={s}
      dragListener={false}
      dragControls={controls}
      className={cn(
        "w-full text-left p-4 rounded-2xl transition-all duration-300 border flex items-center gap-4 cursor-pointer group mb-1",
        selectedStudent?.id === s.id 
          ? `bg-stone-900 border-stone-800 text-white shadow-xl translate-x-1` 
          : `bg-white border-stone-100 hover:bg-stone-50 text-stone-600 hover:border-stone-200`
      )}
      onClick={() => handleSelectStudent(s)}
    >
      <div 
        className={cn(
          "transition-colors cursor-grab active:cursor-grabbing p-1.5 rounded-lg",
          selectedStudent?.id === s.id ? "text-white/20 hover:text-white/40" : "text-stone-300 hover:bg-stone-100"
        )}
        onPointerDown={(e) => controls.start(e)}
        style={{ touchAction: 'none' }}
      >
        <GripVertical size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-display font-bold truncate tracking-tight">{s.name}</p>
        {s.halaqoh_name && (
          <p className={cn(
            "text-[10px] font-black uppercase tracking-widest mt-0.5",
            selectedStudent?.id === s.id ? "text-white/40" : "text-stone-400"
          )}>{s.halaqoh_name}</p>
        )}
      </div>
    </Reorder.Item>
  );
}

export default function DailyInput() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [type, setType] = useState<'hafalan' | 'ummi' | 'tilawah'>('hafalan');
  const [details, setDetails] = useState<any>({});
  const [search, setSearch] = useState('');
  const [showListOnMobile, setShowListOnMobile] = useState(true);
  const [themeColor, setThemeColor] = useState('emerald');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const institution = storage.getInstitution();
    setThemeColor(institution.theme_color || 'emerald');
  }, []);

  const fetchExistingDeposit = () => {
    if (!selectedStudent || !date || !type) return;
    const data = storage.getDeposit(selectedStudent.id, type, date);
    if (data && data.details) {
      setDetails(data.details);
    } else {
      const lastDeposit = storage.getLastDeposit(selectedStudent.id, type);
      if (lastDeposit && lastDeposit.details) {
        const lastDetails = lastDeposit.details;
        if (type === 'hafalan') {
          const shouldAdvance = lastDetails.grade === 'L' || lastDetails.grade === 'CL';
          const lastEnd = parseInt(lastDetails.verse_end) || parseInt(lastDetails.verse_start) || 0;
          
          if (shouldAdvance) {
            setDetails({
              surah: lastDetails.surah,
              verse_start: lastEnd ? lastEnd + 1 : '',
              verse_end: lastEnd ? lastEnd + 1 : ''
            });
          } else {
            setDetails({
              surah: lastDetails.surah,
              verse_start: lastDetails.verse_start || '',
              verse_end: lastDetails.verse_end || ''
            });
          }
        } else if (type === 'ummi') {
          const shouldAdvance = lastDetails.grade === 'A' || lastDetails.grade === 'B';
          const lastEnd = parseInt(lastDetails.page_end) || parseInt(lastDetails.page_start) || 0;
          
          if (shouldAdvance) {
            setDetails({
              level: lastDetails.level,
              page_start: lastEnd ? lastEnd + 1 : '',
              page_end: lastEnd ? lastEnd + 1 : ''
            });
          } else {
            setDetails({
              level: lastDetails.level,
              page_start: lastDetails.page_start || '',
              page_end: lastDetails.page_end || ''
            });
          }
        } else if (type === 'tilawah') {
          const shouldAdvance = lastDetails.grade === 'A' || lastDetails.grade === 'B';
          const lastEnd = parseInt(lastDetails.verse_end) || parseInt(lastDetails.verse_start) || 0;
          
          if (shouldAdvance) {
            setDetails({
              juz: lastDetails.juz,
              surah: lastDetails.surah,
              verse_start: lastEnd ? lastEnd + 1 : '',
              verse_end: lastEnd ? lastEnd + 1 : ''
            });
          } else {
            setDetails({
              juz: lastDetails.juz,
              surah: lastDetails.surah,
              verse_start: lastDetails.verse_start || '',
              verse_end: lastDetails.verse_end || ''
            });
          }
        }
      } else {
        setDetails({});
      }
    }
  };

  useEffect(() => {
    fetchExistingDeposit();
  }, [selectedStudent, date, type]);

  const fetchStudents = () => {
    const data = storage.getStudents();
    // Sort by halaqoh name first, then by the default order
    const sorted = [...data].sort((a, b) => {
      const halaqohA = a.halaqoh_name || 'Tanpa Halaqoh';
      const halaqohB = b.halaqoh_name || 'Tanpa Halaqoh';
      
      // Keep "Tanpa Halaqoh" at the end if you want
      if (halaqohA === 'Tanpa Halaqoh' && halaqohB !== 'Tanpa Halaqoh') return 1;
      if (halaqohA !== 'Tanpa Halaqoh' && halaqohB === 'Tanpa Halaqoh') return -1;
      
      const halaqohCompare = halaqohA.localeCompare(halaqohB);
      if (halaqohCompare !== 0) return halaqohCompare;
      
      return (a.order_index - b.order_index) || a.name.localeCompare(b.name);
    });
    setStudents(sorted);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSendMessage = () => {
    if (!selectedStudent) return;

    const institution = storage.getInstitution();
    const studentName = selectedStudent.name;
    const parentPhone = selectedStudent.parent_phone;

    if (!parentPhone) {
      alert('Nomor HP orang tua belum diatur untuk siswa ini. Silakan atur di Manajemen Siswa.');
      return;
    }

    // Fetch all types of deposits for this student and date
    const hafalanData = storage.getDeposit(selectedStudent.id, 'hafalan', date);
    const ummiData = storage.getDeposit(selectedStudent.id, 'ummi', date);
    const tilawahData = storage.getDeposit(selectedStudent.id, 'tilawah', date);

    if (!hafalanData && !ummiData && !tilawahData) {
      alert('Belum ada data setoran (Hafalan/Ummi/Tilawah) yang disimpan untuk tanggal ini.');
      return;
    }

    let reportSegments = [];

    // Hafalan Segment
    if (hafalanData && hafalanData.details && hafalanData.details.grade) {
      const d = hafalanData.details;
      const isGoodGrade = ['L', 'CL'].includes(d.grade);
      let homework = '';
      if (isGoodGrade) {
        const nextVerse = d.verse_end ? parseInt(d.verse_end) + 1 : (parseInt(d.verse_start) + 1 || '');
        homework = `Lanjut ayat berikutnya (ayat ${nextVerse})`;
      } else {
        homework = `Mengulang ayat yang sama (${d.verse_start}${d.verse_end ? '-' + d.verse_end : ''})`;
      }
      reportSegments.push(`📚 *Hafalan Al-Qur'an*
📖 Materi: Surah ${d.surah}, ayat ${d.verse_start}${d.verse_end ? '-' + d.verse_end : ''}
⭐ Nilai: *${d.grade}*
📝 PR: ${homework}`);
    }

    // Ummi Segment
    if (ummiData && ummiData.details && ummiData.details.grade) {
      const d = ummiData.details;
      const isGoodGrade = ['A', 'B'].includes(d.grade);
      let homework = '';
      if (isGoodGrade) {
        const nextPage = d.page_end ? parseInt(d.page_end) + 1 : (parseInt(d.page_start) + 1 || '');
        homework = `Lanjut halaman berikutnya (hlm ${nextPage})`;
      } else {
        homework = `Mengulang halaman yang sama (hlm ${d.page_start}${d.page_end ? '-' + d.page_end : ''})`;
      }
      reportSegments.push(`📚 *Metode Ummi*
📖 Materi: Jilid ${d.level}, hlm ${d.page_start}${d.page_end ? '-' + d.page_end : ''}
⭐ Nilai: *${d.grade}*
📝 PR: ${homework}`);
    }

    // Tilawah Segment
    if (tilawahData && tilawahData.details && tilawahData.details.grade) {
      const d = tilawahData.details;
      const isGoodGrade = ['A', 'B'].includes(d.grade);
      let homework = '';
      if (isGoodGrade) {
        const nextVerse = d.verse_end ? parseInt(d.verse_end) + 1 : (parseInt(d.verse_start) + 1 || '');
        homework = `Lanjut ayat berikutnya (ayat ${nextVerse})`;
      } else {
        homework = `Mengulang ayat yang sama (${d.verse_start}${d.verse_end ? '-' + d.verse_end : ''})`;
      }
      reportSegments.push(`📚 *Tilawah/BTQ*
📖 Materi: Juz ${d.juz}, Surah ${d.surah}, ayat ${d.verse_start}${d.verse_end ? '-' + d.verse_end : ''}
⭐ Nilai: *${d.grade}*
📝 PR: ${homework}`);
    }

    const message = `*LAPORAN SETORAN HARIAN*
*${institution.name}*

Assalamu'alaikum Warahmatullahi Wabarakatuh,
Ayah/Bunda dari Ananda *${studentName}*, berikut adalah laporan perkembangan hari ini:

📅 Tanggal: ${format(new Date(date), 'dd MMMM yyyy')}

${reportSegments.join('\n\n')}

Mohon bimbingan dan motivasinya di rumah. Syukron, Jazakumullahu Khairan.

Halaqoh: ${selectedStudent.halaqoh_name || '-'}
Ust/Ustzh: ${institution.halaqoh_teacher_name || '-'}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${parentPhone.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || isSaving) return;
    
    setIsSaving(true);
    try {
      storage.saveDeposit(selectedStudent.id, type, date, details);
      alert('Setoran berhasil disimpan!');
    } catch (error) {
      console.error('Save error:', error);
      alert('Terjadi kesalahan saat menyimpan.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDeposit = () => {
    if (!selectedStudent) return;
    storage.deleteDeposit(selectedStudent.id, type, date);
    setDetails({});
    alert('Setoran berhasil dihapus.');
  };

  const handleReorder = (halaqohName: string, newOrder: any[]) => {
    setStudents(prev => {
      const otherStudents = prev.filter(s => (s.halaqoh_name || 'Tanpa Halaqoh') !== halaqohName);
      return [...otherStudents, ...newOrder];
    });

    const orders = newOrder.map((s, index) => ({
      id: s.id,
      order_index: index
    }));

    try {
      storage.reorderStudents(orders);
    } catch (error) {
      console.error('Failed to save order:', error);
      fetchStudents();
    }
  };

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

  const handleSelectStudent = (s: any) => {
    setSelectedStudent(s);
    setShowListOnMobile(false);
  };

  const handleNextStudent = () => {
    if (!selectedStudent || students.length === 0) return;
    const currentIndex = students.findIndex(s => s.id === selectedStudent.id);
    const nextIndex = (currentIndex + 1) % students.length;
    setSelectedStudent(students[nextIndex]);
  };

  const handlePrevStudent = () => {
    if (!selectedStudent || students.length === 0) return;
    const currentIndex = students.findIndex(s => s.id === selectedStudent.id);
    const prevIndex = (currentIndex - 1 + students.length) % students.length;
    setSelectedStudent(students[prevIndex]);
  };


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
    border: themeColor === 'emerald' ? 'border-emerald-200' :
            themeColor === 'blue' ? 'border-blue-200' :
            themeColor === 'amber' ? 'border-amber-200' :
            themeColor === 'indigo' ? 'border-indigo-200' :
            themeColor === 'purple' ? 'border-purple-200' :
            themeColor === 'rose' ? 'border-rose-200' :
            'border-slate-200',
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
    hoverBorder: themeColor === 'emerald' ? 'hover:border-emerald-200' :
                 themeColor === 'blue' ? 'hover:border-blue-200' :
                 themeColor === 'amber' ? 'hover:border-amber-200' :
                 themeColor === 'indigo' ? 'hover:border-indigo-200' :
                 themeColor === 'purple' ? 'hover:border-purple-200' :
                 themeColor === 'rose' ? 'hover:border-rose-200' :
                 'hover:border-slate-200',
    pillShadow: themeColor === 'emerald' ? 'shadow-emerald-100' :
                themeColor === 'blue' ? 'shadow-blue-100' :
                themeColor === 'amber' ? 'shadow-amber-100' :
                themeColor === 'indigo' ? 'shadow-indigo-100' :
                themeColor === 'purple' ? 'shadow-purple-100' :
                themeColor === 'rose' ? 'shadow-rose-100' :
                'shadow-slate-100',
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 font-sans">
      <div className={cn(
        "lg:col-span-4 bg-white p-8 rounded-[2.5rem] border border-stone-200/50 shadow-2xl shadow-stone-900/5 h-[calc(100vh-12rem)] flex flex-col lg:sticky lg:top-8 z-10 overflow-hidden",
        !showListOnMobile && "hidden lg:flex"
      )}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-black text-stone-950 flex items-center gap-3">
              <Search size={22} className={theme.text} />
              Cari Siswa
            </h3>
          </div>
          <div className="relative group">
            <input 
              type="text"
              placeholder="Ketik nama siswa..."
              className={cn("w-full bg-stone-50 border border-stone-200/60 rounded-2xl py-4 px-6 focus:outline-none focus:ring-4 transition-all pr-12 font-medium", theme.ring)}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-stone-950 transition-colors" size={18} />
          </div>
        </div>
        
        <div className="flex-1 mt-8 overflow-y-auto custom-scrollbar pr-2 space-y-8">
          {Object.entries(groupedStudents).map(([halaqohName, halaqohStudents]) => (
            <div key={halaqohName} className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h4 className="text-[10px] font-display font-black text-stone-400 uppercase tracking-[0.25em]">
                  {halaqohName}
                </h4>
                <span className="text-[10px] font-display font-black bg-stone-100 text-stone-500 px-3 py-1 rounded-full border border-stone-200/50 uppercase">
                  {(halaqohStudents as any[]).length} SISWA
                </span>
              </div>
              
              <Reorder.Group 
                axis="y" 
                values={halaqohStudents as any[]} 
                onReorder={(newOrder) => handleReorder(halaqohName, newOrder)}
                className="space-y-1"
              >
                {(halaqohStudents as any[]).map(s => (
                  <StudentReorderItem 
                    key={s.id}
                    s={s}
                    selectedStudent={selectedStudent}
                    theme={theme}
                    handleSelectStudent={handleSelectStudent}
                  />
                ))}
              </Reorder.Group>
            </div>
          ))}

          {Object.keys(groupedStudents).length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-stone-300">
              <Search size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-display font-bold italic">Siswa tidak ditemukan</p>
            </div>
          )}
        </div>
      </div>

      <div className={cn(
        "lg:col-span-8 space-y-8",
        showListOnMobile && "hidden lg:block"
      )}>
        {selectedStudent ? (
          <div className="bg-white p-8 lg:p-12 rounded-[3rem] border border-stone-200/50 shadow-2xl shadow-stone-900/5 transition-all">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setShowListOnMobile(true)}
                  className="lg:hidden p-3 bg-stone-100 hover:bg-stone-200 rounded-2xl text-stone-600 transition-all active:scale-90"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-6">
                  <button 
                    onClick={handlePrevStudent}
                    className="p-3 hover:bg-stone-50 rounded-2xl text-stone-300 hover:text-stone-950 transition-all border border-transparent hover:border-stone-100 active:scale-90"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <div className="space-y-1">
                    <h2 className="text-3xl md:text-4xl font-display font-black text-stone-950 leading-none tracking-tight">
                      {selectedStudent.name}
                    </h2>
                    <p className="text-stone-400 font-medium tracking-tight">Updating daily progress...</p>
                  </div>
                  <button 
                    onClick={handleNextStudent}
                    className="p-3 hover:bg-stone-50 rounded-2xl text-stone-300 hover:text-stone-950 transition-all border border-transparent hover:border-stone-100 active:scale-90"
                  >
                    <ChevronRight size={28} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-stone-200 to-stone-100 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                  <input 
                    type="date"
                    className="relative w-full bg-white border border-stone-200 rounded-2xl px-6 py-4 text-xs font-display font-black uppercase tracking-widest text-stone-600 focus:outline-none focus:ring-4 ring-stone-900/5 transition-all"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                  />
                </div>
                <div className="flex bg-stone-100/50 p-2 rounded-[1.5rem] border border-stone-200/40">
                  {(['hafalan', 'ummi', 'tilawah'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => { setType(t); setDetails({}); }}
                      className={cn(
                        "px-6 py-3 rounded-2xl text-[10px] font-display font-black uppercase tracking-[0.2em] transition-all",
                        type === t ? `bg-stone-950 text-white shadow-xl translate-y-[-1px]` : "text-stone-400 hover:text-stone-950"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="bg-stone-50/50 p-8 lg:p-10 rounded-[2.5rem] border border-stone-200/40">
                  {type === 'hafalan' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    <div className="space-y-3">
                      <label className="text-[10px] font-display font-black text-stone-400 uppercase tracking-[0.25em] ml-2">Nama Surat</label>
                      <input 
                        type="text"
                        className="w-full bg-white border border-stone-200/60 rounded-2xl px-6 py-5 text-lg font-bold placeholder:text-stone-300 focus:outline-none focus:ring-4 ring-stone-900/5 transition-all"
                        placeholder="Contoh: An-Naba"
                        value={details.surah || ''}
                        onChange={e => setDetails({...details, surah: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-display font-black text-stone-400 uppercase tracking-[0.25em] ml-2">Ayat Awal</label>
                        <input 
                          type="text"
                          className="w-full bg-white border border-stone-200/60 rounded-2xl px-6 py-5 text-lg font-bold text-center focus:outline-none focus:ring-4 ring-stone-900/5 transition-all"
                          value={details.verse_start || ''}
                          onChange={e => setDetails({...details, verse_start: e.target.value})}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-display font-black text-stone-400 uppercase tracking-[0.25em] ml-2">Ayat Akhir</label>
                        <input 
                          type="text"
                          className="w-full bg-white border border-stone-200/60 rounded-2xl px-6 py-5 text-lg font-bold text-center focus:outline-none focus:ring-4 ring-stone-900/5 transition-all"
                          value={details.verse_end || ''}
                          onChange={e => setDetails({...details, verse_end: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-[10px] font-display font-black text-stone-400 uppercase tracking-[0.25em] ml-2">Pencapaian Nilai</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         {(['L', 'CL', 'BL'] as const).map(g => (
                           <button
                             type="button"
                             key={g}
                             onClick={() => setDetails({...details, grade: g})}
                             className={cn(
                               "py-4 rounded-2xl font-display font-black border-2 transition-all group flex flex-col items-center justify-center gap-1",
                               details.grade === g 
                                ? "bg-stone-950 border-stone-950 text-white shadow-2xl scale-[1.02]" 
                                : "bg-white border-stone-100 text-stone-400 hover:border-stone-300 hover:text-stone-950"
                             )}
                           >
                             <span className="text-2xl">{g}</span>
                             <span className="text-[8px] uppercase tracking-[0.2em] opacity-60">
                               {g === 'L' ? 'Lancar' : g === 'CL' ? 'Cukup Lancar' : 'Belum Lancar'}
                             </span>
                           </button>
                         ))}
                      </div>
                    </div>
                  </div>
                )}

                {type === 'ummi' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-display font-black text-stone-400 uppercase tracking-[0.25em] ml-2">Jilid</label>
                      <select 
                        className="w-full bg-white border border-stone-200/60 rounded-2xl px-6 py-5 text-lg font-bold focus:outline-none focus:ring-4 ring-stone-900/5 transition-all appearance-none cursor-pointer"
                        value={details.level || ''}
                        onChange={e => setDetails({...details, level: e.target.value})}
                      >
                        <option value="">Pilih</option>
                        {[1,2,3,4,5,6].map(i => <option key={i} value={i}>Ummi Jilid {i}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-display font-black text-stone-400 uppercase tracking-[0.25em] ml-2">Hal Awal</label>
                        <input 
                          type="text"
                          className="w-full bg-white border border-stone-200/60 rounded-2xl px-6 py-5 text-lg font-bold text-center focus:outline-none focus:ring-4 ring-stone-900/5 transition-all"
                          value={details.page_start || ''}
                          onChange={e => setDetails({...details, page_start: e.target.value})}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-display font-black text-stone-400 uppercase tracking-[0.25em] ml-2">Hal Akhir</label>
                        <input 
                          type="text"
                          className="w-full bg-white border border-stone-200/60 rounded-2xl px-6 py-5 text-lg font-bold text-center focus:outline-none focus:ring-4 ring-stone-900/5 transition-all"
                          value={details.page_end || ''}
                          onChange={e => setDetails({...details, page_end: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-display font-black text-stone-400 uppercase tracking-[0.25em] ml-2">Nilai</label>
                      <div className="grid grid-cols-3 gap-3">
                        {(['A', 'B', 'C'] as const).map(g => (
                           <button
                             type="button"
                             key={g}
                             onClick={() => setDetails({...details, grade: g})}
                             className={cn(
                               "h-[68px] rounded-2xl font-display font-black border-2 transition-all flex items-center justify-center",
                               details.grade === g 
                                ? "bg-stone-950 border-stone-950 text-white shadow-xl" 
                                : "bg-white border-stone-100 text-stone-400 hover:border-stone-300 hover:text-stone-950"
                             )}
                           >
                             {g}
                           </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {type === 'tilawah' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-4 space-y-3">
                      <label className="text-[10px] font-display font-black text-stone-400 uppercase tracking-[0.25em] ml-2">Juz</label>
                      <select 
                        className="w-full bg-white border border-stone-200/60 rounded-2xl px-6 py-5 text-lg font-bold focus:outline-none focus:ring-4 ring-stone-900/5 transition-all appearance-none cursor-pointer"
                        value={details.juz || ''}
                        onChange={e => setDetails({...details, juz: e.target.value})}
                      >
                        <option value="">Pilih Juz</option>
                        {Array.from({length: 30}, (_, i) => i + 1).map(i => (
                          <option key={i} value={i}>Juz {i}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-8 space-y-3">
                      <label className="text-[10px] font-display font-black text-stone-400 uppercase tracking-[0.25em] ml-2">Nama Surat</label>
                      <input 
                        type="text"
                        className="w-full bg-white border border-stone-200/60 rounded-2xl px-6 py-5 text-lg font-bold focus:outline-none focus:ring-4 ring-stone-900/5 transition-all"
                        value={details.surah || ''}
                        onChange={e => setDetails({...details, surah: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-6 grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-display font-black text-stone-400 uppercase tracking-[0.25em] ml-2">Ayat Awal</label>
                        <input 
                          type="text"
                          className="w-full bg-white border border-stone-200/60 rounded-2xl px-6 py-5 text-lg font-bold text-center focus:outline-none focus:ring-4 ring-stone-900/5 transition-all"
                          value={details.verse_start || ''}
                          onChange={e => setDetails({...details, verse_start: e.target.value})}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-display font-black text-stone-400 uppercase tracking-[0.25em] ml-2">Ayat Akhir</label>
                        <input 
                          type="text"
                          className="w-full bg-white border border-stone-200/60 rounded-2xl px-6 py-5 text-lg font-bold text-center focus:outline-none focus:ring-4 ring-stone-900/5 transition-all"
                          value={details.verse_end || ''}
                          onChange={e => setDetails({...details, verse_end: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="md:col-span-6 space-y-3">
                      <label className="text-[10px] font-display font-black text-stone-400 uppercase tracking-[0.25em] ml-2">Nilai</label>
                      <div className="grid grid-cols-3 gap-3">
                        {(['A', 'B', 'C'] as const).map(g => (
                           <button
                             type="button"
                             key={g}
                             onClick={() => setDetails({...details, grade: g})}
                             className={cn(
                               "h-[68px] rounded-2xl font-display font-black border-2 transition-all flex items-center justify-center",
                               details.grade === g 
                                ? "bg-stone-950 border-stone-950 text-white shadow-xl" 
                                : "bg-white border-stone-100 text-stone-400 hover:border-stone-300 hover:text-stone-950"
                             )}
                           >
                             {g}
                           </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className={cn(
                    "flex-[2] text-white py-6 rounded-[1.5rem] font-display font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-2xl hover:translate-y-[-2px] active:translate-y-[1px]",
                    theme.bg, theme.shadow,
                    "disabled:opacity-50"
                  )}
                >
                  <Save size={20} />
                  {isSaving ? 'Processing...' : 'Simpan Setoran'}
                </button>
                <div className="flex flex-1 gap-4">
                  <button 
                    type="button"
                    onClick={handleSendMessage}
                    disabled={!selectedStudent || !details.grade}
                    className="flex-1 bg-white text-emerald-600 border-2 border-emerald-500 py-6 rounded-[1.5rem] font-display font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-50 transition-all active:scale-95 disabled:opacity-50 shadow-xl"
                    title="Kirim laporan ke WhatsApp orang tua"
                  >
                    <MessageCircle size={18} />
                    WA Report
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="aspect-square bg-rose-50 text-rose-600 rounded-[1.5rem] font-bold hover:bg-rose-100 transition-all flex items-center justify-center border border-rose-100"
                    title="Hapus Setoran"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 bg-white rounded-[3.5rem] border border-stone-200 border-dashed text-stone-400 space-y-6">
            <div className="w-24 h-24 bg-stone-50 rounded-[2rem] flex items-center justify-center shadow-inner">
              <ClipboardCheck size={40} className="opacity-20" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-display font-black text-stone-950 uppercase tracking-tighter">Ready to start?</h3>
              <p className="font-medium text-stone-400">Pilih salah satu siswa di panel kiri untuk mulai mencatat progress hari ini.</p>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteDeposit}
        title="Hapus Setoran"
        message={`Apakah Anda yakin ingin menghapus data setoran ${type} untuk ${selectedStudent?.name} pada tanggal ${format(new Date(date), 'dd MMMM yyyy')}?`}
        themeColor={themeColor}
      />
    </div>
  );
}
