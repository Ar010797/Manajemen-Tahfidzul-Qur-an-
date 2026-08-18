const fs = require('fs');
let code = fs.readFileSync('src/components/MonthlyRecap.tsx', 'utf-8');

const regex = /if \(!isMurojaahOrUjian\) \{([\s\S]*?)\}\n\s*\}\n\s*\} else if \(curr\.type === 'ummi'\)/;

const replace = `// Ensure the label clearly shows surah and verse range
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
            // Precise verse count: (End - Start + 1). If end is missing, count is 1.
            const count = (!isNaN(end) && end >= start) ? (end - start + 1) : 1;
            target.jml += count;
          }
        }
      } else if (curr.type === 'ummi')`;

code = code.replace(regex, replace);
fs.writeFileSync('src/components/MonthlyRecap.tsx', code);
console.log('Patched MonthlyRecap AWL/AKH logic');
