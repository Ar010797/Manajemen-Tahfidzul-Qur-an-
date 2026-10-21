import { findSurahObj } from './quranUtils';
import { SURAH_LIST } from '../constants/surahs';

export interface SemesterTargetDetail {
  hafalanLabel: string;
  ummiLabel: string;
  targetSurahName: string;
  targetSurahId: number;       // Surah ID (1 - 114)
  targetAyah: number;          // 0 = seluruh surah / sampai akhir surah; >0 = ayat target spesifik
  targetSurahIndex: number;    // Urutan progres kurikulum (1 s.d. 64+)
  targetUmmiLevel: number;     // 1 to 7 (7 = Al-Qur'an)
  targetUmmiAbsoluteScore: number;
  isMurojaah?: boolean;
}

export interface ClassCurriculum {
  gradeNumber: number;
  gradeLabel: string;
  smtGanjil: SemesterTargetDetail;
  smtGenap: SemesterTargetDetail;
  notes?: string;
}

/**
 * Tabel Target & Kurikulum Hafalan Tahunan Resmi
 * Persis Sesuai Lampiran Target Tahfidz:
 * - Kelas 1 (SD): Smt Ganjil: An Naba - Abasa | Jilid 1-2 hal 20
 *                 Smt Genap:  At Takwir - Al Insyiqoq | Jilid 2 hal 21 - Jilid 3 hal 40
 * - Kelas 2 (SD): Smt Ganjil: Al Buruj - Al Fajr | Jilid 4-5 hal 20
 *                 Smt Genap:  Al Balad - Al 'Alaq | Jilid 5 hal 21 - 6 hal 40
 * - Kelas 3 (SD): Smt Ganjil: Al Qodar - An Nas | Al Qur'an
 *                 Smt Genap:  Al Mulk - Al Haqqoh : 8 | Al Qur'an
 * - Kelas 4 (SD): Smt Ganjil: Al Haqqoh : 9 - Al Jin : 28 | Al Qur'an
 *                 Smt Genap:  Al Muzammil - Al Mursalat : 19 | Al Qur'an
 * - Kelas 5 (SD): Smt Ganjil: Al Mursalat : 20 - Al Munafiqun : 4 | Al Qur'an
 *                 Smt Genap:  Al Munafiqun (Lanjutan / Selesai Juz 28) | Al Qur'an
 * - Kelas 6 (SD): Murojaah / setoran ulang hafalan yang didapat dan memutqinkan juz 30
 * - Kelas 7 (MTS): Smt Ganjil: Muroja'ah hafalan | -
 *                  Smt Genap:  Menambah hafalan 1 juz | -
 * - Kelas 8 (MTS): Smt Ganjil: Nambah 1 juz | -
 *                  Smt Genap:  Nambah 1 juz | -
 * - Kelas 9 (MTS): Memutqinkan hafalan yang didapat kelas 7 dan 8
 */
