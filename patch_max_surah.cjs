const fs = require('fs');
let code = fs.readFileSync('src/components/AdminProgressReport.tsx', 'utf-8');

const oldLogic = `let studentSurahIdx = getHighestSurahIndex(currentHafalanStr);`;
const newLogic = `let studentSurahIdx = 0;
         hafalanDeposits.forEach((d: any) => {
            const idx = getHighestSurahIndex(d.details?.surah || '');
            if (idx > studentSurahIdx) studentSurahIdx = idx;
         });
         
         // Fallback if none found
         if (studentSurahIdx === 0) {
            studentSurahIdx = getHighestSurahIndex(currentHafalanStr);
         }`;

code = code.replace(oldLogic, newLogic);
fs.writeFileSync('src/components/AdminProgressReport.tsx', code);
