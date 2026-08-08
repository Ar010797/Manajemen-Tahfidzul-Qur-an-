const fs = require('fs');
const file = 'src/components/ExamHafalan.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/setSemester\(active\.semester \|\| 'Ganjil'\);/g, "setSemester((active.semester as 'Ganjil' | 'Genap') || 'Ganjil');");
code = code.replace(/setSemester\(exam\.semester \|\| 'Ganjil'\);/g, "setSemester((exam.semester as 'Ganjil' | 'Genap') || 'Ganjil');");

fs.writeFileSync(file, code);
console.log('Fixed ExamHafalan');
