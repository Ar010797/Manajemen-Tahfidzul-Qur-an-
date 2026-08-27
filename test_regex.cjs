const fs = require('fs');
let code = fs.readFileSync('src/components/MonthlyRecap.tsx', 'utf-8');

console.log("Found tableLayout: fixed? ", code.includes("tableLayout: 'fixed'"));
console.log("Found truncate in NAMA? ", code.includes("truncate\" style={{ borderColor: '#000000' }}>{s.name}</td>"));
console.log("Found yOffset = 0? ", code.includes("const yOffset = 0;"));

