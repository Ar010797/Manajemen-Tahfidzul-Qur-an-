const fs = require('fs');
let code = fs.readFileSync('src/components/AdminProgressReport.tsx', 'utf-8');

const regexUmmiLogic = /if \(latestTilawah && \(\!latestUmmi \|\| latestTilawah\.date >= latestUmmi\.date\)\) \{[\s\S]*?\} else if \(latestUmmi\) \{[\s\S]*?\}\s*\}/;

const newUmmiLogic = `
         const allLevels: any[] = [];
         tilawahDeposits.forEach((dep: any) => {
             allLevels.push({
                 score: 7 * 40,
                 levelScore: 7,
                 levelStr: "Al-Qur'an",
                 category: "Al-Qur'an"
             });
         });
         ummiDeposits.forEach((dep: any) => {
             const lvl = dep.details?.level;
             const page = parseInt(dep.details?.page || '0') || 0;
             if (lvl === 'Al-Quran' || lvl === 7 || lvl === '7') {
                 allLevels.push({
                     score: 7 * 40,
                     levelScore: 7,
                     levelStr: "Al-Qur'an",
                     category: "Al-Qur'an"
                 });
             } else if (lvl) {
                 const l = parseInt(lvl.toString()) || 0;
                 allLevels.push({
                     score: (l - 1) * 40 + page,
                     levelScore: l,
                     levelStr: \`Jilid \${lvl}\`,
                     category: \`Jilid \${lvl}\`
                 });
             }
         });

         if (allLevels.length > 0) {
             allLevels.sort((a, b) => b.score - a.score);
             levelScore = allLevels[0].levelScore;
             ummiAbsoluteScore = allLevels[0].score;
             currentLevelStr = allLevels[0].levelStr;
             category = allLevels[0].category;
         }
`;

code = code.replace(regexUmmiLogic, newUmmiLogic);


const regexHafalanLogic = /if \(latestHafalan\) \{\s*studentSurahIdx = getHighestSurahIndex\(currentHafalanStr\);\s*\}/;
const newHafalanLogic = `
         if (latestHafalan) {
            hafalanDeposits.forEach((dep: any) => {
                const str = \`Surah \${dep.details?.surah || '-'}\`;
                const idx = getHighestSurahIndex(str);
                if (idx > studentSurahIdx) {
                    studentSurahIdx = idx;
                }
            });
         }
`;
code = code.replace(regexHafalanLogic, newHafalanLogic);


// Additionally, check MonthlyRecap settings.
const regexMonthlyRecap = /const hafalanDeposits = deposits\.filter[\s\S]*?const firstHafalan = hafalanDeposits\[hafalanDeposits\.length - 1\];/;

const newMonthlyRecap = `
         const hafalanDeposits = deposits.filter((dep: any) => dep.student_id === student.id && dep.type === 'hafalan');
         hafalanDeposits.sort((a: any, b: any) => b.date.localeCompare(a.date));
         const latestHafalan = hafalanDeposits[0];
         const firstHafalan = hafalanDeposits[hafalanDeposits.length - 1];

         // Incorporate manual settings from MonthlyRecap if they are higher
         const monthlyRecaps = d.monthly_recaps || [];
         const studentRecaps = monthlyRecaps.filter((r: any) => r.student_id === student.id);
`;

// Wait, doing this via replace is getting messy. Let me just write the full function if needed, or stick to this safe patch.

fs.writeFileSync('src/components/AdminProgressReport.tsx', code);
console.log('Patched Ummi and Hafalan historical max logic!');
