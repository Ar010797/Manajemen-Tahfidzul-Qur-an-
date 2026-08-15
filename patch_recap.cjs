const fs = require('fs');
let code = fs.readFileSync('src/components/MonthlyRecap.tsx', 'utf-8');

const regex = /if \(curr\.type === 'hafalan'\) \{([\s\S]*?)\} else if \(curr\.type === 'ummi'\)/;

const replacement = `if (curr.type === 'hafalan') {
        const surah = details.surah || '';
        const startStr = details.verse_start || '';
        const endStr = details.verse_end || '';
        
        // Exclude Muroja'ah (Hafalan) and Ujian from the monthly recap
        const isMurojaahOrUjian = details.status === 'Hafalan' || details.status === 'Ujian' || details.is_ujian;
        
        if (!isMurojaahOrUjian) {
          // Ensure the label clearly shows surah and verse range
          const label = \`\${surah} \${startStr}\${endStr && endStr !== startStr ? \`-\${endStr}\` : ''}\`.trim();
          const displayLabel = label || '-';
          
          if (target.awl === '-') target.awl = displayLabel;
          target.akh = displayLabel;
          
          if (!isExcluded) {
            const start = parseInt(startStr);
            const end = parseInt(endStr);
            if (!isNaN(start) && start > 0) {
              // Precise verse count: (End - Start + 1). If end is missing, count is 1.
              const count = (!isNaN(end) && end >= start) ? (end - start + 1) : 1;
              target.jml += count;
            }
          }
        }
      } else if (curr.type === 'ummi')`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/MonthlyRecap.tsx', code);
console.log('Patched MonthlyRecap.tsx');
