const fs = require('fs');
let code = fs.readFileSync('src/components/MonthlyRecap.tsx', 'utf-8');

const lines = code.split('\n');
const startIdx = lines.findIndex(l => l.includes("if (curr.type === 'hafalan') {"));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.includes("const studentList = Object.values(grouped);"));

if (startIdx === -1 || endIdx === -1) {
    console.error("Could not find start or end index");
    process.exit(1);
}

const replacement = `      if (curr.type === 'hafalan') {
        const surah = details.surah || '';
        const startStr = details.verse_start || '';
        const endStr = details.verse_end || '';
        
        // Exclude Muroja'ah (Hafalan) and Ujian from the monthly recap
        const isMurojaahOrUjian = details.status === 'Hafalan' || details.status === 'Ujian' || details.is_ujian;
        
        // Ensure the label clearly shows surah and verse range
        const label = \`\${surah} \${startStr}\${endStr && endStr !== startStr ? \`-\${endStr}\` : ''}\`.trim();
        const displayLabel = label || '-';
        
        // Muroja'ah and Ujian still update the AWL and AKH display
        if (target.awl === '-') target.awl = displayLabel;
        target.akh = displayLabel;
        
        // But only Ziyadah (not Muroja'ah and not Ujian) adds to the total (JML)
        if (!isMurojaahOrUjian && !isExcluded) {
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
        }
      } else if (curr.type === 'ummi') {
        const level = details.level || '';
        const startStr = details.page_start || '';
        const endStr = details.page_end || '';
        
        // Improved label logic for Ummi to avoid empty "J H"
        let label = '-';
        if (level && startStr) {
          label = \`J\${level} H\${startStr}\${endStr && endStr !== startStr ? \`-\${endStr}\` : ''}\`;
        } else if (level) {
          label = \`J\${level}\`;
        } else if (startStr) {
          label = \`H\${startStr}\${endStr && endStr !== startStr ? \`-\${endStr}\` : ''}\`;
        }
          
        if (target.awl === '-') target.awl = label;
        target.akh = label;
        
        if (!isExcluded) {
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
        }
      } else if (curr.type === 'tilawah') {
        const juz = details.juz || '';
        const surah = details.surah || '';
        const startStr = details.verse_start || '';
        const endStr = details.verse_end || '';
        const label = startStr 
          ? \`\${juz ? \`J\${juz} \` : ''}\${surah} \${startStr}\${endStr && endStr !== startStr ? \`-\${endStr}\` : ''}\` 
          : (surah || (juz ? \`Juz \${juz}\` : '-'));
          
        if (target.awl === '-') target.awl = label;
        target.akh = label;
        
        if (!isExcluded) {
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
        }
      }
      
      return acc;
    }, {});
    
    // Compute JML for all
    Object.values(grouped).forEach((s: any) => {
      s.hafalan.jml = s.hafalan.set.size + s.hafalan.fallbackJml;
      s.ummi.jml = s.ummi.set.size + s.ummi.fallbackJml;
      s.tilawah.jml = s.tilawah.set.size + s.tilawah.fallbackJml;
    });

    const studentList = Object.values(grouped);`;

const newLines = [
    ...lines.slice(0, startIdx),
    replacement,
    ...lines.slice(endIdx + 1)
];

fs.writeFileSync('src/components/MonthlyRecap.tsx', newLines.join('\n'));
console.log('Patched properly');
