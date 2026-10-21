import { SURAH_LIST } from '../constants/surahs';

export const juzData: Record<number, {name: string, start: number, end: number}[]> = {
  "1": [
    {
      "name": "Al-Faatiha",
      "start": 1,
      "end": 7
    },
    {
      "name": "Al-Baqara",
      "start": 1,
      "end": 141
    }
  ],
  "2": [
    {
      "name": "Al-Baqara",
      "start": 142,
      "end": 252
    }
  ],
  "3": [
    {
      "name": "Al-Baqara",
      "start": 253,
      "end": 286
    },
    {
      "name": "Aal-i-Imraan",
      "start": 1,
      "end": 92
    }
  ],
  "4": [
    {
      "name": "Aal-i-Imraan",
      "start": 93,
      "end": 200
    },
    {
      "name": "An-Nisaa",
      "start": 1,
      "end": 23
    }
  ],
  "5": [
    {
      "name": "An-Nisaa",
      "start": 24,
      "end": 147
    }
  ],
  "6": [
    {
      "name": "An-Nisaa",
      "start": 148,
      "end": 176
    },
    {
      "name": "Al-Maaida",
      "start": 1,
      "end": 81
    }
  ],
  "7": [
    {
      "name": "Al-Maaida",
      "start": 82,
      "end": 120
    },
    {
      "name": "Al-An'aam",
      "start": 1,
      "end": 110
    }
  ],
  "8": [
    {
      "name": "Al-An'aam",
      "start": 111,
      "end": 165
    },
    {
      "name": "Al-A'raaf",
      "start": 1,
      "end": 87
    }
  ],
  "9": [
    {
      "name": "Al-A'raaf",
      "start": 88,
      "end": 206
    },
    {
      "name": "Al-Anfaal",
      "start": 1,
      "end": 40
    }
  ],
  "10": [
    {
      "name": "Al-Anfaal",
      "start": 41,
      "end": 75
    },
    {
      "name": "At-Tawba",
      "start": 1,
      "end": 92
    }
  ],
  "11": [
    {
      "name": "At-Tawba",
      "start": 93,
      "end": 129
    },
    {
      "name": "Yunus",
      "start": 1,
      "end": 109
    },
    {
      "name": "Hud",
      "start": 1,
      "end": 5
    }
  ],
  "12": [
    {
      "name": "Hud",
      "start": 6,
      "end": 123
    },
    {
      "name": "Yusuf",
      "start": 1,
      "end": 52
    }
  ],
  "13": [
    {
      "name": "Yusuf",
      "start": 53,
      "end": 111
    },
    {
      "name": "Ar-Ra'd",
      "start": 1,
      "end": 43
    },
    {
      "name": "Ibrahim",
      "start": 1,
      "end": 52
    }
  ],
  "14": [
    {
      "name": "Al-Hijr",
      "start": 1,
      "end": 99
    },
    {
      "name": "An-Nahl",
      "start": 1,
      "end": 128
    }
  ],
  "15": [
    {
      "name": "Al-Israa",
      "start": 1,
      "end": 111
    },
    {
      "name": "Al-Kahf",
      "start": 1,
      "end": 74
    }
  ],
  "16": [
    {
      "name": "Al-Kahf",
      "start": 75,
      "end": 110
    },
    {
      "name": "Maryam",
      "start": 1,
      "end": 98
    },
    {
      "name": "Taa-Haa",
      "start": 1,
      "end": 135
    }
  ],
  "17": [
    {
      "name": "Al-Anbiyaa",
      "start": 1,
      "end": 112
    },
    {
      "name": "Al-Hajj",
      "start": 1,
      "end": 78
    }
  ],
  "18": [
    {
      "name": "Al-Muminoon",
      "start": 1,
      "end": 118
    },
    {
      "name": "An-Noor",
      "start": 1,
      "end": 64
    },
    {
      "name": "Al-Furqaan",
      "start": 1,
      "end": 20
    }
  ],
  "19": [
    {
      "name": "Al-Furqaan",
      "start": 21,
      "end": 77
    },
    {
      "name": "Ash-Shu'araa",
      "start": 1,
      "end": 227
    },
    {
      "name": "An-Naml",
      "start": 1,
      "end": 55
    }
  ],
  "20": [
    {
      "name": "An-Naml",
      "start": 56,
      "end": 93
    },
    {
      "name": "Al-Qasas",
      "start": 1,
      "end": 88
    },
    {
      "name": "Al-Ankaboot",
      "start": 1,
      "end": 45
    }
  ],
  "21": [
    {
      "name": "Al-Ankaboot",
      "start": 46,
      "end": 69
    },
    {
      "name": "Ar-Room",
      "start": 1,
      "end": 60
    },
    {
      "name": "Luqman",
      "start": 1,
      "end": 34
    },
    {
      "name": "As-Sajda",
      "start": 1,
      "end": 30
    },
    {
      "name": "Al-Ahzaab",
      "start": 1,
      "end": 30
    }
  ],
  "22": [
    {
      "name": "Al-Ahzaab",
      "start": 31,
      "end": 73
    },
    {
      "name": "Saba",
      "start": 1,
      "end": 54
    },
    {
      "name": "Faatir",
      "start": 1,
      "end": 45
    },
    {
      "name": "Yaseen",
      "start": 1,
      "end": 27
    }
  ],
  "23": [
    {
      "name": "Yaseen",
      "start": 28,
      "end": 83
    },
    {
      "name": "As-Saaffaat",
      "start": 1,
      "end": 182
    },
    {
      "name": "Saad",
      "start": 1,
      "end": 88
    },
    {
      "name": "Az-Zumar",
      "start": 1,
      "end": 31
    }
  ],
  "24": [
    {
      "name": "Az-Zumar",
      "start": 32,
      "end": 75
    },
    {
      "name": "Ghafir",
      "start": 1,
      "end": 85
    },
    {
      "name": "Fussilat",
      "start": 1,
      "end": 46
    }
  ],
  "25": [
    {
      "name": "Fussilat",
      "start": 47,
      "end": 54
    },
    {
      "name": "Ash-Shura",
      "start": 1,
      "end": 53
    },
    {
      "name": "Az-Zukhruf",
      "start": 1,
      "end": 89
    },
    {
      "name": "Ad-Dukhaan",
      "start": 1,
      "end": 59
    },
    {
      "name": "Al-Jaathiya",
      "start": 1,
      "end": 37
    }
  ],
  "26": [
    {
      "name": "Al-Ahqaf",
      "start": 1,
      "end": 35
    },
    {
      "name": "Muhammad",
      "start": 1,
      "end": 38
    },
    {
      "name": "Al-Fath",
      "start": 1,
      "end": 29
    },
    {
      "name": "Al-Hujuraat",
      "start": 1,
      "end": 18
    },
    {
      "name": "Qaaf",
      "start": 1,
      "end": 45
    },
    {
      "name": "Adh-Dhaariyat",
      "start": 1,
      "end": 30
    }
  ],
  "27": [
    {
      "name": "Adh-Dhaariyat",
      "start": 31,
      "end": 60
    },
    {
      "name": "At-Tur",
      "start": 1,
      "end": 49
    },
    {
      "name": "An-Najm",
      "start": 1,
      "end": 62
    },
    {
      "name": "Al-Qamar",
      "start": 1,
      "end": 55
    },
    {
      "name": "Ar-Rahmaan",
      "start": 1,
      "end": 78
    },
    {
      "name": "Al-Waaqia",
      "start": 1,
      "end": 96
    },
    {
      "name": "Al-Hadid",
      "start": 1,
      "end": 29
    }
  ],
  "28": [
    {
      "name": "Al-Mujaadila",
      "start": 1,
      "end": 22
    },
    {
      "name": "Al-Hashr",
      "start": 1,
      "end": 24
    },
    {
      "name": "Al-Mumtahana",
      "start": 1,
      "end": 13
    },
    {
      "name": "As-Saff",
      "start": 1,
      "end": 14
    },
    {
      "name": "Al-Jumu'a",
      "start": 1,
      "end": 11
    },
    {
      "name": "Al-Munaafiqoon",
      "start": 1,
      "end": 11
    },
    {
      "name": "At-Taghaabun",
      "start": 1,
      "end": 18
    },
    {
      "name": "At-Talaaq",
      "start": 1,
      "end": 12
    },
    {
      "name": "At-Tahrim",
      "start": 1,
      "end": 12
    }
  ],
  "29": [
    {
      "name": "Al-Mulk",
      "start": 1,
      "end": 30
    },
    {
      "name": "Al-Qalam",
      "start": 1,
      "end": 52
    },
    {
      "name": "Al-Haaqqa",
      "start": 1,
      "end": 52
    },
    {
      "name": "Al-Ma'aarij",
      "start": 1,
      "end": 44
    },
    {
      "name": "Nooh",
      "start": 1,
      "end": 28
    },
    {
      "name": "Al-Jinn",
      "start": 1,
      "end": 28
    },
    {
      "name": "Al-Muzzammil",
      "start": 1,
      "end": 20
    },
    {
      "name": "Al-Muddaththir",
      "start": 1,
      "end": 56
    },
    {
      "name": "Al-Qiyaama",
      "start": 1,
      "end": 40
    },
    {
      "name": "Al-Insaan",
      "start": 1,
      "end": 31
    },
    {
      "name": "Al-Mursalaat",
      "start": 1,
      "end": 50
    }
  ],
  "30": [
    {
      "name": "An-Naba",
      "start": 1,
      "end": 40
    },
    {
      "name": "An-Naazi'aat",
      "start": 1,
      "end": 46
    },
    {
      "name": "Abasa",
      "start": 1,
      "end": 42
    },
    {
      "name": "At-Takwir",
      "start": 1,
      "end": 29
    },
    {
      "name": "Al-Infitaar",
      "start": 1,
      "end": 19
    },
    {
      "name": "Al-Mutaffifin",
      "start": 1,
      "end": 36
    },
    {
      "name": "Al-Inshiqaaq",
      "start": 1,
      "end": 25
    },
    {
      "name": "Al-Burooj",
      "start": 1,
      "end": 22
    },
    {
      "name": "At-Taariq",
      "start": 1,
      "end": 17
    },
    {
      "name": "Al-A'laa",
      "start": 1,
      "end": 19
    },
    {
      "name": "Al-Ghaashiya",
      "start": 1,
      "end": 26
    },
    {
      "name": "Al-Fajr",
      "start": 1,
      "end": 30
    },
    {
      "name": "Al-Balad",
      "start": 1,
      "end": 20
    },
    {
      "name": "Ash-Shams",
      "start": 1,
      "end": 15
    },
    {
      "name": "Al-Lail",
      "start": 1,
      "end": 21
    },
    {
      "name": "Ad-Dhuhaa",
      "start": 1,
      "end": 11
    },
    {
      "name": "Ash-Sharh",
      "start": 1,
      "end": 8
    },
    {
      "name": "At-Tin",
      "start": 1,
      "end": 8
    },
    {
      "name": "Al-Alaq",
      "start": 1,
      "end": 19
    },
    {
      "name": "Al-Qadr",
      "start": 1,
      "end": 5
    },
    {
      "name": "Al-Bayyina",
      "start": 1,
      "end": 8
    },
    {
      "name": "Az-Zalzala",
      "start": 1,
      "end": 8
    },
    {
      "name": "Al-Aadiyaat",
      "start": 1,
      "end": 11
    },
    {
      "name": "Al-Qaari'a",
      "start": 1,
      "end": 11
    },
    {
      "name": "At-Takaathur",
      "start": 1,
      "end": 8
    },
    {
      "name": "Al-Asr",
      "start": 1,
      "end": 3
    },
    {
      "name": "Al-Humaza",
      "start": 1,
      "end": 9
    },
    {
      "name": "Al-Fil",
      "start": 1,
      "end": 5
    },
    {
      "name": "Quraish",
      "start": 1,
      "end": 4
    },
    {
      "name": "Al-Maa'un",
      "start": 1,
      "end": 7
    },
    {
      "name": "Al-Kawthar",
      "start": 1,
      "end": 3
    },
    {
      "name": "Al-Kaafiroon",
      "start": 1,
      "end": 6
    },
    {
      "name": "An-Nasr",
      "start": 1,
      "end": 3
    },
    {
      "name": "Al-Masad",
      "start": 1,
      "end": 5
    },
    {
      "name": "Al-Ikhlaas",
      "start": 1,
      "end": 4
    },
    {
      "name": "Al-Falaq",
      "start": 1,
      "end": 5
    },
    {
      "name": "An-Naas",
      "start": 1,
      "end": 6
    }
  ]
};