export const KURIKULUM_TAHUNAN: ClassCurriculum[] = [
  {
    gradeNumber: 1,
    gradeLabel: 'Kelas 1 (SD)',
    smtGanjil: {
      hafalanLabel: 'An Naba - Abasa',
      ummiLabel: 'Jilid 1-2 hal 20',
      targetSurahName: "'Abasa",
      targetSurahId: 80,
      targetAyah: 0, // Selesai surah 'Abasa
      targetSurahIndex: 3,
      targetUmmiLevel: 2,
      targetUmmiAbsoluteScore: (2 - 1) * 40 + 20 // 60
    },
    smtGenap: {
      hafalanLabel: 'At Takwir - Al Insyiqoq',
      ummiLabel: 'Jilid 2 hal 21 - Jilid 3 hal 40',
      targetSurahName: 'Al-Insyiqaq',
      targetSurahId: 84,
      targetAyah: 0, // Selesai surah Al-Insyiqaq
      targetSurahIndex: 7,
      targetUmmiLevel: 3,
      targetUmmiAbsoluteScore: (3 - 1) * 40 + 40 // 120
    }
  },
  {
    gradeNumber: 2,
    gradeLabel: 'Kelas 2 (SD)',
    smtGanjil: {
      hafalanLabel: 'Al Buruj - Al Fajr',
      ummiLabel: 'Jilid 4-5 hal 20',
      targetSurahName: 'Al-Fajr',
      targetSurahId: 89,
      targetAyah: 0, // Selesai surah Al-Fajr
      targetSurahIndex: 12,
      targetUmmiLevel: 5,
      targetUmmiAbsoluteScore: (5 - 1) * 40 + 20 // 180
    },
    smtGenap: {
      hafalanLabel: "Al Balad - Al 'Alaq",
      ummiLabel: 'Jilid 5 hal 21 - 6 hal 40',
      targetSurahName: "Al-'Alaq",
      targetSurahId: 96,
      targetAyah: 0, // Selesai surah Al-'Alaq
      targetSurahIndex: 19,
      targetUmmiLevel: 6,
      targetUmmiAbsoluteScore: (6 - 1) * 40 + 40 // 240
    }
  },
  {
    gradeNumber: 3,
    gradeLabel: 'Kelas 3 (SD)',
    smtGanjil: {
      hafalanLabel: 'Al Qodar - An Nas',
      ummiLabel: "Al Qur'an",
      targetSurahName: 'An-Nas',
      targetSurahId: 114,
      targetAyah: 0, // Selesai Juz 30 (An-Nas)
      targetSurahIndex: 37,
      targetUmmiLevel: 7,
      targetUmmiAbsoluteScore: 7 * 40 // 280
    },
    smtGenap: {
      hafalanLabel: 'Al Mulk - Al Haqqoh : 8',
      ummiLabel: "Al Qur'an",
      targetSurahName: 'Al-Haqqah',
      targetSurahId: 69,
      targetAyah: 8, // Target spesifik: ayat 8
      targetSurahIndex: 40,
      targetUmmiLevel: 7,
      targetUmmiAbsoluteScore: 7 * 40 // 280
    }
  },
  {
    gradeNumber: 4,
    gradeLabel: 'Kelas 4 (SD)',
    smtGanjil: {
      hafalanLabel: 'Al Haqqoh : 9 - Al Jin : 28',
      ummiLabel: "Al Qur'an",
      targetSurahName: 'Al-Jinn',
      targetSurahId: 72,
      targetAyah: 28, // Target spesifik: ayat 28 (selesai Al-Jinn)
      targetSurahIndex: 43,
      targetUmmiLevel: 7,
      targetUmmiAbsoluteScore: 7 * 40
    },
    smtGenap: {
      hafalanLabel: 'Al Muzammil - Al Mursalat : 19',
      ummiLabel: "Al Qur'an",
      targetSurahName: 'Al-Mursalat',
      targetSurahId: 77,
      targetAyah: 19, // Target spesifik: ayat 19
      targetSurahIndex: 48,
      targetUmmiLevel: 7,
      targetUmmiAbsoluteScore: 7 * 40
    }
  },
  {
    gradeNumber: 5,
    gradeLabel: 'Kelas 5 (SD)',
    smtGanjil: {
      hafalanLabel: 'Al Mursalat : 20 - Al Munafiqun : 4',
      ummiLabel: "Al Qur'an",
      targetSurahName: 'Al-Munafiqun',
      targetSurahId: 63,
      targetAyah: 4, // Target spesifik: ayat 4
      targetSurahIndex: 54,
      targetUmmiLevel: 7,
      targetUmmiAbsoluteScore: 7 * 40
    },
    smtGenap: {
      hafalanLabel: 'Al Munafiqun',
      ummiLabel: "Al Qur'an",
      targetSurahName: 'Al-Munafiqun',
      targetSurahId: 63,
      targetAyah: 0, // Selesai Al-Munafiqun / Juz 28
      targetSurahIndex: 57,
      targetUmmiLevel: 7,
      targetUmmiAbsoluteScore: 7 * 40
    }
  },
  {
    gradeNumber: 6,
    gradeLabel: 'Kelas 6 (SD)',
    notes: 'Murojaah / setoran ulang hafalan yang didapat dan memutqinkan juz 30',
    smtGanjil: {
      hafalanLabel: 'Muroja\'ah Memutqinkan Juz 30',
      ummiLabel: "Al Qur'an",
      targetSurahName: 'An-Nas',
      targetSurahId: 114,
      targetAyah: 0,
      targetSurahIndex: 37,
      targetUmmiLevel: 7,
      targetUmmiAbsoluteScore: 7 * 40,
      isMurojaah: true
    },
    smtGenap: {
      hafalanLabel: 'Muroja\'ah Memutqinkan Juz 30',
      ummiLabel: "Al Qur'an",
      targetSurahName: 'An-Nas',
      targetSurahId: 114,
      targetAyah: 0,
      targetSurahIndex: 37,
      targetUmmiLevel: 7,
      targetUmmiAbsoluteScore: 7 * 40,
      isMurojaah: true
    }
  },
  {
    gradeNumber: 7,
    gradeLabel: 'Kelas 7 (MTS)',
    smtGanjil: {
      hafalanLabel: "Muroja'ah hafalan",
      ummiLabel: '-',
      targetSurahName: "Muroja'ah",
      targetSurahId: 0,
      targetAyah: 0,
      targetSurahIndex: 37,
      targetUmmiLevel: 0,
      targetUmmiAbsoluteScore: 0,
      isMurojaah: true
    },
    smtGenap: {
      hafalanLabel: 'Menambah hafalan 1 juz',
      ummiLabel: '-',
      targetSurahName: 'Menambah 1 Juz',
      targetSurahId: 0,
      targetAyah: 0,
      targetSurahIndex: 48,
      targetUmmiLevel: 0,
      targetUmmiAbsoluteScore: 0
    }
  },
  {
    gradeNumber: 8,
    gradeLabel: 'Kelas 8 (MTS)',
    smtGanjil: {
      hafalanLabel: 'Nambah 1 juz',
      ummiLabel: '-',
      targetSurahName: 'Nambah 1 Juz',
      targetSurahId: 0,
      targetAyah: 0,
      targetSurahIndex: 57,
      targetUmmiLevel: 0,
      targetUmmiAbsoluteScore: 0
    },
    smtGenap: {
      hafalanLabel: 'Nambah 1 juz',
      ummiLabel: '-',
      targetSurahName: 'Nambah 1 Juz',
      targetSurahId: 0,
      targetAyah: 0,
      targetSurahIndex: 64,
      targetUmmiLevel: 0,
      targetUmmiAbsoluteScore: 0
    }
  },
  {
    gradeNumber: 9,
    gradeLabel: 'Kelas 9 (MTS)',
    notes: 'Memutqinkan hafalan yang didapat kelas 7 dan 8',
    smtGanjil: {
      hafalanLabel: 'Memutqinkan hafalan kelas 7 dan 8',
      ummiLabel: '-',
      targetSurahName: 'Mutqin Kelas 7-8',
      targetSurahId: 0,
      targetAyah: 0,
      targetSurahIndex: 64,
      targetUmmiLevel: 0,
      targetUmmiAbsoluteScore: 0,
      isMurojaah: true
    },
    smtGenap: {
      hafalanLabel: 'Memutqinkan hafalan kelas 7 dan 8',
      ummiLabel: '-',
      targetSurahName: 'Mutqin Kelas 7-8',
      targetSurahId: 0,
      targetAyah: 0,
      targetSurahIndex: 64,
      targetUmmiLevel: 0,
      targetUmmiAbsoluteScore: 0,
      isMurojaah: true
    }
  }
];

