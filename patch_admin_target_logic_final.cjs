const fs = require('fs');
let code = fs.readFileSync('src/components/AdminProgressReport.tsx', 'utf-8');

const newSurahProgression = `
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
`;

code = code.replace(/const SURAH_PROGRESSION = \[\s*"",[^\]]+\];/m, newSurahProgression.trim());
fs.writeFileSync('src/components/AdminProgressReport.tsx', code);
