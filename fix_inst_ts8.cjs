const fs = require('fs');
const file = 'src/components/InstitutionProfile.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/handleFileUpload\(e, 'watermark'\)/g, "handleFileUpload(e, 'watermark' as any)");
code = code.replace(/profile\.watermark \?/g, "(profile as any).watermark ?");
code = code.replace(/src=\{profile\.watermark\}/g, "src={(profile as any).watermark}");

fs.writeFileSync(file, code);
console.log('Fixed InstitutionProfile 8');
