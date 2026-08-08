const fs = require('fs');
const file = 'src/components/AdminProgressReport.tsx';
let code = fs.readFileSync(file, 'utf8');

const regexProgression = /const SURAH_PROGRESSION = \[[\s\S]*?\];/;
const replacementProgression = `const SURAH_PROGRESSION = [
      // Juz 30 (Index 0 - 37)
      "annaba", "annaziat", "abasa", "attakwir", "alinfitar", "almutaffifin", "alinsyiqaq", // Kls 1
      "alburuj", "attariq", "alala", "algasyiyah", "alfajr", "albalad", "asysyams", "allail", 
      "adduha", "asysyarh", "attin", "alalaq", // Kls 2
      "alqadr", "albayyinah", "azzalzalah", "aladiyat", "alqariah", "attakasur", "alasr", "alhumazah", 
      "alfil", "quraisy", "almaun", "alkausar", "alkafirun", "annasr", "almasad", "allahab", "alikhlas", "alfalaq", "annas",
      // Juz 29 (Index 38 - 48)
      "almulk", "alqalam", "alhaqqah", "almaarij", "nuh", "aljinn", 
      "almuzzammil", "almuddassir", "alqiyamah", "alinsan", "almursalat", 
      // Juz 28 (Index 49 - 57)
      "almujadilah", "alhasyr", "almumtahanah", "ashshaff", "aljumuah", "almunafiqun", "attagabun", "attalaq", "attahrim",
      // Juz 27 (Index 58 - 64)
      "adzdzariyat", "addzariyat", "attur", "annajm", "alqamar", "arrahman", "alwaqiah", "alhadid",
      // Juz 26 (Index 65 - 70)
      "alahqaf", "muhammad", "alfath", "alhujurat", "qaf", "qof",
      // Juz 1 - 25 will be handled dynamically if not found (we give them high score)
      "alfatihah", "albaqarah", "albaqoroh", "aliimran", "annisa", "almaidah", "alanam", "alaraf", "alanfal", "attaubah", "yunus", "hud", "yusuf", "arrad", "ibrahim", "alhijr", "annahl", "alisra", "alkahfi", "alkahf", "maryam", "taha", "alanbiya", "alhaj", "almuminun", "annur", "alfurqan", "asysyuara", "annaml", "alqasas", "alankabut", "arrum", "luqman", "assajdah", "alazhab", "saba", "fatir", "yasiin", "yasin", "assaffat", "sad", "shod", "azzumar", "ghafir", "fussilat", "asysyura", "azzukhruf", "addukhan", "aljasiyah"
    ];`;

code = code.replace(regexProgression, replacementProgression);

const regexTarget = /let hafalanAchieved = false;[\s\S]*?if \(hafalanAchieved\) halaqohMap\[h\]\.achievedHafalan\+\+;/;
const replacementTarget = `let hafalanAchieved = false;
       let ummiAchieved = false;
       
       if (grade > 0) {
           let targetSurahIndex = 0;
           let targetLevel = 10; // Default to Al-Qur'an (Level 10)
           
           // Berdasarkan Instruksi Hierarki:
           // KELAS 1: Target Hafalan = Surah Abasa. Target Ummi = Jilid 2.
           // KELAS 2: Target Hafalan = Surah Al Fajr. Target Ummi = Jilid 5.
           // KELAS 3: Target Hafalan = Surah An Nas. Target Ummi = Al-Qur'an.
           // KELAS 4: Target Hafalan = Surah Al Jin. Target Ummi = Al-Qur'an.
           // KELAS 5: Target Hafalan = Surah Al Munafiqun. Target Ummi = Al-Qur'an.
           // KELAS 6/7/8/9: Target Hafalan = Ziyadah 1 Juz / Murojaah. Target Ummi = Al-Qur'an.
           if (grade === 1) { targetSurahIndex = SURAH_PROGRESSION.indexOf("abasa"); targetLevel = 2; }
           else if (grade === 2) { targetSurahIndex = SURAH_PROGRESSION.indexOf("alfajr"); targetLevel = 5; }
           else if (grade === 3) { targetSurahIndex = SURAH_PROGRESSION.indexOf("annas"); targetLevel = 10; }
           else if (grade === 4) { targetSurahIndex = SURAH_PROGRESSION.indexOf("aljinn"); targetLevel = 10; }
           else if (grade === 5) { targetSurahIndex = SURAH_PROGRESSION.indexOf("almunafiqun"); targetLevel = 10; }
           else if (grade >= 6) { targetSurahIndex = SURAH_PROGRESSION.indexOf("annas"); targetLevel = 10; } // Fallback for 6/7/8/9 as murojaah/1 juz (assume >= annas is good)
           
           let studentSurahIdx = SURAH_PROGRESSION.indexOf(s.normalizedHafalan);
           
           // If surah not found but has data, maybe it's higher juz or custom name
           if (studentSurahIdx === -1 && s.normalizedHafalan.length > 3) {
               // We will be lenient, if they have entered a valid surah not in the 30/29/28 sequence (like Al-Baqarah), 
               // it means they are doing Juz 1+, so we give them a high index.
               studentSurahIdx = 999; 
           }
           
           // If the student's current surah index in the progression is >= the target index, they achieved it.
           hafalanAchieved = studentSurahIdx >= targetSurahIndex;
           ummiAchieved = s.levelScore >= targetLevel;
       } else {
           // No grade detected, just check if they have any data
           if (s.normalizedHafalan) hafalanAchieved = true;
           if (s.levelScore > 0) ummiAchieved = true;
       }
       
       if (hafalanAchieved) halaqohMap[h].achievedHafalan++;`;

code = code.replace(regexTarget, replacementTarget);

fs.writeFileSync(file, code);
console.log('Patched Target Logic Final');
