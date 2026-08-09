const fs = require('fs');
let code = fs.readFileSync('src/components/AdminProgressReport.tsx', 'utf-8');

const regexHafalan = /if \(s\.hafalanStatus\.includes\('Tercapai'\)\) halaqohMap\[h\]\.achievedHafalan\+\+;/g;
const newHafalan = `if (s.hafalanStatus === 'Tercapai') halaqohMap[h].achievedHafalan++;`;

const regexUmmi = /if \(s\.ummiStatus\.includes\('Tercapai'\)\) halaqohMap\[h\]\.achievedUmmi\+\+;/g;
const newUmmi = `if (s.ummiStatus === 'Tercapai') halaqohMap[h].achievedUmmi++;`;

code = code.replace(regexHafalan, newHafalan);
code = code.replace(regexUmmi, newUmmi);

fs.writeFileSync('src/components/AdminProgressReport.tsx', code);
