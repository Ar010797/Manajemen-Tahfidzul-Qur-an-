const fs = require('fs');
let code = fs.readFileSync('src/components/AdminProgressReport.tsx', 'utf-8');

const regex = /hafalanAchieved,\n            ummiAchieved\n         \}\);/g;
const replacement = `hafalanAchieved,
            ummiAchieved,
            hafalanPercentage,
            ummiPercentage
         });`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/AdminProgressReport.tsx', code);
