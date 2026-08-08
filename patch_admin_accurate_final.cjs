const fs = require('fs');
const file = 'src/components/AdminProgressReport.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Fix levelScore for Al-Qur'an to be 7 instead of 10
code = code.replace(/levelScore = 10/g, 'levelScore = 7');

// 2. Replace SURAH_PROGRESSION and logic
const regexLogic = /const SURAH_PROGRESSION = \[[\s\S]*?if \(hafalanAchieved\) halaqohMap\[h\]\.achievedHafalan\+\+;/;

const newLogic = `const SURAH_PROGRESSION = [
      "", // 0
      "annaba", "annaziat", "abasa", // 1-3
      "attakwir", "alinfitar", "almuthaffifin", "alinsyiqaq", // 4-7
      "alburuj", "atthariq", "alala", "alghasyiyah", "alfajr", // 8-12
      "albalad", "asysyams", "allail", "addhuha", "asysyarh", "attin", "alalaq", // 13-19
      "alqadr", "albayyinah", "azzalzalah", "aladiyat", "alqariah", "attakatsur", "alasr", "alhumazah", "alfil", "quraisy", "almaun", "alkautsar", "alkafirun", "annasr", "almasad", "alikhlas", "alfalaq", "annas", // 20-37
      "almulk", "alqalam", "alhaqqoh", "almaarij", "nuh", "aljin", "almuzammil", "almuddatsir", "alqiyamah", "alinsan", "almursalat", // 38-48
      "attahrim", "atthalaq", "asshaff", "almumtahanah", "alhasyr", "almujadalah", "alhadid", "alwaqiah", "annajm", "adzdzariyat", "atthur", "qof", "alhujurat", "alfath" // 49-62
    ];

    const SURAH_ALIASES: Record<string, number> = {
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
    
    function getHighestSurahIndex(rawText: string): number {
      if (!rawText || rawText === 'Belum Ada Data' || rawText === 'Surah -') return 0;
      
      const text = rawText.toLowerCase().replace(/[^a-z0-9\\s-]/g, '');
      const tokens = text.split(/[\\s-]+/).filter((t: string) => t !== 'surah' && t !== 'surat' && t !== 'qs' && t !== 'sampai' && t !== 'dan' && t !== 'juz');
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
      
      if (maxIdx === 0 && fullJoined.length > 3) {
         if (fullJoined.includes("juz")) maxIdx = 99;
      }
      
      return maxIdx;
    }
    
    // Calculate achievement per Halaqoh
    const halaqohMap: Record<string, { total: number, achievedHafalan: number, achievedUmmi: number }> = {};
    
    studentsList.forEach(s => {
       const h = s.halaqoh;
       if (!halaqohMap[h]) halaqohMap[h] = { total: 0, achievedHafalan: 0, achievedUmmi: 0 };
       halaqohMap[h].total++;
       
       let grade = 0;
       const match = h.match(/([1-9])/);
       if (match) grade = parseInt(match[1]);
       
       let hafalanAchieved = false;
       let ummiAchieved = false;
       
       if (grade > 0) {
           let targetSurahIndex = 0;
           let targetLevel = 7; // Default to Al-Qur'an (Level 7)
           
           if (grade === 1) { targetSurahIndex = 3; targetLevel = 2; }
           else if (grade === 2) { targetSurahIndex = 12; targetLevel = 5; }
           else if (grade === 3) { targetSurahIndex = 37; targetLevel = 7; }
           else if (grade === 4) { targetSurahIndex = 43; targetLevel = 7; }
           else if (grade === 5) { targetSurahIndex = 48; targetLevel = 7; }
           else if (grade >= 6) { targetSurahIndex = 1; targetLevel = 7; } 
           
           let studentSurahIdx = getHighestSurahIndex(s.hafalan);
           
           hafalanAchieved = studentSurahIdx >= targetSurahIndex;
           ummiAchieved = s.levelScore >= targetLevel;
       } else {
           if (s.hafalan && s.hafalan !== 'Belum Ada Data') hafalanAchieved = true;
           if (s.levelScore > 0) ummiAchieved = true;
       }
       
       if (hafalanAchieved) halaqohMap[h].achievedHafalan++;`;

code = code.replace(regexLogic, newLogic);
fs.writeFileSync(file, code);
console.log('Patch 2 complete');
