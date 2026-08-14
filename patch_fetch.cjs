const fs = require('fs');
let code = fs.readFileSync('src/components/DailyInput.tsx', 'utf-8');

const regexHafalan = /if \(type === 'hafalan'\) \{[\s\S]*?\} else if \(type === 'ummi'\)/;

const replaceHafalan = `if (type === 'hafalan') {
          const shouldAdvance = lastDetails.grade === 'L' || lastDetails.grade === 'CL';
          
          const extractLastNum = (val) => {
             if (!val) return 0;
             const match = String(val).match(/(\\d+)(?!.*\\d)/);
             return match ? parseInt(match[1]) : 0;
          };
          const lastEnd = extractLastNum(lastDetails.verse_end) || extractLastNum(lastDetails.verse_start) || 0;
          
          const surahInfo = SURAH_LIST.find(s => s.name.toLowerCase() === lastDetails.surah?.toLowerCase());
          
          if (shouldAdvance) {
            if (lastDetails.is_ujian) {
               const nextSurah = surahInfo ? getNextSurah(surahInfo.id) : null;
               setDetails({
                  surah: nextSurah ? nextSurah.name : '',
                  verse_start: '1',
                  verse_end: '',
                  is_ujian: false
               });
            } else if (surahInfo && lastEnd >= surahInfo.total_ayat) {
               setDetails({
                  surah: surahInfo.name,
                  verse_start: '1',
                  verse_end: surahInfo.total_ayat.toString(),
                  is_ujian: true
               });
            } else {
               setDetails({
                 surah: lastDetails.surah,
                 verse_start: lastEnd ? (lastEnd + 1).toString() : '',
                 verse_end: '',
                 is_ujian: false
               });
            }
          } else {
            setDetails({
              surah: lastDetails.surah,
              verse_start: lastDetails.verse_start || '',
              verse_end: lastDetails.verse_end || '',
              is_ujian: lastDetails.is_ujian || false
            });
          }
        } else if (type === 'ummi')`;

code = code.replace(regexHafalan, replaceHafalan);

const regexUmmi = /} else if \(type === 'ummi'\) \{[\s\S]*?\} else if \(type === 'tilawah'\)/;

const replaceUmmi = `} else if (type === 'ummi') {
          const shouldAdvance = lastDetails.grade === 'A' || lastDetails.grade === 'B';
          const extractLastNum = (val) => {
             if (!val) return 0;
             const match = String(val).match(/(\\d+)(?!.*\\d)/);
             return match ? parseInt(match[1]) : 0;
          };
          const lastEnd = extractLastNum(lastDetails.page_end) || extractLastNum(lastDetails.page_start) || 0;
          
          if (shouldAdvance) {
            setDetails({
              level: lastDetails.level,
              page_start: lastEnd ? (lastEnd + 1).toString() : '',
              page_end: ''
            });
          } else {
            setDetails({
              level: lastDetails.level,
              page_start: lastDetails.page_start || '',
              page_end: lastDetails.page_end || ''
            });
          }
        } else if (type === 'tilawah')`;

code = code.replace(regexUmmi, replaceUmmi);

const regexTilawah = /\} else if \(type === 'tilawah'\) \{[\s\S]*?\} else \{/;

const replaceTilawah = `} else if (type === 'tilawah') {
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
      } else {`;

code = code.replace(regexTilawah, replaceTilawah);

fs.writeFileSync('src/components/DailyInput.tsx', code);
console.log('Patched fetchExistingDeposit');
