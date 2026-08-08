const fs = require('fs');
const file = 'src/components/AdminProgressReport.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /let hafalanAchieved = false;[\s\S]*?if \(hafalanAchieved\) halaqohMap\[h\]\.achievedHafalan\+\+;/;

const replacement = `let hafalanAchieved = false;
       let ummiAchieved = false;
       
       if (grade > 0) {
           let targetSurahIndex = 0;
           let targetLevel = 10; // Default to Al-Qur'an (Level 10)
           
           const currentMonth = new Date().getMonth();
           const isSemesterGanjil = currentMonth >= 6; // July to December
           
           if (isSemesterGanjil) {
               // TARGET SEMESTER GANJIL
               if (grade === 1) { targetSurahIndex = 2; targetLevel = 2; } // Abasa, Jilid 2
               else if (grade === 2) { targetSurahIndex = 11; targetLevel = 5; } // Al-Fajr, Jilid 5
               else if (grade === 3) { targetSurahIndex = 36; targetLevel = 10; } // An-Nas, Al-Quran
               else if (grade === 4) { targetSurahIndex = 42; targetLevel = 10; } // Al-Jinn, Al-Quran
               else if (grade === 5) { targetSurahIndex = 53; targetLevel = 10; } // Al-Munafiqun, Al-Quran
               else if (grade === 6) { targetSurahIndex = 36; targetLevel = 10; } // Murojaah Juz 30 (An-Nas)
               else if (grade === 7) { targetSurahIndex = 51; targetLevel = 10; } // Ash-Shaff, Al-Quran
               else if (grade >= 8) { targetSurahIndex = 56; targetLevel = 10; } // At-Tahrim, Al-Quran
           } else {
               // TARGET SEMESTER GENAP
               if (grade === 1) { targetSurahIndex = 6; targetLevel = 3; } // Al-Insyiqaq, Jilid 3
               else if (grade === 2) { targetSurahIndex = 18; targetLevel = 6; } // Al-'Alaq, Jilid 6
               else if (grade === 3) { targetSurahIndex = 39; targetLevel = 10; } // Al-Haqqah, Al-Quran
               else if (grade === 4) { targetSurahIndex = 47; targetLevel = 10; } // Al-Mursalat, Al-Quran
               else if (grade === 5) { targetSurahIndex = 53; targetLevel = 10; } // Al-Munafiqun, Al-Quran
               else if (grade === 6) { targetSurahIndex = 36; targetLevel = 10; } // Murojaah Juz 30 (An-Nas)
               else if (grade === 7) { targetSurahIndex = 51; targetLevel = 10; } // Ash-Shaff, Al-Quran
               else if (grade >= 8) { targetSurahIndex = 56; targetLevel = 10; } // At-Tahrim, Al-Quran
           }
           
           let studentSurahIdx = SURAH_PROGRESSION.indexOf(s.normalizedHafalan);
           
           // If surah not found but has data, maybe it's higher juz or custom name
           if (studentSurahIdx === -1 && s.normalizedHafalan.length > 3) {
               // We will be strict: if it's not in our progression, we'll mark as achieved ONLY if grade >= 7 as fallback
               if (grade >= 6) studentSurahIdx = 99; 
           }
           
           hafalanAchieved = studentSurahIdx >= targetSurahIndex;
           ummiAchieved = s.levelScore >= targetLevel;
       } else {
           // No grade detected, just check if they have any data
           if (s.normalizedHafalan) hafalanAchieved = true;
           if (s.levelScore > 0) ummiAchieved = true;
       }
       
       if (hafalanAchieved) halaqohMap[h].achievedHafalan++;`;

code = code.replace(regex, replacement);

fs.writeFileSync(file, code);
console.log('Patched Target Logic');
