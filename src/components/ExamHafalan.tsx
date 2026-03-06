import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Trash2, Save, CheckCircle2, Clock, Calendar, GraduationCap, Search, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { storage } from '../services/storage';

const GRADES = [
  { value: 'A+', label: 'MUMTAAZ' },
  { value: 'A', label: 'JAYYID JIDDAN' },
  { value: 'B+', label: 'JAYYID' },
  { value: 'B', label: 'MAQBUL' },
  { value: 'C', label: 'DHOIF' }
];

export default function ExamHafalan() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [surahs, setSurahs] = useState<any[]>([{ name: '', grade: 'A+', predicate: 'MUMTAAZ' }]);
  const [daysProgress, setDaysProgress] = useState<Record<number, string>>({});
  const [semester, setSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeExamId, setActiveExamId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showListOnMobile, setShowListOnMobile] = useState(true);

  useEffect(() => {
    const fetchStudents = () => {
      const data = storage.getStudents();
      setStudents(data);
    };
    fetchStudents();
  }, []);

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

  const fetchActiveExam = (studentId: string) => {
    const data = storage.getStudentExams(studentId);
    const active = data.hafalan.find((e: any) => e.status === 'ongoing');
    if (active) {
      setActiveExamId(active.id);
      setSurahs(active.surahs);
      setDaysProgress(active.days_progress);
      setNote(active.note);
      setSemester(active.semester || 'Ganjil');
    } else {
      setActiveExamId(null);
      setSurahs([{ name: '', grade: 'A+', predicate: 'MUMTAAZ' }]);
      setDaysProgress({});
      setNote('');
    }
  };

  useEffect(() => {
    if (selectedStudent) {
      fetchActiveExam(selectedStudent.id);
    }
  }, [selectedStudent]);

  const addSurah = () => {
    setSurahs([...surahs, { name: '', grade: 'A+', predicate: 'MUMTAAZ' }]);
  };

  const removeSurah = (index: number) => {
    setSurahs(surahs.filter((_, i) => i !== index));
  };

  const updateSurah = (index: number, field: string, value: string) => {
    const newSurahs = [...surahs];
    newSurahs[index][field] = value;
    if (field === 'grade') {
      newSurahs[index].predicate = GRADES.find(g => g.value === value)?.label || '';
    }
    setSurahs(newSurahs);
  };

  const saveProgress = useCallback((status: 'ongoing' | 'completed' = 'ongoing') => {
    if (!selectedStudent) return;
    setLoading(true);
    
    const payload = {
      student_id: selectedStudent.id,
      surahs,
      note,
      date: format(new Date(), 'yyyy-MM-dd'),
      days_progress: daysProgress,
      status,
      semester
    };

    try {
      if (activeExamId) {
        storage.updateHafalanExam(activeExamId, payload);
      } else {
        const newExam = storage.addHafalanExam(payload);
        setActiveExamId(newExam.id);
      }
      
      if (status === 'completed') {
        alert('Ujian selesai dan disimpan!');
        setSelectedStudent(null);
        setActiveExamId(null);
        setShowListOnMobile(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [selectedStudent, surahs, note, daysProgress, activeExamId, semester]);

  // Autosave every 30 seconds if there are changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedStudent) saveProgress('ongoing');
    }, 30000);
    return () => clearTimeout(timer);
  }, [surahs, daysProgress, note, selectedStudent, saveProgress]);

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
        <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
          <Search size={18} className="text-emerald-600" />
          Pilih Siswa
        </h3>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text"
            placeholder="Cari nama..."
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
                    onClick={() => handleSelectStudent(s)}
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
                  <p className="text-stone-500 text-sm">Ujian Hafalan Progresif (6 Hari)</p>
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

              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => saveProgress('ongoing')}
                  disabled={loading}
                  className="flex-1 sm:flex-none p-3 bg-stone-100 text-stone-600 rounded-xl hover:bg-stone-200 transition-all flex items-center justify-center"
                  title="Simpan Draft"
                >
                  <Save size={20} />
                </button>
                <button 
                  onClick={() => saveProgress('completed')}
                  disabled={loading}
                  className="flex-[2] sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle2 size={18} />
                  Selesai
                </button>
              </div>
            </div>

            <div className="space-y-8">
              {/* 6-Day Progress Tracking */}
              <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Clock size={14} />
                  Penilaian Bertahap (6 Hari)
                </h4>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {[1, 2, 3, 4, 5, 6].map(day => (
                    <div key={day} className="space-y-2">
                      <label className="block text-[10px] font-bold text-stone-400 text-center">Hari {day}</label>
                      <select
                        value={daysProgress[day] || ''}
                        onChange={(e) => setDaysProgress({ ...daysProgress, [day]: e.target.value })}
                        className={cn(
                          "w-full text-xs py-2 px-1 rounded-lg border transition-all text-center font-bold",
                          daysProgress[day] 
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                            : "bg-white border-stone-200 text-stone-400"
                        )}
                      >
                        <option value="">-</option>
                        <option value="Hadir">Hadir</option>
                        <option value="Izin">Izin</option>
                        <option value="Sakit">Sakit</option>
                        <option value="Alpa">Alpa</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Surahs */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Daftar Surat yang Diujikan</h4>
                  <button 
                    onClick={addSurah}
                    className="text-emerald-600 hover:text-emerald-700 text-xs font-bold flex items-center gap-1"
                  >
                    <Plus size={14} />
                    Tambah Surat
                  </button>
                </div>
                
                <div className="space-y-3">
                  {surahs.map((surah, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 items-center p-4 bg-stone-50 rounded-2xl border border-stone-100 group">
                      <div className="col-span-5">
                        <input 
                          type="text"
                          placeholder="Nama Surat & Ayat..."
                          className="w-full bg-white border border-stone-200 rounded-xl py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                          value={surah.name}
                          onChange={(e) => updateSurah(index, 'name', e.target.value)}
                        />
                      </div>
                      <div className="col-span-3">
                        <select 
                          className="w-full bg-white border border-stone-200 rounded-xl py-2 px-3 text-sm font-bold text-emerald-700 focus:outline-none"
                          value={surah.grade}
                          onChange={(e) => updateSurah(index, 'grade', e.target.value)}
                        >
                          {GRADES.map(g => (
                            <option key={g.value} value={g.value}>{g.value}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-3">
                        <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Predikat</div>
                        <div className="text-xs font-bold text-stone-600">{surah.predicate}</div>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button 
                          onClick={() => removeSurah(index)}
                          className="text-stone-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Catatan Guru</label>
                <textarea 
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 min-h-[100px]"
                  placeholder="Berikan motivasi atau catatan perkembangan..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-stone-200 border-dashed text-stone-400">
            <GraduationCap size={48} className="mb-4 opacity-20" />
            <p className="font-medium">Pilih siswa untuk memulai ujian hafalan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
