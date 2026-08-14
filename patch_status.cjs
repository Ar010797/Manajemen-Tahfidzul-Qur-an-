const fs = require('fs');
let code = fs.readFileSync('src/components/DailyInput.tsx', 'utf-8');

// Update fetchExistingDeposit
const fetchRegex = /if \(shouldAdvance\) \{[\s\S]*?\} else \{[\s\S]*?is_ujian: lastDetails\.is_ujian \|\| false\s*\}\);\s*\}/;

const fetchReplace = `if (shouldAdvance) {
            if (lastDetails.is_ujian || lastDetails.status === 'Ujian') {
               const nextSurah = surahInfo ? getNextSurah(surahInfo.id) : null;
               setDetails({
                  surah: nextSurah ? nextSurah.name : '',
                  verse_start: '1',
                  verse_end: '',
                  is_ujian: false,
                  status: 'Progressing'
               });
            } else if (surahInfo && lastEnd >= surahInfo.total_ayat) {
               setDetails({
                  surah: surahInfo.name,
                  verse_start: '1',
                  verse_end: surahInfo.total_ayat.toString(),
                  is_ujian: true,
                  status: 'Ujian'
               });
            } else {
               setDetails({
                 surah: lastDetails.surah,
                 verse_start: lastEnd ? (lastEnd + 1).toString() : '',
                 verse_end: '',
                 is_ujian: false,
                 status: 'Progressing'
               });
            }
          } else {
            setDetails({
              surah: lastDetails.surah,
              verse_start: lastDetails.verse_start || '',
              verse_end: lastDetails.verse_end || '',
              is_ujian: lastDetails.is_ujian || false,
              status: (lastDetails.is_ujian || lastDetails.status === 'Ujian') ? 'Ujian' : 'Hafalan'
            });
          }`;
code = code.replace(fetchRegex, fetchReplace);

// Update WA Individual
const waRegex1 = /let currentStatus = '';\s*if \(d\.is_ujian\) \{\s*currentStatus = '\*Ujian \(Exam\)\*';\s*\} else if \(isGoodGrade\) \{\s*currentStatus = '\*Ziyadah \(Progressing\)\*';\s*\} else \{\s*currentStatus = '\*Muroja\\'ah \(Hafalan\)\*';\s*\}/;

const waReplace1 = `let currentStatus = '';
      if (d.status === 'Ujian' || d.is_ujian) {
         currentStatus = '*Ujian*';
      } else if (d.status === 'Progressing' || isGoodGrade) {
         currentStatus = '*Progressing*';
      } else {
         currentStatus = '*Hafalan*';
      }`;
code = code.replace(waRegex1, waReplace1);

const waRegex1b = /if \(d\.is_ujian\) \{\s*materiTitle = `\*UJIAN SURAH \$\{d\.surah\}\*`;/;
const waReplace1b = `if (d.status === 'Ujian' || d.is_ujian) {\n         materiTitle = \`*UJIAN SURAH \${d.surah}*\`;`;
code = code.replace(waRegex1b, waReplace1b);


// Update WA Group
const waRegex2 = /let currentStatus = '';\s*if \(d\.is_ujian\) \{\s*currentStatus = 'Ujian \(Exam\)';\s*\} else if \(isGoodGrade\) \{\s*currentStatus = 'Ziyadah \(Progressing\)';\s*\} else \{\s*currentStatus = 'Muroja\\'ah \(Hafalan\)';\s*\}/;

const waReplace2 = `let currentStatus = '';
        if (d.status === 'Ujian' || d.is_ujian) {
           currentStatus = 'Ujian';
        } else if (d.status === 'Progressing' || isGoodGrade) {
           currentStatus = 'Progressing';
        } else {
           currentStatus = 'Hafalan';
        }`;
code = code.replace(waRegex2, waReplace2);

const waRegex2b = /if \(d\.is_ujian\) \{\s*materiDesc = `UJIAN \$\{d\.surah\}`;/;
const waReplace2b = `if (d.status === 'Ujian' || d.is_ujian) {\n           materiDesc = \`UJIAN \${d.surah}\`;`;
code = code.replace(waRegex2b, waReplace2b);

fs.writeFileSync('src/components/DailyInput.tsx', code);
console.log('Patched logic');