/**
 * Mengambil target kelas berdasarkan nomor tingkat dan semester (1 / 2)
 */
export function getCurriculumForGrade(grade: number, semester: 1 | 2 = 1): SemesterTargetDetail {
  const found = KURIKULUM_TAHUNAN.find(c => c.gradeNumber === grade);
  if (!found) {
    // Default fallback to Kelas 1
    const fallback = KURIKULUM_TAHUNAN[0];
    return semester === 1 ? fallback.smtGanjil : fallback.smtGenap;
  }
  return semester === 1 ? found.smtGanjil : found.smtGenap;
}

/**
 * Menghitung urutan index linear surah dalam kurikulum tahfidz
 */
export function getLinearSurahIndex(surahId: number): number {
  if (surahId >= 78 && surahId <= 114) {
    return (surahId - 78) + 1; // 1 to 37 (Juz 30)
  }
  if (surahId >= 67 && surahId <= 77) {
    return 37 + (surahId - 67) + 1; // 38 to 48 (Juz 29)
  }
  if (surahId >= 58 && surahId <= 66) {
    return 48 + (surahId - 58) + 1; // 49 to 57 (Juz 28)
  }
  if (surahId >= 51 && surahId <= 57) {
    return 57 + (surahId - 51) + 1; // 58 to 64 (Juz 27)
  }
  if (surahId >= 46 && surahId <= 50) {
    return 64 + (surahId - 46) + 1; // 65 to 69
  }
  if (surahId >= 1 && surahId <= 45) {
    return 69 + surahId; // 70+
  }
  return 0;
}

