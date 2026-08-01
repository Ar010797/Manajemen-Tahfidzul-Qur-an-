const fs = require('fs');
const file = 'vite.config.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "devOptions: {\n          enabled: false\n        },",
  "devOptions: {\n          enabled: true,\n          type: 'module',\n          navigateFallback: 'index.html'\n        },"
);

fs.writeFileSync(file, code);
console.log('Patched vite.config.ts');
