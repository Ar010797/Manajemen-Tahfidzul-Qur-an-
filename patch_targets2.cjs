const fs = require('fs');
let code = fs.readFileSync('src/components/AdminProgressReport.tsx', 'utf-8');

const regexTargetLogic = /let targetSurahIndex = 0;[\s\S]*?if \(levelScore > 0\) ummiAchieved = true;\n       \}/;

const newTargetLogic = `let targetSurahIndex = 0;
         let targetLevel = 7; 
         
         if (grade === 1) { 
            targetSurahIndex = 7; // Al-Insyiqoq
            targetLevel = 3;      // Jilid 3
         } 
         else if (grade === 2) { 
            targetSurahIndex = 19; // Al-'Alaq
            targetLevel = 6;       // Jilid 6
         } 
         else if (grade === 3) { 
            targetSurahIndex = 40; // Al-Haqqoh
            targetLevel = 7;       // Al-Qur'an
         } 
         else if (grade === 4) { 
            targetSurahIndex = 48; // Al-Mursalat
            targetLevel = 7;       // Al-Qur'an
         } 
         else if (grade === 5) { 
            targetSurahIndex = 54; // Al-Munafiqun
            targetLevel = 7;       // Al-Qur'an
         } 
         else if (grade === 6) { 
             targetSurahIndex = 37; targetLevel = 7; // Mutqin Juz 30 (An-Nas is 37)
             const examsHafalan = globalData[guru]?.exams_hafalan || [];
             const hasMutqin = examsHafalan.some((e: any) => e.student_id === student.id && e.note?.toLowerCase().includes('mutqin'));
             if (hasMutqin) studentSurahIdx = 999;
         }
         else if (grade === 7 || grade === 8) {
             // For MTs +1 juz per semester.
             // We check their first hafalan record and target the next Juz boundary.
             // Also support 'totalJuzAdded' if it exists.
             if (student.totalJuzAdded && student.totalJuzAdded >= 1) {
                 studentSurahIdx = 999; 
                 targetSurahIndex = 1;
             } else {
                 targetSurahIndex = firstSurahIdx > 0 ? getNextJuzBoundary(firstSurahIdx) : 37; 
             }
             targetLevel = 7;
         }
         else if (grade === 9) {
             // 3 Juz total
             if (student.totalAccumulatedJuz && student.totalAccumulatedJuz >= 3) {
                 studentSurahIdx = 999;
                 targetSurahIndex = 1;
             } else {
                 targetSurahIndex = 57; // Just a fallback if totalAccumulatedJuz is not present (Juz 28 end)
                 const examsHafalan = globalData[guru]?.exams_hafalan || [];
                 const hasMutqin = examsHafalan.some((e: any) => e.student_id === student.id && e.note?.toLowerCase().includes('mutqin'));
                 if (hasMutqin) studentSurahIdx = 999;
             }
             targetLevel = 7;
         }
         
         hafalanAchieved = studentSurahIdx >= targetSurahIndex;
         ummiAchieved = levelScore >= targetLevel;
         
         if (latestHafalan) {
             if (studentSurahIdx >= targetSurahIndex) hafalanStatus = 'Tercapai';
             else hafalanStatus = 'Belum Tercapai';
         }
         if (latestUmmi || latestTilawah) {
             if (levelScore >= targetLevel) ummiStatus = 'Tercapai';
             else ummiStatus = 'Belum Tercapai';
         }
       } else {
         if (latestHafalan) hafalanAchieved = true;
         if (levelScore > 0) ummiAchieved = true;
       }`;

code = code.replace(regexTargetLogic, newTargetLogic);

fs.writeFileSync('src/components/AdminProgressReport.tsx', code);
