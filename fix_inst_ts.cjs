const fs = require('fs');
const file = 'src/components/InstitutionProfile.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/theme_color: data\.theme_color \|\| 'emerald',/g, "theme_color: (data.theme_color as any) || 'emerald',");

fs.writeFileSync(file, code);
console.log('Fixed InstitutionProfile');
