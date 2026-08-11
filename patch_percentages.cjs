const fs = require('fs');
let code = fs.readFileSync('src/components/AdminProgressReport.tsx', 'utf-8');

const regexReplace = /let currentLevelStr = 'Belum Ada Data';[\s\S]*?hafalanAchieved = studentSurahIdx >= targetSurahIndex;\n         ummiAchieved = levelScore >= targetLevel;/;

const newBlock = `let currentLevelStr = 'Belum Ada Data';
         let category = 'Belum Ada Data'; // For charting
         let levelScore = 0;
         let ummiAbsoluteScore = 0;
         
         if (latestTilawah && (!latestUmmi || latestTilawah.date >= latestUmmi.date)) {
             currentLevelStr = 'Al-Qur\\'an';
             category = 'Al-Qur\\'an';
             levelScore = 7;
             ummiAbsoluteScore = 7 * 40;
         } else if (latestUmmi) {
             const lvl = latestUmmi.details?.level;
             const page = parseInt(latestUmmi.details?.page || '0') || 0;
             if (lvl === 'Al-Quran' || lvl === 7 || lvl === '7') {
                 currentLevelStr = 'Al-Qur\\'an';
                 category = 'Al-Qur\\'an';
                 levelScore = 7;
                 ummiAbsoluteScore = 7 * 40;
             } else if (lvl) {
                 currentLevelStr = \`Jilid \${lvl}\`;
                 category = \`Jilid \${lvl}\`;
                 levelScore = parseInt(lvl.toString()) || 0;
                 ummiAbsoluteScore = (levelScore - 1) * 40 + page;
             }
         }
         
         
         const hafalanDeposits = deposits.filter((dep: any) => dep.student_id === student.id && dep.type === 'hafalan');
         hafalanDeposits.sort((a: any, b: any) => b.date.localeCompare(a.date));
         const latestHafalan = hafalanDeposits[0];
         const firstHafalan = hafalanDeposits[hafalanDeposits.length - 1];

         let currentHafalanStr = 'Belum Ada Data';
         let normalizedHafalan = '';
         
         if (latestHafalan) {
            currentHafalanStr = \`Surah \${latestHafalan.details?.surah || '-'}\`;
            if (latestHafalan.details?.ayah) {
               currentHafalanStr += \` ayat \${latestHafalan.details.ayah}\`;
            }
            normalizedHafalan = currentHafalanStr;
         }
         
         let hafalanStatus = '-';
         let ummiStatus = '-';
         let hafalanAchieved = false;
         let ummiAchieved = false;
         
         let studentSurahIdx = 0;
         let firstSurahIdx = 0;
         let hafalanPercentage = 0;
         let ummiPercentage = 0;
         let targetSurahIndex = 0;
         let targetLevel = 7;
         let targetUmmiAbsoluteScore = 7 * 40;
         
         if (latestHafalan) {
            studentSurahIdx = getHighestSurahIndex(currentHafalanStr);
         }
         if (firstHafalan) {
            firstSurahIdx = getHighestSurahIndex(\`Surah \${firstHafalan.details?.surah || '-'}\`);
         }
         
         if (grade > 0) {
         
         if (grade === 1) { 
            targetSurahIndex = 7; // Al-Insyiqoq
            targetLevel = 3;      // Jilid 3
            targetUmmiAbsoluteScore = 3 * 40; // Jilid 3 Hal 40
         } 
         else if (grade === 2) { 
            targetSurahIndex = 19; // Al-'Alaq
            targetLevel = 6;       // Jilid 6
            targetUmmiAbsoluteScore = 6 * 40; // Jilid 6 Hal 40
         } 
         else if (grade === 3) { 
            targetSurahIndex = 40; // Al-Haqqoh
            targetLevel = 7;       // Al-Qur'an
            targetUmmiAbsoluteScore = 7 * 40;
         } 
         else if (grade === 4) { 
            targetSurahIndex = 48; // Al-Mursalat
            targetLevel = 7;       // Al-Qur'an
            targetUmmiAbsoluteScore = 7 * 40;
         } 
         else if (grade === 5) { 
            targetSurahIndex = 54; // Al-Munafiqun
            targetLevel = 7;       // Al-Qur'an
            targetUmmiAbsoluteScore = 7 * 40;
         } 
         else if (grade === 6) { 
             targetSurahIndex = 37; targetLevel = 7; // Mutqin Juz 30 (An-Nas is 37)
             targetUmmiAbsoluteScore = 7 * 40;
             const examsHafalan = globalData[guru]?.exams_hafalan || [];
             const hasMutqin = examsHafalan.some((e: any) => e.student_id === student.id && e.note?.toLowerCase().includes('mutqin'));
             if (hasMutqin) studentSurahIdx = 999;
         }
         else if (grade === 7 || grade === 8) {
             let requiredJuz = grade === 8 ? 2 : 1;
             if (student.totalJuzAdded && student.totalJuzAdded >= requiredJuz) {
                 studentSurahIdx = 999; 
                 targetSurahIndex = 1;
             } else {
                 let tIdx = firstSurahIdx > 0 ? getNextJuzBoundary(firstSurahIdx) : 37;
                 if (grade === 8) tIdx = getNextJuzBoundary(tIdx);
                 targetSurahIndex = tIdx; 
             }
             targetLevel = 7;
             targetUmmiAbsoluteScore = 7 * 40;
         }
         else if (grade === 9) {
             if (student.totalAccumulatedJuz && student.totalAccumulatedJuz >= 3) {
                 studentSurahIdx = 999;
                 targetSurahIndex = 1;
             } else {
                 targetSurahIndex = 57; 
                 const examsHafalan = globalData[guru]?.exams_hafalan || [];
                 const hasMutqin = examsHafalan.some((e: any) => e.student_id === student.id && e.note?.toLowerCase().includes('mutqin'));
                 if (hasMutqin) studentSurahIdx = 999;
             }
             targetLevel = 7;
             targetUmmiAbsoluteScore = 7 * 40;
         }
         
         // Calculate percentages
         ummiPercentage = Math.min(100, Math.round((ummiAbsoluteScore / targetUmmiAbsoluteScore) * 100)) || 0;
         
         if (grade === 6 || grade === 9) {
             if (studentSurahIdx === 999) hafalanPercentage = 100;
             else hafalanPercentage = Math.min(100, Math.round((studentSurahIdx / targetSurahIndex) * 100)) || 0;
         } else if (grade === 7 || grade === 8) {
             if (studentSurahIdx === 999) hafalanPercentage = 100;
             else {
                 let surahsNeeded = targetSurahIndex - firstSurahIdx;
                 let surahsDone = studentSurahIdx - firstSurahIdx;
                 if (surahsNeeded <= 0) hafalanPercentage = 100;
                 else if (surahsDone <= 0) hafalanPercentage = 0;
                 else hafalanPercentage = Math.min(100, Math.round((surahsDone / surahsNeeded) * 100));
             }
         } else {
             hafalanPercentage = Math.min(100, Math.round((studentSurahIdx / targetSurahIndex) * 100)) || 0;
         }
         
         hafalanAchieved = studentSurahIdx >= targetSurahIndex;
         ummiAchieved = levelScore >= targetLevel;`;

code = code.replace(regexReplace, newBlock);
fs.writeFileSync('src/components/AdminProgressReport.tsx', code);
