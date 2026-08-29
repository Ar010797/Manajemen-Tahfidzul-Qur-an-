const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

code = code.replace(
  `const currentMonthStr = new Date().toISOString().substring(0, 7);
            gurus.map(guru => {`,
  `gurus.map(guru => {`
);

code = code.replace(
  `const gurus = Object.keys(globalData);`,
  `const gurus = Object.keys(globalData);\n  const currentMonthStr = new Date().toISOString().substring(0, 7);`
);

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
console.log('Fixed');
