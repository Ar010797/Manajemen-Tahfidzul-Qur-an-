// src/constants/surahs.ts

export interface SurahItem {
  id: number;
  name: string;
  total_ayat: number;
  juz: number;
}

export const SURAH_LIST: SurahItem[] = [
  { id: 1, name: "Al-Fatihah", total_ayat: 7, juz: 1 },
  { id: 2, name: "Al-Baqarah", total_ayat: 286, juz: 1 },
  { id: 3, name: "Ali 'Imran", total_ayat: 200, juz: 3 },
  { id: 4, name: "An-Nisa'", total_ayat: 176, juz: 4 },
  { id: 5, name: "Al-Ma'idah", total_ayat: 120, juz: 6 },
  { id: 6, name: "Al-An'am", total_ayat: 165, juz: 7 },
  { id: 7, name: "Al-A'raf", total_ayat: 206, juz: 8 },
  { id: 8, name: "Al-Anfal", total_ayat: 75, juz: 9 },
  { id: 9, name: "At-Taubah", total_ayat: 129, juz: 10 },
  { id: 10, name: "Yunus", total_ayat: 109, juz: 11 },
  { id: 11, name: "Hud", total_ayat: 123, juz: 11 },
  { id: 12, name: "Yusuf", total_ayat: 111, juz: 12 },
  { id: 13, name: "Ar-Ra'd", total_ayat: 43, juz: 13 },
  { id: 14, name: "Ibrahim", total_ayat: 52, juz: 13 },
  { id: 15, name: "Al-Hijr", total_ayat: 99, juz: 14 },
  { id: 16, name: "An-Nahl", total_ayat: 128, juz: 14 },
  { id: 17, name: "Al-Isra'", total_ayat: 111, juz: 15 },
  { id: 18, name: "Al-Kahf", total_ayat: 110, juz: 15 },
  { id: 19, name: "Maryam", total_ayat: 98, juz: 16 },
  { id: 20, name: "Taha", total_ayat: 135, juz: 16 },
  { id: 21, name: "Al-Anbiya'", total_ayat: 112, juz: 17 },
  { id: 22, name: "Al-Hajj", total_ayat: 78, juz: 17 },
  { id: 23, name: "Al-Mu'minun", total_ayat: 118, juz: 18 },
  { id: 24, name: "An-Nur", total_ayat: 64, juz: 18 },
  { id: 25, name: "Al-Furqan", total_ayat: 77, juz: 18 },
  { id: 26, name: "Asy-Syu'ara'", total_ayat: 227, juz: 19 },
  { id: 27, name: "An-Naml", total_ayat: 93, juz: 19 },
  { id: 28, name: "Al-Qasas", total_ayat: 88, juz: 20 },
  { id: 29, name: "Al-'Ankabut", total_ayat: 69, juz: 20 },
  { id: 30, name: "Ar-Rum", total_ayat: 60, juz: 21 },
  { id: 31, name: "Luqman", total_ayat: 34, juz: 21 },
  { id: 32, name: "As-Sajdah", total_ayat: 30, juz: 21 },
  { id: 33, name: "Al-Ahzab", total_ayat: 73, juz: 21 },
  { id: 34, name: "Saba'", total_ayat: 54, juz: 22 },
  { id: 35, name: "Fatir", total_ayat: 45, juz: 22 },
  { id: 36, name: "Ya Sin", total_ayat: 83, juz: 22 },
  { id: 37, name: "As-Saffat", total_ayat: 182, juz: 23 },
  { id: 38, name: "Sad", total_ayat: 88, juz: 23 },
  { id: 39, name: "Az-Zumar", total_ayat: 75, juz: 23 },
  { id: 40, name: "Ghafir", total_ayat: 85, juz: 24 },
  { id: 41, name: "Fussilat", total_ayat: 54, juz: 24 },
  { id: 42, name: "Asy-Syura", total_ayat: 53, juz: 25 },
  { id: 43, name: "Az-Zukhruf", total_ayat: 89, juz: 25 },
  { id: 44, name: "Ad-Dukhan", total_ayat: 59, juz: 25 },
  { id: 45, name: "Al-Jasiyah", total_ayat: 37, juz: 25 },
  { id: 46, name: "Al-Ahqaf", total_ayat: 35, juz: 26 },
  { id: 47, name: "Muhammad", total_ayat: 38, juz: 26 },
  { id: 48, name: "Al-Fath", total_ayat: 29, juz: 26 },
  { id: 49, name: "Al-Hujurat", total_ayat: 18, juz: 26 },
  { id: 50, name: "Qaf", total_ayat: 45, juz: 26 },
  { id: 51, name: "Az-Zariyat", total_ayat: 60, juz: 26 },
  { id: 52, name: "At-Tur", total_ayat: 49, juz: 27 },
  { id: 53, name: "An-Najm", total_ayat: 62, juz: 27 },
  { id: 54, name: "Al-Qamar", total_ayat: 55, juz: 27 },
  { id: 55, name: "Ar-Rahman", total_ayat: 78, juz: 27 },
  { id: 56, name: "Al-Waqi'ah", total_ayat: 96, juz: 27 },
  { id: 57, name: "Al-Hadid", total_ayat: 29, juz: 27 },
  { id: 58, name: "Al-Mujadilah", total_ayat: 22, juz: 28 },
  { id: 59, name: "Al-Hasyr", total_ayat: 24, juz: 28 },
  { id: 60, name: "Al-Mumtahanah", total_ayat: 13, juz: 28 },
  { id: 61, name: "As-Saff", total_ayat: 14, juz: 28 },
  { id: 62, name: "Al-Jumu'ah", total_ayat: 11, juz: 28 },
  { id: 63, name: "Al-Munafiqun", total_ayat: 11, juz: 28 },
  { id: 64, name: "At-Tagabun", total_ayat: 18, juz: 28 },
  { id: 65, name: "At-Talaq", total_ayat: 12, juz: 28 },
  { id: 66, name: "At-Tahrim", total_ayat: 12, juz: 28 },
  { id: 67, name: "Al-Mulk", total_ayat: 30, juz: 29 },
  { id: 68, name: "Al-Qalam", total_ayat: 52, juz: 29 },
  { id: 69, name: "Al-Haqqah", total_ayat: 52, juz: 29 },
  { id: 70, name: "Al-Ma'arij", total_ayat: 44, juz: 29 },
  { id: 71, name: "Nuh", total_ayat: 28, juz: 29 },
  { id: 72, name: "Al-Jinn", total_ayat: 28, juz: 29 },
  { id: 73, name: "Al-Muzzammil", total_ayat: 20, juz: 29 },
  { id: 74, name: "Al-Muddassir", total_ayat: 56, juz: 29 },
  { id: 75, name: "Al-Qiyamah", total_ayat: 40, juz: 29 },
  { id: 76, name: "Al-Insan", total_ayat: 31, juz: 29 },
  { id: 77, name: "Al-Mursalat", total_ayat: 50, juz: 29 },
  { id: 78, name: "An-Naba'", total_ayat: 40, juz: 30 },
  { id: 79, name: "An-Nazi'at", total_ayat: 46, juz: 30 },
  { id: 80, name: "'Abasa", total_ayat: 42, juz: 30 },
  { id: 81, name: "At-Takwir", total_ayat: 29, juz: 30 },
  { id: 82, name: "Al-Infitar", total_ayat: 19, juz: 30 },
  { id: 83, name: "Al-Mutaffifin", total_ayat: 36, juz: 30 },
  { id: 84, name: "Al-Insyiqaq", total_ayat: 25, juz: 30 },
  { id: 85, name: "Al-Buruj", total_ayat: 22, juz: 30 },
  { id: 86, name: "At-Tariq", total_ayat: 17, juz: 30 },
  { id: 87, name: "Al-A'la", total_ayat: 19, juz: 30 },
  { id: 88, name: "Al-Gasyiyah", total_ayat: 26, juz: 30 },
  { id: 89, name: "Al-Fajr", total_ayat: 30, juz: 30 },
  { id: 90, name: "Al-Balad", total_ayat: 20, juz: 30 },
  { id: 91, name: "Asy-Syams", total_ayat: 15, juz: 30 },
  { id: 92, name: "Al-Lail", total_ayat: 21, juz: 30 },
  { id: 93, name: "Ad-Duha", total_ayat: 11, juz: 30 },
  { id: 94, name: "Asy-Syarh", total_ayat: 8, juz: 30 },
  { id: 95, name: "At-Tin", total_ayat: 8, juz: 30 },
  { id: 96, name: "Al-'Alaq", total_ayat: 19, juz: 30 },
  { id: 97, name: "Al-Qadr", total_ayat: 5, juz: 30 },
  { id: 98, name: "Al-Bayyinah", total_ayat: 8, juz: 30 },
  { id: 99, name: "Az-Zalzalah", total_ayat: 8, juz: 30 },
  { id: 100, name: "Al-'Adiyat", total_ayat: 11, juz: 30 },
  { id: 101, name: "Al-Qari'ah", total_ayat: 11, juz: 30 },
  { id: 102, name: "At-Takasur", total_ayat: 8, juz: 30 },
  { id: 103, name: "Al-'Asr", total_ayat: 3, juz: 30 },
  { id: 104, name: "Al-Humazah", total_ayat: 9, juz: 30 },
  { id: 105, name: "Al-Fil", total_ayat: 5, juz: 30 },
  { id: 106, name: "Quraisy", total_ayat: 4, juz: 30 },
  { id: 107, name: "Al-Ma'un", total_ayat: 7, juz: 30 },
  { id: 108, name: "Al-Kausar", total_ayat: 3, juz: 30 },
  { id: 109, name: "Al-Kafirun", total_ayat: 6, juz: 30 },
  { id: 110, name: "An-Nasr", total_ayat: 3, juz: 30 },
  { id: 111, name: "Al-Lahab", total_ayat: 5, juz: 30 },
  { id: 112, name: "Al-Ikhlas", total_ayat: 4, juz: 30 },
  { id: 113, name: "Al-Falaq", total_ayat: 5, juz: 30 },
  { id: 114, name: "An-Nas", total_ayat: 6, juz: 30 }
];