export const CURRICULUM_ORDER = [30, 29, 28, 27, 26, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

// Map of canonical aliases to Surah ID
export const SURAH_ALIAS_TO_ID: Record<string, number> = {
  // Juz 30 (IDs 78 to 114)
  "anaba": 78, "annaba": 78, "naba": 78,
  "naziat": 79, "annaziat": 79, "annazi'at": 79,
  "abasa": 80,
  "attakwir": 81, "takwir": 81,
  "alinfitar": 82, "alinfitor": 82, "infitar": 82, "infitor": 82,
  "almutaffifin": 83, "almuthaffifin": 83, "almuthoffifin": 83, "mutaffifin": 83, "muthaffifin": 83, "muthoffifin": 83,
  "alinsyiqaq": 84, "alinsyiqoq": 84, "insyiqaq": 84, "insyiqoq": 84, "alinshiqaaq": 84,
  "alburuj": 85, "buruj": 85, "alburooj": 85,
  "attariq": 86, "atthariq": 86, "attoriq": 86, "tariq": 86, "thariq": 86,
  "alala": 87, "al-ala": 87, "al'ala": 87, "ala": 87, "alalaa": 87,
  "alghasyiyah": 88, "algosyiyah": 88, "alghosiyah": 88, "ghasyiyah": 88, "ghosiyah": 88, "alghaashiya": 88,
  "alfajr": 89, "fajr": 89,
  "albalad": 90, "balad": 90,
  "asysyams": 91, "ashsyams": 91, "syams": 91,
  "allail": 92, "lail": 92,
  "adduha": 93, "addhuha": 93, "duha": 93, "dhuha": 93,
  "asysyarh": 94, "alamnasyrah": 94, "insyirah": 94, "syarh": 94,
  "attin": 95, "tin": 95,
  "alalaq": 96, "alaq": 96,
  "alqadr": 97, "alqodar": 97, "qadr": 97,
  "albayyinah": 98, "albayinah": 98, "bayyinah": 98,
  "azzalzalah": 99, "zalzalah": 99,
  "aladiyat": 100, "al'adiyat": 100, "adiyat": 100,
  "alqariah": 101, "al-qariah": 101, "qariah": 101,
  "attakasur": 102, "attakatsur": 102, "takasur": 102, "takatsur": 102,
  "alasr": 103, "al-asr": 103, "asr": 103, "ashr": 103,
  "alhumazah": 104, "humazah": 104,
  "alfil": 105, "fil": 105,
  "quraisy": 106, "quraish": 106,
  "almaun": 107, "al-maun": 107, "maun": 107,
  "alkausar": 108, "alkautsar": 108, "kausar": 108, "kautsar": 108,
  "alkafirun": 109, "kafirun": 109,
  "annasr": 110, "nasr": 110,
  "allahab": 111, "almasad": 111, "lahab": 111, "masad": 111,
  "alikhlas": 112, "ikhlas": 112,
  "alfalaq": 113, "falaq": 113,
  "annas": 114, "nas": 114,
  // Juz 29 (IDs 67 to 77)
  "almulk": 67, "mulk": 67,
  "alqalam": 68, "alqolam": 68, "qalam": 68, "qolam": 68,
  "alhaqqah": 69, "alhaqqoh": 69, "haqqah": 69, "haqqoh": 69,
  "almaarij": 70, "maarij": 70,
  "nuh": 71,
  "aljinn": 72, "aljin": 72, "jinn": 72, "jin": 72,
  "almuzzammil": 73, "almuzammil": 73, "muzzammil": 73,
  "almuddassir": 74, "almudasir": 74, "muddassir": 74,
  "alqiyamah": 75, "qiyamah": 75,
  "alinsan": 76, "insan": 76, "addahr": 76,
  "almursalat": 77, "mursalat": 77,
  // Juz 28 (IDs 58 to 66)
  "almujadilah": 58, "almujadalah": 58, "mujadilah": 58, "mujadalah": 58,
  "alhasyr": 59, "hasyr": 59,
  "almumtahanah": 60, "mumtahanah": 60,
  "assaff": 61, "asshaff": 61, "ashshaff": 61, "shaff": 61,
  "aljumuah": 62, "jumuah": 62,
  "almunafiqun": 63, "munafiqun": 63,
  "attagabun": 64, "attaghabun": 64, "attaqabun": 64, "tagabun": 64,
  "attalaq": 65, "atthalaq": 65, "talaq": 65, "thalaq": 65,
  "attahrim": 66, "tahrim": 66,
  // Juz 27 (IDs 51 to 57)
  "azzariyat": 51, "adzdzariyat": 51, "zariyat": 51,
  "attur": 52, "tur": 52,
  "annajm": 53, "najm": 53,
  "alqamar": 54, "qamar": 54,
  "arrahman": 55, "rahman": 55,
  "alwaqiah": 56, "waqiah": 56,
  "alhadid": 57, "hadid": 57,
  // Juz 26
  "al-ahqaf": 46, "alahqaf": 46, "ahqaf": 46,
  "muhammad": 47,
  "alfath": 48, "fath": 48,
  "alhujurat": 49, "hujurat": 49,
  "qaf": 50,
  // Common long surahs
  "alfatihah": 1, "fatihah": 1,
  "albaqarah": 2, "albaqoroh": 2, "baqarah": 2, "baqoroh": 2,
  "aliimran": 3, "alimran": 3, "imran": 3, "imron": 3,
  "annisa": 4, "nisa": 4,
  "almaidah": 5, "maidah": 5,
  "yasin": 36, "yasiin": 36
};

export function cleanSurahKey(s: string): string {
  return (s || '').toLowerCase()
    .replace(/^qs\.?\s*/i, '')
    .replace(/^surah?\s*/i, '')
    .replace(/[^a-z0-9]/g, '');
}

export function findSurahObj(input: string): { id: number; name: string; total_ayat: number } | null {
  if (!input) return null;
  const key = cleanSurahKey(input);
  if (!key) return null;

  if (SURAH_ALIAS_TO_ID[key]) {
    const s = SURAH_LIST.find(x => x.id === SURAH_ALIAS_TO_ID[key]);
    if (s) return s;
  }

  // Exact match on canonical list
  const exact = SURAH_LIST.find(s => cleanSurahKey(s.name) === key);
  if (exact) return exact;

  // Substring match
  const match = SURAH_LIST.find(s => {
    const sk = cleanSurahKey(s.name);
    return sk.includes(key) || key.includes(sk);
  });
  return match || null;
}

/**
 * Returns curriculum index (1-based progression):
 * - 1 to 37: Juz 30 (1 = An-Naba, 7 = Al-Insyiqaq, 19 = Al-'Alaq, 37 = An-Nas)
 * - 38 to 48: Juz 29 (38 = Al-Mulk, 40 = Al-Haqqah, 48 = Al-Mursalat)
 * - 49 to 57: Juz 28 (49 = Al-Mujadilah, 54 = Al-Munafiqun, 57 = At-Tahrim)
 * - 58 to 64: Juz 27 (58 = Az-Zariyat, 64 = Al-Hadid)
 * - 65+: Higher Juzes / Juz 1-26
 * - 999: Mutqin / Lulus Ujian
 */
export function getCurriculumSurahIndex(rawText: string): number {
  if (!rawText || rawText === 'Belum Ada Data' || rawText === 'Surah -' || rawText === '-') return 0;
  
  const text = rawText.toLowerCase().trim();
  
  if (/mutqin|lulus mutqin/i.test(text)) return 999;
  
  // Explicit Juz completed mentions
  if (/\b(?:4|empat)\s*juz\b/i.test(text) || /selesai\s*(?:juz\s*)?27/i.test(text)) return 64;
  if (/\b(?:3|tiga)\s*juz\b/i.test(text) || /selesai\s*(?:juz\s*)?28/i.test(text)) return 57;
  if (/\b(?:2|dua)\s*juz\b/i.test(text) || /selesai\s*(?:juz\s*)?29/i.test(text)) return 48;
  if (/\b(?:1|satu)\s*juz\b/i.test(text) || /selesai\s*(?:juz\s*)?30/i.test(text)) return 37;

  // Pattern "X surat" (e.g. "7 surat", "1 Juz 3 surat")
  const juzSuratMatch = text.match(/(\d+)\s*juz\s*(\d+)\s*surat/i);
  if (juzSuratMatch) {
    const j = parseInt(juzSuratMatch[1]);
    const s = parseInt(juzSuratMatch[2]);
    if (j === 1) return Math.min(48, 37 + s);
    if (j === 2) return Math.min(57, 48 + s);
    if (j === 3) return Math.min(64, 57 + s);
  }
  
  const justSuratMatch = text.match(/^(\d+)\s*surat/i);
  if (justSuratMatch) {
    const s = parseInt(justSuratMatch[1]);
    if (s > 0 && s <= 37) return s;
  }

  // Extract surah and try matching
  let cleanText = text
    .replace(/^j(?:uz)?\s*\d+\s+/i, '')
    .replace(/^surah?\s*/i, '')
    .replace(/ayat\s*\d+(?:-\d+)?/i, '')
    .replace(/\d+(?:-\d+)?$/, '')
    .trim();

  const surahObj = findSurahObj(cleanText);
  if (!surahObj) {
    // If text mentions just Juz
    if (/juz\s*30/i.test(text)) return 37;
    if (/juz\s*29/i.test(text)) return 48;
    if (/juz\s*28/i.test(text)) return 57;
    if (/juz\s*27/i.test(text)) return 64;
    return 0;
  }

  const id = surahObj.id;
  if (id >= 78 && id <= 114) {
    return (id - 78) + 1; // 1 to 37
  }
  if (id >= 67 && id <= 77) {
    return 37 + (id - 67) + 1; // 38 to 48
  }
  if (id >= 58 && id <= 66) {
    return 48 + (id - 58) + 1; // 49 to 57
  }
  if (id >= 51 && id <= 57) {
    return 57 + (id - 51) + 1; // 58 to 64
  }
  if (id >= 46 && id <= 50) {
    return 64 + (id - 46) + 1; // 65 to 69
  }
  if (id >= 1 && id <= 45) {
    return 69 + id; // 70+
  }

  return 0;
}

export function calculateTotalHafalanFromNameAndAyah(
  inputSurahStr: string,
  inputAyah: number,
  isUjian: boolean = false
): { juz: number; surah: number; ayah: number } | null {
  if (!inputSurahStr) return null;

  const surahObj = findSurahObj(inputSurahStr);
  if (!surahObj) return null;

  const id = surahObj.id;
  const isFull = isUjian || isNaN(inputAyah) || inputAyah >= surahObj.total_ayat;

  // Juz 30: Surah 78 (An-Naba) to 114 (An-Nas)
  if (id >= 78 && id <= 114) {
    const priorCompleted = id - 78;
    if (isFull) {
      const completed = priorCompleted + 1;
      if (completed >= 37) {
        return { juz: 1, surah: 0, ayah: 0 };
      }
      return { juz: 0, surah: completed, ayah: 0 };
    }
    return { juz: 0, surah: priorCompleted, ayah: inputAyah > 0 ? inputAyah : 0 };
  }

  // Juz 29: Surah 67 (Al-Mulk) to 77 (Al-Mursalat)
  if (id >= 67 && id <= 77) {
    const priorCompleted = id - 67;
    if (isFull) {
      const completed = priorCompleted + 1;
      if (completed >= 11) {
        return { juz: 2, surah: 0, ayah: 0 };
      }
      return { juz: 1, surah: completed, ayah: 0 };
    }
    return { juz: 1, surah: priorCompleted, ayah: inputAyah > 0 ? inputAyah : 0 };
  }

  // Juz 28: Surah 58 (Al-Mujadilah) to 66 (At-Tahrim)
  if (id >= 58 && id <= 66) {
    const priorCompleted = id - 58;
    if (isFull) {
      const completed = priorCompleted + 1;
      if (completed >= 9) {
        return { juz: 3, surah: 0, ayah: 0 };
      }
      return { juz: 2, surah: completed, ayah: 0 };
    }
    return { juz: 2, surah: priorCompleted, ayah: inputAyah > 0 ? inputAyah : 0 };
  }

  // Juz 27: Surah 51 (Az-Zariyat) to 57 (Al-Hadid)
  if (id >= 51 && id <= 57) {
    const priorCompleted = id - 51;
    if (isFull) {
      const completed = priorCompleted + 1;
      if (completed >= 7) {
        return { juz: 4, surah: 0, ayah: 0 };
      }
      return { juz: 3, surah: completed, ayah: 0 };
    }
    return { juz: 3, surah: priorCompleted, ayah: inputAyah > 0 ? inputAyah : 0 };
  }

  // Juz 26: Surah 46 to 50
  if (id >= 46 && id <= 50) {
    const priorCompleted = id - 46;
    if (isFull) {
      const completed = priorCompleted + 1;
      if (completed >= 5) {
        return { juz: 5, surah: 0, ayah: 0 };
      }
      return { juz: 4, surah: completed, ayah: 0 };
    }
    return { juz: 4, surah: priorCompleted, ayah: inputAyah > 0 ? inputAyah : 0 };
  }

  // Long surahs from Juz 1-25 (Al-Baqarah, Ali 'Imran, etc.)
  return {
    juz: 5,
    surah: id,
    ayah: isNaN(inputAyah) ? 0 : inputAyah
  };
}

export function parseAndCalculateTotalHafalan(hafalanAkhStr: string): string {
  if (!hafalanAkhStr || hafalanAkhStr === '-' || hafalanAkhStr === 'Belum Ada Data') return '';
  const text = hafalanAkhStr.trim();

  // If already clean and structured (e.g. "1 Juz", "2 Juz", "7 surat", "1 Juz 3 surat")
  if (/^\d+\s*juz$/i.test(text)) return text;
  if (/^\d+\s*juz\s+\d+\s*surat$/i.test(text)) return text;
  if (/^\d+\s*surat$/i.test(text)) return text;

  // Handle explicit Juz mentions
  if (/^juz\s*30(?:\s*selesai)?$/i.test(text) || /^selesai\s*(?:juz\s*)?30$/i.test(text)) return '1 Juz';
  if (/^juz\s*29(?:\s*selesai)?$/i.test(text) || /^selesai\s*(?:juz\s*)?29$/i.test(text)) return '2 Juz';
  if (/^juz\s*28(?:\s*selesai)?$/i.test(text) || /^selesai\s*(?:juz\s*)?28$/i.test(text)) return '3 Juz';
  if (/^juz\s*27(?:\s*selesai)?$/i.test(text) || /^selesai\s*(?:juz\s*)?27$/i.test(text)) return '4 Juz';

  let surahStr = text;
  let isUjian = /ujian/i.test(surahStr);
  surahStr = surahStr.replace(/ujian/ig, '').trim();

  // Strip Juz prefixes like "J30 ", "Juz 30 ", "J29 ", "Juz 29 "
  surahStr = surahStr.replace(/^J\d+\s+/i, '').replace(/^Juz\s*\d+\s+/i, '').trim();

  // Extract ayah from end e.g. "Al-Insyiqaq 1-25" or "An-Naba 40"
  let ayah = NaN;
  const ayahMatch = surahStr.match(/(?:ayat\s*|\s|^)(\d+)(?:\s*-\s*(\d+))?$/i);
  if (ayahMatch) {
    ayah = parseInt(ayahMatch[2] || ayahMatch[1]);
    surahStr = surahStr.substring(0, ayahMatch.index).trim();
  }

  const result = calculateTotalHafalanFromNameAndAyah(surahStr, ayah, isUjian);
  if (!result) return hafalanAkhStr;

  const parts: string[] = [];
  if (result.juz > 0) parts.push(`${result.juz} Juz`);
  if (result.surah > 0) parts.push(`${result.surah} surat`);
  if (result.ayah > 0) parts.push(`${result.ayah} ayat`);

  if (parts.length === 0) {
    return result.juz === 0 && result.surah === 0 && result.ayah === 0 ? '0 Juz' : hafalanAkhStr;
  }
  return parts.join(' ');
}

