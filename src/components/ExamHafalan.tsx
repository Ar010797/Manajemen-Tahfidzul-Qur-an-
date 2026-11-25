import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Clock,
  Calendar,
  GraduationCap,
  Search,
  ChevronLeft,
  TrendingUp,
  BarChart3,
  Edit2,
  Check,
  X,
  ArrowRight,
  BookOpen,
  AlertCircle,
  Copy,
  RotateCcw,
  Award
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { cn } from '../lib/utils';
import { storage } from '../services/storage';
import { SURAH_LIST } from '../constants/surahs';
import ConfirmModal from './ConfirmModal';
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

export interface ExamDayRecord {
  id: string;
  day_number: number;
  date: string;
  grade: string;
  predicate: string;
  surah_tested: string;
  attendance: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';
  note: string;
  saved_at: string;
}

export interface ExamSurahItem {
  id: string;
  name: string;
  grade: string;
  predicate: string;
}

const GRADES = [
  { value: 'A+', label: 'MUMTAAZ', score: 5 },
  { value: 'A', label: 'JAYYID JIDDAN', score: 4 },
  { value: 'B+', label: 'JAYYID', score: 3 },
  { value: 'B', label: 'MAQBUL', score: 2 },
  { value: 'C', label: 'DHOIF', score: 1 }
] as const;

const ATTENDANCES: Array<'Hadir' | 'Izin' | 'Sakit' | 'Alpa'> = ['Hadir', 'Izin', 'Sakit', 'Alpa'];

const makeLocalId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

const getPredicateForGrade = (grade: string) =>
  GRADES.find(g => g.value === grade)?.label || 'MUMTAAZ';

const getScoreForGrade = (grade: string) =>
  GRADES.find(g => g.value === grade)?.score || 0;

const getGradeFromAverage = (avg: number) => {
  if (avg >= 4.5) return { grade: 'A+', label: 'MUMTAAZ' };
  if (avg >= 3.5) return { grade: 'A', label: 'JAYYID JIDDAN' };
  if (avg >= 2.5) return { grade: 'B+', label: 'JAYYID' };
  if (avg >= 1.5) return { grade: 'B', label: 'MAQBUL' };
  if (avg > 0) return { grade: 'C', label: 'DHOIF' };
  return { grade: '-', label: 'BELUM DINILAI' };
};

const formatDisplayDate = (dateStr?: string) => {
  if (!dateStr) return '-';
  try {
    return format(parseISO(dateStr), 'dd MMM yyyy', { locale: localeId });
  } catch {
    return dateStr;
  }
};

const formatDisplayDateTime = (isoStr?: string) => {
  if (!isoStr) return '-';
  try {
    return format(new Date(isoStr), 'dd MMM yyyy, HH:mm', { locale: localeId });
  } catch {
    return isoStr;
  }
};

const normalizeSurahKey = (name?: string) =>
  (name || '').trim().replace(/\s+/g, ' ').toLowerCase();