// Exact verse boundaries for surahs spanning multiple Juzes
export const MULTI_JUZ_BOUNDARIES: { surahId: number; startAyah: number; endAyah: number; juz: number }[] = [
  { surahId: 2, startAyah: 1, endAyah: 141, juz: 1 },
  { surahId: 2, startAyah: 142, endAyah: 252, juz: 2 },
  { surahId: 2, startAyah: 253, endAyah: 286, juz: 3 },
  { surahId: 3, startAyah: 1, endAyah: 92, juz: 3 },
  { surahId: 3, startAyah: 93, endAyah: 200, juz: 4 },
  { surahId: 4, startAyah: 1, endAyah: 23, juz: 4 },
  { surahId: 4, startAyah: 24, endAyah: 147, juz: 5 },
  { surahId: 4, startAyah: 148, endAyah: 176, juz: 6 },
  { surahId: 5, startAyah: 1, endAyah: 81, juz: 6 },
  { surahId: 5, startAyah: 82, endAyah: 120, juz: 7 },
  { surahId: 6, startAyah: 1, endAyah: 110, juz: 7 },
  { surahId: 6, startAyah: 111, endAyah: 165, juz: 8 },
  { surahId: 7, startAyah: 1, endAyah: 87, juz: 8 },
  { surahId: 7, startAyah: 88, endAyah: 206, juz: 9 },
  { surahId: 8, startAyah: 1, endAyah: 40, juz: 9 },
  { surahId: 8, startAyah: 41, endAyah: 75, juz: 10 },
  { surahId: 9, startAyah: 1, endAyah: 92, juz: 10 },
  { surahId: 9, startAyah: 93, endAyah: 129, juz: 11 },
  { surahId: 11, startAyah: 1, endAyah: 5, juz: 11 },
  { surahId: 11, startAyah: 6, endAyah: 123, juz: 12 },
  { surahId: 12, startAyah: 1, endAyah: 52, juz: 12 },
  { surahId: 12, startAyah: 53, endAyah: 111, juz: 13 },
  { surahId: 14, startAyah: 1, endAyah: 52, juz: 13 },
  { surahId: 15, startAyah: 1, endAyah: 99, juz: 14 },
  { surahId: 16, startAyah: 1, endAyah: 128, juz: 14 },
  { surahId: 17, startAyah: 1, endAyah: 111, juz: 15 },
  { surahId: 18, startAyah: 1, endAyah: 74, juz: 15 },
  { surahId: 18, startAyah: 75, endAyah: 110, juz: 16 },
  { surahId: 21, startAyah: 1, endAyah: 112, juz: 17 },
  { surahId: 22, startAyah: 1, endAyah: 78, juz: 17 },
  { surahId: 23, startAyah: 1, endAyah: 118, juz: 18 },
  { surahId: 24, startAyah: 1, endAyah: 64, juz: 18 },
  { surahId: 25, startAyah: 1, endAyah: 20, juz: 18 },
  { surahId: 25, startAyah: 21, endAyah: 77, juz: 19 },
  { surahId: 26, startAyah: 1, endAyah: 227, juz: 19 },
  { surahId: 27, startAyah: 1, endAyah: 55, juz: 19 },
  { surahId: 27, startAyah: 56, endAyah: 93, juz: 20 },
  { surahId: 28, startAyah: 1, endAyah: 88, juz: 20 },
  { surahId: 29, startAyah: 1, endAyah: 45, juz: 20 },
  { surahId: 29, startAyah: 46, endAyah: 69, juz: 21 },
  { surahId: 30, startAyah: 1, endAyah: 60, juz: 21 },
  { surahId: 31, startAyah: 1, endAyah: 34, juz: 21 },
  { surahId: 32, startAyah: 1, endAyah: 30, juz: 21 },
  { surahId: 33, startAyah: 1, endAyah: 30, juz: 21 },
  { surahId: 33, startAyah: 31, endAyah: 73, juz: 22 },
  { surahId: 34, startAyah: 1, endAyah: 54, juz: 22 },
  { surahId: 35, startAyah: 1, endAyah: 45, juz: 22 },
  { surahId: 36, startAyah: 1, endAyah: 27, juz: 22 },
  { surahId: 36, startAyah: 28, endAyah: 83, juz: 23 },
  { surahId: 37, startAyah: 1, endAyah: 182, juz: 23 },
  { surahId: 38, startAyah: 1, endAyah: 88, juz: 23 },
  { surahId: 39, startAyah: 1, endAyah: 31, juz: 23 },
  { surahId: 39, startAyah: 32, endAyah: 75, juz: 24 },
  { surahId: 40, startAyah: 1, endAyah: 85, juz: 24 },
  { surahId: 41, startAyah: 1, endAyah: 46, juz: 24 },
  { surahId: 41, startAyah: 47, endAyah: 54, juz: 25 },
  { surahId: 42, startAyah: 1, endAyah: 53, juz: 25 },
  { surahId: 43, startAyah: 1, endAyah: 89, juz: 25 },
  { surahId: 44, startAyah: 1, endAyah: 59, juz: 25 },
  { surahId: 45, startAyah: 1, endAyah: 37, juz: 25 },
  { surahId: 46, startAyah: 1, endAyah: 35, juz: 26 },
  { surahId: 50, startAyah: 1, endAyah: 45, juz: 26 },
  { surahId: 51, startAyah: 1, endAyah: 30, juz: 26 },
  { surahId: 51, startAyah: 31, endAyah: 60, juz: 27 }
];

