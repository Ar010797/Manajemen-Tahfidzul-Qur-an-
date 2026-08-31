const fs = require('fs');
let code = fs.readFileSync('src/components/AdminProgressReport.tsx', 'utf-8');

const regexHafalanLogic2 = /if \(latestHafalan\) \{\s*currentHafalanStr = `Surah \$\{latestHafalan\.details\?\.surah \|\| '-'\}`;[\s\S]*?if \(firstHafalan\) \{\s*firstSurahIdx = getHighestSurahIndex\(`Surah \$\{firstHafalan\.details\?\.surah \|\| '-'\}`\);\s*\}/;

const newHafalanLogic2 = `
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
         }

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

         if (firstHafalan) {
            firstSurahIdx = getHighestSurahIndex(\`Surah \${firstHafalan.details?.surah || '-'}\`);
         }
`;

code = code.replace(regexHafalanLogic2, newHafalanLogic2);

fs.writeFileSync('src/components/AdminProgressReport.tsx', code);
console.log('Fixed hafalan logic');
