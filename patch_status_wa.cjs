const fs = require('fs');
let code = fs.readFileSync('src/components/DailyInput.tsx', 'utf-8');

const regex1 = /let currentStatus = '';\s*if \(d\.status === 'Ujian' \|\| d\.is_ujian\) \{\s*currentStatus = '\*Ujian\*';\s*\} else if \(d\.status === 'Progressing' \|\| isGoodGrade\) \{\s*currentStatus = '\*Progressing\*';\s*\} else \{\s*currentStatus = '\*Hafalan\*';\s*\}/;

const replace1 = `let currentStatus = '';
      if (d.status === 'Ujian' || d.is_ujian) {
         currentStatus = '*Ujian Surah*';
      } else if (d.status === 'Hafalan') {
         currentStatus = '*Muroja\\'ah (Mengulang)*';
      } else {
         currentStatus = '*Ziyadah (Menambah)*';
      }`;

code = code.replace(regex1, replace1);

const regex2 = /let currentStatus = '';\s*if \(d\.status === 'Ujian' \|\| d\.is_ujian\) \{\s*currentStatus = 'Ujian';\s*\} else if \(d\.status === 'Progressing' \|\| isGoodGrade\) \{\s*currentStatus = 'Progressing';\s*\} else \{\s*currentStatus = 'Hafalan';\s*\}/;

const replace2 = `let currentStatus = '';
        if (d.status === 'Ujian' || d.is_ujian) {
           currentStatus = 'Ujian Surah';
        } else if (d.status === 'Hafalan') {
           currentStatus = 'Muroja\\'ah';
        } else {
           currentStatus = 'Ziyadah';
        }`;

code = code.replace(regex2, replace2);

fs.writeFileSync('src/components/DailyInput.tsx', code);
console.log('Patched');
