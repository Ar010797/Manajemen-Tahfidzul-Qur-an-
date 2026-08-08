const fs = require('fs');
const file = 'src/components/InstitutionProfile.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/setProfile\(\{/g, "setProfile((prev: any) => ({ ...prev, ");
code = code.replace(/setProfile\(\(\s*\.\.\.profile,\s*theme_color/g, "setProfile({ ...profile, theme_color");

fs.writeFileSync(file, code);
console.log('Fixed InstitutionProfile');
