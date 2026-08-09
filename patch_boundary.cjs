const fs = require('fs');
let code = fs.readFileSync('src/components/AdminProgressReport.tsx', 'utf-8');

const oldBoundaryLogic = `function getNextJuzBoundary(idx: number): number {
    if (idx <= 37) return 48; // move from Juz 30 to end of 29
    if (idx <= 48) return 57; // move from Juz 29 to end of 28
    if (idx <= 57) return 64; // move from Juz 28 to end of 27
    return idx + 10; // rough fallback
}`;

const newBoundaryLogic = `function getNextJuzBoundary(idx: number): number {
    if (idx < 37) return 37;
    if (idx >= 37 && idx < 48) return 48;
    if (idx >= 48 && idx < 57) return 57;
    if (idx >= 57 && idx < 64) return 64;
    return 64;
}`;

code = code.replace(oldBoundaryLogic, newBoundaryLogic);
fs.writeFileSync('src/components/AdminProgressReport.tsx', code);
