const fs = require('fs');
let code = fs.readFileSync('src/components/AdminProgressReport.tsx', 'utf-8');

code = code.replace(
  /else hafalanStatus = 'Belum Tercapai';/g,
  "else hafalanStatus = 'Belum Mencapai Target';"
);

code = code.replace(
  /else ummiStatus = 'Belum Tercapai';/g,
  "else ummiStatus = 'Belum Mencapai Target';"
);

// update ui span coloring conditions
code = code.replace(
  /s\.ummiStatus === 'Belum Tercapai'/g,
  "s.ummiStatus === 'Belum Mencapai Target'"
);

code = code.replace(
  /s\.hafalanStatus === 'Belum Tercapai'/g,
  "s.hafalanStatus === 'Belum Mencapai Target'"
);

fs.writeFileSync('src/components/AdminProgressReport.tsx', code);
