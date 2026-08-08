const fs = require('fs');
let code = fs.readFileSync('src/components/AdminProgressReport.tsx', 'utf-8');

// Insert getNextJuzBoundary
const helperFuncs = `
    function getNextJuzBoundary(idx) {
        if (idx <= 37) return 48; // move from Juz 30 to end of 29
        if (idx <= 48) return 57; // move from Juz 29 to end of 28
        if (idx <= 57) return 64; // move from Juz 28 to end of 27
        return idx + 10; // rough fallback
    }
`;

code = code.replace('function getHighestSurahIndex(rawText: string): number {', helperFuncs + '\n    function getHighestSurahIndex(rawText: string): number {');

const studentLoopInner = `
         const hafalanDeposits = deposits.filter((dep: any) => dep.student_id === student.id && dep.type === 'hafalan');
         hafalanDeposits.sort((a: any, b: any) => b.date.localeCompare(a.date));
         const latestHafalan = hafalanDeposits[0];
         const firstHafalan = hafalanDeposits[hafalanDeposits.length - 1];

         let currentHafalanStr = 'Belum Ada Data';
         let normalizedHafalan = '';
         if (latestHafalan) {
            currentHafalanStr = \`Surah \${latestHafalan.details?.surah || '-'}\`;
            normalizedHafalan = (latestHafalan.details?.surah || '').toLowerCase().replace(/[^a-z]/g, '').replace(/^(surah|surat|qs)/, '');
         }
         
         let hafalanStatus = 'Belum Ada Data';
         let ummiStatus = 'Belum Ada Data';
         let hafalanAchieved = false;
         let ummiAchieved = false;
         
         const halaqohName = student.halaqoh_name || halaqohs.find((h: any) => h.id === student.halaqoh_id)?.name || 'Tanpa Halaqoh';
         let grade = 0;
         const match = halaqohName.match(/([1-9])/);
         if (match) grade = parseInt(match[1]);
         
         let studentSurahIdx = getHighestSurahIndex(currentHafalanStr);
         let firstSurahIdx = firstHafalan ? getHighestSurahIndex(\`Surah \${firstHafalan.details?.surah || '-'}\`) : 0;
         
         if (grade > 0) {
           let targetSurahIndex = 0;
           let targetLevel = 7; 
           
           if (grade === 1) { targetSurahIndex = 3; targetLevel = 2; }
           else if (grade === 2) { targetSurahIndex = 12; targetLevel = 5; }
           else if (grade === 3) { targetSurahIndex = 37; targetLevel = 7; }
           else if (grade === 4) { targetSurahIndex = 43; targetLevel = 7; }
           else if (grade === 5) { targetSurahIndex = 54; targetLevel = 7; }
           else if (grade === 6) { 
               // Based on exam mutqin logic if possible, else fallback to 37 (Juz 30 complete)
               const examsHafalan = globalData[guru]?.exams_hafalan || [];
               const hasMutqin = examsHafalan.some((e: any) => e.student_id === student.id && e.note?.toLowerCase().includes('mutqin'));
               if (hasMutqin) studentSurahIdx = 999;
               targetSurahIndex = 37; targetLevel = 7;
           }
           else if (grade === 7 || grade === 8) {
               targetSurahIndex = firstSurahIdx > 0 ? getNextJuzBoundary(firstSurahIdx) : 37; 
               targetLevel = 7;
           }
           else if (grade === 9) {
               const examsHafalan = globalData[guru]?.exams_hafalan || [];
               const hasMutqin = examsHafalan.some((e: any) => e.student_id === student.id && e.note?.toLowerCase().includes('mutqin'));
               if (hasMutqin) studentSurahIdx = 999;
               targetSurahIndex = 57; targetLevel = 7; 
           }
           
           hafalanAchieved = studentSurahIdx >= targetSurahIndex;
           ummiAchieved = levelScore >= targetLevel;
           
           if (latestHafalan) {
               hafalanStatus = hafalanAchieved ? 'Tercapai' : 'Belum Tercapai';
           }
           if (latestUmmi || latestTilawah) {
               ummiStatus = ummiAchieved ? 'Tercapai' : 'Belum Tercapai';
           }
         } else {
           if (latestHafalan) hafalanAchieved = true;
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
            ummiAchieved
         });
`;

code = code.replace(/const hafalanDeposits = deposits\.filter[\s\S]*? normalizedHafalan,\n         }\);/m, studentLoopInner);

// Now update the HalaqohMap calculation to use these booleans
const halaqohMapLogic = `
    const halaqohMap: Record<string, { total: number, achievedHafalan: number, achievedUmmi: number }> = {};
    
    studentsList.forEach(s => {
       const h = s.halaqoh;
       if (!halaqohMap[h]) halaqohMap[h] = { total: 0, achievedHafalan: 0, achievedUmmi: 0 };
       halaqohMap[h].total++;
       
       if (s.hafalanAchieved) halaqohMap[h].achievedHafalan++;
       if (s.ummiAchieved) halaqohMap[h].achievedUmmi++;
    });
`;

code = code.replace(/const halaqohMap: Record[\s\S]*?if \(ummiAchieved\) halaqohMap\[h\]\.achievedUmmi\+\+;\n    \}\);/m, halaqohMapLogic);

fs.writeFileSync('src/components/AdminProgressReport.tsx', code);
