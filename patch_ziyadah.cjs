const fs = require('fs');
let code = fs.readFileSync('src/components/DailyInput.tsx', 'utf-8');

const fetchRegex = /if \(shouldAdvance\) \{[\s\S]*?\} else \{[\s\S]*?is_ujian: lastDetails\.is_ujian \|\| false,\s*status: \(lastDetails\.is_ujian \|\| lastDetails\.status === 'Ujian'\) \? 'Ujian' : 'Hafalan'\s*\}\);\s*\}/;

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
               const nextSurah = surahInfo ? getNextSurah(surahInfo.id) : null;
               setDetails({
                  surah: nextSurah ? nextSurah.name : '',
                  verse_start: '1',
                  verse_end: '',
                  is_ujian: false,
                  status: 'Progressing'
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
              is_ujian: false,
              status: 'Progressing'
            });
          }`;

code = code.replace(fetchRegex, fetchReplace);
fs.writeFileSync('src/components/DailyInput.tsx', code);
console.log('Patched');
