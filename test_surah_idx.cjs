const SURAH_PROGRESSION = [
  "", // 0
  "annaba", "annaziat", "abasa", "attakwir", "alinfitar", "almuthaffifin", "alinsyiqaq", // 1-7
  "alburuj", "atthariq", "alala", "alghasyiyah", "alfajr", "albalad", "asysyams", "allail", // 8-15
  "addhuha", "asysyarh", "attin", "alalaq", "alqadr", "albayyinah", "azzalzalah", "aladiyat", // 16-23
  "alqariah", "attakatsur", "alasr", "alhumazah", "alfil", "quraisy", "almaun", "alkautsar", // 24-31
  "alkafirun", "annasr", "almasad", "alikhlas", "alfalaq", "annas", // 32-37
  "almulk", "alqalam", "alhaqqoh", "almaarij", "nuh", "aljin", "almuzammil", "almuddatsir", // 38-45
  "alqiyamah", "alinsan", "almursalat", // 46-48
  "almujadalah", "alhasyr", "almumtahanah", "asshaff", "aljumuah", "almunafiqun", "attaghabun", // 49-55
  "atthalaq", "attahrim", // 56-57
  "adzdzariyat", "atthur", "annajm", "alqamar", "arrahman", "alwaqiah", "alhadid" // 58-64
];

const SURAH_ALIASES = {
  "attoriq": 9,
  "algosyiyah": 11,
  "asyams": 14,
  "insyirah": 17,
  "lahab": 34,
  "haqoh": 40,
  "alhaqoh": 40,
  "muzamil": 44,
  "almuzamil": 44,
  "mudatsir": 45,
  "almudatsir": 45,
  "mursalat": 48,
  "alhasyir": 50,
  "hasyir": 50,
  "munafikun": 54,
  "dzariyat": 58,
  "waqiah": 63,
  "anaba": 1,
  "naba": 1,
  "naziat": 2,
  "abasa": 3,
  "takwir": 4,
  "infitar": 5,
  "muthaffifin": 6,
  "insyiqaq": 7,
  "buruj": 8,
  "thariq": 9,
  "ala": 10,
  "ghasyiyah": 11,
  "fajr": 12,
  "balad": 13,
  "syams": 14,
  "lail": 15,
  "dhuha": 16,
  "syarh": 17,
  "tin": 18,
  "alaq": 19,
  "qadr": 20,
  "bayyinah": 21,
  "zalzalah": 22,
  "adiyat": 23,
  "qariah": 24,
  "takatsur": 25,
  "asr": 26,
  "humazah": 27,
  "fil": 28,
  "quraisy": 29,
  "maun": 30,
  "kautsar": 31,
  "kafirun": 32,
  "nasr": 33,
  "masad": 34,
  "ikhlas": 35,
  "falaq": 36,
  "nas": 37,
  "mulk": 38,
  "qalam": 39,
  "haqqoh": 40,
  "maarij": 41,
  "nuh": 42,
  "jin": 43,
  "muzammil": 44,
  "muddatsir": 45,
  "qiyamah": 46,
  "insan": 47,
  "mujadalah": 49,
  "hasyr": 50,
  "mumtahanah": 51,
  "shaff": 52,
  "jumuah": 53,
  "munafiqun": 54,
  "taghabun": 55,
  "thalaq": 56,
  "tahrim": 57,
  "thur": 59,
  "najm": 60,
  "qamar": 61,
  "rahman": 62,
  "hadid": 64
};

function getHighestSurahIndex(rawText) {
  if (!rawText || rawText === 'Belum Ada Data' || rawText === 'Surah -') return 0;
  const text = rawText.toLowerCase().replace(/[^a-z0-9\s-]/g, '');
  const tokens = text.split(/[\s-]+/).filter(t => t !== 'surah' && t !== 'surat' && t !== 'qs' && t !== 'sampai' && t !== 'dan' && t !== 'juz');
  const fullJoined = tokens.join('');
  
  let maxIdx = 0;
  for (let i = 1; i < SURAH_PROGRESSION.length; i++) {
     if (fullJoined.includes(SURAH_PROGRESSION[i])) {
        if (i > maxIdx) maxIdx = i;
     }
  }
  for (const alias in SURAH_ALIASES) {
     if (fullJoined.includes(alias)) {
        if (SURAH_ALIASES[alias] > maxIdx) maxIdx = SURAH_ALIASES[alias];
     }
  }
  return maxIdx;
}

console.log("An-Naba", getHighestSurahIndex("An-Naba"));
console.log("Abasa", getHighestSurahIndex("Abasa"));
console.log("Al-Fajr", getHighestSurahIndex("Al-Fajr"));
console.log("Al-Jin", getHighestSurahIndex("Al-Jin"));