export interface ParsedHafalanPosition {
  surahId: number;
  surahName: string;
  ayah: number;
  isFullSurah: boolean;
  curriculumIndex: number;
  isMutqin: boolean;
  rawText: string;
}

/**
 * Parsing posisi hafalan siswa (surah & ayat) dari teks atau deposit harian
 */
export function parseHafalanPosition(rawInput: any): ParsedHafalanPosition {
  const result: ParsedHafalanPosition = {
    surahId: 0,
    surahName: '',
    ayah: 0,
    isFullSurah: false,
    curriculumIndex: 0,
    isMutqin: false,
    rawText: ''
  };

  if (!rawInput) return result;

  let text = '';
  let ayahExplicit = 0;

  if (typeof rawInput === 'object') {
    text = rawInput.surah || rawInput.name || rawInput.total_hafalan || '';
    ayahExplicit = parseInt(rawInput.verse_end || rawInput.verse_start || rawInput.ayah || '0') || 0;
  } else {
    text = String(rawInput);
  }

  result.rawText = text.trim();

  if (/mutqin|lulus mutqin|khatam mutqin/i.test(text)) {
    result.isMutqin = true;
    result.curriculumIndex = 999;
  }

  // Extract explicit verse number if written in text (e.g. "Al-Haqqah : 8", "ayat 8", "ayat 1-8", "ayat 28")
  if (ayahExplicit === 0) {
    const colonMatch = text.match(/:\s*(\d+)/);
    if (colonMatch) {
      ayahExplicit = parseInt(colonMatch[1]);
    } else {
      const ayatMatch = text.match(/ayat\s*(?:(\d+)\s*-\s*)?(\d+)/i);
      if (ayatMatch) {
        ayahExplicit = parseInt(ayatMatch[2] || ayatMatch[1]);
      } else {
        const trailingNum = text.match(/\b(?:ayat\s*)?(\d+)$/i);
        if (trailingNum && !text.toLowerCase().includes('juz') && !text.toLowerCase().includes('surat')) {
          ayahExplicit = parseInt(trailingNum[1]);
        }
      }
    }
  }

  // Explicit juz completed
  if (/\b(?:4|empat)\s*juz\b/i.test(text) || /selesai\s*(?:juz\s*)?27/i.test(text)) {
    result.curriculumIndex = Math.max(result.curriculumIndex, 64);
  } else if (/\b(?:3|tiga)\s*juz\b/i.test(text) || /selesai\s*(?:juz\s*)?28/i.test(text)) {
    result.curriculumIndex = Math.max(result.curriculumIndex, 57);
  } else if (/\b(?:2|dua)\s*juz\b/i.test(text) || /selesai\s*(?:juz\s*)?29/i.test(text)) {
    result.curriculumIndex = Math.max(result.curriculumIndex, 48);
  } else if (/\b(?:1|satu)\s*juz\b/i.test(text) || /selesai\s*(?:juz\s*)?30/i.test(text)) {
    result.curriculumIndex = Math.max(result.curriculumIndex, 37);
  }

  // Pattern "X surat" (e.g. "37 surat")
  const justSuratMatch = text.match(/^(\d+)\s*surat/i);
  if (justSuratMatch) {
    const s = parseInt(justSuratMatch[1]);
    if (s > 0 && s <= 37) {
      result.curriculumIndex = Math.max(result.curriculumIndex, s);
    }
  }

  // Clean text to extract pure surah name
  const cleanSurahText = text
    .replace(/^j(?:uz)?\s*\d+\s+/i, '')
    .replace(/^surah?\s*/i, '')
    .replace(/ayat\s*\d+(?:\s*-\s*\d+)?/i, '')
    .replace(/:\s*\d+/g, '')
    .replace(/\d+(?:\s*-\s*\d+)?$/, '')
    .trim();

  const surahObj = findSurahObj(cleanSurahText);
  if (surahObj) {
    result.surahId = surahObj.id;
    result.surahName = surahObj.name;
    result.ayah = ayahExplicit;
    if (ayahExplicit === 0 || ayahExplicit >= surahObj.total_ayat) {
      result.isFullSurah = true;
    }
    const linearIdx = getLinearSurahIndex(surahObj.id);
    result.curriculumIndex = Math.max(result.curriculumIndex, linearIdx);
  }

  return result;
}

