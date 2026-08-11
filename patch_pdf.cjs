const fs = require('fs');
let code = fs.readFileSync('src/components/AdminProgressReport.tsx', 'utf-8');

// Patch Students Table
const regexStudentPdf = /const studentsBody = studentsProgress\.map\(\(s\) => \[\n           s\.name, \n           s\.guru, \n           s\.level, \n           s\.hafalan \|\| '-',\n           s\.ummiStatus,\n           s\.hafalanStatus\n        \]\);\n        \n        autoTable\(pdf, \{\n           startY: startY,\n           head: \[\['Nama Siswa', 'Guru', 'Progress Ummi\/Quran', 'Hafalan Terakhir', 'Status Ummi', 'Status Hafalan'\]\],/g;
const replacementStudentPdf = `const studentsBody = studentsProgress.map((s) => [
           s.name, 
           s.guru, 
           s.level, 
           s.hafalan || '-',
           s.ummiPercentage.toString() + '%',
           s.ummiStatus,
           s.hafalanPercentage.toString() + '%',
           s.hafalanStatus
        ]);
        
        autoTable(pdf, {
           startY: startY,
           head: [['Nama Siswa', 'Guru', 'Progress Ummi/Quran', 'Hafalan Terakhir', '% Ummi', 'Status Ummi', '% Hafalan', 'Status Hafalan']],`;

code = code.replace(regexStudentPdf, replacementStudentPdf);

// Patch Kurikulum Table
const regexKurikulumPdf = /const kurikulumBody = \[\];\n        \/\/ TARGET_KURIKULUM is defined globally in the file\n        TARGET_KURIKULUM\.forEach\(\(t\) => \{\n           if \(t\.full_text\) \{\n              kurikulumBody\.push\(\[\{ content: t\.full_text, colSpan: 5, styles: \{ fontStyle: 'italic', halign: 'center' \} \}\]\);\n           \} else \{\n              kurikulumBody\.push\(\[\n                 t\.grade,\n                 t\.s1_hafalan,\n                 t\.s1_ummi,\n                 t\.s2_hafalan,\n                 t\.s2_ummi\n              \]\);\n           \}\n        \}\);\n        \n        autoTable\(pdf, \{\n           startY: startY,\n           head: \[\n              \['Kelas', 'Smt Ganjil: Hafalan', 'Smt Ganjil: Ummi', 'Smt Genap: Hafalan', 'Smt Genap: Ummi'\]\n           \],/g;

const replacementKurikulumPdf = `const kurikulumBody = [];
        // TARGET_KURIKULUM is defined globally in the file
        TARGET_KURIKULUM.forEach((t) => {
           if (t.full_text) {
              kurikulumBody.push([{ content: t.full_text, colSpan: 3, styles: { fontStyle: 'italic', halign: 'center' } }]);
           } else {
              kurikulumBody.push([
                 t.grade,
                 t.hafalan,
                 t.ummi
              ]);
           }
        });
        
        autoTable(pdf, {
           startY: startY,
           head: [
              ['Kelas', 'Target Hafalan Tahunan', 'Target Ummi/Tilawah Tahunan']
           ],`;

code = code.replace(regexKurikulumPdf, replacementKurikulumPdf);

fs.writeFileSync('src/components/AdminProgressReport.tsx', code);
