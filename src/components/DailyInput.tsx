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
        "w-full text-left p-3 rounded-xl transition-all border flex items-center gap-3 cursor-pointer group",
        selectedStudent?.id === s.id 
          ? `${theme.lightBg} ${theme.border} ${theme.lightText} font-bold shadow-sm ${theme.pillShadow}` 
          : `bg-white border-stone-100 ${theme.hoverBorder} hover:bg-stone-50 text-stone-600`
      )}
      onClick={() => handleSelectStudent(s)}
    >
      <div 
        className={cn("text-stone-300 transition-colors cursor-grab active:cursor-grabbing p-1 -ml-1 rounded hover:bg-stone-100", `group-hover:${theme.text}`)}
        onPointerDown={(e) => controls.start(e)}
        style={{ touchAction: 'none' }}
      >
        <GripVertical size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate">{s.name}</p>
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
          const lastEnd = lastDetails.verse_end ? parseInt(lastDetails.verse_end) : 0;
          setDetails({
            surah: lastDetails.surah,
            verse_start: lastEnd ? (shouldAdvance ? lastEnd + 1 : lastEnd) : '',
            verse_end: lastEnd ? (shouldAdvance ? lastEnd + 1 : lastEnd) : ''
          });
        } else if (type === 'ummi') {
          const shouldAdvance = lastDetails.grade === 'A' || lastDetails.grade === 'B';
          const lastEnd = lastDetails.page_end ? parseInt(lastDetails.page_end) : 0;
          setDetails({
            level: lastDetails.level,
            page_start: lastEnd ? (shouldAdvance ? lastEnd + 1 : lastEnd) : '',
            page_end: lastEnd ? (shouldAdvance ? lastEnd + 1 : lastEnd) : ''
          });
        } else if (type === 'tilawah') {
          const shouldAdvance = lastDetails.grade === 'A' || lastDetails.grade === 'B';
          const lastEnd = lastDetails.verse_end ? parseInt(lastDetails.verse_end) : 0;
          setDetails({
            juz: lastDetails.juz,
            surah: lastDetails.surah,
            verse_start: lastEnd ? (shouldAdvance ? lastEnd + 1 : lastEnd) : '',
            verse_end: lastEnd ? (shouldAdvance ? lastEnd + 1 : lastEnd) : ''
          });
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
    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
      <div className={cn(
        "lg:col-span-1 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm h-fit lg:sticky lg:top-8 z-10",
        !showListOnMobile && "hidden lg:block"
      )}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Search size={18} className={theme.text} />
            Pilih Siswa
          </h3>
        </div>
        <input 
          type="text"
          placeholder="Cari nama..."
          className={cn("w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-4 mb-6 focus:outline-none focus:ring-2", theme.ring)}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        
        <div className="space-y-6 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
          {Object.entries(groupedStudents).map(([halaqohName, halaqohStudents]) => (
            <div key={halaqohName} className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  {halaqohName}
                </h4>
                <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                  {(halaqohStudents as any[]).length} Siswa
                </span>
              </div>
              
              <Reorder.Group 
                axis="y" 
                values={halaqohStudents as any[]} 
                onReorder={(newOrder) => handleReorder(halaqohName, newOrder)}
                className="space-y-2"
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
            <div className="text-center py-8 text-stone-400">
              <p className="text-sm italic">Siswa tidak ditemukan</p>
            </div>
          )}
        </div>
      </div>

      <div className={cn(
        "lg:col-span-2 space-y-6",
        showListOnMobile && "hidden lg:block"
      )}>
        {selectedStudent ? (
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
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handlePrevStudent}
                    className="p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <h2 className="text-xl lg:text-2xl font-bold text-stone-900 leading-tight">{selectedStudent.name}</h2>
                  <button 
                    onClick={handleNextStudent}
                    className="p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Tanggal</label>
                  <input 
                    type="date"
                    className={cn("bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-600 focus:outline-none focus:ring-2", theme.ring)}
                    value={date}
                    onChange={e => setDate(e.target.value)}
                  />
                </div>
                <div className="flex bg-stone-100 p-1 rounded-xl w-full sm:w-fit">
                  {(['hafalan', 'ummi', 'tilawah'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => { setType(t); setDetails({}); }}
                      className={cn(
                        "flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all capitalize",
                        type === t ? `bg-white ${theme.lightText} shadow-sm` : "text-stone-400 hover:text-stone-600"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {type === 'hafalan' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Nama Surat</label>
                    <input 
                      type="text"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                      placeholder="Contoh: An-Naba"
                      value={details.surah || ''}
                      onChange={e => setDetails({...details, surah: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Ayat Awal</label>
                      <input 
                        type="text"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                        value={details.verse_start || ''}
                        onChange={e => setDetails({...details, verse_start: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Ayat Akhir</label>
                      <input 
                        type="text"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                        value={details.verse_end || ''}
                        onChange={e => setDetails({...details, verse_end: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Nilai</label>
                    <select 
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                      value={details.grade || ''}
                      onChange={e => setDetails({...details, grade: e.target.value})}
                    >
                      <option value="">Pilih Nilai</option>
                      <option value="L">L (Lancar)</option>
                      <option value="CL">CL (Cukup Lancar)</option>
                      <option value="BL">BL (Belum Lancar)</option>
                    </select>
                  </div>
                </div>
              )}

              {type === 'ummi' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Jilid</label>
                    <select 
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                      value={details.level || ''}
                      onChange={e => setDetails({...details, level: e.target.value})}
                    >
                      <option value="">Pilih Jilid</option>
                      {[1,2,3,4,5,6].map(i => <option key={i} value={i}>Jilid {i}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Hal Awal</label>
                      <input 
                        type="text"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                        value={details.page_start || ''}
                        onChange={e => setDetails({...details, page_start: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Hal Akhir</label>
                      <input 
                        type="text"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                        value={details.page_end || ''}
                        onChange={e => setDetails({...details, page_end: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Nilai</label>
                    <select 
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                      value={details.grade || ''}
                      onChange={e => setDetails({...details, grade: e.target.value})}
                    >
                      <option value="">Pilih Nilai</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </div>
                </div>
              )}

              {type === 'tilawah' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Juz</label>
                    <select 
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                      value={details.juz || ''}
                      onChange={e => setDetails({...details, juz: e.target.value})}
                    >
                      <option value="">Pilih Juz</option>
                      {Array.from({length: 30}, (_, i) => i + 1).map(i => (
                        <option key={i} value={i}>Juz {i}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Nama Surat</label>
                    <input 
                      type="text"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                      value={details.surah || ''}
                      onChange={e => setDetails({...details, surah: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Ayat Awal</label>
                      <input 
                        type="text"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                        value={details.verse_start || ''}
                        onChange={e => setDetails({...details, verse_start: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Ayat Akhir</label>
                      <input 
                        type="text"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                        value={details.verse_end || ''}
                        onChange={e => setDetails({...details, verse_end: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Nilai</label>
                    <select 
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                      value={details.grade || ''}
                      onChange={e => setDetails({...details, grade: e.target.value})}
                    >
                      <option value="">Pilih Nilai</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className={cn(
                    "flex-1 min-w-[200px] text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg",
                    theme.bg, "hover:opacity-90", theme.shadow,
                    "disabled:opacity-50"
                  )}
                >
                  <Save size={20} />
                  {isSaving ? 'Menyimpan...' : 'Simpan Setoran'}
                </button>
                <button 
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!selectedStudent || !details.grade}
                  className="flex-1 min-w-[150px] bg-white text-emerald-600 border-2 border-emerald-500 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                  title="Kirim laporan ke WhatsApp orang tua"
                >
                  <MessageCircle size={20} />
                  Kirim WA
                </button>
                <button 
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-6 py-4 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2 border border-red-100"
                  title="Hapus Setoran Hari Ini"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-stone-200 border-dashed text-stone-400">
            <ClipboardCheck size={48} className="mb-4 opacity-20" />
            <p className="font-medium">Pilih siswa di sebelah kiri untuk memulai input setoran.</p>
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
