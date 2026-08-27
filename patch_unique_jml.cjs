const fs = require('fs');
let code = fs.readFileSync('src/components/MonthlyRecap.tsx', 'utf-8');

// 1. Add `set: new Set(), fallbackJml: 0` to initialization
code = code.replace(
  /hafalan: \{ awl: '-', akh: '-', jml: 0 \},/g,
  "hafalan: { awl: '-', akh: '-', jml: 0, set: new Set(), fallbackJml: 0 },"
);
code = code.replace(
  /ummi: \{ awl: '-', akh: '-', jml: 0 \},/g,
  "ummi: { awl: '-', akh: '-', jml: 0, set: new Set(), fallbackJml: 0 },"
);
code = code.replace(
  /tilawah: \{ awl: '-', akh: '-', jml: 0 \},/g,
  "tilawah: { awl: '-', akh: '-', jml: 0, set: new Set(), fallbackJml: 0 },"
);

// 2. Replace Hafalan logic
const hafalanRegex = /if \(\!isMurojaahOrUjian && \!isExcluded\) \{[\s\S]*?const start = parseInt\(startStr\);[\s\S]*?const end = parseInt\(endStr\);[\s\S]*?if \(\!isNaN\(start\) && start > 0\) \{[\s\S]*?const count = \(\!isNaN\(end\)\) \? \(Math\.abs\(end - start\) \+ 1\) : 1;[\s\S]*?target\.jml \+= count;[\s\S]*?\}[\s\S]*?\}/;

const hafalanReplace = `if (!isMurojaahOrUjian && !isExcluded) {
          const start = parseInt(startStr);
          const end = parseInt(endStr);
          if (!isNaN(start) && start > 0) {
            const endNum = (!isNaN(end)) ? end : start;
            const minV = Math.min(start, endNum);
            const maxV = Math.max(start, endNum);
            for(let i=minV; i<=maxV; i++) {
              target.set.add(\`\${surah}-\${i}\`);
            }
          }
        }`;
code = code.replace(hafalanRegex, hafalanReplace);

// 3. Replace Ummi logic
const ummiRegex = /if \(\!isExcluded\) \{[\s\S]*?const start = parseInt\(startStr\);[\s\S]*?const end = parseInt\(endStr\);[\s\S]*?if \(\!isNaN\(start\) && start > 0\) \{[\s\S]*?target\.jml \+= \(\!isNaN\(end\)\) \? \(Math\.abs\(end - start\) \+ 1\) : 1;[\s\S]*?\} else if \(level && isNaN\(start\)\) \{[\s\S]*?\} else if \(level && \!startStr\) \{[\s\S]*?target\.jml \+= 1;[\s\S]*?\}[\s\S]*?\}/;

const ummiReplace = `if (!isExcluded) {
          const start = parseInt(startStr);
          const end = parseInt(endStr);
          if (!isNaN(start) && start > 0) {
            const endNum = (!isNaN(end)) ? end : start;
            const minV = Math.min(start, endNum);
            const maxV = Math.max(start, endNum);
            for(let i=minV; i<=maxV; i++) {
              target.set.add(\`J\${level}P\${i}\`);
            }
          } else if (level && isNaN(start)) {
            // text page, ignore
          } else if (level && !startStr) {
            target.fallbackJml += 1;
          }
        }`;
code = code.replace(ummiRegex, ummiReplace);

// 4. Replace Tilawah logic
const tilawahRegex = /if \(\!isExcluded\) \{[\s\S]*?const start = parseInt\(startStr\);[\s\S]*?const end = parseInt\(endStr\);[\s\S]*?if \(\!isNaN\(start\) && start > 0\) \{[\s\S]*?target\.jml \+= \(\!isNaN\(end\)\) \? \(Math\.abs\(end - start\) \+ 1\) : 1;[\s\S]*?\} else if \(surah && isNaN\(start\)\) \{[\s\S]*?\} else if \(surah && \!startStr\) \{[\s\S]*?target\.jml \+= 1;[\s\S]*?\}[\s\S]*?\}/;

const tilawahReplace = `if (!isExcluded) {
          const start = parseInt(startStr);
          const end = parseInt(endStr);
          if (!isNaN(start) && start > 0) {
            const endNum = (!isNaN(end)) ? end : start;
            const minV = Math.min(start, endNum);
            const maxV = Math.max(start, endNum);
            for(let i=minV; i<=maxV; i++) {
              target.set.add(\`J\${juz}S\${surah}V\${i}\`);
            }
          } else if (surah && isNaN(start)) {
            // text verse, ignore
          } else if (surah && !startStr) {
            target.fallbackJml += 1;
          }
        }`;
code = code.replace(tilawahRegex, tilawahReplace);

// 5. Compute JML from set size at the end of reduce!
// Find: return acc;
// We need to mutate acc right before returning it? No, wait!
// Actually, doing it after reduce is better.
// The reduce returns grouped.
// Find: const studentsArray = Object.values(grouped).map((s: any) => ({
const groupRegex = /const studentsArray = Object\.values\(grouped\)\.map\(\(s: any\) => \(\{/g;
const groupReplace = `Object.values(grouped).forEach((s: any) => {
      s.hafalan.jml = s.hafalan.set.size + s.hafalan.fallbackJml;
      s.ummi.jml = s.ummi.set.size + s.ummi.fallbackJml;
      s.tilawah.jml = s.tilawah.set.size + s.tilawah.fallbackJml;
    });
    
    const studentsArray = Object.values(grouped).map((s: any) => ({`;

code = code.replace(groupRegex, groupReplace);

fs.writeFileSync('src/components/MonthlyRecap.tsx', code);
console.log('Patched JML to use Set for accurate deduplication');
