const fs = require('fs');
let code = fs.readFileSync('src/components/AdminProgressReport.tsx', 'utf-8');

const regexTargetLogic = /let targetSurahIndex = 0;[\s\S]*?if \(levelScore > 0\) ummiAchieved = true;\n       \}/;

const newTargetLogic = `let targetSurahIndex = 0;
         let targetLevel = 7; 
         
         // Using Full Year (Tahunan) targets as requested
         // +1 index because "melebihi surat X" means they must be at X+1
         if (grade === 1) { targetSurahIndex = 8; targetLevel = 3; } // Al-Insyiqoq(7) -> 8
         else if (grade === 2) { targetSurahIndex = 20; targetLevel = 6; } // Al-'Alaq(19) -> 20
         else if (grade === 3) { targetSurahIndex = 41; targetLevel = 7; } // Al-Haqqoh(40) -> 41
         else if (grade === 4) { targetSurahIndex = 49; targetLevel = 7; } // Al-Mursalat(48) -> 49
         else if (grade === 5) { targetSurahIndex = 55; targetLevel = 7; } // Al-Munafiqun(54) -> 55
         else if (grade === 6) { 
             targetSurahIndex = 38; targetLevel = 7; // Mutqin Juz 30 (An-Nas is 37) -> 38
             const examsHafalan = globalData[guru]?.exams_hafalan || [];
             const hasMutqin = examsHafalan.some((e: any) => e.student_id === student.id && e.note?.toLowerCase().includes('mutqin'));
             if (hasMutqin) studentSurahIdx = 999;
         }
         else if (grade === 7 || grade === 8) {
             // For MTs +1 juz per semester -> +2 Juz for Tahunan.
             // But the user specifies "minimal +1 Juz per semester (semester 1 maupun semester 2)".
             // We'll require they reached the next juz boundary from their starting point.
             targetSurahIndex = firstSurahIdx > 0 ? getNextJuzBoundary(firstSurahIdx) : 37; 
             targetLevel = 7;
         }
         else if (grade === 9) {
             targetSurahIndex = 57; targetLevel = 7; // 3 Juz
             const examsHafalan = globalData[guru]?.exams_hafalan || [];
             const hasMutqin = examsHafalan.some((e: any) => e.student_id === student.id && e.note?.toLowerCase().includes('mutqin'));
             if (hasMutqin) studentSurahIdx = 999;
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
