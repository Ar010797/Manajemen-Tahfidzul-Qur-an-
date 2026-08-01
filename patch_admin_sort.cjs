const fs = require('fs');
const file = 'src/components/AdminProgressReport.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "}).sort((a,b) => b.percentageHafalan - a.percentageHafalan);",
  "}).sort((a,b) => {\n       const gradeA = a.name.match(/([1-9])/) ? parseInt(a.name.match(/([1-9])/)[1]) : 99;\n       const gradeB = b.name.match(/([1-9])/) ? parseInt(b.name.match(/([1-9])/)[1]) : 99;\n       if (gradeA !== gradeB) return gradeA - gradeB;\n       return a.name.localeCompare(b.name);\n    });"
);

fs.writeFileSync(file, code);
