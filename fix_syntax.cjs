const fs = require('fs');
let code = fs.readFileSync('src/components/DailyInput.tsx', 'utf-8');

const brokenRegex = /\} else if \(type === 'tilawah'\) \{[\s\S]*?\}\s*\}\s*else \{\s*setDetails\(\{\s*juz: lastDetails\.juz,[\s\S]*?\}\);\s*\}\s*\}\s*\}\s*else \{\s*setDetails\(\{\}\);\s*\}\s*\}\s*\};/;

const fix = `} else if (type === 'tilawah') {
          const shouldAdvance = lastDetails.grade === 'A' || lastDetails.grade === 'B';
          const extractLastNum = (val) => {
             if (!val) return 0;
             const match = String(val).match(/(\\d+)(?!.*\\d)/);
             return match ? parseInt(match[1]) : 0;
          };
          const lastEnd = extractLastNum(lastDetails.verse_end) || extractLastNum(lastDetails.verse_start) || 0;
          
          if (shouldAdvance) {
            setDetails({
              juz: lastDetails.juz,
              surah: lastDetails.surah,
              verse_start: lastEnd ? (lastEnd + 1).toString() : '',
              verse_end: ''
            });
          } else {
            setDetails({
              juz: lastDetails.juz,
              surah: lastDetails.surah,
              verse_start: lastDetails.verse_start || '',
              verse_end: lastDetails.verse_end || ''
            });
          }
        }
      } else {
        setDetails({});
      }
    }
  };`;

code = code.replace(brokenRegex, fix);
fs.writeFileSync('src/components/DailyInput.tsx', code);
console.log('Fixed syntax');