// Comprehensive transliteration aliases for accurate matching
const SURAH_ALIASES: Record<string, number> = {
  // Juz 1 - 25 common surahs
  "alfatihah": 1, "fatihah": 1, "alfatiha": 1, "fatiha": 1,
  "albaqarah": 2, "albaqara": 2, "baqarah": 2, "baqara": 2, "albaqoroh": 2, "baqoroh": 2,
  "aliimran": 3, "alimran": 3, "imran": 3, "aalimraan": 3, "aliimron": 3,
  "annisa": 4, "annisaa": 4, "nisa": 4, "nisaa": 4,
  "almaidah": 5, "almaaida": 5, "maidah": 5, "maaidah": 5,
  "alanam": 6, "alanaam": 6, "anam": 6,
  "alaraf": 7, "alaraaf": 7, "araf": 7,
  "alanfal": 8, "alanfaal": 8, "anfal": 8,
  "attaubah": 9, "attawbah": 9, "taubah": 9, "tawbah": 9, "at-tawba": 9,
  "yunus": 10,
  "hud": 11,
  "yusuf": 12,
  "arrad": 13, "ar-rad": 13, "rad": 13,
  "ibrahim": 14,
  "alhijr": 15, "hijr": 15,
  "annahl": 16, "nahl": 16,
  "alisra": 17, "isra": 17, "baniisrail": 17,
  "alkahf": 18, "alkahfi": 18, "kahf": 18, "kahfi": 18,
  "maryam": 19,
  "taha": 20, "thaha": 20,
  "alanbiya": 21, "alanbiyaa": 21, "anbiya": 21,
  "alhajj": 22, "hajj": 22,
  "almuminun": 23, "almu'minun": 23, "muminun": 23,
  "annur": 24, "nur": 24,
  "alfurqan": 25, "alfurqon": 25, "furqan": 25,
  "asysyuara": 26, "syuara": 26,
  "annaml": 27, "naml": 27,
  "alqasas": 28, "alqosos": 28, "qasas": 28,
  "alankabut": 29, "ankabut": 29,
  "arrum": 30, "rum": 30,
  "luqman": 31,
  "assajdah": 32, "sajdah": 32,
  "alahzab": 33, "ahzab": 33,
  "saba": 34,
  "fatir": 35,
  "yasin": 36, "yasiin": 36, "yaasin": 36,
  "assaffat": 37, "asshaffat": 37, "saffat": 37,
  "sad": 38, "shad": 38,
  "azzumar": 39, "zumar": 39,
  "ghafir": 40, "ghofir": 40, "almu'min": 40,
  "fussilat": 41, "fusilat": 41,
  "asysyura": 42, "syura": 42,
  "azzukhruf": 43, "zukhruf": 43,
  "addukhan": 44, "dukhan": 44,
  "aljasiyah": 45, "jasiyah": 45,
  "alahqaf": 46, "ahqaf": 46,
  "muhammad": 47,
  "alfath": 48, "fath": 48,
  "alhujurat": 49, "hujurat": 49,
  "qaf": 50,
  "azzariyat": 51, "adzdzariyat": 51, "zariyat": 51,
  "attur": 52, "tur": 52,
  "annajm": 53, "najm": 53,
  "alqamar": 54, "qamar": 54, "qomar": 54,
  "arrahman": 55, "rahman": 55, "rohman": 55,
  "alwaqiah": 56, "waqiah": 56,
  "alhadid": 57, "hadid": 57,

  // Juz 28
  "almujadilah": 58, "almujadalah": 58, "mujadilah": 58, "mujadalah": 58,
  "alhasyr": 59, "hasyr": 59,
  "almumtahanah": 60, "mumtahanah": 60,
  "assaff": 61, "asshaff": 61, "ashshaff": 61, "saff": 61, "shaff": 61,
  "aljumuah": 62, "jumuah": 62, "jumat": 62,
  "almunafiqun": 63, "munafiqun": 63, "munafik": 63,
  "attagabun": 64, "attaghabun": 64, "attaqabun": 64, "tagabun": 64, "taghabun": 64,
  "attalaq": 65, "atthalaq": 65, "talaq": 65, "thalaq": 65,
  "attahrim": 66, "tahrim": 66,

  // Juz 29
  "almulk": 67, "mulk": 67, "tabarak": 67,
  "alqalam": 68, "alqolam": 68, "qalam": 68, "qolam": 68, "nun": 68,
  "alhaqqah": 69, "alhaqqoh": 69, "haqqah": 69, "haqqoh": 69,
  "almaarij": 70, "maarij": 70,
  "nuh": 71,
  "aljinn": 72, "aljin": 72, "jinn": 72, "jin": 72,
  "almuzzammil": 73, "almuzammil": 73, "muzzammil": 73, "muzammil": 73,
  "almuddassir": 74, "almudasir": 74, "muddassir": 74, "mudasir": 74,
  "alqiyamah": 75, "qiyamah": 75,
  "alinsan": 76, "insan": 76, "addahr": 76, "dahr": 76,
  "almursalat": 77, "mursalat": 77,

  // Juz 30
  "annaba": 78, "annaba'": 78, "naba": 78, "anaba": 78,
  "annaziat": 79, "naziat": 79, "anaziat": 79,
  "abasa": 80, "'abasa": 80,
  "attakwir": 81, "takwir": 81,
  "alinfitar": 82, "alinfitor": 82, "infitar": 82, "infitor": 82,
  "almutaffifin": 83, "almuthaffifin": 83, "almuthoffifin": 83, "mutaffifin": 83, "muthaffifin": 83,
  "alinsyiqaq": 84, "alinsyiqoq": 84, "insyiqaq": 84, "insyiqoq": 84,
  "alburuj": 85, "buruj": 85,
  "attariq": 86, "atthariq": 86, "attoriq": 86, "tariq": 86, "thariq": 86,
  "alala": 87, "ala": 87, "al'ala": 87,
  "alghasyiyah": 88, "algosyiyah": 88, "alghosiyah": 88, "ghasyiyah": 88, "ghosiyah": 88,
  "alfajr": 89, "fajr": 89,
  "albalad": 90, "balad": 90,
  "asysyams": 91, "syams": 91, "ashsyams": 91,
  "allail": 92, "lail": 92,
  "adduha": 93, "addhuha": 93, "duha": 93, "dhuha": 93,
  "asysyarh": 94, "alamnasyrah": 94, "insyirah": 94, "syarh": 94,
  "attin": 95, "tin": 95,
  "alalaq": 96, "alaq": 96, "al'alaq": 96, "iqra": 96,
  "alqadr": 97, "alqodar": 97, "qadr": 97, "qodar": 97,
  "albayyinah": 98, "albayinah": 98, "bayyinah": 98,
  "azzalzalah": 99, "zalzalah": 99,
  "aladiyat": 100, "al'adiyat": 100, "adiyat": 100,
  "alqariah": 101, "qariah": 101,
  "attakasur": 102, "attakatsur": 102, "takasur": 102, "takatsur": 102,
  "alasr": 103, "al'asr": 103, "asr": 103, "ashr": 103,
  "alhumazah": 104, "humazah": 104,
  "alfil": 105, "fil": 105,
  "quraisy": 106, "quraish": 106,
  "almaun": 107, "maun": 107,
  "alkausar": 108, "alkautsar": 108, "kausar": 108, "kautsar": 108,
  "alkafirun": 109, "kafirun": 109,
  "annasr": 110, "nasr": 110,
  "allahab": 111, "almasad": 111, "lahab": 111, "masad": 111,
  "alikhlas": 112, "ikhlas": 112,
  "alfalaq": 113, "falaq": 113,
  "annas": 114, "nas": 114
};