export interface TargetEvaluationResult {
  achieved: boolean;
  percentage: number;
  statusLabel: 'Tercapai' | 'Belum Mencapai Target' | 'Belum Ada Data';
  keterangan: string;
}

/**
 * Parsing spesifikasi target hafalan (baik berupa rentang "Al Buruj - Al Fajr" maupun surah tunggal).
 * Pada rentang "Surah A - Surah B", target capaian akhir yang harus ditembus adalah Surah B (bagian akhir rentang)!
 */
export function parseTargetSpecification(rawTarget: string, defaultGrade: number = 1, semester: 1 | 2 = 1): SemesterTargetDetail {
  if (!rawTarget || rawTarget === '-' || rawTarget === 'Belum Ada Data') {
    return getCurriculumForGrade(defaultGrade, semester);
  }

  const text = rawTarget.trim();

  // 1. Cek apakah cocok dengan salah satu label di KURIKULUM_TAHUNAN
  for (const c of KURIKULUM_TAHUNAN) {
    if (c.smtGanjil.hafalanLabel.toLowerCase() === text.toLowerCase()) {
      return c.smtGanjil;
    }
    if (c.smtGenap.hafalanLabel.toLowerCase() === text.toLowerCase()) {
      return c.smtGenap;
    }
  }

  // 2. Jika berbentuk rentang "Surah A - Surah B" atau "Surah A s/d Surah B"
  let endTargetText = text;
  if (text.includes('-')) {
    const parts = text.split('-');
    endTargetText = parts[parts.length - 1].trim(); // Ambil bagian akhir setelah tanda hubung
  } else if (/\bs\/?d\b/i.test(text)) {
    const parts = text.split(/\bs\/?d\b/i);
    endTargetText = parts[parts.length - 1].trim();
  } else if (/\bsampai\b/i.test(text)) {
    const parts = text.split(/\bsampai\b/i);
    endTargetText = parts[parts.length - 1].trim();
  }

  // Parse surah dan ayat dari endTargetText
  const parsedEnd = parseHafalanPosition(endTargetText);

  // Jika surah teridentifikasi
  if (parsedEnd.surahId > 0 && parsedEnd.curriculumIndex > 0) {
    return {
      hafalanLabel: text,
      ummiLabel: text.toLowerCase().includes('jilid') ? text : "Al Qur'an",
      targetSurahName: parsedEnd.surahName,
      targetSurahId: parsedEnd.surahId,
      targetAyah: parsedEnd.ayah, // e.g. 8 jika Al-Haqqah : 8, 28 jika Al-Jinn : 28, 0 jika surah penuh
      targetSurahIndex: parsedEnd.curriculumIndex,
      targetUmmiLevel: 7,
      targetUmmiAbsoluteScore: 7 * 40
    };
  }

  // Jika menyebut Juz (misal: "Juz 30", "1 Juz", "Juz 29")
  if (/juz\s*30/i.test(text) || /\b1\s*juz\b/i.test(text)) {
    return {
      hafalanLabel: text,
      ummiLabel: "Al Qur'an",
      targetSurahName: 'An-Nas',
      targetSurahId: 114,
      targetAyah: 0,
      targetSurahIndex: 37,
      targetUmmiLevel: 7,
      targetUmmiAbsoluteScore: 7 * 40
    };
  }
  if (/juz\s*29/i.test(text) || /\b2\s*juz\b/i.test(text)) {
    return {
      hafalanLabel: text,
      ummiLabel: "Al Qur'an",
      targetSurahName: 'Al-Mursalat',
      targetSurahId: 77,
      targetAyah: 0,
      targetSurahIndex: 48,
      targetUmmiLevel: 7,
      targetUmmiAbsoluteScore: 7 * 40
    };
  }
  if (/juz\s*28/i.test(text) || /\b3\s*juz\b/i.test(text)) {
    return {
      hafalanLabel: text,
      ummiLabel: "Al Qur'an",
      targetSurahName: 'At-Tahrim',
      targetSurahId: 66,
      targetAyah: 0,
      targetSurahIndex: 57,
      targetUmmiLevel: 7,
      targetUmmiAbsoluteScore: 7 * 40
    };
  }

  return getCurriculumForGrade(defaultGrade, semester);
}

