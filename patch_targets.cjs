const fs = require('fs');
let code = fs.readFileSync('src/components/AdminProgressReport.tsx', 'utf-8');

const regexTargetLogic = /let targetSurahIndexS1 = 0;[\s\S]*?if \(levelScore > 0\) ummiAchieved = true;\n       \}/;

const newTargetLogic = `let targetSurahIndex = 0;
         let targetLevel = 7; 
         
         if (grade === 1) { targetSurahIndex = 3; targetLevel = 2; }
         else if (grade === 2) { targetSurahIndex = 12; targetLevel = 5; }
         else if (grade === 3) { targetSurahIndex = 37; targetLevel = 7; }
         else if (grade === 4) { targetSurahIndex = 43; targetLevel = 7; }
         else if (grade === 5) { targetSurahIndex = 54; targetLevel = 7; }
         else if (grade === 6) { 
             targetSurahIndex = 37; targetLevel = 7;
             // Mutqin check
             const examsHafalan = globalData[guru]?.exams_hafalan || [];
             const hasMutqin = examsHafalan.some((e: any) => e.student_id === student.id && e.note?.toLowerCase().includes('mutqin'));
             if (hasMutqin) studentSurahIdx = 999;
         }
         else if (grade === 7 || grade === 8) {
             // For MTs +1 juz per semester. Since it's semester 1, they just need to reach the next juz boundary from where they started.
             targetSurahIndex = firstSurahIdx > 0 ? getNextJuzBoundary(firstSurahIdx) : 37; 
             targetLevel = 7;
         }
         else if (grade === 9) {
             targetSurahIndex = 57; targetLevel = 7; 
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
