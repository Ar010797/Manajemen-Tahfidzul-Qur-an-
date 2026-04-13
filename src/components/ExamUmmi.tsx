import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Save, Search, ChevronLeft, TrendingUp, BarChart3 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '../lib/utils';
import { storage } from '../services/storage';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const UMMI_INDICATORS: Record<number, string[]> = {
  1: ['Makhroj', 'Huruf Hijaiyyah'],
  2: ['Harokat', 'Huruf Sambung', 'Angka Arab'],
  3: ['Mad Tobi\'i', 'Mad Wajib', 'Mad Jaiz'],
  4: ['Penekanan Huruf Disukun', 'Penekanan Huruf Ditasyid'],
  5: ['Waqof', 'Bacaan Lafadz Allah', 'Bacaan Dengung'],
  6: ['Qolqolah', 'Nun Iwadz'],
  7: ['Kelancaran', 'Tajwid', 'Fashohah'] // Tilawah Pasca J6
};

export default function ExamUmmi() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [level, setLevel] = useState<number>(1);
  const [target, setTarget] = useState('');
  const [semester, setSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');
  const [allScores, setAllScores] = useState<Record<number, Record<string, string>>>({});
  const [search, setSearch] = useState('');
  const [showListOnMobile, setShowListOnMobile] = useState(true);
  const [themeColor, setThemeColor] = useState('emerald');

  useEffect(() => {
    const inst = storage.getInstitution();
    setThemeColor(inst.theme_color || 'emerald');
  }, []);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    
    const levelsToSave = Object.keys(allScores).map(Number);
    
    if (levelsToSave.length === 0) {
      alert('Pilih setidaknya satu nilai untuk disimpan.');
      return;
    }

    try {
      for (const l of levelsToSave) {
        storage.addUmmiExam({
          student_id: selectedStudent.id,
          level: l,
          scores: allScores[l],
          date: format(new Date(), 'yyyy-MM-dd'),
          semester,
          target
        });
      }
      
      alert('Semua nilai ujian Ummi berhasil disimpan!');
      setAllScores({});
    } catch (error) {
      console.error('Error saving Ummi exams:', error);
      alert('Gagal menyimpan nilai.');
    }
  };

  const setScore = (lvl: number, indicator: string, grade: string) => {
    setAllScores(prev => ({
      ...prev,
      [lvl]: {
        ...(prev[lvl] || {}),
        [indicator]: grade
      }
    }));
  };

  const handleSelectStudent = (s: any) => {
    setSelectedStudent(s);
    setShowListOnMobile(false);
  };

  const progressData = useMemo(() => {
    if (!selectedStudent) return [];
    const exams = storage.getStudentExams(selectedStudent.id).ummi;
    return [...exams]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(e => ({
        date: format(parseISO(e.date), 'dd/MM'),
        fullDate: format(parseISO(e.date), 'dd MMM yyyy'),
        level: e.level,
        levelName: e.level === 7 ? 'Tilawah' : `Jilid ${e.level}`
      }));
  }, [selectedStudent]);

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
        <input 
          type="text"
          placeholder="Cari nama..."
          className={cn("w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-4 mb-6 focus:outline-none focus:ring-2", theme.ring)}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        
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
                  <p className="text-stone-500 text-sm">Input Nilai Ujian Ummi / Tilawah</p>
                </div>
              </div>

              {progressData.length > 0 && (
                <div className="hidden md:block bg-stone-50 p-4 rounded-2xl border border-stone-100 w-64">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={14} className={theme.text} />
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Progress Terakhir</span>
                  </div>
                  <div className="h-16 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={progressData}>
                        <defs>
                          <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={themeColor === 'emerald' ? '#10b981' : themeColor === 'blue' ? '#3b82f6' : '#f59e0b'} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={themeColor === 'emerald' ? '#10b981' : themeColor === 'blue' ? '#3b82f6' : '#f59e0b'} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="level" stroke={themeColor === 'emerald' ? '#10b981' : themeColor === 'blue' ? '#3b82f6' : '#f59e0b'} fillOpacity={1} fill="url(#colorLevel)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
              
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Target Ummi / Tajwid</label>
                <input 
                  type="text"
                  placeholder="Contoh: Ummi Jilid 4"
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
            </div>

            <div className="flex flex-wrap gap-2 mb-8 bg-stone-50 p-2 rounded-2xl border border-stone-100">
              {[1,2,3,4,5,6,7].map(l => {
                const hasScores = allScores[l] && Object.keys(allScores[l]).length > 0;
                return (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLevel(l)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all relative",
                      level === l ? `${theme.bg} text-white shadow-lg ${theme.shadow.replace('10', '20')}` : "bg-stone-100 text-stone-500 hover:bg-stone-200",
                      hasScores && level !== l && `border-2 ${theme.border.replace('200', '500')}`
                    )}
                  >
                    {l === 7 ? 'Tilawah' : `Jilid ${l}`}
                    {hasScores && (
                      <span className={cn("absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white", theme.bg)} />
                    )}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {progressData.length > 1 && (
                <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100">
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <BarChart3 size={14} className={theme.text} />
                    Grafik Perkembangan Jilid
                  </h4>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="date" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fill: '#9ca3af' }}
                          dy={10}
                        />
                        <YAxis 
                          domain={[1, 7]} 
                          ticks={[1, 2, 3, 4, 5, 6, 7]} 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fill: '#9ca3af' }}
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                          formatter={(value: number) => [value === 7 ? 'Tilawah' : `Jilid ${value}`, 'Level']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="level" 
                          stroke={themeColor === 'emerald' ? '#10b981' : themeColor === 'blue' ? '#3b82f6' : '#f59e0b'} 
                          strokeWidth={3} 
                          dot={{ r: 4, fill: themeColor === 'emerald' ? '#10b981' : themeColor === 'blue' ? '#3b82f6' : '#f59e0b', strokeWidth: 2, stroke: '#fff' }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              <div className="grid gap-6">
                {UMMI_INDICATORS[level].map(indicator => (
                  <div key={indicator} className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100">
                    <span className="font-semibold text-stone-700">{indicator}</span>
                    <div className="flex gap-2">
                      {['A', 'B', 'C'].map(grade => (
                        <button
                          key={grade}
                          type="button"
                          onClick={() => setScore(level, indicator, grade)}
                          className={cn(
                            "w-10 h-10 rounded-lg font-bold transition-all",
                            allScores[level]?.[indicator] === grade 
                              ? `${theme.bg} text-white shadow-md` 
                              : `bg-white text-stone-400 border border-stone-200 ${theme.hoverBorder.replace('200', '300')}`
                          )}
                        >
                          {grade}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button 
                type="submit"
                className={cn("w-full text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg", theme.bg, theme.hover, theme.shadow)}
              >
                <Save size={20} />
                Simpan Nilai Ujian
              </button>
            </form>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-stone-200 border-dashed text-stone-400">
            <BookOpen size={48} className="mb-4 opacity-20" />
            <p className="font-medium">Pilih siswa untuk memulai ujian.</p>
          </div>
        )}
      </div>
    </div>
  );
}
