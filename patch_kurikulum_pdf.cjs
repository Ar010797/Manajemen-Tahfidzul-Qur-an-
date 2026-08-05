const fs = require('fs');
const file = 'src/components/AdminProgressReport.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "t.semester1.hafalan",
  "t.s1_hafalan"
);
code = code.replace(
  "t.semester1.ummi",
  "t.s1_ummi"
);
code = code.replace(
  "t.semester2.hafalan",
  "t.s2_hafalan"
);
code = code.replace(
  "t.semester2.ummi",
  "t.s2_ummi"
);

fs.writeFileSync(file, code);
