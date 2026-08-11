const fs = require('fs');
let code = fs.readFileSync('src/components/AdminProgressReport.tsx', 'utf-8');

const regexArr = /const TARGET_KURIKULUM = \[[\s\S]*?\}];/g;
const newArr = `const TARGET_KURIKULUM = [
  { grade: 'Kelas 1 (SD)', hafalan: 'Al Insyiqoq', ummi: 'Jilid 3 Hal 40' },
  { grade: 'Kelas 2 (SD)', hafalan: 'Al \\'Alaq', ummi: 'Jilid 6 Hal 40' },
  { grade: 'Kelas 3 (SD)', hafalan: 'Al Haqqoh', ummi: 'Lulus / Al Qur\\'an' },
  { grade: 'Kelas 4 (SD)', hafalan: 'Al Mursalat', ummi: 'Lulus / Al Qur\\'an' },
  { grade: 'Kelas 5 (SD)', hafalan: 'Al Munafiqun', ummi: 'Lulus / Al Qur\\'an' },
  { grade: 'Kelas 6 (SD)', full_text: 'Muroja\\'ah (Setoran ulang hafalan yang didapat dan memutqinkan Juz 30)' },
  { grade: 'Kelas 7 (MTS)', hafalan: 'Muroja\\'ah + Menambah 1 Juz', ummi: 'Lulus / Al Qur\\'an' },
  { grade: 'Kelas 8 (MTS)', hafalan: 'Menambah 2 Juz', ummi: 'Lulus / Al Qur\\'an' },
  { grade: 'Kelas 9 (MTS)', full_text: 'Muroja\\'ah (Memutqinkan hafalan yang didapat di kelas 7 dan 8)' }
];`;

code = code.replace(regexArr, newArr);
fs.writeFileSync('src/components/AdminProgressReport.tsx', code);
