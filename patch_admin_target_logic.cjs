const fs = require('fs');
const file = 'src/components/AdminProgressReport.tsx';
let code = fs.readFileSync(file, 'utf8');

const oldLogicRegex = /\/\/ JUZ 30 Surahs for scoring[\s\S]*?if \(!halaqohMap\[h\]\) halaqohMap\[h\] = \{ total: 0, achievedHafalan: 0, achievedUmmi: 0 \};/m;

const newLogic = `
    // Progression sequence from Juz 30 -> Juz 29 -> Juz 28
    const SURAH_PROGRESSION = [
      "annaba", "annaziat", "abasa", "attakwir", "alinfitar", "almutaffifin", "alinsyiqaq", // Kls 1
      "alburuj", "attariq", "alala", "algasyiyah", "alfajr", "albalad", "asysyams", "allail", 
      "adduha", "asysyarh", "attin", "alalaq", // Kls 2
      "alqadr", "albayyinah", "azzalzalah", "aladiyat", "alqariah", "attakasur", "alasr", "alhumazah", 
      "alfil", "quraisy", "almaun", "alkausar", "alkafirun", "annasr", "allahab", "alikhlas", "alfalaq", "annas",
      "almulk", "alqalam", "alhaqqah", // Kls 3
      "almaarij", "nuh", "aljinn", // Kls 4
      "almuzzammil", "almuddassir", "alqiyamah", "alinsan", "almursalat", // Kls 5 & 6
      "almujadilah", "alhasyr", "almumtahanah", "ashshaff", // Kls 7
      "aljumuah", "almunafiqun", "attagabun", "attalaq", "attahrim" // Kls 8 & 9
    ];
    
    // Calculate achievement per Halaqoh
    const halaqohMap: Record<string, { total: number, achievedHafalan: number, achievedUmmi: number }> = {};
    
    studentsList.forEach(s => {
       const h = s.halaqoh;
       if (!halaqohMap[h]) halaqohMap[h] = { total: 0, achievedHafalan: 0, achievedUmmi: 0 };
`;

code = code.replace(oldLogicRegex, newLogic.trim());

const gradeLogicRegex = /if \(grade > 0\) \{[\s\S]*?ummiAchieved = s\.levelScore >= targetLevel;\n       \} else \{/m;

const newGradeLogic = `
       if (grade > 0) {
           let targetSurahIndex = 0;
           let targetLevel = 10; // Default to Al-Qur'an (Level 10)
           
           if (grade === 1) { targetSurahIndex = 6; targetLevel = 3; } // Al-Insyiqaq, Jilid 3
           else if (grade === 2) { targetSurahIndex = 18; targetLevel = 6; } // Al-'Alaq, Jilid 6
           else if (grade === 3) { targetSurahIndex = 39; targetLevel = 10; } // Al-Haqqah, Al-Quran
           else if (grade === 4) { targetSurahIndex = 42; targetLevel = 10; } // Al-Jinn, Al-Quran
           else if (grade === 5 || grade === 6) { targetSurahIndex = 47; targetLevel = 10; } // Al-Mursalat, Al-Quran
           else if (grade === 7) { targetSurahIndex = 51; targetLevel = 10; } // Ash-Shaff, Al-Quran
           else if (grade >= 8) { targetSurahIndex = 56; targetLevel = 10; } // At-Tahrim, Al-Quran
           
           let studentSurahIdx = SURAH_PROGRESSION.indexOf(s.normalizedHafalan);
           
           // If surah not found but has data, maybe it's higher juz or custom name
           if (studentSurahIdx === -1 && s.normalizedHafalan.length > 3) {
               // We will be strict: if it's not in our progression, we'll mark as achieved ONLY if grade >= 7 as fallback
               if (grade >= 6) studentSurahIdx = 99; 
           }
           
           hafalanAchieved = studentSurahIdx >= targetSurahIndex;
           ummiAchieved = s.levelScore >= targetLevel;
       } else {
`;

code = code.replace(gradeLogicRegex, newGradeLogic.trim() + "\n       } else {");

fs.writeFileSync(file, code);
console.log('Patched AdminProgressReport.tsx target logic');
