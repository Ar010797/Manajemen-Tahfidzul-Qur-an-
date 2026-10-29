import React, { useState, useEffect, useMemo } from 'react';
import { ClipboardCheck, Save, Search, GripVertical, ChevronLeft, Trash2, ChevronRight, MessageCircle, FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { motion, Reorder, useDragControls } from 'motion/react';
import { cn } from '../lib/utils';
import { storage } from '../services/storage';
import { SURAH_LIST, findSurahByName, getNextSurah, getSurahJuz, computeTomorrowTarget } from '../constants/surahs';
import ConfirmModal from './ConfirmModal';

function StudentReorderItem({ s, selectedStudent, theme, handleSelectStudent }: any) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={s}
      dragListener={false}
      dragControls={controls}
      className={cn(
        "w-full text-left p-3.5 rounded-xl transition-all duration-300 border flex items-center gap-3 cursor-pointer group mb-1.5",
        selectedStudent?.id === s.id 
          ? `bg-stone-900 border-stone-800 text-white shadow-lg` 
          : `bg-white border-stone-100 hover:bg-stone-50 text-stone-600 hover:border-stone-200`
      )}
      onClick={() => handleSelectStudent(s)}
    >
      <div 
        className={cn(
          "transition-colors cursor-grab active:cursor-grabbing p-1 rounded-lg",
          selectedStudent?.id === s.id ? "text-white/20 hover:text-white/40" : "text-stone-300 hover:bg-stone-100"
        )}
        onPointerDown={(e) => controls.start(e)}
        style={{ touchAction: 'none' }}
      >
        <GripVertical size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-display font-bold truncate tracking-tight text-stone-900">{s.name}</p>
        {s.halaqoh_name && (
          <div className="flex items-center gap-1.5 mt-1">
            <div className={cn("w-1 h-1 rounded-full", selectedStudent?.id === s.id ? "bg-white/40" : "bg-indigo-400")} />
            <p className={cn(
              "text-[10px] font-black uppercase tracking-[0.15em]",
              selectedStudent?.id === s.id ? "text-white/60" : "text-stone-400"
            )}>{s.halaqoh_name}</p>
          </div>
        )}
      </div>
    </Reorder.Item>
  );
}

export { findSurahByName, getNextSurah, getSurahJuz, computeTomorrowTarget };


