const fs = require('fs');
let code = fs.readFileSync('src/components/AdminProgressReport.tsx', 'utf-8');

const regex = /const latestTilawah = tilawahDeposits\[0\];\n\n         let currentLevelStr = 'Belum Ada Data';/g;

const replacement = `const latestTilawah = tilawahDeposits[0];

         const halaqohObj = halaqohs.find((h: any) => h.id === student.halaqoh_id);
         const halaqohName = halaqohObj?.name || 'Tidak Ada Halaqoh';
         const grade = parseInt(halaqohName.match(/([1-9])/)?.[1] || '0');

         let currentLevelStr = 'Belum Ada Data';`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/AdminProgressReport.tsx', code);
