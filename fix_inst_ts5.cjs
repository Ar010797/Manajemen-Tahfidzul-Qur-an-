const fs = require('fs');
const file = 'src/components/InstitutionProfile.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/setProfile\(\(prev: any\) => \(\{ \.\.\.profile,\s*(.+?):\s*(.+?)\}\)\)/g, "setProfile((prev: any) => ({ ...prev, $1: $2 }))");
code = code.replace(/setProfile\(\(prev: any\) => \(\{\s*\n/g, "setProfile((prev: any) => ({ ...prev,\n");

fs.writeFileSync(file, code);
console.log('Fixed InstitutionProfile 5');