// Level-specific note recommendations for Ummi method
export const UMMI_LEVEL_NOTES: Record<string, { label: string; chips: string[]; remediation: string }> = {
  '1': {
    label: 'Jilid 1 (Mengenal Huruf Hijaiyah Tunggal & Fathah)',
    remediation: 'Perlu bimbingan intensif pengenalan huruf hijaiyah di rumah',
    chips: [
      'Alhamdulillah lancar mengenal huruf hijaiyah',
      'Bedakan huruf serupa (ba, ta, tsa)',
      'Perjelas makhraj jim, ha, kho',
      'Jaga ketukan stabil 1 harakat',
      'Jangan dieja, baca langsung tegas'
    ]
  },
  '2': {
    label: 'Jilid 2 (Mad Thabi\'i & Harakat Kasrah/Dhommah)',
    remediation: 'Sering keliru panjang pendek, perlu muroja\'ah mad di rumah',
    chips: [
      'Alhamdulillah mad thabi\'i 2 harakat stabil',
      'Perhatikan panjang pendek (mad 2 harakat)',
      'Perjelas bunyi kasrah (i) dan dhommah (u)',
      'Jangan memanjangkan huruf berharakat pendek',
      'Jaga ketukan tempo membaca tetap teratur'
    ]
  },
  '3': {
    label: 'Jilid 3 (Sukun, Qalqalah & Tasydid)',
    remediation: 'Masih ragu huruf sukun/qalqalah, perlu latihan di rumah',
    chips: [
      'Sukun dan tasydid terbaca jelas & mantap',
      'Qalqalah (baju di thoko) harus mantul tegas',
      'Huruf sukun jangan terseret atau membal',
      'Perjelas makhraj huruf bersukun (\'ain, ha, kho)',
      'Tekan tasydid 1 ketukan dengan mantap'
    ]
  },
  '4': {
    label: 'Jilid 4 (Nun/Mim Sukun, Tanwin & Dengung)',
    remediation: 'Dengung belum ditahan 2 harakat, perlu latihan di rumah',
    chips: [
      'Hukum nun sukun & dengung (ghunnah) sangat baik',
      'Tahan dengung (ghunnah) sempurna 2 harakat',
      'Perhatikan perbedaan ikhfa dan idgham',
      'Mim sukun jangan terburu-buru dilepas',
      'Latih kelancaran membaca sambungan kata'
    ]
  },
  '5': {
    label: 'Jilid 5 (Waqaf, Ibtida\' & Ayat Panjang)',
    remediation: 'Nafas sering terputus di tengah ayat, perlu latihan di rumah',
    chips: [
      'Waqaf dan ibtida\' sudah tepat & tartil',
      'Perhatikan tanda waqaf & washol',
      'Atur jeda nafas, jangan berhenti di tengah kata',
      'Mulai kembali bacaan dari kalimat yang tepat',
      'Latih pernafasan pada kalimat panjang'
    ]
  },
  '6': {
    label: 'Jilid 6 (Mad Far\'i / Panjang 4-5 Harakat & Rasm Utsmani)',
    remediation: 'Belum konsisten mad 4-5 harakat, perlu latihan di rumah',
    chips: [
      'Mad wajib & jaiz terbaca sempurna 4-5 harakat',
      'Bedakan panjang 2 harakat dan 4-5 harakat',
      'Kuasai fawatihussuwar (huruf potong awal surat)',
      'Perhatikan tanda bendera/coret panjang',
      'Fashohah dan makhraj semakin matang'
    ]
  },
  'Al-Quran': {
    label: 'Al-Qur\'an / Ghorib & Tajwid',
    remediation: 'Perlu bimbingan khusus bacaan ghorib & tajwid di rumah',
    chips: [
      'Tilawah tartil, fasih, dan makhraj mutqin',
      'Kuasai bacaan ghorib (saktah, imalah, tashil)',
      'Terapkan seluruh kaidah hukum tajwid',
      'Jaga ketukan irama tartil Al-Qur\'an',
      'Perhatikan kesempurnaan sifatul huruf'
    ]
  }
};

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
          // If the last deposit was already completed with next_surah and a passing grade:
          if (lastDetails.next_surah && (lastDetails.grade === 'L' || lastDetails.grade === 'CL')) {
            setDetails({
              surah: lastDetails.next_surah,
              verse_start: '1',
              verse_end: '',
              is_ujian: false,
              status: 'Progressing',
              grade: '',
              note: ''
            });
            return;
          }

          const decision = computeTomorrowTarget({
            studentName: selectedStudent.name,
            surah: lastDetails.surah,
            verseStart: lastDetails.verse_start,
            verseEnd: lastDetails.verse_end,
            grade: lastDetails.grade,
            isUjian: lastDetails.is_ujian,
            status: lastDetails.status,
            nextSurah: lastDetails.next_surah
          });

          if (decision.action === 'ganti_surah') {
            // Lulus Ujian Surah -> baru lanjut ke surah selanjutnya ayat 1
            setDetails({
              surah: decision.targetSurah,
              verse_start: '1',
              verse_end: '',
              is_ujian: false,
              status: 'Progressing',
              grade: '',
              note: ''
            });
          } else if (decision.action === 'ujian_surah' || decision.action === 'ulang_ujian') {
            // Selesai ayat terakhir -> masuk Ujian Surah ayat 1 - terakhir
            setDetails({
              surah: decision.targetSurah,
              verse_start: '1',
              verse_end: decision.targetVerseEnd,
              is_ujian: true,
              status: 'Ujian',
              grade: '',
              note: ''
            });
          } else if (decision.action === 'lanjut_ayat') {
            setDetails({
              surah: decision.targetSurah,
              verse_start: decision.targetVerseStart,
              verse_end: '',
              is_ujian: false,
              status: 'Progressing',
              grade: '',
              note: ''
            });
          } else {
            // ulang_surah atau ulang_ayat
            setDetails({
              surah: decision.targetSurah,
              verse_start: decision.targetVerseStart || '1',
              verse_end: decision.targetVerseEnd || '',
              is_ujian: false,
              status: 'Progressing',
              grade: '',
              note: ''
            });
          }
        } else if (type === 'ummi') {
          const shouldAdvance = lastDetails.grade === 'A' || lastDetails.grade === 'B';
          const extractLastNum = (val) => {
             if (!val) return 0;
             const match = String(val).match(/(\d+)(?!.*\d)/);
             return match ? parseInt(match[1]) : 0;
          };
          const lastEnd = extractLastNum(lastDetails.page_end) || extractLastNum(lastDetails.page_start) || 0;
          
          if (shouldAdvance) {
            setDetails({
              level: lastDetails.level,
              page_start: lastEnd ? (lastEnd + 1).toString() : '',
              page_end: ''
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
          const extractLastNum = (val) => {
             if (!val) return 0;
             const match = String(val).match(/(\d+)(?!.*\d)/);
             return match ? parseInt(match[1]) : 0;
          };
          const lastEnd = extractLastNum(lastDetails.verse_end) || extractLastNum(lastDetails.verse_start) || 0;
          
          if (shouldAdvance) {
            setDetails({
              juz: lastDetails.juz,
              surah: lastDetails.surah,
              verse_start: lastEnd ? (lastEnd + 1).toString() : '',
              verse_end: ''
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

    if (!hafalanData?.details?.grade && !ummiData?.details?.grade && !tilawahData?.details?.grade) {
      alert('Belum ada data setoran yang dinilai pada tanggal ini untuk santri ini.');
      return;
    }

    const formattedDate = format(new Date(date), 'dd MMMM yyyy');
    const sections: string[] = [];

    // Header Salam
    sections.push('Assalamualaikum Warahmatullahi Wabarakatuh');

    // 1. Hafalan Segment
    if (hafalanData?.details?.grade) {
      const d = hafalanData.details;
      const decision = computeTomorrowTarget({
        studentName: selectedStudent.name,
        surah: d.surah,
        verseStart: d.verse_start,
        verseEnd: d.verse_end,
        grade: d.grade,
        isUjian: d.is_ujian,
        status: d.status
      });

      const surahInfo = findSurahByName(d.surah);
      const surahName = surahInfo ? surahInfo.name : (d.surah || '-');
      const lastEnd = parseInt(d.verse_end) || parseInt(d.verse_start) || 1;
      const juzNum = getSurahJuz(surahInfo ? surahInfo.id : d.surah, lastEnd);
      const startStr = d.verse_start || '1';
      const endStr = d.verse_end || d.verse_start || '1';
      const ayatToday = startStr === endStr ? startStr : `${startStr} – ${endStr}`;

      const isExamToday = d.status === 'Ujian' || d.is_ujian;
      const todaySurahLabel = isExamToday ? `${surahName} [Ujian Surah]` : surahName;
      const targetSurahLabel = decision.isUjian ? `${decision.targetSurah} (Ujian Surah)` : decision.targetSurah;

      let hafalanText = `*SETORAN HAFALAN HARI INI*\n` +
        `Nama   : ${studentName}\n` +
        `Tanggal: ${formattedDate}\n` +
        `Surah  : ${todaySurahLabel} (Juz ${juzNum})\n` +
        `Ayat   : ${ayatToday}\n` +
        `Nilai  : ${d.grade}\n\n` +
        `*TARGET BESOK*\n` +
        `Surah  : ${targetSurahLabel}\n` +
        `Ayat   : ${decision.targetVerseText}\n` +
        `Keterangan: ${decision.keterangan}`;

      if (d.note && d.note.trim()) {
        hafalanText += `\nCatatan: ${d.note.trim()}`;
      }

      sections.push(hafalanText);
    } else if (ummiData?.details?.grade) {
      // If only Ummi is present
      const d = ummiData.details;
      const isGoodGrade = ['A', 'B'].includes(d.grade);
      const nextPage = d.page_end ? parseInt(d.page_end) + 1 : (parseInt(d.page_start) + 1 || '');
      let ummiText = `*SETORAN METODE UMMI HARI INI*\n` +
        `Nama   : ${studentName}\n` +
        `Tanggal: ${formattedDate}\n` +
        `Materi : Jilid ${d.level}, Halaman ${d.page_start}${d.page_end ? ' – ' + d.page_end : ''}\n` +
        `Nilai  : ${d.grade}\n\n` +
        `*TARGET BESOK*\n` +
        `Target : ${isGoodGrade ? `Lanjut Jilid ${d.level} Hlm ${nextPage}` : `Mengulang Jilid ${d.level} Hlm ${d.page_start}`}\n` +
        `Keterangan: ${isGoodGrade ? 'Lanjut halaman berikutnya' : 'Belum lulus, ulang'}`;

      if (d.note && d.note.trim()) {
        ummiText += `\nCatatan: ${d.note.trim()}`;
      }

      sections.push(ummiText);
    }

    // Additional segments if both Hafalan and Ummi/Tilawah exist
    if (hafalanData?.details?.grade && ummiData?.details?.grade) {
      const d = ummiData.details;
      const isGoodGrade = ['A', 'B'].includes(d.grade);
      const nextPage = d.page_end ? parseInt(d.page_end) + 1 : (parseInt(d.page_start) + 1 || '');
      sections.push(
        `*METODE UMMI*\n` +
        `Materi : Jilid ${d.level}, Hlm ${d.page_start}${d.page_end ? ' – ' + d.page_end : ''}\n` +
        `Nilai  : ${d.grade}\n` +
        `Target : ${isGoodGrade ? `Lanjut Hlm ${nextPage}` : `Mengulang Hlm ${d.page_start}`}`
      );
    }

    if (tilawahData?.details?.grade) {
      const d = tilawahData.details;
      const isGoodGrade = ['A', 'B'].includes(d.grade);
      const nextVerse = d.verse_end ? parseInt(d.verse_end) + 1 : (parseInt(d.verse_start) + 1 || '');
      sections.push(
        `*TILAWAH / BTQ*\n` +
        `Materi : Juz ${d.juz}, Surah ${d.surah}, Ayat ${d.verse_start}${d.verse_end ? ' – ' + d.verse_end : ''}\n` +
        `Nilai  : ${d.grade}\n` +
        `Target : ${isGoodGrade ? `Lanjut Ayat ${nextVerse}` : `Mengulang Ayat ${d.verse_start}`}`
      );
    }

    // Footer
    sections.push('Jazakumullah khairan wassalamualaikum warahmatullahi wabarakatuh');

    const message = sections.join('\n\n');
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${parentPhone.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareHalaqohToWhatsApp = (halaqohName: string, studentsList: any[]) => {
    let studentBlocks: string[] = [];
    let hasAnyData = false;
    const formattedDate = format(new Date(date), 'dd MMMM yyyy');

    studentsList.forEach((student, index) => {
      const hafalanData = storage.getDeposit(student.id, 'hafalan', date);
      const ummiData = storage.getDeposit(student.id, 'ummi', date);
      const tilawahData = storage.getDeposit(student.id, 'tilawah', date);

      if (!hafalanData?.details?.grade && !ummiData?.details?.grade && !tilawahData?.details?.grade) {
        return;
      }
      hasAnyData = true;

      const lines: string[] = [];
      // Student name clearly at the top
      lines.push(`*${index + 1}. ${student.name.toUpperCase()}*`);
      lines.push('');

      if (hafalanData?.details?.grade) {
        const d = hafalanData.details;
        const decision = computeTomorrowTarget({
          studentName: student.name,
          surah: d.surah,
          verseStart: d.verse_start,
          verseEnd: d.verse_end,
          grade: d.grade,
          isUjian: d.is_ujian,
          status: d.status
        });

        const surahInfo = findSurahByName(d.surah);
        const surahName = surahInfo ? surahInfo.name : (d.surah || '-');
        const lastEnd = parseInt(d.verse_end) || parseInt(d.verse_start) || 1;
        const juzNum = getSurahJuz(surahInfo ? surahInfo.id : d.surah, lastEnd);
        const startStr = d.verse_start || '1';
        const endStr = d.verse_end || d.verse_start || '1';
        const ayatToday = startStr === endStr ? startStr : `${startStr} – ${endStr}`;

        const isExamToday = d.status === 'Ujian' || d.is_ujian;
        const todaySurahLabel = isExamToday ? `${surahName} [Ujian Surah]` : surahName;
        const targetSurahLabel = decision.isUjian ? `${decision.targetSurah} (Ujian Surah)` : decision.targetSurah;

        lines.push(`*SETORAN HAFALAN HARI INI*`);
        lines.push(`Tanggal: ${formattedDate}`);
        lines.push(`Surah  : ${todaySurahLabel} (Juz ${juzNum})`);
        lines.push(`Ayat   : ${ayatToday}`);
        lines.push(`Nilai  : ${d.grade}`);
        lines.push('');
        lines.push(`*TARGET BESOK*`);
        lines.push(`Surah  : ${targetSurahLabel}`);
        lines.push(`Ayat   : ${decision.targetVerseText}`);
        lines.push(`Keterangan: ${decision.keterangan}`);

        if (d.note && d.note.trim()) {
          lines.push(`Catatan: ${d.note.trim()}`);
        }
      } else if (ummiData?.details?.grade) {
        const d = ummiData.details;
        const isGoodGrade = ['A', 'B'].includes(d.grade);
        const nextPage = d.page_end ? parseInt(d.page_end) + 1 : (parseInt(d.page_start) + 1 || '');
        lines.push(`*METODE UMMI HARI INI*`);
        lines.push(`Tanggal: ${formattedDate}`);
        lines.push(`Materi : Jilid ${d.level}, Hlm ${d.page_start}${d.page_end ? ' – ' + d.page_end : ''}`);
        lines.push(`Nilai  : ${d.grade}`);
        lines.push('');
        lines.push(`*TARGET BESOK*`);
        lines.push(`Target : ${isGoodGrade ? `Lanjut Hlm ${nextPage}` : `Mengulang Hlm ${d.page_start}`}`);
        lines.push(`Keterangan: ${isGoodGrade ? 'Lanjut halaman berikutnya' : 'Belum lulus, ulang'}`);
        if (d.note && d.note.trim()) {
          lines.push(`Catatan: ${d.note.trim()}`);
        }
      }

      if (hafalanData?.details?.grade && ummiData?.details?.grade) {
        const d = ummiData.details;
        const isGoodGrade = ['A', 'B'].includes(d.grade);
        const nextPage = d.page_end ? parseInt(d.page_end) + 1 : (parseInt(d.page_start) + 1 || '');
        lines.push('');
        lines.push(`*METODE UMMI*`);
        lines.push(`Materi : Jilid ${d.level}, Hlm ${d.page_start}${d.page_end ? ' – ' + d.page_end : ''}`);
        lines.push(`Nilai  : ${d.grade}`);
        lines.push(`Target : ${isGoodGrade ? `Lanjut Hlm ${nextPage}` : `Mengulang Hlm ${d.page_start}`}`);
      }

      studentBlocks.push(lines.join('\n'));
    });

    if (!hasAnyData) {
      alert('Belum ada data setoran yang disimpan untuk halaqoh ini pada tanggal ini.');
      return;
    }

    const message = `Assalamualaikum Warahmatullahi Wabarakatuh

*LAPORAN SETORAN HALAQOH ${halaqohName.toUpperCase()}*
Tanggal: ${formattedDate}

${studentBlocks.join('\n\n----------\n\n')}

Jazakumullah khairan wassalamualaikum warahmatullahi wabarakatuh`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || isSaving) return;
    
    setIsSaving(true);
    try {
      const detailsToSave = { ...details };
      let customAlert = 'Setoran berhasil disimpan!';

      if (type === 'hafalan' && details.surah && details.grade) {
        const decision = computeTomorrowTarget({
          studentName: selectedStudent.name,
          surah: details.surah,
          verseStart: details.verse_start,
          verseEnd: details.verse_end,
          grade: details.grade,
          isUjian: details.is_ujian,
          status: details.status
        });

        if (decision.action === 'ujian_surah') {
          customAlert = `Alhamdulillah! Siswa selesai ayat terakhir Surah ${details.surah} dengan nilai ${details.grade} (${details.grade === 'L' ? 'Lancar' : 'Cukup Lancar'}).\nSesuai aturan, besok siswa UJIAN SURAH ${details.surah} (Ayat 1 – ${decision.targetVerseEnd})!`;
        } else if (decision.action === 'ganti_surah') {
          detailsToSave.next_surah = decision.targetSurah;
          customAlert = `Alhamdulillah! Siswa LULUS Ujian Surah ${details.surah} dengan nilai ${details.grade} (${details.grade === 'L' ? 'Lancar' : 'Cukup Lancar'})!\nBesok otomatis lanjut ke Surah ${decision.targetSurah} (Ayat 1)!`;
        } else if (decision.action === 'ulang_ujian') {
          customAlert = `Setoran tersimpan. Nilai ${details.grade} pada Ujian Surah ${details.surah}.\nSesuai aturan kurikulum, besok siswa mengulang Ujian Surah ${details.surah} sampai lulus (L/CL).`;
        } else if (decision.action === 'ulang_surah') {
          customAlert = `Setoran tersimpan. Nilai ${details.grade} di ayat terakhir Surah ${details.surah}.\nSesuai aturan kurikulum, besok siswa mengulang Surah ${details.surah} sampai tuntas dan lulus (L/CL).`;
        }
      }

      storage.saveDeposit(selectedStudent.id, type, date, detailsToSave);
      setDetails(detailsToSave);
      alert(customAlert);
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
    from: themeColor === 'emerald' ? 'from-emerald-500' :
          themeColor === 'blue' ? 'from-blue-500' :
          themeColor === 'amber' ? 'from-amber-500' :
          themeColor === 'indigo' ? 'from-indigo-500' :
          themeColor === 'purple' ? 'from-purple-500' :
          themeColor === 'rose' ? 'from-rose-500' :
          'from-slate-500',
    to: themeColor === 'emerald' ? 'to-emerald-600' :
        themeColor === 'blue' ? 'to-blue-600' :
        themeColor === 'amber' ? 'to-amber-600' :
        themeColor === 'indigo' ? 'to-indigo-600' :
        themeColor === 'purple' ? 'to-purple-600' :
        themeColor === 'rose' ? 'to-rose-600' :
        'to-slate-600',
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 font-sans">
      <div className={cn(
        "lg:col-span-4 bg-white p-6 rounded-[2rem] border border-stone-200/60 shadow-xl shadow-stone-900/5 h-[calc(100vh-12rem)] flex flex-col lg:sticky lg:top-8 z-10",
        !showListOnMobile && "hidden lg:flex"
      )}>
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-display font-black text-stone-950 uppercase tracking-[0.2em] flex items-center gap-2">
              <div className={cn("w-1.5 h-4 rounded-full bg-gradient-to-b", theme.from, theme.to)} />
              Daftar Siswa
            </h3>
            <div className="px-2.5 py-1 bg-stone-100 rounded-lg text-[9px] font-black text-stone-500 uppercase tracking-widest">
              {students.length} Siswa
            </div>
          </div>
          <div className="relative group">
            <input 
              type="text"
              placeholder="Cari nama siswa..."
              className={cn("w-full bg-stone-50/50 border border-stone-200/60 rounded-xl py-3 px-10 focus:outline-none focus:ring-4 transition-all text-xs font-semibold tracking-tight", theme.ring)}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-stone-950 transition-colors" size={14} />
          </div>
        </div>
        
        <div className="flex-1 mt-6 overflow-y-auto custom-scrollbar pr-1 space-y-6">
          {Object.entries(groupedStudents).map(([halaqohName, halaqohStudents]) => (
            <div key={halaqohName} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-[11px] font-display font-black text-stone-400 uppercase tracking-widest">
                  {halaqohName}
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShareHalaqohToWhatsApp(halaqohName, halaqohStudents as any[])}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 rounded-lg text-[10px] font-bold border border-green-200 transition-colors shadow-sm"
                    title="Kirim ke Grup WA"
                  >
                    <MessageCircle size={12} /> WA Grup
                  </button>
                  <span className="text-[10px] font-black bg-stone-50 text-stone-400 px-2.5 py-0.5 rounded-lg border border-stone-100">
                    {(halaqohStudents as any[]).length}
                  </span>
                </div>
              </div>
              
              <Reorder.Group 
                axis="y" 
                values={halaqohStudents as any[]} 
                onReorder={(newOrder) => handleReorder(halaqohName, newOrder)}
                className="space-y-1"
              >
                {(halaqohStudents as any[]).map((s, idx) => (
                  <StudentReorderItem 
                    key={`${s.id}-${idx}`}
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
        "lg:col-span-8 space-y-6",
        showListOnMobile && "hidden lg:block transition-all"
      )}>
        {selectedStudent ? (
          <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-stone-200/60 shadow-xl shadow-stone-900/5">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-10">
              <div className="flex items-center gap-5">
                <button 
                  onClick={() => setShowListOnMobile(true)}
                  className="lg:hidden p-3 bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-600 transition-all active:scale-95"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handlePrevStudent}
                    className="p-2.5 bg-stone-50 hover:bg-stone-100 rounded-xl text-stone-400 hover:text-stone-950 transition-all active:scale-95"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="space-y-1.5 text-center sm:text-left px-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500/80 leading-none mb-1">Update Progress</p>
                      <h2 className="text-3xl sm:text-4xl font-display font-black text-stone-950 leading-tight tracking-tighter">
                        {selectedStudent.name}
                      </h2>
                      <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                        <div className="flex -space-x-1">
                          {[1,2,3].map(i => <div key={i} className="w-4 h-4 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[6px] font-bold text-indigo-400">#</div>)}
                        </div>
                        <p className="text-[11px] font-black text-stone-400 uppercase tracking-[0.15em]">{selectedStudent.halaqoh_name || 'Personal'}</p>
                      </div>
                    </div>
                  <button 
                    onClick={handleNextStudent}
                    className="p-2.5 bg-stone-50 hover:bg-stone-100 rounded-xl text-stone-400 hover:text-stone-950 transition-all active:scale-95"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input 
                  type="date"
                  className="bg-stone-50 border border-stone-200 rounded-xl px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-stone-600 focus:outline-none focus:ring-4 ring-stone-900/5 transition-all"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
                <div className="flex bg-stone-100/50 p-1.5 rounded-xl border border-stone-200/30">
                  {(['hafalan', 'ummi', 'tilawah'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => { setType(t); setDetails({}); }}
                      className={cn(
                        "px-5 py-2 rounded-lg text-[9px] font-display font-bold uppercase tracking-[0.15em] transition-all",
                        type === t ? `bg-stone-950 text-white shadow-lg` : "text-stone-500 hover:text-stone-950"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-stone-50/30 p-6 lg:p-8 rounded-[2rem] border border-stone-200/40">
                  {type === 'hafalan' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    <datalist id="surah-datalist">
                      {SURAH_LIST.map(s => (
                        <option key={s.id} value={s.name} />
                      ))}
                    </datalist>

                    <div className="space-y-2.5">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Nama Surat</label>
                      <input 
                        type="text"
                        list="surah-datalist"
                        className="w-full bg-white border border-stone-200/60 rounded-xl px-5 py-4 text-base font-semibold placeholder:text-stone-300 focus:outline-none focus:ring-4 ring-stone-900/5 transition-all"
                        placeholder="Ketik atau pilih surat (contoh: An-Naba)"
                        value={details.surah || ''}
                        onChange={e => setDetails({...details, surah: e.target.value})}
                      />
                      <div className="space-y-2.5 mt-4">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Status Hafalan</label>
                        <select 
                          className="w-full bg-white border border-stone-200/60 rounded-xl px-5 py-4 text-base font-semibold focus:outline-none focus:ring-4 ring-stone-900/5 transition-all appearance-none cursor-pointer"
                          value={details.status || (details.is_ujian ? 'Ujian' : 'Progressing')}
                          onChange={e => {
                            const val = e.target.value;
                            setDetails({...details, status: val, is_ujian: val === 'Ujian'});
                          }}
                        >
                          <option value="Progressing">Progressing (Ziyadah)</option>
                          <option value="Hafalan">Hafalan (Muroja'ah)</option>
                          <option value="Ujian">Ujian Surah</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2.5">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Ayat Awal</label>
                        <input 
                          type="text"
                          className="w-full bg-white border border-stone-200/60 rounded-xl px-5 py-4 text-base font-semibold text-center focus:outline-none focus:ring-4 ring-stone-900/5 transition-all"
                          value={details.verse_start || ''}
                          onChange={e => setDetails({...details, verse_start: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2.5">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Ayat Akhir</label>
                        <input 
                          type="text"
                          className="w-full bg-white border border-stone-200/60 rounded-xl px-5 py-4 text-base font-semibold text-center focus:outline-none focus:ring-4 ring-stone-900/5 transition-all"
                          value={details.verse_end || ''}
                          onChange={e => setDetails({...details, verse_end: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    {/* Nilai Hafalan */}
                    <div className="space-y-4 md:col-span-2 mt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Pencapaian Nilai</label>
                        {(() => {
                          const surahInfo = findSurahByName(details.surah);
                          const totalAyat = surahInfo ? surahInfo.total_ayat : 0;
                          const isFull = details.verse_start === '1' && totalAyat > 0 && parseInt(details.verse_end) >= totalAyat;
                          if (details.status === 'Ujian' || details.is_ujian || isFull) {
                            return (
                              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200 flex items-center gap-1 shadow-xs">
                                <Sparkles size={11} className="text-indigo-500" /> Mode Ujian Surah
                              </span>
                            );
                          }
                          return null;
                        })()}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                         {(['L', 'CL', 'BL'] as const).map(g => (
                           <button
                             type="button"
                             key={g}
                             onClick={() => setDetails({...details, grade: g})}
                             className={cn(
                               "py-4 rounded-xl font-display font-bold border-2 transition-all flex flex-col items-center justify-center gap-1",
                               details.grade === g 
                                ? (g === 'BL' ? "bg-rose-600 border-rose-600 text-white shadow-lg scale-[1.02]" : "bg-stone-950 border-stone-950 text-white shadow-lg scale-[1.02]")
                                : "bg-white border-stone-100 text-stone-400 hover:border-stone-300 hover:text-stone-950"
                             )}
                           >
                             <span className="text-xl">{g}</span>
                             <span className="text-[8px] uppercase tracking-widest opacity-80">
                               {g === 'L' ? 'Lancar' : g === 'CL' ? 'Cukup Lancar' : 'Belum Lancar'}
                             </span>
                           </button>
                         ))}
                      </div>
                    </div>

                    {/* Auto Next Decision Feedback Banner */}
                    {(() => {
                      if (!details.surah || !details.grade) return null;
                      const decision = computeTomorrowTarget({
                        studentName: selectedStudent?.name,
                        surah: details.surah,
                        verseStart: details.verse_start,
                        verseEnd: details.verse_end,
                        grade: details.grade,
                        isUjian: details.is_ujian,
                        status: details.status
                      });

                      if (decision.action === 'ujian_surah') {
                        return (
                          <div className="md:col-span-2 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border-2 border-indigo-500/30 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">📋</span>
                                <p className="text-xs font-black uppercase tracking-wider text-indigo-900">
                                  Tuntas Ayat Terakhir Surah {details.surah || ''}!
                                </p>
                              </div>
                              <p className="text-sm font-bold text-stone-800">
                                Target Besok: <span className="text-indigo-700 underline font-black">UJIAN SURAH {decision.targetSurah}</span> (Ayat 1 – {decision.targetVerseEnd})
                              </p>
                              <p className="text-[11px] text-stone-500">
                                Sesuai aturan: Santri wajib Ujian Surah dari ayat 1 – terakhir dulu. Jika nilai ujian L/CL, baru lanjut ke surah berikutnya.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                storage.saveDeposit(selectedStudent.id, 'hafalan', date, {
                                  ...details,
                                  is_ujian: false
                                });
                                setDetails({
                                  surah: decision.targetSurah,
                                  verse_start: '1',
                                  verse_end: decision.targetVerseEnd,
                                  status: 'Ujian',
                                  is_ujian: true,
                                  grade: '',
                                  note: ''
                                });
                                alert(`Setoran ayat terakhir Surah ${details.surah} tersimpan!\nForm otomatis dialihkan ke Mode Ujian Surah ${decision.targetSurah} (Ayat 1 – ${decision.targetVerseEnd}).`);
                              }}
                              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all shadow-md active:scale-95 shrink-0 flex items-center gap-2"
                            >
                              <Sparkles size={14} />
                              Mulai Ujian {decision.targetSurah}
                            </button>
                          </div>
                        );
                      }

                      if (decision.action === 'ganti_surah') {
                        return (
                          <div className="md:col-span-2 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border-2 border-emerald-500/30 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🎉</span>
                                <p className="text-xs font-black uppercase tracking-wider text-emerald-800">
                                  Alhamdulillah Siswa LULUS UJIAN Surah {details.surah || ''}!
                                </p>
                              </div>
                              <p className="text-sm font-bold text-stone-800">
                                Target Besok: <span className="text-emerald-700 underline font-black">{decision.targetSurah}</span> (Ayat 1)
                              </p>
                              <p className="text-[11px] text-stone-500">
                                Nilai Ujian: {details.grade === 'L' ? 'Lancar (L)' : 'Cukup Lancar (CL)'}. Otomatis lanjut ke surah selanjutnya.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                storage.saveDeposit(selectedStudent.id, 'hafalan', date, {
                                  ...details,
                                  next_surah: decision.targetSurah
                                });
                                setDetails({
                                  surah: decision.targetSurah,
                                  verse_start: '1',
                                  verse_end: '',
                                  status: 'Progressing',
                                  is_ujian: false,
                                  grade: '',
                                  note: ''
                                });
                                alert(`Ujian Surah ${details.surah} tersimpan lulus!\nForm otomatis beralih ke Surah ${decision.targetSurah} ayat 1.`);
                              }}
                              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all shadow-md active:scale-95 shrink-0 flex items-center gap-2"
                            >
                              <Sparkles size={14} />
                              Lanjut Setor {decision.targetSurah}
                            </button>
                          </div>
                        );
                      }

                      if (decision.action === 'ulang_ujian') {
                        return (
                          <div className="md:col-span-2 bg-rose-50 border-2 border-rose-200 p-4 rounded-2xl flex items-start gap-3 shadow-sm animate-in fade-in duration-300">
                            <span className="text-lg mt-0.5">⚠️</span>
                            <div className="space-y-1">
                              <p className="text-xs font-black uppercase tracking-wider text-rose-800">
                                Ujian Surah {details.surah} Belum Lulus (Nilai BL)
                              </p>
                              <p className="text-xs text-rose-700 font-medium">
                                Aturan wajib: Besok santri <span className="font-bold underline">ULANG Ujian Surah {details.surah} (Ayat 1 – {decision.targetVerseEnd})</span> dan terus mengulang sampai mendapatkan nilai L atau CL, baru otomatis lanjut ke surah berikutnya.
                              </p>
                            </div>
                          </div>
                        );
                      }

                      if (decision.action === 'ulang_surah') {
                        return (
                          <div className="md:col-span-2 bg-rose-50 border-2 border-rose-200 p-4 rounded-2xl flex items-start gap-3 shadow-sm animate-in fade-in duration-300">
                            <span className="text-lg mt-0.5">⚠️</span>
                            <div className="space-y-1">
                              <p className="text-xs font-black uppercase tracking-wider text-rose-800">
                                Nilai BL di Ayat Terakhir Surah {details.surah}
                              </p>
                              <p className="text-xs text-rose-700 font-medium">
                                Aturan wajib: Besok santri <span className="font-bold underline">ULANG Surah {details.surah}</span> dan terus mengulang sampai mendapatkan nilai L atau CL, baru dapat menempuh Ujian Surah.
                              </p>
                            </div>
                          </div>
                        );
                      }

                      if (decision.action === 'lanjut_ayat') {
                        return (
                          <div className="md:col-span-2 bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-sm">
                            <div className="flex items-center gap-2 text-emerald-800 font-medium">
                              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                              <span>Nilai <span className="font-bold">{details.grade}</span>: Target besok otomatis <span className="font-bold text-emerald-900">lanjut ayat berikutnya ({decision.targetVerseText})</span></span>
                            </div>
                          </div>
                        );
                      }

                      if (decision.action === 'ulang_ayat') {
                        return (
                          <div className="md:col-span-2 bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-sm">
                            <div className="flex items-center gap-2 text-amber-800 font-medium">
                              <span className="text-base shrink-0">🔁</span>
                              <span>Nilai <span className="font-bold">BL (Belum Lancar)</span>: Target besok <span className="font-bold text-amber-900">mengulang ayat {decision.targetVerseText}</span></span>
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })()}

                    {/* Catatan Harian Hafalan - Placed directly below Nilai Hafalan */}
                    <div className="space-y-2 md:col-span-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                          <FileText size={12} className="text-indigo-500" />
                          Catatan Harian Hafalan <span className="text-stone-400 font-normal lowercase">(opsional / terkirim ke WA & rekap)</span>
                        </label>
                        {details.note && (
                          <button 
                            type="button"
                            onClick={() => setDetails({...details, note: ''})}
                            className="text-[10px] text-rose-500 hover:underline font-bold"
                          >
                            Kosongkan Catatan
                          </button>
                        )}
                      </div>
                      <textarea 
                        rows={2}
                        className="w-full bg-white border border-stone-200/60 rounded-xl px-5 py-3 text-sm font-medium placeholder:text-stone-300 focus:outline-none focus:ring-4 ring-stone-900/5 transition-all resize-none"
                        placeholder="Contoh: Belum lancar di ayat 5-8 / Tajwid mad thabi'i perlu diperhatikan (bisa dikosongkan jika tidak ada catatan)"
                        value={details.note || ''}
                        onChange={e => setDetails({...details, note: e.target.value})}
                      />
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100/60 inline-flex items-center gap-1">
                            <Sparkles size={11} className="text-indigo-600" />
                            {details.status === 'Ujian' || details.is_ujian 
                              ? 'Pilihan Catatan Ujian Surat:' 
                              : 'Pilihan Catatan Cepat Hafalan:'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(() => {
                            const isExam = details.status === 'Ujian' || details.is_ujian;
                            const chips: string[] = [];
                            if (isExam) {
                              if (details.grade === 'L' || details.grade === 'CL') {
                                chips.push(
                                  'Alhamdulillah lulus ujian surat dengan baik',
                                  'Lulus ujian lancar, siap lanjut surat berikutnya',
                                  'Tajwid dan makhraj saat ujian sangat baik'
                                );
                              } else if (details.grade === 'BL') {
                                chips.push(
                                  'Ujian belum tuntas, perlu muroja\'ah intensif di rumah',
                                  'Sering terhenti di sambungan ayat saat ujian',
                                  'Perlu bimbingan mandiri sebelum mengulang ujian'
                                );
                              } else {
                                chips.push(
                                  'Lulus ujian lancar, siap lanjut surat berikutnya',
                                  'Ujian belum tuntas, perlu muroja\'ah di rumah'
                                );
                              }
                            } else {
                              if (details.grade === 'BL') {
                                chips.push('Belum lancar, perlu dimaksimalkan muroja\'ah di rumah');
                              } else {
                                chips.push('Alhamdulillah bacaan lancar dan makhraj tepat');
                              }
                              chips.push(
                                'Perhatikan sambungan ayat tengah ke akhir',
                                'Perhatikan hukum tajwid (mad thabi\'i & dengung)',
                                'Sering lupa sambung ayat, mohon didampingi',
                                'Tingkatkan fokus dan ketelitian saat menyetor'
                              );
                            }
                            return chips.map((chip, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setDetails({
                                  ...details, 
                                  note: details.note ? `${details.note}. ${chip}` : chip
                                })}
                                className="text-[10px] bg-stone-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-stone-600 px-2.5 py-1 rounded-lg transition-all border border-stone-200/50"
                              >
                                + {chip}
                              </button>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {type === 'ummi' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Jilid</label>
                      <select 
                        className="w-full bg-white border border-stone-200/60 rounded-xl px-5 py-4 text-base font-semibold focus:outline-none focus:ring-4 ring-stone-900/5 transition-all appearance-none cursor-pointer"
                        value={details.level || ''}
                        onChange={e => setDetails({...details, level: e.target.value})}
                      >
                        <option value="">Pilih Jilid</option>
                        {[1,2,3,4,5,6].map(i => <option key={i} value={i}>Ummi Jilid {i}</option>)}
                        <option value="Al-Quran">Al-Quran</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2.5">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Hal Awal</label>
                        <input 
                          type="text"
                          className="w-full bg-white border border-stone-200/60 rounded-xl px-5 py-4 text-base font-semibold text-center focus:outline-none focus:ring-4 ring-stone-900/5 transition-all"
                          value={details.page_start || ''}
                          onChange={e => setDetails({...details, page_start: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2.5">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Hal Akhir</label>
                        <input 
                          type="text"
                          className="w-full bg-white border border-stone-200/60 rounded-xl px-5 py-4 text-base font-semibold text-center focus:outline-none focus:ring-4 ring-stone-900/5 transition-all"
                          value={details.page_end || ''}
                          onChange={e => setDetails({...details, page_end: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Nilai</label>
                      <div className="grid grid-cols-3 gap-3">
                        {(['A', 'B', 'C'] as const).map(g => (
                           <button
                             type="button"
                             key={g}
                             onClick={() => setDetails({...details, grade: g})}
                             className={cn(
                               "h-[60px] rounded-xl font-display font-bold border-2 transition-all flex items-center justify-center",
                               details.grade === g 
                                ? (g === 'C' ? "bg-rose-600 border-rose-600 text-white shadow-lg" : "bg-stone-950 border-stone-950 text-white shadow-lg")
                                : "bg-white border-stone-100 text-stone-400 hover:border-stone-300 hover:text-stone-950"
                             )}
                           >
                             {g}
                           </button>
                        ))}
                      </div>
                    </div>

                    {/* Catatan Harian Ummi - Placed directly below Nilai Ummi */}
                    <div className="space-y-2 md:col-span-2 lg:col-span-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                          <FileText size={12} className="text-emerald-500" />
                          Catatan Harian Ummi <span className="text-stone-400 font-normal lowercase">(opsional / terkirim ke WA & rekap)</span>
                        </label>
                        {details.note && (
                          <button 
                            type="button"
                            onClick={() => setDetails({...details, note: ''})}
                            className="text-[10px] text-rose-500 hover:underline font-bold"
                          >
                            Kosongkan Catatan
                          </button>
                        )}
                      </div>
                      <textarea 
                        rows={2}
                        className="w-full bg-white border border-stone-200/60 rounded-xl px-5 py-3 text-sm font-medium placeholder:text-stone-300 focus:outline-none focus:ring-4 ring-stone-900/5 transition-all resize-none"
                        placeholder={details.level ? `Catatan harian untuk Ummi Jilid ${details.level} (klik pilihan cepat di bawah)...` : "Pilih Jilid di atas untuk menampilkan pilihan catatan sesuai tingkat jilid (opsional)"}
                        value={details.note || ''}
                        onChange={e => setDetails({...details, note: e.target.value})}
                      />
                      
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/60 inline-flex items-center gap-1">
                            <Sparkles size={11} className="text-emerald-600" />
                            {details.level && UMMI_LEVEL_NOTES[String(details.level)] 
                              ? `Pilihan Catatan ${UMMI_LEVEL_NOTES[String(details.level)].label}`
                              : 'Pilihan Catatan (Pilih Jilid di atas untuk rekomendasi sesuai tingkatan):'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(() => {
                            const lvl = String(details.level || '');
                            const config = UMMI_LEVEL_NOTES[lvl];
                            const chips: string[] = [];
                            if (config) {
                              if (details.grade === 'C') {
                                chips.push(config.remediation);
                              }
                              chips.push(...config.chips);
                            } else {
                              if (details.grade === 'C') {
                                chips.push('Perlu banyak latihan membaca di rumah agar lebih lancar');
                              } else {
                                chips.push('Lancar, makharijul huruf sangat baik');
                              }
                              chips.push(
                                'Perhatikan panjang pendek (mad thabi\'i 2 harakat)',
                                'Tanda waqaf dan jeda nafas perlu dilatih',
                                'Perjelas bunyi harakat dhommah dan kasrah'
                              );
                            }
                            return chips.map((chip, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setDetails({
                                  ...details, 
                                  note: details.note ? `${details.note}. ${chip}` : chip
                                })}
                                className="text-[10px] bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 text-stone-600 px-2.5 py-1 rounded-lg transition-all border border-stone-200/50"
                              >
                                + {chip}
                              </button>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {type === 'tilawah' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
                    <div className="md:col-span-3 space-y-2.5">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Juz</label>
                      <select 
                        className="w-full bg-white border border-stone-200/60 rounded-xl px-5 py-4 text-base font-semibold focus:outline-none focus:ring-4 ring-stone-900/5 transition-all appearance-none cursor-pointer"
                        value={details.juz || ''}
                        onChange={e => setDetails({...details, juz: e.target.value})}
                      >
                        <option value="">Pilih Juz</option>
                        {Array.from({length: 30}, (_, i) => i + 1).map(i => (
                          <option key={i} value={i}>Juz {i}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-9 space-y-2.5">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Nama Surat</label>
                      <input 
                        type="text"
                        list="surah-datalist"
                        className="w-full bg-white border border-stone-200/60 rounded-xl px-5 py-4 text-base font-semibold placeholder:text-stone-300 focus:outline-none focus:ring-4 ring-stone-900/5 transition-all"
                        placeholder="Contoh: Al-Baqarah"
                        value={details.surah || ''}
                        onChange={e => setDetails({...details, surah: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-7 grid grid-cols-2 gap-4">
                      <div className="space-y-2.5">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Ayat Awal</label>
                        <input 
                          type="text"
                          className="w-full bg-white border border-stone-200/60 rounded-xl px-5 py-4 text-base font-semibold text-center focus:outline-none focus:ring-4 ring-stone-900/5 transition-all"
                          value={details.verse_start || ''}
                          onChange={e => setDetails({...details, verse_start: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2.5">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Ayat Akhir</label>
                        <input 
                          type="text"
                          className="w-full bg-white border border-stone-200/60 rounded-xl px-5 py-4 text-base font-semibold text-center focus:outline-none focus:ring-4 ring-stone-900/5 transition-all"
                          value={details.verse_end || ''}
                          onChange={e => setDetails({...details, verse_end: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="md:col-span-5 space-y-2.5">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Nilai</label>
                      <div className="grid grid-cols-3 gap-3">
                        {(['A', 'B', 'C'] as const).map(g => (
                           <button
                             type="button"
                             key={g}
                             onClick={() => setDetails({...details, grade: g})}
                             className={cn(
                               "h-[60px] rounded-xl font-display font-bold border-2 transition-all flex items-center justify-center",
                               details.grade === g 
                                ? (g === 'C' ? "bg-rose-600 border-rose-600 text-white shadow-lg" : "bg-stone-950 border-stone-950 text-white shadow-lg")
                                : "bg-white border-stone-100 text-stone-400 hover:border-stone-300 hover:text-stone-950"
                             )}
                           >
                             {g}
                           </button>
                        ))}
                      </div>
                    </div>

                    {/* Catatan Harian Tilawah - Placed directly below Nilai Tilawah */}
                    <div className="space-y-2 md:col-span-12">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                          <FileText size={12} className="text-indigo-500" />
                          Catatan Harian Tilawah <span className="text-stone-400 font-normal lowercase">(opsional / terkirim ke WA & rekap)</span>
                        </label>
                        {details.note && (
                          <button 
                            type="button"
                            onClick={() => setDetails({...details, note: ''})}
                            className="text-[10px] text-rose-500 hover:underline font-bold"
                          >
                            Kosongkan Catatan
                          </button>
                        )}
                      </div>
                      <textarea 
                        rows={2}
                        className="w-full bg-white border border-stone-200/60 rounded-xl px-5 py-3 text-sm font-medium placeholder:text-stone-300 focus:outline-none focus:ring-4 ring-stone-900/5 transition-all resize-none"
                        placeholder="Contoh: Perhatikan waqaf dan ibtida / Tartil dan intonasi tilawah (bisa dikosongkan jika tidak ada catatan)"
                        value={details.note || ''}
                        onChange={e => setDetails({...details, note: e.target.value})}
                      />
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100/60 inline-flex items-center gap-1">
                            <Sparkles size={11} className="text-blue-600" />
                            {details.juz ? `Pilihan Catatan Tilawah (Juz ${details.juz}):` : 'Pilihan Catatan Cepat Tilawah:'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(() => {
                            const juzNum = parseInt(details.juz || '0', 10);
                            const chips: string[] = [];
                            if (details.grade === 'C') {
                              chips.push('Kelancaran tilawah perlu ditingkatkan di rumah');
                            } else {
                              chips.push('Tilawah tartil, makhraj dan tajwid sangat baik');
                            }
                            if (juzNum >= 1 && juzNum <= 10) {
                              chips.push(
                                'Perhatikan tanda waqaf lazim dan jim',
                                'Perjelas makhraj huruf tenggorokan (\'Ain, Ha, Ghain)',
                                'Latih jeda nafas pada ayat panjang'
                              );
                            } else if (juzNum >= 11 && juzNum <= 20) {
                              chips.push(
                                'Tartil dan ketukan dengung terjaga dengan baik',
                                'Perhatikan tanda waqaf mutlaq & washol',
                                'Jaga irama tartil tetap konsisten'
                              );
                            } else if (juzNum >= 21 && juzNum <= 30) {
                              chips.push(
                                'Tilawah fasih dan mutqin',
                                'Perhatikan hukum ro\' tafkhim & tarqiq',
                                'Konsistenkan panjang mad 2 dan 4-5 harakat'
                              );
                            } else {
                              chips.push(
                                'Perhatikan tanda waqaf & washol',
                                'Jaga ketukan nada dan kejelasan makhraj huruf',
                                'Latih pernafasan saat membaca ayat panjang'
                              );
                            }
                            return chips.map((chip, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setDetails({
                                  ...details, 
                                  note: details.note ? `${details.note}. ${chip}` : chip
                                })}
                                className="text-[10px] bg-stone-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-stone-600 px-2.5 py-1 rounded-lg transition-all border border-stone-200/50"
                              >
                                + {chip}
                              </button>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className={cn(
                    "flex-[2] text-white py-5 rounded-2xl font-display font-bold text-sm uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 shadow-xl hover:translate-y-[-2px] active:translate-y-0",
                    theme.bg, theme.shadow,
                    "disabled:opacity-50"
                  )}
                >
                  <Save size={18} />
                  {isSaving ? 'Processing...' : 'Simpan Setoran'}
                </button>
                <div className="flex flex-1 gap-3">
                  <button 
                    type="button"
                    onClick={handleSendMessage}
                    disabled={!selectedStudent || !details.grade}
                    className="flex-1 bg-white text-emerald-600 border border-stone-200 py-5 rounded-2xl font-display font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-50 hover:border-emerald-200 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                    title="Kirim laporan ke WhatsApp orang tua"
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="aspect-square bg-stone-100 text-stone-400 rounded-2xl hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center justify-center border border-stone-200/50"
                    title="Hapus"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 bg-white rounded-[3rem] border border-stone-100 text-stone-400 space-y-6">
            <div className="w-20 h-20 bg-stone-50 rounded-2xl flex items-center justify-center shadow-inner">
              <ClipboardCheck size={32} className="opacity-10" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-display font-bold text-stone-950 uppercase tracking-tighter">Pilih Siswa</h3>
              <p className="text-xs font-medium text-stone-400 max-w-[240px] mx-auto leading-relaxed">Ketuk nama siswa di sebelah kiri untuk mulai menginput data setoran hari ini.</p>
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
