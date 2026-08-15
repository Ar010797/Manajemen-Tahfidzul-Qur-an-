const fs = require('fs');
let code = fs.readFileSync('src/components/DailyInput.tsx', 'utf-8');

// 1. Fix WhatsApp individual PR message
code = code.replace(
  /homework = nextSurah \? \`Lulus Ujian! Lanjut ke Surah \$\{nextSurah\.name\}\` : 'Lulus Ujian!';/g,
  "homework = nextSurah ? `Lulus Ujian! Lanjut ke Surah ${nextSurah.name} ayat 1` : 'Lulus Ujian!';"
);

// 2. Fix WhatsApp group PR message
code = code.replace(
  /homework = nextSurah \? \`Lulus! Lanjut \$\{nextSurah\.name\}\` : 'Lulus!';/g,
  "homework = nextSurah ? `Lulus! Lanjut ${nextSurah.name} ayat 1` : 'Lulus!';"
);

// 3. Fix Ummi advance logic
code = code.replace(
  /const shouldAdvance = lastDetails\.grade === 'A' \|\| lastDetails\.grade === 'B';/g,
  "const shouldAdvance = lastDetails.grade === 'A';"
);

// 4. Fix Ummi & Tilawah WA isGoodGrade
code = code.replace(
  /const isGoodGrade = \['A', 'B'\]\.includes\(d\.grade\);/g,
  "const isGoodGrade = ['A'].includes(d.grade);"
);

fs.writeFileSync('src/components/DailyInput.tsx', code);
console.log('Patched');
