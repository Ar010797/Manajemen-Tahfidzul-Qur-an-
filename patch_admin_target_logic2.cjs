const fs = require('fs');
const file = 'src/components/AdminProgressReport.tsx';
let code = fs.readFileSync(file, 'utf8');

const regexProgression = /const SURAH_PROGRESSION = \[[\s\S]*?\];/;
const replacementProgression = `const SURAH_PROGRESSION = [
      // Juz 30 (Index 0 - 36)
      "annaba", "annaziat", "abasa", "attakwir", "alinfitar", "almutaffifin", "alinsyiqaq", // Kls 1
      "alburuj", "attariq", "alala", "algasyiyah", "alfajr", "albalad", "asysyams", "allail", 
      "adduha", "asysyarh", "attin", "alalaq", // Kls 2
      "alqadr", "albayyinah", "azzalzalah", "aladiyat", "alqariah", "attakasur", "alasr", "alhumazah", 
      "alfil", "quraisy", "almaun", "alkausar", "alkafirun", "annasr", "allahab", "alikhlas", "alfalaq", "annas",
      // Juz 29 (Index 37 - 47)
      "almulk", "alqalam", "alhaqqah", "almaarij", "nuh", "aljinn", 
      "almuzzammil", "almuddassir", "alqiyamah", "alinsan", "almursalat", 
      // Juz 28 (Index 48 - 56)
      "almujadilah", "alhasyr", "almumtahanah", "ashshaff", "aljumuah", "almunafiqun", "attagabun", "attalaq", "attahrim",
      // Juz 27 (Index 57 - 63)
      "adzdzariyat", "addzariyat", "attur", "annajm", "alqamar", "arrahman", "alwaqiah", "alhadid",
      // Juz 26 (Index 64 - 69)
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
           
           const currentMonth = new Date().getMonth();
           const isSemesterGanjil = currentMonth >= 6; // July to December
           
           if (isSemesterGanjil) {
               // TARGET SEMESTER GANJIL
               if (grade === 1) { targetSurahIndex = SURAH_PROGRESSION.indexOf("abasa"); targetLevel = 2; } // Abasa, Jilid 2
               else if (grade === 2) { targetSurahIndex = SURAH_PROGRESSION.indexOf("alfajr"); targetLevel = 5; } // Al-Fajr, Jilid 5
               else if (grade === 3) { targetSurahIndex = SURAH_PROGRESSION.indexOf("annas"); targetLevel = 10; } // An-Nas, Al-Quran
               else if (grade === 4) { targetSurahIndex = SURAH_PROGRESSION.indexOf("aljinn"); targetLevel = 10; } // Al-Jinn, Al-Quran
               else if (grade === 5) { targetSurahIndex = SURAH_PROGRESSION.indexOf("almunafiqun"); targetLevel = 10; } // Al-Munafiqun, Al-Quran
               else if (grade === 6) { targetSurahIndex = SURAH_PROGRESSION.indexOf("annas"); targetLevel = 10; } // Murojaah Juz 30 (An-Nas)
               else if (grade === 7) { targetSurahIndex = SURAH_PROGRESSION.indexOf("ashshaff"); targetLevel = 10; } // Ash-Shaff, Al-Quran
               else if (grade >= 8) { targetSurahIndex = SURAH_PROGRESSION.indexOf("attahrim"); targetLevel = 10; } // At-Tahrim, Al-Quran
           } else {
               // TARGET SEMESTER GENAP
               if (grade === 1) { targetSurahIndex = SURAH_PROGRESSION.indexOf("alinsyiqaq"); targetLevel = 3; } // Al-Insyiqaq, Jilid 3
               else if (grade === 2) { targetSurahIndex = SURAH_PROGRESSION.indexOf("alalaq"); targetLevel = 6; } // Al-'Alaq, Jilid 6
               else if (grade === 3) { targetSurahIndex = SURAH_PROGRESSION.indexOf("alhaqqah"); targetLevel = 10; } // Al-Haqqah, Al-Quran
               else if (grade === 4) { targetSurahIndex = SURAH_PROGRESSION.indexOf("almursalat"); targetLevel = 10; } // Al-Mursalat, Al-Quran
               else if (grade === 5) { targetSurahIndex = SURAH_PROGRESSION.indexOf("almunafiqun"); targetLevel = 10; } // Al-Munafiqun, Al-Quran
               else if (grade === 6) { targetSurahIndex = SURAH_PROGRESSION.indexOf("annas"); targetLevel = 10; } // Murojaah Juz 30 (An-Nas)
               else if (grade === 7) { targetSurahIndex = SURAH_PROGRESSION.indexOf("ashshaff"); targetLevel = 10; } // Ash-Shaff, Al-Quran
               else if (grade >= 8) { targetSurahIndex = SURAH_PROGRESSION.indexOf("attahrim"); targetLevel = 10; } // At-Tahrim, Al-Quran
           }
           
           let studentSurahIdx = SURAH_PROGRESSION.indexOf(s.normalizedHafalan);
           
           // If surah not found but has data, maybe it's higher juz or custom name
           if (studentSurahIdx === -1 && s.normalizedHafalan.length > 3) {
               // If it's something like "juz" or "surah" we can assume they have done significant hafalan.
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
console.log('Done');
