const fs = require('fs');
let code = fs.readFileSync('src/components/MonthlyRecap.tsx', 'utf-8');

code = code.replace(
  /const count = \(\!isNaN\(end\) && end >= start\) \? \(end - start \+ 1\) : 1;/g,
  "const count = (!isNaN(end)) ? (Math.abs(end - start) + 1) : 1;"
);

// Also for tilawah and ummi:
code = code.replace(
  /target\.jml \+= \(\!isNaN\(end\) && end >= start\) \? \(end - start \+ 1\) : 1;/g,
  "target.jml += (!isNaN(end)) ? (Math.abs(end - start) + 1) : 1;"
);

fs.writeFileSync('src/components/MonthlyRecap.tsx', code);
console.log('Patched JML math');
