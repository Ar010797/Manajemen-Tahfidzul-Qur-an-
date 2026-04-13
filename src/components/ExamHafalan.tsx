import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Trash2, Save, CheckCircle2, Clock, Calendar, GraduationCap, Search, ChevronLeft, TrendingUp, BarChart3 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '../lib/utils';
import { storage } from '../services/storage';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

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
  const [target, setTarget] = useState('');
  const [semester, setSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeExamId, setActiveExamId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showListOnMobile, setShowListOnMobile] = useState(true);
  const [themeColor, setThemeColor] = useState('emerald');

  useEffect(() => {
    const inst = storage.getInstitution();
    setThemeColor(inst.theme_color || 'emerald');
  }, []);

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
    hover: themeColor === 'emerald' ? 'hover:bg-emerald-500' :
           themeColor === 'blue' ? 'hover:bg-blue-500' :
           themeColor === 'amber' ? 'hover:bg-amber-500' :
           themeColor === 'indigo' ? 'hover:bg-indigo-500' :
           themeColor === 'purple' ? 'hover:bg-purple-500' :
           themeColor === 'rose' ? 'hover:bg-rose-500' :
           'hover:bg-slate-500',
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
    pillShadow: themeColor === 'emerald' ? 'shadow-emerald-100' :
                themeColor === 'blue' ? 'shadow-blue-100' :
                themeColor === 'amber' ? 'shadow-amber-100' :
                themeColor === 'indigo' ? 'shadow-indigo-100' :
                themeColor === 'purple' ? 'shadow-purple-100' :
                themeColor === 'rose' ? 'shadow-rose-100' :
                'shadow-slate-100',
    hoverBorder: themeColor === 'emerald' ? 'hover:border-emerald-200' :
                 themeColor === 'blue' ? 'hover:border-blue-200' :
                 themeColor === 'amber' ? 'hover:border-amber-200' :
                 themeColor === 'indigo' ? 'hover:border-indigo-200' :
                 themeColor === 'purple' ? 'hover:border-purple-200' :
                 themeColor === 'rose' ? 'hover:border-rose-200' :
                 'hover:border-slate-200',
  };

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
      setTarget(active.target || '');
      setSemester(active.semester || 'Ganjil');
    } else {
      setActiveExamId(null);
      setSurahs([{ name: '', grade: 'A+', predicate: 'MUMTAAZ' }]);
      setDaysProgress({});
      setNote('');
      setTarget('');
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
      semester,
      target
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

  const progressData = useMemo(() => {
    if (!selectedStudent) return [];
    const exams = storage.getStudentExams(selectedStudent.id).hafalan;
    return [...exams]
      .filter(e => e.status === 'completed')
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(e => ({
        date: format(parseISO(e.date), 'dd/MM'),
        fullDate: format(parseISO(e.date), 'dd MMM yyyy'),
        surahCount: e.surahs.length,
        avgGrade: e.surahs.reduce((acc: number, s: any) => {
          const gradeMap: Record<string, number> = { 'A+': 5, 'A': 4, 'B+': 3, 'B': 2, 'C': 1 };
          return acc + (gradeMap[s.grade] || 0);
        }, 0) / e.surahs.length
      }));
  }, [selectedStudent]);

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
      <div className={cn(
        "lg:col-span-1 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm h-fit lg:sticky lg:top-8 z-10",
        !showListOnMobile && "hidden lg:block"
      )}>
        <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
          <Search size={18} className={theme.text} />
          Pilih Siswa
        </h3>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text"
            placeholder="Cari nama..."
            className={cn("w-full bg-stone-50 border border-stone-200 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2", theme.ring)}
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
                        ? `${theme.lightBg} ${theme.border} ${theme.lightText} font-bold shadow-sm ${theme.pillShadow}` 
                        : `bg-white border-stone-100 ${theme.hoverBorder} hover:bg-stone-50 text-stone-600`
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

              {progressData.length > 0 && (
                <div className="hidden md:flex items-center gap-4">
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 w-48">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp size={14} className={theme.text} />
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Total Ujian</span>
                    </div>
                    <div className="text-2xl font-black text-stone-900">{progressData.length}</div>
                  </div>
                </div>
              )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Target Hafalan</label>
                <input 
                  type="text"
                  placeholder="Contoh: Juz 30 / An-Naba - An-Naziat"
                  className={cn("w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2", theme.ring)}
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-xl w-full">
                  <button
                    onClick={() => setSemester('Ganjil')}
                    className={cn(
                      "flex-1 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                      semester === 'Ganjil' ? `bg-white ${theme.text} shadow-sm` : "text-stone-500 hover:text-stone-700"
                    )}
                  >
                    Ganjil
                  </button>
                  <button
                    onClick={() => setSemester('Genap')}
                    className={cn(
                      "flex-1 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                      semester === 'Genap' ? `bg-white ${theme.text} shadow-sm` : "text-stone-500 hover:text-stone-700"
                    )}
                  >
                    Genap
                  </button>
                </div>
              </div>
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
                  className={cn("flex-[2] sm:flex-none flex items-center justify-center gap-2 px-6 py-3 text-white rounded-xl font-bold transition-all shadow-lg", theme.bg, theme.hover, theme.shadow.replace('10', '20'))}
                >
                  <CheckCircle2 size={18} />
                  Selesai
                </button>
              </div>
            </div>

            <div className="space-y-8">
              {progressData.length > 1 && (
                <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100">
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <BarChart3 size={14} className={theme.text} />
                    Statistik Jumlah Surat per Ujian
                  </h4>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="date" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fill: '#9ca3af' }}
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fill: '#9ca3af' }}
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                          formatter={(value: number) => [value, 'Jumlah Surat']}
                        />
                        <Bar 
                          dataKey="surahCount" 
                          radius={[6, 6, 0, 0]}
                          barSize={32}
                        >
                          {progressData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={themeColor === 'emerald' ? '#10b981' : themeColor === 'blue' ? '#3b82f6' : '#f59e0b'} 
                              fillOpacity={0.6 + (index / progressData.length) * 0.4}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

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
