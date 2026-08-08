const fs = require('fs');
const file = 'src/components/InstitutionProfile.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/setProfile\(\{/g, "setProfile((prev: any) => ({ ...prev, ");
code = code.replace(/\}\)/g, "}))");
code = code.replace(/setProfile\(\(prev: any\) => \(\{\s*\.\.\.prev,\s*\.\.\.profile,\s*(.+?):\s*(.+?)\}\)\)/g, "setProfile((prev: any) => ({ ...prev, $1: $2 }))");

fs.writeFileSync(file, code);
console.log('Fixed InstitutionProfile 4');
