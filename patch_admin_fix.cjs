const fs = require('fs');
const file = 'src/components/AdminProgressReport.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "percentageUmmi: halaqohMap[k].total > 0 ? Math.round((halaqohMap[k].achievedUmmi / halaqohMap[k].total) * 100) : 0\n    }).sort",
  "percentageUmmi: halaqohMap[k].total > 0 ? Math.round((halaqohMap[k].achievedUmmi / halaqohMap[k].total) * 100) : 0\n       };\n    }).sort"
);

fs.writeFileSync(file, code);
