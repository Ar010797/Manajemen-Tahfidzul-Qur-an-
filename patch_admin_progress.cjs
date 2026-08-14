const fs = require('fs');
let code = fs.readFileSync('src/components/AdminProgressReport.tsx', 'utf-8');

const regex = /const d = globalData\[guru\];\n\s*const students = d\.students \|\| \[\];/g;
const replacement = `const d = globalData[guru];
      if (!d) return; // Protect against null/undefined
      const students = d.students || [];`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/AdminProgressReport.tsx', code);