export function cleanSurahQuery(query: string): string {
  if (!query) return '';
  return query
    .toLowerCase()
    .replace(/^qs\.?\s*/i, '')
    .replace(/^surat?h?\s*/i, '')
    .replace(/^s\.\s*/i, '')
    .replace(/juz\s*\d+\s*/i, '')
    .replace(/\(.*?\)/g, '')
    .replace(/ayat\s*\d+.*$/i, '')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Accurately finds a surah by name, alias, or ID across all 114 surahs.
 */
export function findSurahByName(query: string | number | null | undefined): SurahItem | null {
  if (query === null || query === undefined || query === '') return null;

  // If already an ID number
  if (typeof query === 'number') {
    return SURAH_LIST.find(s => s.id === query) || null;
  }

  const str = String(query).trim();
  if (!str) return null;

  // Numeric string like "78"
  const numericId = parseInt(str);
  if (!isNaN(numericId) && numericId >= 1 && numericId <= 114 && String(numericId) === str) {
    return SURAH_LIST.find(s => s.id === numericId) || null;
  }

  const q = cleanSurahQuery(str);
  if (!q) return null;

  // 1. Direct match on clean name
  const direct = SURAH_LIST.find(s => cleanSurahQuery(s.name) === q);
  if (direct) return direct;

  // 2. Direct match in aliases dictionary
  if (SURAH_ALIASES[q]) {
    const found = SURAH_LIST.find(s => s.id === SURAH_ALIASES[q]);
    if (found) return found;
  }

  // 3. Substring match against name or alias
  const sub = SURAH_LIST.find(s => {
    const sk = cleanSurahQuery(s.name);
    return sk.includes(q) || q.includes(sk);
  });
  if (sub) return sub;

  // 4. Substring against alias keys
  for (const [aliasKey, surahId] of Object.entries(SURAH_ALIASES)) {
    if (aliasKey.includes(q) || q.includes(aliasKey)) {
      const found = SURAH_LIST.find(s => s.id === surahId);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Returns the exact Juz for any Surah and Ayah across all Juz (1 to 30).
 */
export function getSurahJuz(surahInput: string | number, ayah?: number): number {
  let surahObj: SurahItem | null = null;
  if (typeof surahInput === 'number') {
    surahObj = SURAH_LIST.find(s => s.id === surahInput) || null;
  } else {
    surahObj = findSurahByName(surahInput);
  }
  if (!surahObj) return 30;

  if (ayah && ayah > 0) {
    const multi = MULTI_JUZ_BOUNDARIES.find(
      b => b.surahId === surahObj!.id && ayah >= b.startAyah && ayah <= b.endAyah
    );
    if (multi) return multi.juz;
  }

  return surahObj.juz;
}

/**
 * Returns the next surah in Madrasah Tahfidz curriculum progression:
 * Juz 30 (78 -> 114) -> Juz 29 (67 -> 77) -> Juz 28 (58 -> 66) ->
 * Juz 27 (51 -> 57) -> Juz 26 (46 -> 50) -> Juz 1..25 (1 -> 45) -> 46.
 */
export function getNextSurah(currentId: number): SurahItem | null {
  // Juz 30 (78 to 113) -> advance sequentially in Juz 30
  if (currentId >= 78 && currentId < 114) {
    return SURAH_LIST.find(s => s.id === currentId + 1) || null;
  }
  // 114 An-Nas (end of Juz 30) -> 67 Al-Mulk (start of Juz 29)
  if (currentId === 114) {
    return SURAH_LIST.find(s => s.id === 67) || null;
  }

  // Juz 29 (67 to 76) -> advance sequentially in Juz 29
  if (currentId >= 67 && currentId < 77) {
    return SURAH_LIST.find(s => s.id === currentId + 1) || null;
  }
  // 77 Al-Mursalat (end of Juz 29) -> 58 Al-Mujadilah (start of Juz 28)
  if (currentId === 77) {
    return SURAH_LIST.find(s => s.id === 58) || null;
  }

  // Juz 28 (58 to 65) -> advance sequentially in Juz 28
  if (currentId >= 58 && currentId < 66) {
    return SURAH_LIST.find(s => s.id === currentId + 1) || null;
  }
  // 66 At-Tahrim (end of Juz 28) -> 51 Az-Zariyat (start of Juz 27)
  if (currentId === 66) {
    return SURAH_LIST.find(s => s.id === 51) || null;
  }

  // Juz 27 (51 to 56) -> advance sequentially in Juz 27
  if (currentId >= 51 && currentId < 57) {
    return SURAH_LIST.find(s => s.id === currentId + 1) || null;
  }
  // 57 Al-Hadid (end of Juz 27) -> 46 Al-Ahqaf (start of Juz 26)
  if (currentId === 57) {
    return SURAH_LIST.find(s => s.id === 46) || null;
  }

  // Juz 26 (46 to 49) -> advance sequentially in Juz 26
  if (currentId >= 46 && currentId < 50) {
    return SURAH_LIST.find(s => s.id === currentId + 1) || null;
  }
  // 50 Qaf (end of Juz 26) -> 1 Al-Fatihah (start of Juz 1)
  if (currentId === 50) {
    return SURAH_LIST.find(s => s.id === 1) || null;
  }

  // Juz 1 to 25 (1 to 44) -> advance sequentially
  if (currentId >= 1 && currentId < 45) {
    return SURAH_LIST.find(s => s.id === currentId + 1) || null;
  }
  // 45 Al-Jasiyah -> 46 Al-Ahqaf
  if (currentId === 45) {
    return SURAH_LIST.find(s => s.id === 46) || null;
  }

  // Fallback progression
  if (currentId >= 1 && currentId < 114) {
    return SURAH_LIST.find(s => s.id === currentId + 1) || null;
  }

  return SURAH_LIST[0]; // fallback Al-Fatihah
}

export interface TomorrowTargetDecision {
  action: 'lanjut_ayat' | 'ganti_surah' | 'ulang_surah' | 'ulang_ayat';
  keterangan: 'Lanjut ayat berikutnya' | 'Lulus, ganti surah' | 'Belum lulus, ulang';
  targetSurah: string;
  targetVerseStart: string;
  targetVerseEnd: string;
  targetVerseText: string;
  currentJuz: number;
  auditLog: string;
}

/**
 * Computes tomorrow's setoran target strictly adhering to the mandatory rule:
 * - Reach last verse of surah AND grade is L/CL -> besok OTOMATIS lanjut ke surah berikutnya (ayat 1).
 * - Reach last verse of surah AND grade is BL -> besok ULANG surah yang sama sampai dapat L/CL.
 * - Belum sampai ayat terakhir AND grade is L/CL -> besok lanjut ayat berikutnya.
 * - Belum sampai ayat terakhir AND grade is BL -> besok ulang ayat yang sama.
 * Includes complete audit logging.
 */
export function computeTomorrowTarget(params: {
  studentName?: string;
  surah: string;
  verseStart?: string | number;
  verseEnd?: string | number;
  grade?: string;
  isUjian?: boolean;
  status?: string;
}): TomorrowTargetDecision {
  const surahInfo = findSurahByName(params.surah);
  const totalAyat = surahInfo ? surahInfo.total_ayat : 0;

  const extractNum = (val: any): number => {
    if (!val) return 0;
    const match = String(val).match(/(\d+)(?!.*\d)/);
    return match ? parseInt(match[1]) : 0;
  };

  const startNum = extractNum(params.verseStart) || 1;
  const endNum = extractNum(params.verseEnd) || startNum;

  const isPassed = params.grade === 'L' || params.grade === 'CL';
  const isExam = params.isUjian || params.status === 'Ujian';
  const isLastVerse = isExam || (totalAyat > 0 && endNum >= totalAyat);

  const currentJuz = getSurahJuz(surahInfo ? surahInfo.id : params.surah, endNum);
  const student = params.studentName || 'Santri';
  const surahName = surahInfo ? surahInfo.name : params.surah;

  if (isLastVerse) {
    if (isPassed) {
      const nextSurahObj = surahInfo ? getNextSurah(surahInfo.id) : null;
      const targetSurah = nextSurahObj ? nextSurahObj.name : surahName;
      const auditLog = `[AUTO-LANJUT AUDIT] ${student} | Surah: ${surahName} (Juz ${currentJuz}) | Ayat Terakhir: ${endNum}/${totalAyat} | Nilai: ${params.grade} (Lulus) | Keputusan: GANTI SURAH -> ${targetSurah} Ayat 1`;
      console.log(auditLog);
      return {
        action: 'ganti_surah',
        keterangan: 'Lulus, ganti surah',
        targetSurah,
        targetVerseStart: '1',
        targetVerseEnd: '',
        targetVerseText: '1',
        currentJuz,
        auditLog
      };
    } else {
      // Failed at last verse or exam -> repeat the same surah
      const targetSurah = surahName;
      const targetVerseStart = String(startNum);
      const targetVerseEnd = String(endNum);
      const targetVerseText = startNum === endNum ? String(startNum) : `${startNum} – ${endNum}`;
      const auditLog = `[AUTO-LANJUT AUDIT] ${student} | Surah: ${surahName} (Juz ${currentJuz}) | Ayat Terakhir: ${endNum}/${totalAyat} | Nilai: ${params.grade || 'BL'} (Belum Lulus) | Keputusan: ULANG SURAH -> Tetap ${targetSurah} (${targetVerseText})`;
      console.log(auditLog);
      return {
        action: 'ulang_surah',
        keterangan: 'Belum lulus, ulang',
        targetSurah,
        targetVerseStart,
        targetVerseEnd,
        targetVerseText,
        currentJuz,
        auditLog
      };
    }
  } else {
    // Belum sampai ayat terakhir
    if (isPassed) {
      const nextVerse = endNum + 1;
      const auditLog = `[AUTO-LANJUT AUDIT] ${student} | Surah: ${surahName} (Juz ${currentJuz}) | Ayat: ${startNum}-${endNum}/${totalAyat} | Nilai: ${params.grade} (Lulus) | Keputusan: LANJUT AYAT BERIKUTNYA -> ${surahName} Ayat ${nextVerse}`;
      console.log(auditLog);
      return {
        action: 'lanjut_ayat',
        keterangan: 'Lanjut ayat berikutnya',
        targetSurah: surahName,
        targetVerseStart: String(nextVerse),
        targetVerseEnd: '',
        targetVerseText: String(nextVerse),
        currentJuz,
        auditLog
      };
    } else {
      // Failed before last verse -> repeat same verses
      const targetVerseStart = String(startNum);
      const targetVerseEnd = String(endNum);
      const targetVerseText = startNum === endNum ? String(startNum) : `${startNum} – ${endNum}`;
      const auditLog = `[AUTO-LANJUT AUDIT] ${student} | Surah: ${surahName} (Juz ${currentJuz}) | Ayat: ${startNum}-${endNum}/${totalAyat} | Nilai: ${params.grade || 'BL'} (Belum Lulus) | Keputusan: ULANG AYAT -> Tetap ${surahName} (${targetVerseText})`;
      console.log(auditLog);
      return {
        action: 'ulang_ayat',
        keterangan: 'Belum lulus, ulang',
        targetSurah: surahName,
        targetVerseStart,
        targetVerseEnd,
        targetVerseText,
        currentJuz,
        auditLog
      };
    }
  }
}