/**
 * Mengevaluasi apakah capaian hafalan siswa sudah mencapai ayat dalam target
 * Sesuai aturan:
 * - Jika target memiliki batas ayat (e.g. Al-Haqqah : 8, Al-Jinn : 28, Al-Mursalat : 19, Al-Munafiqun : 4):
 *   Bila siswa sudah mencapai ayat target atau lebih, ditandai TERCAPAI (100%).
 * - Jika siswa sudah melampaui surah target ke surah berikutnya: TERCAPAI (100%).
 * - Siswa yang belum mencapai surah target (misal target Al-Buruj - Al-Fajr tapi baru 'Abasa) WAJIB ditandai BELUM MENCAPAI TARGET!
 */
export function evaluateHafalanAchievement(
  pos: ParsedHafalanPosition,
  target: SemesterTargetDetail,
  hasCompletedExam: boolean = false
): TargetEvaluationResult {
  // 1. Jika ada kelulusan ujian resmi pada surah target atau melampaui target
  if (hasCompletedExam && pos.curriculumIndex >= target.targetSurahIndex) {
    return {
      achieved: true,
      percentage: 100,
      statusLabel: 'Tercapai',
      keterangan: 'Lulus Ujian Target'
    };
  }

  // 2. Jika mutqin umum tingkat tinggi (misal khatam juz)
  if (pos.isMutqin && (pos.curriculumIndex >= target.targetSurahIndex || pos.curriculumIndex === 999)) {
    return {
      achieved: true,
      percentage: 100,
      statusLabel: 'Tercapai',
      keterangan: 'Lulus Mutqin'
    };
  }

  // 2. Tingkat Muroja'ah (Kelas 6 SD, Kelas 9 MTS, Kelas 7 Smt Ganjil)
  if (target.isMurojaah) {
    const hasData = pos.curriculumIndex > 0 || pos.surahId > 0;
    return {
      achieved: hasData,
      percentage: hasData ? 100 : 0,
      statusLabel: hasData ? 'Tercapai' : 'Belum Ada Data',
      keterangan: hasData ? 'Muroja\'ah Aktif' : 'Belum Ada Catatan Muroja\'ah'
    };
  }

  // 3. Belum ada data hafalan
  if (pos.curriculumIndex === 0 && pos.surahId === 0) {
    return {
      achieved: false,
      percentage: 0,
      statusLabel: 'Belum Ada Data',
      keterangan: 'Belum ada data setoran'
    };
  }

  // 4. Sudah melampaui surah target (berada di surah yang lebih lanjut dalam kurikulum)
  if (pos.curriculumIndex > target.targetSurahIndex) {
    return {
      achieved: true,
      percentage: 100,
      statusLabel: 'Tercapai',
      keterangan: `Melampaui target (${target.hafalanLabel})`
    };
  }

  // 5. Berada di surah target yang sama persis
  if (pos.curriculumIndex === target.targetSurahIndex || (target.targetSurahId > 0 && pos.surahId === target.targetSurahId)) {
    // A. Jika target tidak mensyaratkan ayat tertentu (target seluruh surah / targetAyah = 0)
    if (!target.targetAyah || target.targetAyah <= 0) {
      return {
        achieved: true,
        percentage: 100,
        statusLabel: 'Tercapai',
        keterangan: `Mencapai surah target (${target.targetSurahName})`
      };
    }

    // B. Target memiliki ayat spesifik (e.g. Al-Haqqah : 8, Al-Jinn : 28, Al-Mursalat : 19, Al-Munafiqun : 4)
    if (pos.isFullSurah || pos.ayah >= target.targetAyah) {
      return {
        achieved: true,
        percentage: 100,
        statusLabel: 'Tercapai',
        keterangan: `Mencapai ayat ${pos.ayah || target.targetAyah} (Target: ayat ${target.targetAyah})`
      };
    } else {
      // Masih di surah target tapi belum mencapai ayat yang ditentukan
      const pct = Math.min(99, Math.max(1, Math.round((pos.ayah / target.targetAyah) * 100)));
      return {
        achieved: false,
        percentage: pct,
        statusLabel: 'Belum Mencapai Target',
        keterangan: `Ayat ${pos.ayah} dari target ayat ${target.targetAyah}`
      };
    }
  }

  // 6. Masih berada di surah sebelum target
  const pct = target.targetSurahIndex > 0 ? Math.min(95, Math.round((pos.curriculumIndex / target.targetSurahIndex) * 100)) : 0;
  return {
    achieved: false,
    percentage: Math.max(0, pct),
    statusLabel: 'Belum Mencapai Target',
    keterangan: `Progres menuju ${target.hafalanLabel}`
  };
}
