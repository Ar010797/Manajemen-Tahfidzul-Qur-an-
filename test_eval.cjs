const fs = require('fs');
// Let's create a mockup of the evaluation logic

const SURAH_PROGRESSION = [
  "", // 0
  // Juz 30 (1-37)
  "annaba", "annaziat", "abasa", "attakwir", "alinfitar", "almuthaffifin", "alinsyiqaq", // 1-7
  "alburuj", "atthariq", "alala", "alghasyiyah", "alfajr", "albalad", "asysyams", "allail", // 8-15
  "addhuha", "asysyarh", "attin", "alalaq", "alqadr", "albayyinah", "azzalzalah", "aladiyat", // 16-23
  "alqariah", "attakatsur", "alasr", "alhumazah", "alfil", "quraisy", "almaun", "alkautsar", // 24-31
  "alkafirun", "annasr", "almasad", "alikhlas", "alfalaq", "annas", // 32-37
  // Juz 29 (38-48)
  "almulk", "alqalam", "alhaqqoh", "almaarij", "nuh", "aljin", "almuzammil", "almuddatsir", // 38-45
  "alqiyamah", "alinsan", "almursalat", // 46-48
  // Juz 28 (49-57)
  "almujadalah", "alhasyr", "almumtahanah", "asshaff", "aljumuah", "almunafiqun", "attaghabun", // 49-55
  "atthalaq", "attahrim", // 56-57
  // Juz 27 (58-64)
  "adzdzariyat", "atthur", "annajm", "alqamar", "arrahman", "alwaqiah", "alhadid" // 58-64
];

const SURAH_ALIASES = {
  "attoriq": 9,
  "algosyiyah": 11,
  "alghosiyah": 11,
  "alhaqqah": 40,
  "alqolam": 39,
  "albayinah": 21,
  "alinfitor": 5,
  "almuthoffifin": 6,
  "almutaffifin": 6,
  "almuzzammil": 44,
  "almudasir": 45,
  "ashshaff": 51,
  "asshof": 51,
  "attaqabun": 50,
  "addzariyat": 58,
  "attur": 59,
  "qaf": 60,
  "albaqoroh": 99,
  "albaqarah": 99,
  "almaidah": 99,
  "aliimran": 99,
  "annisa": 99,
  "alanam": 99,
  "alaraf": 99,
  "alanfal": 99,
  "attaubah": 99,
  "yunus": 99,
  "hud": 99,
  "yusuf": 99,
  "arrad": 99,
  "ibrahim": 99,
  "alhijr": 99,
  "annahl": 99,
  "alisra": 99,
  "alkahfi": 99,
  "maryam": 99,
  "taha": 99,
  "alanbiya": 99,
  "alhaj": 99,
  "almuminun": 99,
  "annur": 99,
  "alfurqan": 99,
  "asysyuara": 99,
  "annaml": 99,
  "alqasas": 99,
  "alankabut": 99,
  "arrum": 99,
  "luqman": 99,
  "assajdah": 99,
  "alazhab": 99,
  "saba": 99,
  "fatir": 99,
  "yasin": 99,
  "yasiin": 99,
  "assaffat": 99,
  "sad": 99,
  "shod": 99,
  "azzumar": 99,
  "ghafir": 99,
  "fussilat": 99,
  "asysyura": 99,
  "azzukhruf": 99,
  "addukhan": 99,
  "aljasiyah": 99
};

function getHighestSurahIndex(rawText) {
  if (!rawText || rawText === 'Belum Ada Data' || rawText === 'Surah -') return 0;
  
  const text = rawText.toLowerCase().replace(/[^a-z0-9\s-]/g, '');
  const tokens = text.split(/[\s-]+/).filter((t) => t !== 'surah' && t !== 'surat' && t !== 'qs' && t !== 'sampai' && t !== 'dan' && t !== 'juz');
  const fullJoined = tokens.join('');
  
  let maxIdx = 0;
  
  for (let i = 1; i < SURAH_PROGRESSION.length; i++) {
     const p = SURAH_PROGRESSION[i];
     if (fullJoined.includes(p)) {
        if (i > maxIdx) maxIdx = i;
     }
  }
  
  for (const alias in SURAH_ALIASES) {
     if (fullJoined.includes(alias)) {
        if (SURAH_ALIASES[alias] > maxIdx) maxIdx = SURAH_ALIASES[alias];
     }
  }
  
  if (maxIdx === 0 && fullJoined.length > 0) {
     if (fullJoined.includes("30")) maxIdx = 37;
     else if (fullJoined.includes("29")) maxIdx = 48;
     else if (fullJoined.includes("28")) maxIdx = 57;
     else if (fullJoined.includes("juz")) maxIdx = 99;
  }
  
  return maxIdx;
}

console.log("aljin", getHighestSurahIndex("aljin"));
console.log("al jin", getHighestSurahIndex("al jin"));
console.log("an-naba", getHighestSurahIndex("an-naba"));
console.log("al-baqarah", getHighestSurahIndex("al-baqarah"));
console.log("juz 30", getHighestSurahIndex("juz 30"));

