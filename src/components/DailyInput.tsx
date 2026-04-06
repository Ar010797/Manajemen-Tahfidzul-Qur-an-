import React, { useState, useEffect, useMemo } from 'react';
import { ClipboardCheck, Save, Search, GripVertical, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { motion, Reorder } from 'motion/react';
import { cn } from '../lib/utils';
import { storage } from '../services/storage';

export default function DailyInput() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [type, setType] = useState<'hafalan' | 'ummi' | 'tilawah'>('hafalan');
  const [details, setDetails] = useState<any>({});
  const [search, setSearch] = useState('');
  const [showListOnMobile, setShowListOnMobile] = useState(true);

  const fetchExistingDeposit = () => {
    if (!selectedStudent || !date || !type) return;
    const data = storage.getDeposit(selectedStudent.id, type, date);
    if (data && data.details) {
      setDetails(data.details);
    } else {
      // If no deposit for today, try to auto-fill "Awal" from the last deposit
      const lastDeposit = storage.getLastDeposit(selectedStudent.id, type);
      if (lastDeposit && lastDeposit.details) {
        const lastDetails = lastDeposit.details;
        if (type === 'hafalan') {
          setDetails({
            surah: lastDetails.surah,
            verse_start: lastDetails.verse_end ? parseInt(lastDetails.verse_end) + 1 : '',
            verse_end: lastDetails.verse_end ? parseInt(lastDetails.verse_end) + 1 : ''
          });
        } else if (type === 'ummi') {
          setDetails({
            level: lastDetails.level,
            page_start: lastDetails.page_end ? parseInt(lastDetails.page_end) + 1 : '',
            page_end: lastDetails.page_end ? parseInt(lastDetails.page_end) + 1 : ''
          });
        } else if (type === 'tilawah') {
          setDetails({
            juz: lastDetails.juz,
            surah: lastDetails.surah,
            verse_start: lastDetails.verse_end ? parseInt(lastDetails.verse_end) + 1 : '',
            verse_end: lastDetails.verse_end ? parseInt(lastDetails.verse_end) + 1 : ''
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
    setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || isSaving) return;
    
    setIsSaving(true);
    try {
      storage.saveDeposit(selectedStudent.id, type, date, details);
      alert('Setoran berhasil disimpan!');
      // setDetails({}); // Keep details for quick editing if needed
    } catch (error) {
      console.error('Save error:', error);
      alert('Terjadi kesalahan saat menyimpan.');
    } finally {
      setIsSaving(false);
    }
  };

  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const handleReorder = (halaqohName: string, newOrder: any[]) => {
    setIsSavingOrder(true);
    // Update local state first for responsiveness
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
      setTimeout(() => setIsSavingOrder(false), 500);
    } catch (error) {
      console.error('Failed to save order:', error);
      setIsSavingOrder(false);
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
    
    // Sort halaqoh names alphabetically, but keep 'Tanpa Halaqoh' at the end
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

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
      <div className={cn(
        "lg:col-span-1 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm h-fit lg:sticky lg:top-8 z-10",
        !showListOnMobile && "hidden lg:block"
      )}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Search size={18} className="text-emerald-600" />
            Pilih Siswa
          </h3>
          {isSavingOrder && (
            <span className="text-[10px] text-emerald-600 font-bold animate-pulse">
              Menyimpan urutan...
            </span>
          )}
        </div>
        <input 
          type="text"
          placeholder="Cari nama..."
          className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-4 mb-6 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
                  <Reorder.Item
                    key={s.id}
                    value={s}
                    className={cn(
                      "w-full text-left p-3 rounded-xl transition-all border flex items-center gap-3 cursor-pointer group",
                      selectedStudent?.id === s.id 
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-bold shadow-sm shadow-emerald-100" 
                        : "bg-white border-stone-100 hover:border-emerald-200 hover:bg-stone-50 text-stone-600"
                    )}
                    onClick={() => handleSelectStudent(s)}
                  >
                    <div className="text-stone-300 group-hover:text-emerald-400 transition-colors">
                      <GripVertical size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{s.name}</p>
                    </div>
                  </Reorder.Item>
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
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-stone-900 leading-tight">{selectedStudent.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-stone-100 text-stone-500 text-[10px] font-bold rounded-full uppercase tracking-wider">
                      {selectedStudent.halaqoh_name || 'Tanpa Halaqoh'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Tanggal</label>
                  <input 
                    type="date"
                    className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
                        type === t ? "bg-white text-emerald-700 shadow-sm" : "text-stone-400 hover:text-stone-600"
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
                        type="number"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                        value={details.verse_start || ''}
                        onChange={e => setDetails({...details, verse_start: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Ayat Akhir</label>
                      <input 
                        type="number"
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
                        type="number"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                        value={details.page_start || ''}
                        onChange={e => setDetails({...details, page_start: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Hal Akhir</label>
                      <input 
                        type="number"
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
                        type="number"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                        value={details.verse_start || ''}
                        onChange={e => setDetails({...details, verse_start: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Ayat Akhir</label>
                      <input 
                        type="number"
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

              <button 
                type="submit"
                disabled={isSaving}
                className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 disabled:opacity-50"
              >
                <Save size={20} />
                {isSaving ? 'Menyimpan...' : 'Simpan Setoran'}
              </button>
            </form>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-stone-200 border-dashed text-stone-400">
            <ClipboardCheck size={48} className="mb-4 opacity-20" />
            <p className="font-medium">Pilih siswa di sebelah kiri untuk memulai input setoran.</p>
          </div>
        )}
      </div>
    </div>
  );
}
