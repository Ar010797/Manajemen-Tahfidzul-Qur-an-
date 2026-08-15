const fs = require('fs');
let code = fs.readFileSync('src/components/DailyInput.tsx', 'utf-8');

code = code.replace(/lastDetails\.grade === 'A';/g, "lastDetails.grade === 'A' || lastDetails.grade === 'B';");
code = code.replace(/\['A'\]\.includes\(d\.grade\)/g, "['A', 'B'].includes(d.grade)");

fs.writeFileSync('src/components/DailyInput.tsx', code);
console.log('Patched Ummi & Tilawah Grades');
