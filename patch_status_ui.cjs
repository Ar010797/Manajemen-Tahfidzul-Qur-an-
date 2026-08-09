const fs = require('fs');
let code = fs.readFileSync('src/components/AdminProgressReport.tsx', 'utf-8');

code = code.replace(
  /s\.ummiStatus\.includes\('Tercapai'\)/g,
  "s.ummiStatus === 'Tercapai'"
);

code = code.replace(
  /s\.hafalanStatus\.includes\('Tercapai'\)/g,
  "s.hafalanStatus === 'Tercapai'"
);

fs.writeFileSync('src/components/AdminProgressReport.tsx', code);
