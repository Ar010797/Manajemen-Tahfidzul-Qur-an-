const fs = require('fs');
const file = 'src/components/InstitutionProfile.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/setProfile\(\(prev: any\) => \(\{\s*\.\.\.prev,\s*\.\.\.profile,\s*(.+?):\s*(.+?)\}\)/g, "setProfile({ ...profile, $1: $2 })");
code = code.replace(/setProfile\(\(prev: any\) => \(\{\s*\.\.\.prev,\s*([\s\S]*?)\}\);/g, "setProfile({\n$1});");

fs.writeFileSync(file, code);
console.log('Fixed InstitutionProfile 3');
