const fs = require('fs');
let code = fs.readFileSync('src/components/AdminProgressReport.tsx', 'utf-8');

const regexToReplace = /let currentHafalanStr = 'Belum Ada Data';[\s\S]*?hafalanPercentage,\s*ummiPercentage\s*\}\);/g;

const replacement = `let currentHafalanStr = 'Belum Ada Data';
         let normalizedHafalan = '';
         
         let studentSurahIdx = 0;
         let firstSurahIdx = 0;

         if (latestHafalan) {
            currentHafalanStr = \`Surah \${latestHafalan.details?.surah || '-'}\`;
            if (latestHafalan.details?.ayah) {
               currentHafalanStr += \` ayat \${latestHafalan.details.ayah}\`;
            }
            normalizedHafalan = currentHafalanStr;
         }

         hafalanDeposits.forEach((dep: any) => {
             const str = \`Surah \${dep.details?.surah || '-'}\`;
             const idx = getHighestSurahIndex(str);
             if (idx > studentSurahIdx) {
                 studentSurahIdx = idx;
                 currentHafalanStr = str;
                 if (dep.details?.ayah) currentHafalanStr += \` ayat \${dep.details.ayah}\`;
                 normalizedHafalan = currentHafalanStr;
             }
         });

         const monthlyRecaps = d.monthly_recaps || [];
         monthlyRecaps.forEach((r: any) => {
             if (r.student_id === student.id && r.total_hafalan) {
                 const idx = getHighestSurahIndex(r.total_hafalan);
                 if (idx > studentSurahIdx) {
                     studentSurahIdx = idx;
                     currentHafalanStr = r.total_hafalan;
                     normalizedHafalan = r.total_hafalan;
                 }
             }
         });

         const examsHafalan = d.exams_hafalan || [];
         const hasMutqin = examsHafalan.some((e: any) => e.student_id === student.id && e.note?.toLowerCase().includes('mutqin'));
         if (hasMutqin && (grade === 6 || grade === 9 || grade === 7 || grade === 8)) {
             studentSurahIdx = 999;
             if (currentHafalanStr === 'Belum Ada Data') {
                 currentHafalanStr = 'Lulus Mutqin';
                 normalizedHafalan = 'Lulus Mutqin';
             }
         }

         if (firstHafalan) {
            firstSurahIdx = getHighestSurahIndex(\`Surah \${firstHafalan.details?.surah || '-'}\`);
         }
         
         let hafalanStatus = '-';
         let ummiStatus = '-';
         let hafalanAchieved = false;
         let ummiAchieved = false;
         
         let hafalanPercentage = 0;
         let ummiPercentage = 0;
         let targetSurahIndex = 0;
         let targetLevel = 7;
         let targetUmmiAbsoluteScore = 7 * 40;
         
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
         }
         else if (grade === 7 || grade === 8) {
             let requiredJuz = grade === 8 ? 2 : 1;
             if (studentSurahIdx === 999) {
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
             if (studentSurahIdx === 999) {
                 targetSurahIndex = 1;
             } else {
                 targetSurahIndex = 57; 
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
         ummiAchieved = levelScore >= targetLevel;
         
         if (currentHafalanStr !== 'Belum Ada Data') {
             if (studentSurahIdx >= targetSurahIndex) hafalanStatus = 'Tercapai';
             else hafalanStatus = 'Belum Mencapai Target';
         }
         if (currentLevelStr !== 'Belum Ada Data') {
             if (levelScore >= targetLevel) ummiStatus = 'Tercapai';
             else ummiStatus = 'Belum Mencapai Target';
         }
       } else {
         if (currentHafalanStr !== 'Belum Ada Data') hafalanAchieved = true;
         if (levelScore > 0) ummiAchieved = true;
       }

         studentsList.push({
            name: student.name,
            guru: guru,
            halaqoh: halaqohName,
            level: currentLevelStr,
            levelScore,
            category: category,
            hafalan: currentHafalanStr,
            normalizedHafalan,
            hafalanStatus,
            ummiStatus,
            hafalanAchieved,
            ummiAchieved,
            hafalanPercentage,
            ummiPercentage
         });`;

code = code.replace(regexToReplace, replacement);

fs.writeFileSync('src/components/AdminProgressReport.tsx', code);
console.log('Super fix applied!');
