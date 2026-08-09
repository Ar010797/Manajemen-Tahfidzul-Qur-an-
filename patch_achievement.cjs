const fs = require('fs');
let code = fs.readFileSync('src/components/AdminProgressReport.tsx', 'utf-8');

const oldLogic = `       if (s.hafalanAchieved) halaqohMap[h].achievedHafalan++;
       if (s.ummiAchieved) halaqohMap[h].achievedUmmi++;`;

const newLogic = `       if (s.hafalanStatus.includes('Tercapai')) halaqohMap[h].achievedHafalan++;
       if (s.ummiStatus.includes('Tercapai')) halaqohMap[h].achievedUmmi++;`;

code = code.replace(oldLogic, newLogic);
fs.writeFileSync('src/components/AdminProgressReport.tsx', code);
