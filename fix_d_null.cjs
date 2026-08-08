const fs = require('fs');
const file = 'src/components/AdminProgressReport.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/const d = globalData\[guru\];\n      const students = d.students \|\| \[\];/g, "const d = globalData[guru];\n      if (!d) return;\n      const students = d.students || [];");

fs.writeFileSync(file, code);
console.log('Fixed d null');
