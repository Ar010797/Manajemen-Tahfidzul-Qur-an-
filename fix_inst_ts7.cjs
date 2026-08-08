const fs = require('fs');
const file = 'src/components/InstitutionProfile.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/logo: '',/g, "logo: '',\n    watermark: '',");
code = code.replace(/logo_mts: '',/g, "logo_mts: '',\n    watermark_mts: '',");

fs.writeFileSync(file, code);
console.log('Fixed InstitutionProfile 7');
