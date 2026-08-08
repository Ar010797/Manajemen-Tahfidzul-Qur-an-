const fs = require('fs');
const file = 'src/components/AdminProgressReport.tsx';
let code = fs.readFileSync(file, 'utf8');

// There are a few edge cases: some teachers might input "surah al baqoroh" which becomes "surahalbaqoroh", or just "albaqoroh".
// To fix this globally, we should normalize the student's input properly by removing "surah", "surat", and spaces.
const regexNormalize = /normalizedHafalan = \(latestHafalan\.details\?\.surah \|\| ''\)\.toLowerCase\(\)\.replace\(\/\[\^a-z\]\/g, ''\);/;
const replaceNormalize = `normalizedHafalan = (latestHafalan.details?.surah || '').toLowerCase().replace(/[^a-z]/g, '').replace(/^(surah|surat|qs)/, '');`;

code = code.replace(regexNormalize, replaceNormalize);
fs.writeFileSync(file, code);
console.log('Normalized fix done');
