import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Save, Search, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { storage } from '../services/storage';

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
  const [semester, setSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');
  const [allScores, setAllScores] = useState<Record<number, Record<string, string>>>({});
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
          semester
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
        <input 
          type="text"
          placeholder="Cari nama..."
          className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-4 mb-6 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
                  <p className="text-stone-500 text-sm">Input Nilai Ujian Ummi / Tilawah</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-xl">
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
                      level === l ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" : "bg-stone-100 text-stone-500 hover:bg-stone-200",
                      hasScores && level !== l && "border-2 border-emerald-500"
                    )}
                  >
                    {l === 7 ? 'Tilawah' : `Jilid ${l}`}
                    {hasScores && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                    )}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
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
                              ? "bg-emerald-600 text-white shadow-md" 
                              : "bg-white text-stone-400 border border-stone-200 hover:border-emerald-300"
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
                className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
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