const extractBaseSurahKey = (name?: string) => {
  const cleaned = normalizeSurahKey(name);
  if (!cleaned) return '';
  return cleaned.split(/[:(\d]|ayat/i)[0].replace(/[-–—]+$/g, '').trim();
};

const normalizeSurahList = (rawSurahs: any): ExamSurahItem[] => {
  let list: any[] = [];
  if (Array.isArray(rawSurahs)) {
    list = rawSurahs;
  } else if (typeof rawSurahs === 'string') {
    try {
      const parsed = JSON.parse(rawSurahs);
      if (Array.isArray(parsed)) list = parsed;
    } catch {
      list = [];
    }
  }
  return list
    .filter(s => s && (typeof s.name === 'string' || typeof s === 'string'))
    .map(s => {
      if (typeof s === 'string') {
        return { id: makeLocalId(), name: s, grade: 'A+', predicate: 'MUMTAAZ' };
      }
      const grade = s.grade || 'A+';
      return {
        id: s.id || makeLocalId(),
        name: s.name || '',
        grade,
        predicate: s.predicate || getPredicateForGrade(grade)
      };
    })
    .filter(s => s.name.trim() !== '');
};

const normalizeDayRecords = (exam: any): ExamDayRecord[] => {
  if (Array.isArray(exam?.day_records) && exam.day_records.length > 0) {
    return [...exam.day_records]
      .sort((a, b) => (a.day_number || 0) - (b.day_number || 0))
      .map((d, idx) => {
        const grade = d.grade || 'A';
        return {
          id: d.id || makeLocalId(),
          day_number: d.day_number || idx + 1,
          date: d.date || exam.date || format(new Date(), 'yyyy-MM-dd'),
          grade,
          predicate: d.predicate || getPredicateForGrade(grade),
          surah_tested: d.surah_tested || '',
          attendance: (ATTENDANCES.includes(d.attendance) ? d.attendance : 'Hadir') as ExamDayRecord['attendance'],
          note: d.note || '',
          saved_at: d.saved_at || exam.updated_at || exam.date || ''
        };
      });
  }

  // Backward compatibility migration for legacy 6-day days_progress map
  if (exam?.days_progress && typeof exam.days_progress === 'object') {
    const entries = Object.entries(exam.days_progress)
      .filter(([, val]) => Boolean(val && String(val).trim()))
      .sort(([a], [b]) => Number(a) - Number(b));

    if (entries.length > 0) {
      const fallbackGrade = exam.surahs?.[0]?.grade || 'A';
      return entries.map(([dayKey, attVal], idx) => ({
        id: makeLocalId(),
        day_number: Number(dayKey) || idx + 1,
        date: exam.date || format(new Date(), 'yyyy-MM-dd'),
        grade: fallbackGrade,
        predicate: getPredicateForGrade(fallbackGrade),
        surah_tested: '',
        attendance: (ATTENDANCES.includes(attVal as any) ? attVal : 'Hadir') as ExamDayRecord['attendance'],
        note: '',
        saved_at: exam.date || ''
      }));
    }
  }

  return [];
};

const buildDaysProgressMap = (records: ExamDayRecord[]): Record<number, string> => {
  const map: Record<number, string> = {};
  records.forEach(r => {
    map[r.day_number] = r.attendance || 'Hadir';
  });
  return map;
};

export default function ExamHafalan() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [examListVersion, setExamListVersion] = useState(0);

  // Active exam state
  const [activeExamId, setActiveExamId] = useState<string | null>(null);
  const [activeExamStatus, setActiveExamStatus] = useState<'ongoing' | 'completed'>('ongoing');
  const [target, setTarget] = useState('');
  const [semester, setSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');
  const [note, setNote] = useState('');
  const [completedAt, setCompletedAt] = useState<string | undefined>(undefined);
  const [surahs, setSurahs] = useState<ExamSurahItem[]>([]);
  const [dayRecords, setDayRecords] = useState<ExamDayRecord[]>([]);

  // Active day input form (Hari berikutnya / Hari ini)
  const [isAddingNewDay, setIsAddingNewDay] = useState(true);
  const [todayDate, setTodayDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [todayGrade, setTodayGrade] = useState('A+');
  const [todaySurahTested, setTodaySurahTested] = useState('');
  const [todayAttendance, setTodayAttendance] = useState<'Hadir' | 'Izin' | 'Sakit' | 'Alpa'>('Hadir');
  const [todayNote, setTodayNote] = useState('');
  const [autoSyncSurah, setAutoSyncSurah] = useState(true);

  // Saved status banner info
  const [lastSavedStatus, setLastSavedStatus] = useState<{
    dayNumber: number;
    date: string;
    savedAt: string;
    grade: string;
    predicate: string;
    surahTested: string;
    isJustSaved: boolean;
  } | null>(null);

  // Inline Day Edit state
  const [editingDayId, setEditingDayId] = useState<string | null>(null);
  const [editDayForm, setEditDayForm] = useState<ExamDayRecord | null>(null);

  // Inline Surah Add/Edit state
  const [isAddingSurah, setIsAddingSurah] = useState(false);
  const [newSurahForm, setNewSurahForm] = useState({ name: '', grade: 'A+' });
  const [editingSurahId, setEditingSurahId] = useState<string | null>(null);
  const [editSurahForm, setEditSurahForm] = useState({ name: '', grade: 'A+' });

  // UI & Notifications
  const [search, setSearch] = useState('');
  const [showListOnMobile, setShowListOnMobile] = useState(true);
  const [themeColor, setThemeColor] = useState('emerald');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Confirm Modals
  const [dayToDelete, setDayToDelete] = useState<ExamDayRecord | null>(null);
  const [surahToDelete, setSurahToDelete] = useState<ExamSurahItem | null>(null);
  const [examToDeleteId, setExamToDeleteId] = useState<string | null>(null);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  const dayFormRef = useRef<HTMLDivElement>(null);
  const recapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inst = storage.getInstitution();
    setThemeColor(inst.theme_color || 'emerald');
    setStudents(storage.getStudents());
  }, []);

  useEffect(() => {
    if (!feedback) return;
    if (feedback.type === 'error') return;
    const t = setTimeout(() => setFeedback(null), 5000);
    return () => clearTimeout(t);
  }, [feedback]);

  const theme = useMemo(() => ({
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
    hover: themeColor === 'emerald' ? 'hover:bg-emerald-700' :
           themeColor === 'blue' ? 'hover:bg-blue-700' :
           themeColor === 'amber' ? 'hover:bg-amber-700' :
           themeColor === 'indigo' ? 'hover:bg-indigo-700' :
           themeColor === 'purple' ? 'hover:bg-purple-700' :
           themeColor === 'rose' ? 'hover:bg-rose-700' :
           'hover:bg-slate-700',
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
    ring: themeColor === 'emerald' ? 'focus:ring-emerald-500/30 focus:border-emerald-500' :
          themeColor === 'blue' ? 'focus:ring-blue-500/30 focus:border-blue-500' :
          themeColor === 'amber' ? 'focus:ring-amber-500/30 focus:border-amber-500' :
          themeColor === 'indigo' ? 'focus:ring-indigo-500/30 focus:border-indigo-500' :
          themeColor === 'purple' ? 'focus:ring-purple-500/30 focus:border-purple-500' :
          themeColor === 'rose' ? 'focus:ring-rose-500/30 focus:border-rose-500' :
          'focus:ring-slate-500/30 focus:border-slate-500',
    hex: themeColor === 'emerald' ? '#059669' :
         themeColor === 'blue' ? '#2563eb' :
         themeColor === 'amber' ? '#d97706' :
         themeColor === 'indigo' ? '#4f46e5' :
         themeColor === 'purple' ? '#9333ea' :
         themeColor === 'rose' ? '#e11d48' :
         '#475569'
  }), [themeColor]);

  // Precompute per-student exam status badge metadata for the sidebar list
  const studentExamMeta = useMemo(() => {
    const meta: Record<string, { ongoingDays: number; hasOngoing: boolean; completedCount: number }> = {};
    students.forEach(s => {
      const exams = storage.getStudentExams(s.id).hafalan || [];
      const ongoing = exams.find((e: any) => e.status === 'ongoing');
      const completed = exams.filter((e: any) => e.status === 'completed');
      meta[s.id] = {
        hasOngoing: Boolean(ongoing),
        ongoingDays: ongoing ? normalizeDayRecords(ongoing).length : 0,
        completedCount: completed.length
      };
    });
    return meta;
  }, [students, examListVersion]);

  const groupedStudents = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = students.filter(s =>
      s.name.toLowerCase().includes(q) ||
      (s.halaqoh_name && s.halaqoh_name.toLowerCase().includes(q))
    );
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

  const resetTodayDraft = (existingRecords: ExamDayRecord[] = []) => {
    setTodayDate(format(new Date(), 'yyyy-MM-dd'));
    setTodayGrade('A+');
    setTodaySurahTested('');
    setTodayAttendance('Hadir');
    setTodayNote('');
    setAutoSyncSurah(true);
    setEditingDayId(null);
    setEditDayForm(null);
    setEditingSurahId(null);
    setIsAddingSurah(false);
    // Automatically open Hari ke-1 if no days recorded yet; otherwise show history + Lanjutkan Ujian button
    setIsAddingNewDay(existingRecords.length === 0);
  };

  const loadExamIntoWorkspace = (exam: any) => {
    const records = normalizeDayRecords(exam);
    const parsedSurahs = normalizeSurahList(exam.surahs);
    const status = exam.status === 'completed' ? 'completed' : 'ongoing';

    setActiveExamId(exam.id);
    setActiveExamStatus(status);
    setTarget(exam.target || '');
    setSemester(exam.semester === 'Genap' ? 'Genap' : 'Ganjil');
    setNote(exam.note || '');
    setCompletedAt(exam.completed_at);
    setSurahs(parsedSurahs);
    setDayRecords(records);

    if (records.length > 0) {
      const last = records[records.length - 1];
      setLastSavedStatus({
        dayNumber: last.day_number,
        date: last.date,
        savedAt: last.saved_at || exam.updated_at || exam.date,
        grade: last.grade,
        predicate: last.predicate,
        surahTested: last.surah_tested,
        isJustSaved: false
      });
    } else {
      setLastSavedStatus(null);
    }

    resetTodayDraft(records);
  };

  const startFreshExamForStudent = (defaultSemester?: 'Ganjil' | 'Genap') => {
    setActiveExamId(null);
    setActiveExamStatus('ongoing');
    setTarget('');
    setSemester(defaultSemester || 'Ganjil');
    setNote('');
    setCompletedAt(undefined);
    setSurahs([]);
    setDayRecords([]);
    setLastSavedStatus(null);
    resetTodayDraft([]);
  };

  const loadStudentWorkspace = (studentId: string) => {
    const data = storage.getStudentExams(studentId);
    const active = data.hafalan.find((e: any) => e.status === 'ongoing');
    if (active) {
      loadExamIntoWorkspace(active);
      return;
    }

    // If no ongoing exam, check if there's a completed exam to display or start fresh
    const latestCompleted = data.hafalan.find((e: any) => e.status === 'completed');
    if (latestCompleted) {
      loadExamIntoWorkspace(latestCompleted);
    } else {
      startFreshExamForStudent();
    }
  };

  useEffect(() => {
    if (selectedStudent) {
      setFeedback(null);
      loadStudentWorkspace(selectedStudent.id);
    }
  }, [selectedStudent]);

  const handleSelectStudent = (s: any) => {
    setSelectedStudent(s);
    setShowListOnMobile(false);
  };

  // Next sequential day number
  const nextDayNumber = useMemo(() => {
    if (dayRecords.length === 0) return 1;
    const maxDay = Math.max(...dayRecords.map(d => d.day_number || 0));
    return maxDay + 1;
  }, [dayRecords]);

  // Core persistence helper ensuring zero cross-student contamination and failure notification
  const persistExamRecord = (params: {
    targetVal?: string;
    semesterVal?: 'Ganjil' | 'Genap';
    noteVal?: string;
    surahsVal?: ExamSurahItem[];
    dayRecordsVal?: ExamDayRecord[];
    statusVal?: 'ongoing' | 'completed';
    completedAtVal?: string;
  }): { success: boolean; examId: string | null } => {
    if (!selectedStudent) return { success: false, examId: activeExamId };

    const finalTarget = params.targetVal !== undefined ? params.targetVal : target;
    const finalSemester = params.semesterVal !== undefined ? params.semesterVal : semester;
    const finalNote = params.noteVal !== undefined ? params.noteVal : note;
    const finalSurahs = (params.surahsVal !== undefined ? params.surahsVal : surahs).map(s => ({
      id: s.id,
      name: s.name.trim(),
      grade: s.grade,
      predicate: s.predicate || getPredicateForGrade(s.grade)
    }));
    const finalDays = params.dayRecordsVal !== undefined ? params.dayRecordsVal : dayRecords;
    const finalStatus = params.statusVal !== undefined ? params.statusVal : activeExamStatus;
    const finalCompletedAt = params.completedAtVal !== undefined ? params.completedAtVal : completedAt;

    const latestDate =
      finalDays.length > 0
        ? finalDays[finalDays.length - 1].date
        : format(new Date(), 'yyyy-MM-dd');

    const payload = {
      student_id: selectedStudent.id,
      surahs: finalSurahs,
      note: finalNote,
      date: latestDate,
      days_progress: buildDaysProgressMap(finalDays),
      day_records: finalDays,
      status: finalStatus,
      semester: finalSemester,
      target: finalTarget,
      completed_at: finalStatus === 'completed' ? (finalCompletedAt || new Date().toISOString()) : undefined,
      updated_at: new Date().toISOString()
    };

    try {
      if (activeExamId) {
        const ok = storage.updateHafalanExam(activeExamId, payload);
        if (!ok) {
          throw new Error('Data ujian tidak dapat diperbarui pada penyimpanan perangkat.');
        }
        setExamListVersion(v => v + 1);
        return { success: true, examId: activeExamId };
      } else {
        const created = storage.addHafalanExam(payload);
        setActiveExamId(created.id);
        setExamListVersion(v => v + 1);
        return { success: true, examId: created.id };
      }
    } catch (err: any) {
      console.error('Failed to persist hafalan exam:', err);
      setFeedback({
        type: 'error',
        message: err?.message || 'Gagal menyimpan ke memori perangkat. Data yang sedang diisi tetap aman di layar.'
      });
      return { success: false, examId: activeExamId };
    }
  };

  // Upsert surah tested from day form into Daftar Surat yang Diujikan
  const mergeSurahIntoList = (list: ExamSurahItem[], surahName: string, grade: string): ExamSurahItem[] => {
    const cleanName = surahName.trim();
    if (!cleanName) return list;
    const idx = list.findIndex(s => s.name.trim().toLowerCase() === cleanName.toLowerCase());
    const predicate = getPredicateForGrade(grade);
    if (idx !== -1) {
      const updated = [...list];
      updated[idx] = { ...updated[idx], name: cleanName, grade, predicate };
      return updated;
    }
    return [...list, { id: makeLocalId(), name: cleanName, grade, predicate }];
  };

  // Action: SIMPAN HARI INI (saves today without ending the exam)
  const handleSaveToday = () => {
    if (!selectedStudent) return;
    setSaving(true);

    try {
      let nextRecords = [...dayRecords];
      let nextSurahs = [...surahs];
      let savedDayInfo: typeof lastSavedStatus = lastSavedStatus;

      if (isAddingNewDay) {
        if (!todayDate) {
          setFeedback({ type: 'error', message: 'Pilih tanggal pelaksanaan ujian terlebih dahulu.' });
          setSaving(false);
          return;
        }
        if (!todayGrade) {
          setFeedback({ type: 'error', message: 'Pilih nilai pencapaian hari ini terlebih dahulu.' });
          setSaving(false);
          return;
        }

        const nowIso = new Date().toISOString();
        const predicate = getPredicateForGrade(todayGrade);
        const newDayRecord: ExamDayRecord = {
          id: makeLocalId(),
          day_number: nextDayNumber,
          date: todayDate,
          grade: todayGrade,
          predicate,
          surah_tested: todaySurahTested.trim(),
          attendance: todayAttendance,
          note: todayNote.trim(),
          saved_at: nowIso
        };

        nextRecords = [...dayRecords, newDayRecord];
        if (autoSyncSurah && todaySurahTested.trim()) {
          nextSurahs = mergeSurahIntoList(nextSurahs, todaySurahTested, todayGrade);
        }

        savedDayInfo = {
          dayNumber: newDayRecord.day_number,
          date: newDayRecord.date,
          savedAt: nowIso,
          grade: newDayRecord.grade,
          predicate: newDayRecord.predicate,
          surahTested: newDayRecord.surah_tested,
          isJustSaved: true
        };
      }

      const result = persistExamRecord({
        dayRecordsVal: nextRecords,
        surahsVal: nextSurahs,
        statusVal: 'ongoing'
      });

      if (!result.success) {
        // Keep current unsaved form inputs intact on failure!
        setSaving(false);
        return;
      }

      setDayRecords(nextRecords);
      setSurahs(nextSurahs);
      setActiveExamStatus('ongoing');
      setLastSavedStatus(savedDayInfo);

      if (isAddingNewDay) {
        setIsAddingNewDay(false);
        setTodaySurahTested('');
        setTodayNote('');
        setFeedback({
          type: 'success',
          message: `Hari ke-${savedDayInfo?.dayNumber} berhasil disimpan (${formatDisplayDate(savedDayInfo?.date)} · Nilai ${savedDayInfo?.grade}). Ujian tetap berlangsung dan dapat dilanjutkan kapan saja.`
        });
      } else {
        setFeedback({
          type: 'success',
          message: 'Perubahan data ujian hari ini berhasil disimpan. Status ujian masih Berlangsung.'
        });
      }
    } finally {
      setSaving(false);
    }
  };

  // Action: LANJUTKAN UJIAN / Tambah Hari Ujian
  const handleContinueExam = () => {
    if (activeExamStatus === 'completed') {
      // Re-open completed exam to ongoing so examiner can add another day
      const res = persistExamRecord({ statusVal: 'ongoing' });
      if (!res.success) return;
      setActiveExamStatus('ongoing');
      setCompletedAt(undefined);
    }

    setTodayDate(format(new Date(), 'yyyy-MM-dd'));
    setTodayGrade('A+');
    setTodaySurahTested('');
    setTodayAttendance('Hadir');
    setTodayNote('');
    setAutoSyncSurah(true);
    setEditingDayId(null);
    setEditDayForm(null);
    setIsAddingNewDay(true);

    setFeedback({
      type: 'info',
      message: `Membuka sesi penilaian Hari ke-${nextDayNumber}. Penilaian hari sebelumnya tetap tersimpan aman.`
    });

    setTimeout(() => {
      dayFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  };

  // Action: Edit individual Day Card
  const startEditDay = (day: ExamDayRecord) => {
    setEditingDayId(day.id);
    setEditDayForm({ ...day });
  };

  const handleSaveEditedDay = () => {
    if (!editDayForm || !editingDayId) return;
    if (!editDayForm.date) {
      setFeedback({ type: 'error', message: 'Tanggal pelaksanaan ujian tidak boleh kosong.' });
      return;
    }

    const previousDay = dayRecords.find(d => d.id === editingDayId);
    const updatedPredicate = getPredicateForGrade(editDayForm.grade);
    const updatedRecord: ExamDayRecord = {
      ...editDayForm,
      predicate: updatedPredicate,
      surah_tested: editDayForm.surah_tested.trim(),
      note: editDayForm.note.trim()
    };

    const nextRecords = dayRecords.map(d => (d.id === editingDayId ? updatedRecord : d));

    // Sinkronkan nilai dan nama surat ke Daftar Surat yang Diujikan yang bersangkutan
    const oldDaySurahKey = normalizeSurahKey(previousDay?.surah_tested);
    const oldBaseKey = extractBaseSurahKey(previousDay?.surah_tested);
    const newDaySurahName = updatedRecord.surah_tested;
    const newDaySurahKey = normalizeSurahKey(newDaySurahName);
    const newBaseKey = extractBaseSurahKey(newDaySurahName);

    let nextSurahs = [...surahs];
    let syncedSurahCount = 0;

    if (newDaySurahKey) {
      const exactIdx = nextSurahs.findIndex(s => normalizeSurahKey(s.name) === newDaySurahKey);
      const oldIdx = oldDaySurahKey
        ? nextSurahs.findIndex(s => normalizeSurahKey(s.name) === oldDaySurahKey)
        : -1;
      const otherDayStillUsesOld =
        oldDaySurahKey !== '' &&
        nextRecords.some(d => d.id !== editingDayId && normalizeSurahKey(d.surah_tested) === oldDaySurahKey);

      if (exactIdx !== -1) {
        nextSurahs[exactIdx] = {
          ...nextSurahs[exactIdx],
          name: newDaySurahName,
          grade: updatedRecord.grade,
          predicate: updatedPredicate
        };
        syncedSurahCount = 1;
      } else if (oldIdx !== -1 && !otherDayStillUsesOld) {
        nextSurahs[oldIdx] = {
          ...nextSurahs[oldIdx],
          name: newDaySurahName,
          grade: updatedRecord.grade,
          predicate: updatedPredicate
        };
        syncedSurahCount = 1;
      } else {
        const oldBaseMatches = oldBaseKey
          ? nextSurahs.filter(s => extractBaseSurahKey(s.name) === oldBaseKey)
          : [];
        const otherDayStillUsesOldBase =
          oldBaseKey !== '' &&
          nextRecords.some(d => d.id !== editingDayId && extractBaseSurahKey(d.surah_tested) === oldBaseKey);

        if (oldBaseMatches.length === 1 && !otherDayStillUsesOldBase) {
          nextSurahs = nextSurahs.map(s =>
            s.id === oldBaseMatches[0].id
              ? {
                  ...s,
                  name: newDaySurahName,
                  grade: updatedRecord.grade,
                  predicate: updatedPredicate
                }
              : s
          );
          syncedSurahCount = 1;
        } else {
          const baseMatches = newBaseKey
            ? nextSurahs.filter(s => extractBaseSurahKey(s.name) === newBaseKey)
            : [];
          if (baseMatches.length === 1) {
            nextSurahs = nextSurahs.map(s =>
              s.id === baseMatches[0].id
                ? {
                    ...s,
                    name: newDaySurahName,
                    grade: updatedRecord.grade,
                    predicate: updatedPredicate
                  }
                : s
            );
            syncedSurahCount = 1;
          } else if (oldDaySurahKey === '' && nextRecords.length === 1 && nextSurahs.length === 1) {
            nextSurahs[0] = {
              ...nextSurahs[0],
              name: newDaySurahName,
              grade: updatedRecord.grade,
              predicate: updatedPredicate
            };
            syncedSurahCount = 1;
          } else if (autoSyncSurah) {
            nextSurahs = mergeSurahIntoList(nextSurahs, newDaySurahName, updatedRecord.grade);
            syncedSurahCount = 1;
          }
        }
      }
    } else if (nextRecords.length === 1 && nextSurahs.length === 1) {
      nextSurahs[0] = {
        ...nextSurahs[0],
        grade: updatedRecord.grade,
        predicate: updatedPredicate
      };
      syncedSurahCount = 1;
    }

    const res = persistExamRecord({ dayRecordsVal: nextRecords, surahsVal: nextSurahs });
    if (!res.success) return;

    setDayRecords(nextRecords);
    setSurahs(nextSurahs);
    if (lastSavedStatus && lastSavedStatus.dayNumber === updatedRecord.day_number) {
      setLastSavedStatus({
        ...lastSavedStatus,
        date: updatedRecord.date,
        grade: updatedRecord.grade,
        predicate: updatedRecord.predicate,
        surahTested: updatedRecord.surah_tested
      });
    }
    setEditingDayId(null);
    setEditDayForm(null);
    setFeedback({
      type: 'success',
      message:
        syncedSurahCount > 0
          ? `Perubahan pada Hari ke-${updatedRecord.day_number}${newDaySurahName ? ` (${newDaySurahName} · Nilai ${updatedRecord.grade})` : ` (Nilai ${updatedRecord.grade})`} dan daftar surat terkait berhasil disimpan.`
          : `Perubahan pada Hari ke-${updatedRecord.day_number} berhasil disimpan.`
    });
  };

  // Action: Delete individual Day Card (with confirmation)
  const confirmDeleteDay = () => {
    if (!dayToDelete) return;
    const filtered = dayRecords
      .filter(d => d.id !== dayToDelete.id)
      .sort((a, b) => (a.day_number || 0) - (b.day_number || 0))
      .map((d, idx) => ({
        ...d,
        day_number: idx + 1
      }));

    const res = persistExamRecord({ dayRecordsVal: filtered });
    if (!res.success) return;

    setDayRecords(filtered);
    if (filtered.length > 0) {
      const last = filtered[filtered.length - 1];
      setLastSavedStatus({
        dayNumber: last.day_number,
        date: last.date,
        savedAt: last.saved_at,
        grade: last.grade,
        predicate: last.predicate,
        surahTested: last.surah_tested,
        isJustSaved: false
      });
    } else {
      setLastSavedStatus(null);
      setIsAddingNewDay(true);
    }

    setFeedback({
      type: 'success',
      message: `Penilaian Hari ke-${dayToDelete.day_number} (${formatDisplayDate(dayToDelete.date)}) dihapus. Hari lainnya tetap aman.`
    });
    setDayToDelete(null);
  };

  // Action: Add / Edit / Delete Surah in Daftar Surat yang Diujikan
  const handleAddSurahSubmit = () => {
    const clean = newSurahForm.name.trim();
    if (!clean) {
      setFeedback({ type: 'error', message: 'Masukkan nama surat yang diujikan terlebih dahulu.' });
      return;
    }

    const newItem: ExamSurahItem = {
      id: makeLocalId(),
      name: clean,
      grade: newSurahForm.grade,
      predicate: getPredicateForGrade(newSurahForm.grade)
    };
    const nextSurahs = [...surahs, newItem];
    const res = persistExamRecord({ surahsVal: nextSurahs });
    if (!res.success) return;

    setSurahs(nextSurahs);
    setNewSurahForm({ name: '', grade: 'A+' });
    setIsAddingSurah(false);
    setFeedback({ type: 'success', message: `Surat "${clean}" berhasil ditambahkan ke daftar ujian.` });
  };

  const startEditSurah = (item: ExamSurahItem) => {
    setEditingSurahId(item.id);
    setEditSurahForm({ name: item.name, grade: item.grade });
  };

  const handleSaveEditedSurah = () => {
    if (!editingSurahId) return;
    const clean = editSurahForm.name.trim();
    if (!clean) {
      setFeedback({ type: 'error', message: 'Nama surat tidak boleh kosong.' });
      return;
    }

    const previousSurah = surahs.find(s => s.id === editingSurahId);
    const updatedPredicate = getPredicateForGrade(editSurahForm.grade);

    const nextSurahs = surahs.map(s =>
      s.id === editingSurahId
        ? {
            ...s,
            name: clean,
            grade: editSurahForm.grade,
            predicate: updatedPredicate
          }
        : s
    );

    // Sinkronkan nilai dan nama surat ke Riwayat Penilaian Harian yang bersangkutan
    const oldKey = normalizeSurahKey(previousSurah?.name);
    const newKey = normalizeSurahKey(clean);
    const oldBase = extractBaseSurahKey(previousSurah?.name);
    const newBase = extractBaseSurahKey(clean);
    const isUniqueBaseInSurahs =
      oldBase !== '' &&
      surahs.filter(s => extractBaseSurahKey(s.name) === oldBase).length === 1;
    const anotherSurahHasNewKey = surahs.some(
      s => s.id !== editingSurahId && normalizeSurahKey(s.name) === newKey
    );
    const anotherSurahHasNewBase =
      newBase !== '' &&
      surahs.some(s => s.id !== editingSurahId && extractBaseSurahKey(s.name) === newBase);

    let syncedDaysCount = 0;
    const updatedDayNumbers: number[] = [];

    const nextRecords = dayRecords.map(day => {
      const dayKey = normalizeSurahKey(day.surah_tested);
      const dayBase = extractBaseSurahKey(day.surah_tested);

      const isOldExactMatch = dayKey !== '' && dayKey === oldKey;
      const isNewExactMatch = dayKey !== '' && !anotherSurahHasNewKey && dayKey === newKey;
      const isOldBaseMatch = isUniqueBaseInSurahs && dayKey !== '' && dayBase === oldBase;
      const isNewBaseMatch =
        isUniqueBaseInSurahs &&
        !anotherSurahHasNewBase &&
        dayKey !== '' &&
        newBase !== '' &&
        dayBase === newBase;
      const isSingleLegacyMatch =
        dayRecords.length === 1 && surahs.length === 1 && dayKey === '';

      if (
        isOldExactMatch ||
        isNewExactMatch ||
        isOldBaseMatch ||
        isNewBaseMatch ||
        isSingleLegacyMatch
      ) {
        syncedDaysCount += 1;
        updatedDayNumbers.push(day.day_number);
        const nameChanged = Boolean(previousSurah && clean !== previousSurah.name);
        return {
          ...day,
          grade: editSurahForm.grade,
          predicate: updatedPredicate,
          surah_tested: nameChanged || isSingleLegacyMatch ? clean : day.surah_tested
        };
      }
      return day;
    });

    const res = persistExamRecord({
      surahsVal: nextSurahs,
      dayRecordsVal: nextRecords
    });
    if (!res.success) return;

    setSurahs(nextSurahs);
    setDayRecords(nextRecords);

    if (editingDayId && editDayForm) {
      const matchedActiveEdit = nextRecords.find(d => d.id === editingDayId);
      if (matchedActiveEdit && updatedDayNumbers.includes(matchedActiveEdit.day_number)) {
        setEditDayForm({ ...matchedActiveEdit });
      }
    }

    if (lastSavedStatus && updatedDayNumbers.includes(lastSavedStatus.dayNumber)) {
      const latestMatch = nextRecords.find(d => d.day_number === lastSavedStatus.dayNumber);
      if (latestMatch) {
        setLastSavedStatus({
          ...lastSavedStatus,
          grade: latestMatch.grade,
          predicate: latestMatch.predicate,
          surahTested: latestMatch.surah_tested
        });
      }
    }

    setEditingSurahId(null);
    setFeedback({
      type: 'success',
      message:
        syncedDaysCount > 0
          ? `Data surat "${clean}" dan ${syncedDaysCount} riwayat penilaian terkait berhasil diperbarui ke Nilai ${editSurahForm.grade} (${updatedPredicate}).`
          : `Data surat "${clean}" berhasil diperbarui.`
    });
  };

  const confirmDeleteSurah = () => {
    if (!surahToDelete) return;
    const nextSurahs = surahs.filter(s => s.id !== surahToDelete.id);
    const res = persistExamRecord({ surahsVal: nextSurahs });
    if (!res.success) return;

    setSurahs(nextSurahs);
    setFeedback({ type: 'success', message: `Surat "${surahToDelete.name}" dihapus dari daftar ujian.` });
    setSurahToDelete(null);
  };

  // Action: SELESAI UJIAN (Confirmation + Rekap Calculation)
  const hasPendingUnsavedDayDraft = useMemo(() => {
    return (
      activeExamStatus === 'ongoing' &&
      isAddingNewDay &&
      (todaySurahTested.trim() !== '' || todayNote.trim() !== '')
    );
  }, [activeExamStatus, isAddingNewDay, todaySurahTested, todayNote]);

  const handleClickCompleteExam = () => {
    if (dayRecords.length === 0 && surahs.length === 0 && !hasPendingUnsavedDayDraft) {
      setFeedback({
        type: 'error',
        message: 'Belum ada penilaian hari ujian atau daftar surat yang diisi. Isi dan simpan minimal 1 penilaian terlebih dahulu.'
      });
      return;
    }
    setIsCompleteModalOpen(true);
  };

  const confirmCompleteExam = () => {
    let finalRecords = [...dayRecords];
    let finalSurahs = [...surahs];
    const nowIso = new Date().toISOString();

    // Commit any active draft the teacher already typed if not yet saved
    if (hasPendingUnsavedDayDraft) {
      const predicate = getPredicateForGrade(todayGrade);
      const draftRecord: ExamDayRecord = {
        id: makeLocalId(),
        day_number: nextDayNumber,
        date: todayDate || format(new Date(), 'yyyy-MM-dd'),
        grade: todayGrade,
        predicate,
        surah_tested: todaySurahTested.trim(),
        attendance: todayAttendance,
        note: todayNote.trim(),
        saved_at: nowIso
      };
      finalRecords = [...finalRecords, draftRecord];
      if (autoSyncSurah && todaySurahTested.trim()) {
        finalSurahs = mergeSurahIntoList(finalSurahs, todaySurahTested, todayGrade);
      }
    }

    const res = persistExamRecord({
      dayRecordsVal: finalRecords,
      surahsVal: finalSurahs,
      statusVal: 'completed',
      completedAtVal: nowIso
    });

    if (!res.success) return;

    setDayRecords(finalRecords);
    setSurahs(finalSurahs);
    setActiveExamStatus('completed');
    setCompletedAt(nowIso);
    setIsAddingNewDay(false);
    setTodaySurahTested('');
    setTodayNote('');

    if (finalRecords.length > 0) {
      const last = finalRecords[finalRecords.length - 1];
      setLastSavedStatus({
        dayNumber: last.day_number,
        date: last.date,
        savedAt: last.saved_at || nowIso,
        grade: last.grade,
        predicate: last.predicate,
        surahTested: last.surah_tested,
        isJustSaved: false
      });
    }

    setFeedback({
      type: 'success',
      message: `Ujian hafalan ${selectedStudent?.name} telah ditandai SELESAI (${finalRecords.length} Hari ujian, ${finalSurahs.length} surat).`
    });

    setTimeout(() => {
      recapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Compute Overall Recap Stats (uses surah grades + day grades)
  const overallSummary = useMemo(() => {
    const scoreItems: number[] = [];
    dayRecords.forEach(d => {
      const s = getScoreForGrade(d.grade);
      if (s > 0) scoreItems.push(s);
    });
    surahs.forEach(sr => {
      const s = getScoreForGrade(sr.grade);
      if (s > 0) scoreItems.push(s);
    });

    const avg = scoreItems.length > 0 ? scoreItems.reduce((a, b) => a + b, 0) / scoreItems.length : 0;
    const summaryGrade = getGradeFromAverage(avg);

    const attendanceCounts = {
      Hadir: dayRecords.filter(d => d.attendance === 'Hadir').length,
      Izin: dayRecords.filter(d => d.attendance === 'Izin').length,
      Sakit: dayRecords.filter(d => d.attendance === 'Sakit').length,
      Alpa: dayRecords.filter(d => d.attendance === 'Alpa').length
    };

    return {
      totalDays: dayRecords.length,
      totalSurahs: surahs.length,
      avgNumeric: avg,
      grade: summaryGrade.grade,
      label: summaryGrade.label,
      attendanceCounts
    };
  }, [dayRecords, surahs]);

  // All completed exams for Archive & Chart
  const completedExamHistory = useMemo(() => {
    if (!selectedStudent) return [];
    const exams = storage.getStudentExams(selectedStudent.id).hafalan || [];
    return [...exams]
      .filter(e => e.status === 'completed')
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [selectedStudent, examListVersion]);

  const progressData = useMemo(() => {
    if (!completedExamHistory.length) return [];
    return [...completedExamHistory].reverse().map(e => {
      const sList = normalizeSurahList(e.surahs);
      const dList = normalizeDayRecords(e);
      return {
        date: formatDisplayDate(e.date),
        surahCount: sList.length,
        dayCount: dList.length
      };
    });
  }, [completedExamHistory]);

  const confirmDeleteArchiveExam = () => {
    if (!examToDeleteId) return;
    const ok = storage.deleteHafalanExam(examToDeleteId);
    if (!ok) {
      setFeedback({ type: 'error', message: 'Gagal menghapus riwayat ujian dari penyimpanan.' });
      setExamToDeleteId(null);
      return;
    }

    setExamListVersion(v => v + 1);
    if (activeExamId === examToDeleteId) {
      loadStudentWorkspace(selectedStudent.id);
    }
    setFeedback({ type: 'success', message: 'Riwayat ujian berhasil dihapus.' });
    setExamToDeleteId(null);
  };

  const handleCopyRecap = async () => {
    if (!selectedStudent) return;
    const lines = [
      `*REKAP HASIL UJIAN HAFALAN*`,
      `Nama    : ${selectedStudent.name}`,
      selectedStudent.halaqoh_name ? `Halaqoh : ${selectedStudent.halaqoh_name}` : '',
      `Semester: ${semester}`,
      `Target  : ${target || '-'}`,
      `Status  : ${activeExamStatus === 'completed' ? 'Selesai' : 'Berlangsung'}`,
      `Lama Ujian: ${overallSummary.totalDays} Hari`,
      `Predikat Akhir: ${overallSummary.grade} (${overallSummary.label})`,
      '',
      `*RIWAYAT PENILAIAN HARIAN*`,
      ...dayRecords.map(
        d =>
          `Hari ke-${d.day_number} (${formatDisplayDate(d.date)}): ${d.grade} - ${d.predicate}` +
          (d.surah_tested ? ` [${d.surah_tested}]` : '') +
          (d.note ? ` · ${d.note}` : '')
      ),
      '',
      `*DAFTAR SURAT YANG DIUJIKAN*`,
      ...(surahs.length > 0
        ? surahs.map((s, idx) => `${idx + 1}. ${s.name} — ${s.grade} (${s.predicate})`)
        : ['-']),
      note.trim() ? `\nCatatan Penguji: ${note.trim()}` : ''
    ].filter(Boolean);

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setFeedback({ type: 'success', message: 'Rekap hasil ujian berhasil disalin ke clipboard.' });
    } catch {
      setFeedback({ type: 'error', message: 'Gagal menyalin otomatis. Browser membatasi akses clipboard.' });
    }
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8">
      {/* Datalist suggestions for surah names */}
      <datalist id="hafalan-surah-list">
        {SURAH_LIST.map(s => (
          <option key={s.id} value={s.name}>
            {s.name} ({s.total_ayat} ayat · Juz {s.juz})
          </option>
        ))}
      </datalist>

      {/* LEFT SIDEBAR: STUDENT LIST */}
      <aside
        className={cn(
          'lg:col-span-4 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-sm h-fit lg:sticky lg:top-6 z-10',
          !showListOnMobile && 'hidden lg:block'
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-display font-bold text-stone-900 flex items-center gap-2">
            <GraduationCap size={18} className={theme.text} />
            Pilih Siswa
          </h3>
          <span className="text-xs font-medium text-stone-500 tabular-nums">
            {students.length} siswa
          </span>
        </div>

        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
          <input
            type="text"
            placeholder="Cari nama siswa atau halaqoh..."
            className={cn(
              'w-full min-h-[44px] bg-stone-50 border border-stone-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 transition-all',
              theme.ring
            )}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-5 max-h-[62vh] lg:max-h-[580px] overflow-y-auto custom-scrollbar pr-1">
          {Object.entries(groupedStudents).map(([halaqohName, halaqohStudents]: [string, any[]]) => (
            <div key={halaqohName} className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-xs font-semibold text-stone-500">
                  {halaqohName}
                </h4>
                <span className="text-xs text-stone-400 tabular-nums">
                  {halaqohStudents.length}
                </span>
              </div>

              <div className="space-y-1.5">
                {halaqohStudents.map((s: any, idx: number) => {
                  const meta = studentExamMeta[s.id] || { hasOngoing: false, ongoingDays: 0, completedCount: 0 };
                  const isSelected = selectedStudent?.id === s.id;
                  return (
                    <button
                      type="button"
                      key={`${s.id}-${idx}`}
                      onClick={() => handleSelectStudent(s)}
                      className={cn(
                        'w-full min-h-[48px] text-left px-3.5 py-2.5 rounded-xl transition-all border flex items-center justify-between gap-2',
                        isSelected
                          ? `${theme.lightBg} ${theme.border} ${theme.lightText}`
                          : 'bg-white border-stone-200/70 hover:bg-stone-50 text-stone-700'
                      )}
                    >
                      <div className="min-w-0">
                        <p className={cn('text-sm truncate', isSelected ? 'font-bold' : 'font-semibold text-stone-800')}>
                          {s.name}
                        </p>
                        <p className="text-xs text-stone-500 mt-0.5 tabular-nums truncate">
                          {meta.hasOngoing ? (
                            <span className="text-amber-700 font-medium">
                              Berlangsung · {meta.ongoingDays} Hari
                            </span>
                          ) : meta.completedCount > 0 ? (
                            <span className="text-emerald-700 font-medium">
                              Selesai · {meta.completedCount} Ujian
                            </span>
                          ) : (
                            <span>Belum ada ujian</span>
                          )}
                        </p>
                      </div>
                      <ArrowRight
                        size={15}
                        className={cn(
                          'shrink-0 transition-transform',
                          isSelected ? theme.text : 'text-stone-300'
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {Object.keys(groupedStudents).length === 0 && (
            <div className="text-center py-8 text-stone-400">
              <p className="text-sm">Siswa tidak ditemukan</p>
            </div>
          )}
        </div>
      </aside>

      {/* RIGHT WORKSPACE */}
      <section
        className={cn(
          'lg:col-span-8 space-y-6',
          showListOnMobile && 'hidden lg:block'
        )}
      >
        {selectedStudent ? (
          <div className="space-y-6">
            {/* FEEDBACK / NOTIFICATION BANNER */}
            {feedback && (
              <div
                role="status"
                className={cn(
                  'p-4 rounded-2xl border flex items-start justify-between gap-3 text-sm transition-all',
                  feedback.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : feedback.type === 'error'
                      ? 'bg-red-50 border-red-200 text-red-900'
                      : 'bg-blue-50 border-blue-200 text-blue-900'
                )}
              >
                <div className="flex items-start gap-2.5">
                  {feedback.type === 'success' ? (
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  ) : feedback.type === 'error' ? (
                    <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                  ) : (
                    <Clock size={18} className="text-blue-600 shrink-0 mt-0.5" />
                  )}
                  <p className="font-medium leading-relaxed">{feedback.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFeedback(null)}
                  className="p-1 rounded-lg hover:bg-black/5 shrink-0"
                  aria-label="Tutup notifikasi"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* A. IDENTITAS SISWA */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setShowListOnMobile(true)}
                      className="lg:hidden min-h-[40px] inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-700 transition-colors text-xs font-semibold shrink-0"
                    >
                      <ChevronLeft size={16} />
                      Daftar Siswa
                    </button>
                    <span className="text-xs font-semibold text-stone-400">
                      Identitas Siswa & Target
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 leading-tight">
                    {selectedStudent.name}
                  </h2>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-stone-500">
                    <span>{selectedStudent.halaqoh_name || 'Tanpa Halaqoh'}</span>
                    {(selectedStudent.kelas || selectedStudent.class_name) && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>Kelas {selectedStudent.kelas || selectedStudent.class_name}</span>
                      </>
                    )}
                    <span aria-hidden="true">·</span>
                    <span>Semester {semester}</span>
                  </div>
                </div>

                {/* Explicit dual-coded status indicator (Icon + Text) */}
                <div
                  className={cn(
                    'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-semibold self-start shrink-0 whitespace-nowrap',
                    activeExamStatus === 'completed'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-amber-50 border-amber-200 text-amber-800'
                  )}
                >
                  {activeExamStatus === 'completed' ? (
                    <>
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>Status Ujian: Selesai</span>
                    </>
                  ) : (
                    <>
                      <Clock size={16} className="text-amber-600 shrink-0" />
                      <span>Status Ujian: Berlangsung</span>
                    </>
                  )}
                </div>
              </div>

              {/* Target & Semester Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 border-t border-stone-100">
                <div className="md:col-span-7">
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                    Target Hafalan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Juz 30 / An-Naba – Al-Mursalat"
                    className={cn(
                      'w-full min-h-[44px] bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-4 text-sm text-stone-900 focus:outline-none focus:ring-2 transition-all',
                      theme.ring
                    )}
                    value={target}
                    onChange={e => setTarget(e.target.value)}
                  />
                </div>

                <div className="md:col-span-5">
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                    Semester
                  </label>
                  <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl min-h-[44px]">
                    {(['Ganjil', 'Genap'] as const).map(sem => (
                      <button
                        key={sem}
                        type="button"
                        onClick={() => setSemester(sem)}
                        className={cn(
                          'flex-1 min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap',
                          semester === sem
                            ? `bg-white ${theme.text} shadow-sm`
                            : 'text-stone-600 hover:text-stone-900'
                        )}
                      >
                        Semester {sem}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Compact Tabular KPI Strip */}
              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-stone-100">
                <div className="bg-stone-50/80 px-3.5 py-2.5 rounded-xl">
                  <p className="text-xs text-stone-500">Jumlah Hari</p>
                  <p className="text-lg sm:text-xl font-bold text-stone-900 tabular-nums mt-0.5">
                    {overallSummary.totalDays} Hari
                  </p>
                </div>
                <div className="bg-stone-50/80 px-3.5 py-2.5 rounded-xl">
                  <p className="text-xs text-stone-500">Surat Diuji</p>
                  <p className="text-lg sm:text-xl font-bold text-stone-900 tabular-nums mt-0.5">
                    {overallSummary.totalSurahs} Surat
                  </p>
                </div>
                <div className="bg-stone-50/80 px-3.5 py-2.5 rounded-xl">
                  <p className="text-xs text-stone-500">Rata-rata</p>
                  <p className={cn('text-lg sm:text-xl font-bold tabular-nums mt-0.5', theme.text)}>
                    {overallSummary.grade}
                  </p>
                </div>
              </div>
            </div>

            {/* B. KONTROL UJIAN */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-display font-bold text-stone-900">
                    Kontrol Ujian
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {activeExamStatus === 'ongoing'
                      ? 'Simpan penilaian harian tanpa mengakhiri ujian, atau selesaikan jika seluruh rangkaian telah tuntas.'
                      : 'Rangkaian ujian ini telah selesai. Anda dapat membuka kembali untuk mengedit atau memulai ujian baru.'}
                  </p>
                </div>
              </div>

              {/* Primary Control Buttons */}
              {activeExamStatus === 'ongoing' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={handleSaveToday}
                    disabled={saving}
                    className={cn(
                      'min-h-[48px] px-4 py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 shadow-sm transition-all whitespace-nowrap',
                      theme.bg,
                      theme.hover,
                      saving && 'opacity-60 cursor-not-allowed'
                    )}
                  >
                    <Save size={18} />
                    <span>SIMPAN HARI INI</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleContinueExam}
                    disabled={saving}
                    className="min-h-[48px] px-4 py-3 rounded-xl font-semibold text-sm bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 flex items-center justify-center gap-2 transition-all whitespace-nowrap"
                  >
                    <Plus size={18} />
                    <span>LANJUTKAN UJIAN</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClickCompleteExam}
                    disabled={saving}
                    className="min-h-[48px] px-4 py-3 rounded-xl font-semibold text-sm bg-stone-900 hover:bg-stone-800 text-white flex items-center justify-center gap-2 shadow-sm transition-all whitespace-nowrap"
                  >
                    <CheckCircle2 size={18} />
                    <span>SELESAI UJIAN</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleContinueExam}
                    className="min-h-[48px] px-4 py-3 rounded-xl font-semibold text-sm bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 flex items-center justify-center gap-2 transition-all whitespace-nowrap"
                  >
                    <RotateCcw size={17} />
                    <span>Lanjutkan / Tambah Hari ke-{nextDayNumber}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => startFreshExamForStudent(semester)}
                    className={cn(
                      'min-h-[48px] px-4 py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 shadow-sm transition-all whitespace-nowrap',
                      theme.bg,
                      theme.hover
                    )}
                  >
                    <Plus size={18} />
                    <span>Mulai Ujian Baru</span>
                  </button>
                </div>
              )}

              {/* Saved Today / Latest Saved Day Confirmation Status */}
              {lastSavedStatus && (
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>
                        {lastSavedStatus.isJustSaved
                          ? `Hari ke-${lastSavedStatus.dayNumber} — Hari ini sudah tersimpan`
                          : `Tersimpan terakhir: Hari ke-${lastSavedStatus.dayNumber}`}
                      </span>
                    </div>
                    <div className="text-xs text-emerald-900/80 flex flex-wrap items-center gap-x-2 gap-y-1 tabular-nums">
                      <span>Tanggal Ujian: {formatDisplayDate(lastSavedStatus.date)}</span>
                      <span aria-hidden="true">·</span>
                      <span>Disimpan: {formatDisplayDateTime(lastSavedStatus.savedAt)}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold">
                        Nilai: {lastSavedStatus.grade} ({lastSavedStatus.predicate})
                      </span>
                      {lastSavedStatus.surahTested && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>Materi: {lastSavedStatus.surahTested}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {activeExamStatus === 'ongoing' && !isAddingNewDay && (
                    <button
                      type="button"
                      onClick={handleContinueExam}
                      className={cn(
                        'min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap',
                        theme.bg,
                        theme.hover
                      )}
                    >
                      <Plus size={15} />
                      <span>Tambah Hari ke-{nextDayNumber}</span>
                    </button>
                  )}
                </div>
              )}

              {/* Active Day Assessment Form (Hari ke-N) */}
              {activeExamStatus === 'ongoing' && isAddingNewDay && (
                <div
                  ref={dayFormRef}
                  className="bg-stone-50/90 border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm sm:text-base font-display font-bold text-stone-900">
                        Input Penilaian Hari ke-{nextDayNumber}
                      </h4>
                      <p className="text-xs text-stone-500">
                        Isi nilai dan catatan sesi hari ini, lalu tekan Simpan Hari Ini.
                      </p>
                    </div>
                    {dayRecords.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setIsAddingNewDay(false)}
                        className="min-h-[36px] px-3 py-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 rounded-lg transition-colors"
                      >
                        Tutup Form
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                        Tanggal Pelaksanaan
                      </label>
                      <input
                        type="date"
                        value={todayDate}
                        onChange={e => setTodayDate(e.target.value)}
                        className={cn(
                          'w-full min-h-[44px] bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-sm text-stone-900 tabular-nums focus:outline-none focus:ring-2',
                          theme.ring
                        )}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                        Kehadiran Siswa
                      </label>
                      <div className="grid grid-cols-4 gap-1.5 bg-white p-1 rounded-xl border border-stone-200 min-h-[44px]">
                        {ATTENDANCES.map(att => (
                          <button
                            key={att}
                            type="button"
                            onClick={() => setTodayAttendance(att)}
                            className={cn(
                              'min-h-[36px] rounded-lg text-xs font-semibold transition-all',
                              todayAttendance === att
                                ? `${theme.bg} text-white shadow-sm`
                                : 'text-stone-600 hover:bg-stone-100'
                            )}
                          >
                            {att}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                      Surat / Bagian Hafalan yang Diuji Hari Ini
                    </label>
                    <input
                      type="text"
                      list="hafalan-surah-list"
                      placeholder="Contoh: An-Naba : 1-40 atau Juz 30 (Hal 1-2)"
                      value={todaySurahTested}
                      onChange={e => setTodaySurahTested(e.target.value)}
                      className={cn(
                        'w-full min-h-[44px] bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2',
                        theme.ring
                      )}
                    />
                    <label className="inline-flex items-center gap-2 mt-2 text-xs text-stone-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={autoSyncSurah}
                        onChange={e => setAutoSyncSurah(e.target.checked)}
                        className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Masukkan otomatis ke Daftar Surat yang Diujikan</span>
                    </label>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-stone-600">
                        Nilai & Predikat Hari ke-{nextDayNumber}
                      </label>
                      <span className={cn('text-xs font-bold', theme.text)}>
                        {todayGrade} · {getPredicateForGrade(todayGrade)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {GRADES.map(g => {
                        const active = todayGrade === g.value;
                        return (
                          <button
                            key={g.value}
                            type="button"
                            onClick={() => setTodayGrade(g.value)}
                            className={cn(
                              'min-h-[48px] px-3 py-2 rounded-xl border text-left sm:text-center transition-all flex sm:flex-col items-center justify-between sm:justify-center gap-0.5',
                              active
                                ? `${theme.bg} border-transparent text-white shadow-sm`
                                : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                            )}
                          >
                            <span className="text-sm font-bold">{g.value}</span>
                            <span className={cn('text-[10px] font-medium leading-tight', active ? 'text-white/90' : 'text-stone-500')}>
                              {g.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                      Keterangan Penilaian Hari Ini
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Contoh: Bacaan lancar, tajwid dan makhraj baik..."
                      value={todayNote}
                      onChange={e => setTodayNote(e.target.value)}
                      className={cn(
                        'w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 resize-none',
                        theme.ring
                      )}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={handleSaveToday}
                      disabled={saving}
                      className={cn(
                        'flex-1 min-h-[48px] px-5 py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 shadow-sm transition-all',
                        theme.bg,
                        theme.hover,
                        saving && 'opacity-60'
                      )}
                    >
                      <Save size={18} />
                      <span>SIMPAN HARI INI (Hari ke-{nextDayNumber})</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* C. RIWAYAT PENILAIAN (Per-Day Cards) */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-display font-bold text-stone-900 flex items-center gap-2">
                    <Calendar size={18} className={theme.text} />
                    Riwayat Penilaian Harian
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5 tabular-nums">
                    {dayRecords.length === 0
                      ? 'Belum ada hari ujian yang disimpan.'
                      : `${dayRecords.length} hari tercatat — setiap hari dapat diedit atau dihapus secara terpisah.`}
                  </p>
                </div>

                {activeExamStatus === 'ongoing' && (
                  <button
                    type="button"
                    onClick={handleContinueExam}
                    className={cn(
                      'min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 whitespace-nowrap',
                      theme.lightBg,
                      theme.border,
                      theme.lightText
                    )}
                  >
                    <Plus size={15} />
                    <span>Tambah Hari Ujian</span>
                  </button>
                )}
              </div>

              {dayRecords.length > 0 ? (
                <div className="space-y-3">
                  {dayRecords.map(day => {
                    const isEditing = editingDayId === day.id && editDayForm !== null;

                    return (
                      <div
                        key={day.id}
                        className={cn(
                          'rounded-2xl border p-4 transition-all',
                          isEditing
                            ? 'bg-stone-50 border-stone-300'
                            : 'bg-white border-stone-200/80 hover:border-stone-300'
                        )}
                      >
                        {!isEditing ? (
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="space-y-1.5 min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                <span className="text-sm font-bold text-stone-900 tabular-nums">
                                  Hari ke-{day.day_number} – {formatDisplayDate(day.date)}
                                </span>
                                <span aria-hidden="true" className="text-stone-300">·</span>
                                <span className="text-xs font-medium text-stone-500">
                                  {day.attendance}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                                <span className={cn('font-bold', theme.text)}>
                                  Nilai {day.grade} ({day.predicate})
                                </span>
                                {day.surah_tested && (
                                  <>
                                    <span aria-hidden="true" className="text-stone-300">·</span>
                                    <span className="text-stone-700 font-medium">{day.surah_tested}</span>
                                  </>
                                )}
                              </div>

                              {day.note && (
                                <p className="text-xs text-stone-600 leading-relaxed pt-0.5">
                                  {day.note}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => startEditDay(day)}
                                className="min-h-[40px] px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5"
                              >
                                <Edit2 size={14} />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setDayToDelete(day)}
                                className="min-h-[40px] px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5"
                              >
                                <Trash2 size={14} />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-stone-900">
                                Edit Penilaian Hari ke-{day.day_number}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-semibold text-stone-600 mb-1">
                                  Tanggal Ujian
                                </label>
                                <input
                                  type="date"
                                  value={editDayForm.date}
                                  onChange={e =>
                                    setEditDayForm({ ...editDayForm, date: e.target.value })
                                  }
                                  className="w-full min-h-[44px] bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm tabular-nums"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-stone-600 mb-1">
                                  Kehadiran
                                </label>
                                <select
                                  value={editDayForm.attendance}
                                  onChange={e =>
                                    setEditDayForm({
                                      ...editDayForm,
                                      attendance: e.target.value as ExamDayRecord['attendance']
                                    })
                                  }
                                  className="w-full min-h-[44px] bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm font-medium"
                                >
                                  {ATTENDANCES.map(att => (
                                    <option key={att} value={att}>
                                      {att}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-semibold text-stone-600 mb-1">
                                  Surat / Materi yang Diuji
                                </label>
                                <input
                                  type="text"
                                  list="hafalan-surah-list"
                                  value={editDayForm.surah_tested}
                                  onChange={e =>
                                    setEditDayForm({ ...editDayForm, surah_tested: e.target.value })
                                  }
                                  placeholder="Nama surat / bagian hafalan"
                                  className="w-full min-h-[44px] bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-sm"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-stone-600 mb-1">
                                  Nilai & Predikat
                                </label>
                                <select
                                  value={editDayForm.grade}
                                  onChange={e =>
                                    setEditDayForm({
                                      ...editDayForm,
                                      grade: e.target.value,
                                      predicate: getPredicateForGrade(e.target.value)
                                    })
                                  }
                                  className="w-full min-h-[44px] bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-sm font-semibold"
                                >
                                  {GRADES.map(g => (
                                    <option key={g.value} value={g.value}>
                                      {g.value} — {g.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-stone-600 mb-1">
                                Keterangan Penilaian
                              </label>
                              <textarea
                                rows={2}
                                value={editDayForm.note}
                                onChange={e =>
                                  setEditDayForm({ ...editDayForm, note: e.target.value })
                                }
                                placeholder="Catatan atau keterangan untuk hari ini..."
                                className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-sm resize-none"
                              />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 justify-end">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingDayId(null);
                                  setEditDayForm(null);
                                }}
                                className="min-h-[42px] px-4 py-2 bg-white border border-stone-200 text-stone-700 text-xs font-semibold rounded-xl hover:bg-stone-100"
                              >
                                Batal
                              </button>
                              <button
                                type="button"
                                onClick={handleSaveEditedDay}
                                className={cn(
                                  'min-h-[42px] px-5 py-2 text-white text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-1.5',
                                  theme.bg,
                                  theme.hover
                                )}
                              >
                                <Check size={15} />
                                <span>Simpan Perubahan</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-stone-500 text-sm">
                  Belum ada riwayat harian tersimpan. Mulai isi Penilaian Hari ke-1 di atas lalu klik Simpan Hari Ini.
                </div>
              )}
            </div>

            {/* D. DAFTAR SURAT YANG DIUJIKAN */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-display font-bold text-stone-900 flex items-center gap-2">
                    <BookOpen size={18} className={theme.text} />
                    Daftar Surat yang Diujikan
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5 tabular-nums">
                    {surahs.length} surat terdaftar untuk rapor & rekap ujian
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setNewSurahForm({ name: '', grade: 'A+' });
                    setIsAddingSurah(true);
                  }}
                  className={cn(
                    'min-h-[42px] px-4 py-2 rounded-xl text-xs font-semibold text-white inline-flex items-center gap-1.5 whitespace-nowrap',
                    theme.bg,
                    theme.hover
                  )}
                >
                  <Plus size={16} />
                  <span>Tambah Surat</span>
                </button>
              </div>

              {/* Add Surah Form */}
              {isAddingSurah && (
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                  <p className="text-xs font-bold text-stone-700">Tambah Surat Baru</p>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-6">
                      <input
                        type="text"
                        list="hafalan-surah-list"
                        placeholder="Nama Surat & Ayat (Contoh: An-Naba : 1-40)"
                        value={newSurahForm.name}
                        onChange={e => setNewSurahForm({ ...newSurahForm, name: e.target.value })}
                        className="w-full min-h-[44px] bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-sm"
                      />
                    </div>
                    <div className="sm:col-span-6">
                      <select
                        value={newSurahForm.grade}
                        onChange={e => setNewSurahForm({ ...newSurahForm, grade: e.target.value })}
                        className="w-full min-h-[44px] bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-sm font-semibold"
                      >
                        {GRADES.map(g => (
                          <option key={g.value} value={g.value}>
                            {g.value} — {g.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingSurah(false)}
                      className="min-h-[40px] px-4 py-2 bg-white border border-stone-200 text-stone-700 text-xs font-semibold rounded-xl hover:bg-stone-100"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleAddSurahSubmit}
                      className={cn(
                        'min-h-[40px] px-4 py-2 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5',
                        theme.bg,
                        theme.hover
                      )}
                    >
                      <Check size={15} />
                      <span>Simpan Surat</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Surahs List */}
              {surahs.length > 0 ? (
                <div className="space-y-2.5">
                  {surahs.map((surah, idx) => {
                    const isEditing = editingSurahId === surah.id;
                    return (
                      <div
                        key={surah.id || idx}
                        className="p-3.5 sm:p-4 rounded-2xl border border-stone-200/80 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        {!isEditing ? (
                          <>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-baseline gap-2">
                                <span className="text-xs font-semibold text-stone-400 tabular-nums">
                                  {idx + 1}.
                                </span>
                                <span className="text-sm font-bold text-stone-900 break-words">
                                  {surah.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1 pl-5 text-xs">
                                <span className={cn('font-bold', theme.text)}>
                                  Nilai {surah.grade}
                                </span>
                                <span aria-hidden="true" className="text-stone-300">·</span>
                                <span className="font-semibold text-stone-600">
                                  {surah.predicate}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 pl-5 sm:pl-0">
                              <button
                                type="button"
                                onClick={() => startEditSurah(surah)}
                                className="min-h-[40px] px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5"
                              >
                                <Edit2 size={14} />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setSurahToDelete(surah)}
                                className="min-h-[40px] px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5"
                              >
                                <Trash2 size={14} />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="w-full space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                              <div className="sm:col-span-7">
                                <input
                                  type="text"
                                  list="hafalan-surah-list"
                                  value={editSurahForm.name}
                                  onChange={e =>
                                    setEditSurahForm({ ...editSurahForm, name: e.target.value })
                                  }
                                  className="w-full min-h-[44px] bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-sm"
                                />
                              </div>
                              <div className="sm:col-span-5">
                                <select
                                  value={editSurahForm.grade}
                                  onChange={e =>
                                    setEditSurahForm({ ...editSurahForm, grade: e.target.value })
                                  }
                                  className="w-full min-h-[44px] bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-sm font-semibold"
                                >
                                  {GRADES.map(g => (
                                    <option key={g.value} value={g.value}>
                                      {g.value} — {g.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingSurahId(null)}
                                className="min-h-[40px] px-4 py-2 bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl"
                              >
                                Batal
                              </button>
                              <button
                                type="button"
                                onClick={handleSaveEditedSurah}
                                className={cn(
                                  'min-h-[40px] px-4 py-2 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5',
                                  theme.bg,
                                  theme.hover
                                )}
                              >
                                <Check size={15} />
                                <span>Simpan Perubahan</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-stone-500 text-sm">
                  Belum ada surat terdaftar. Klik "Tambah Surat" atau isi materi saat menyimpan penilaian harian.
                </div>
              )}

              {/* General Teacher Note */}
              <div className="pt-3 border-t border-stone-100">
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  Catatan Umum Penguji (Keseluruhan Ujian)
                </label>
                <textarea
                  rows={2}
                  placeholder="Berikan motivasi atau catatan umum perkembangan hafalan siswa..."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className={cn(
                    'w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-4 text-sm text-stone-900 focus:outline-none focus:ring-2 resize-none',
                    theme.ring
                  )}
                />
              </div>
            </div>

            {/* E. REKAP HASIL (Displayed prominently when Completed, or previewed below) */}
            {activeExamStatus === 'completed' && (
              <div
                ref={recapRef}
                className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-emerald-200 shadow-sm space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Award size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-bold text-stone-900">
                        Rekap Hasil Ujian Hafalan
                      </h3>
                      <p className="text-xs text-stone-500 tabular-nums">
                        {selectedStudent.name} · Semester {semester}
                        {completedAt ? ` · Diselesaikan ${formatDisplayDateTime(completedAt)}` : ''}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyRecap}
                    className="min-h-[42px] px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap self-start sm:self-auto"
                  >
                    <Copy size={15} />
                    <span>Salin Rekap</span>
                  </button>
                </div>

                {/* Overall Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-stone-50 p-3.5 rounded-xl">
                    <p className="text-xs text-stone-500">Total Hari Ujian</p>
                    <p className="text-lg font-bold text-stone-900 tabular-nums mt-0.5">
                      {overallSummary.totalDays} Hari
                    </p>
                  </div>
                  <div className="bg-stone-50 p-3.5 rounded-xl">
                    <p className="text-xs text-stone-500">Total Surat</p>
                    <p className="text-lg font-bold text-stone-900 tabular-nums mt-0.5">
                      {overallSummary.totalSurahs} Surat
                    </p>
                  </div>
                  <div className="bg-emerald-50 p-3.5 rounded-xl col-span-2">
                    <p className="text-xs text-emerald-700 font-medium">Predikat Rata-rata Keseluruhan</p>
                    <p className="text-lg font-bold text-emerald-900 tabular-nums mt-0.5">
                      {overallSummary.grade} — {overallSummary.label}
                    </p>
                  </div>
                </div>

                {/* Recap Daily Grades */}
                {dayRecords.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-stone-600">
                      Ringkasan Penilaian Per Hari
                    </h4>
                    <div className="divide-y divide-stone-100 border border-stone-200/80 rounded-xl overflow-hidden">
                      {dayRecords.map(d => (
                        <div
                          key={d.id}
                          className="px-4 py-2.5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs sm:text-sm"
                        >
                          <div className="flex flex-wrap items-center gap-x-2">
                            <span className="font-semibold text-stone-800 tabular-nums">
                              Hari ke-{d.day_number} ({formatDisplayDate(d.date)})
                            </span>
                            {d.surah_tested && (
                              <>
                                <span className="text-stone-300">·</span>
                                <span className="text-stone-600">{d.surah_tested}</span>
                              </>
                            )}
                          </div>
                          <span className={cn('font-bold shrink-0', theme.text)}>
                            {d.grade} ({d.predicate})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recap Surahs */}
                {surahs.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-stone-600">
                      Seluruh Nilai & Predikat Surat
                    </h4>
                    <div className="divide-y divide-stone-100 border border-stone-200/80 rounded-xl overflow-hidden">
                      {surahs.map((s, idx) => (
                        <div
                          key={s.id || idx}
                          className="px-4 py-2.5 bg-white flex items-center justify-between gap-3 text-xs sm:text-sm"
                        >
                          <span className="font-medium text-stone-800">
                            {idx + 1}. {s.name}
                          </span>
                          <span className={cn('font-bold shrink-0', theme.text)}>
                            {s.grade} · {s.predicate}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {note.trim() && (
                  <div className="bg-stone-50 p-3.5 rounded-xl text-xs sm:text-sm text-stone-700">
                    <span className="font-semibold text-stone-900">Catatan Penguji: </span>
                    {note}
                  </div>
                )}
              </div>
            )}

            {/* ARCHIVE OF COMPLETED EXAMS & STATS CHART */}
            {completedExamHistory.length > 0 && (
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-display font-bold text-stone-900 flex items-center gap-2">
                    <TrendingUp size={18} className={theme.text} />
                    Arsip Ujian Selesai ({completedExamHistory.length})
                  </h3>
                </div>

                {progressData.length > 1 && (
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                    <h4 className="text-xs font-semibold text-stone-500 mb-3 flex items-center gap-2">
                      <BarChart3 size={14} className={theme.text} />
                      Statistik Jumlah Surat per Periode Ujian
                    </h4>
                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={progressData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                          <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: '#78716c' }}
                            dy={8}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: '#78716c' }}
                          />
                          <Tooltip
                            contentStyle={{
                              borderRadius: '12px',
                              border: '1px solid #e7e5e4',
                              boxShadow: '0 4px 12px rgb(0 0 0 / 0.08)'
                            }}
                            formatter={(value: number) => [value, 'Jumlah Surat']}
                          />
                          <Bar dataKey="surahCount" radius={[6, 6, 0, 0]} barSize={28}>
                            {progressData.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={theme.hex}
                                fillOpacity={0.65 + (index / progressData.length) * 0.35}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {completedExamHistory.map((exam: any) => {
                    const exDays = normalizeDayRecords(exam);
                    const exSurahs = normalizeSurahList(exam.surahs);
                    const isCurrent = activeExamId === exam.id;

                    return (
                      <div
                        key={exam.id}
                        className={cn(
                          'border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors',
                          isCurrent
                            ? `${theme.lightBg} ${theme.border}`
                            : 'bg-white border-stone-200/80 hover:border-stone-300'
                        )}
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 text-xs text-stone-500 tabular-nums">
                            <span className="font-semibold text-stone-800">
                              Semester {exam.semester || 'Ganjil'}
                            </span>
                            <span>·</span>
                            <span>{formatDisplayDate(exam.date)}</span>
                            <span>·</span>
                            <span>{exDays.length} Hari</span>
                            <span>·</span>
                            <span>{exSurahs.length} Surat</span>
                          </div>
                          <p className="text-sm font-bold text-stone-900 truncate">
                            Target: {exam.target || 'Juz 30'}
                          </p>
                          {exam.note && (
                            <p className="text-xs text-stone-600 line-clamp-1">{exam.note}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              loadExamIntoWorkspace(exam);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="min-h-[40px] px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl"
                          >
                            {isCurrent ? 'Sedang Dibuka' : 'Lihat / Edit'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setExamToDeleteId(exam.id)}
                            className="min-h-[40px] px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5"
                          >
                            <Trash2 size={14} />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full min-h-[380px] flex flex-col items-center justify-center p-10 bg-white rounded-2xl border border-stone-200 border-dashed text-stone-400 text-center">
            <GraduationCap size={48} className="mb-4 opacity-30" />
            <p className="font-semibold text-stone-600">Pilih Siswa Terlebih Dahulu</p>
            <p className="text-xs text-stone-400 mt-1 max-w-sm">
              Setiap siswa memiliki riwayat ujian hafalan progresif fleksibel yang tersimpan secara terpisah.
            </p>
          </div>
        )}
      </section>

      {/* CONFIRMATION MODALS */}
      <ConfirmModal
        isOpen={Boolean(dayToDelete)}
        onClose={() => setDayToDelete(null)}
        onConfirm={confirmDeleteDay}
        title={dayToDelete ? `Hapus Penilaian Hari ke-${dayToDelete.day_number}?` : 'Hapus Penilaian?'}
        message={
          dayToDelete
            ? `Data penilaian tanggal ${formatDisplayDate(dayToDelete.date)} (Nilai ${dayToDelete.grade} · ${dayToDelete.predicate}) akan dihapus. Hari penilaian lainnya tidak akan terpengaruh.`
            : ''
        }
        confirmText="Hapus Hari Ini"
        themeColor={themeColor}
        variant="danger"
      />

      <ConfirmModal
        isOpen={Boolean(surahToDelete)}
        onClose={() => setSurahToDelete(null)}
        onConfirm={confirmDeleteSurah}
        title="Hapus Surat dari Daftar?"
        message={
          surahToDelete
            ? `Surat "${surahToDelete.name}" (Nilai ${surahToDelete.grade}) akan dihapus dari daftar surat ujian ini.`
            : ''
        }
        confirmText="Hapus Surat"
        themeColor={themeColor}
        variant="danger"
      />

      <ConfirmModal
        isOpen={Boolean(examToDeleteId)}
        onClose={() => setExamToDeleteId(null)}
        onConfirm={confirmDeleteArchiveExam}
        title="Hapus Arsip Ujian?"
        message="Apakah Anda yakin ingin menghapus seluruh arsip ujian ini? Data yang sudah dihapus tidak dapat dikembalikan."
        confirmText="Hapus Ujian"
        themeColor={themeColor}
        variant="danger"
      />

      <ConfirmModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        onConfirm={confirmCompleteExam}
        title="Selesaikan Rangkaian Ujian?"
        message={
          `Ujian hafalan untuk ${selectedStudent?.name || 'siswa'} akan ditandai SELESAI dan rekap hasil akan dihitung` +
          ` (${overallSummary.totalDays + (hasPendingUnsavedDayDraft ? 1 : 0)} hari ujian` +
          `, ${surahs.length} surat terdaftar).` +
          (hasPendingUnsavedDayDraft
            ? ` Penilaian Hari ke-${nextDayNumber} yang sedang diisi akan ikut tersimpan ke rekap.`
            : '')
        }
        confirmText="Selesai & Hitung Rekap"
        cancelText="Belum Selesai"
        themeColor={themeColor}
        variant="info"
      />
    </div>
  );
}
