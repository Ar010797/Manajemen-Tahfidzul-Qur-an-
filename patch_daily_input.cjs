const fs = require('fs');
let code = fs.readFileSync('src/components/DailyInput.tsx', 'utf-8');

// 1. Add getNextSurah helper function
const helperRegex = /export default function DailyInput\(\) \{/;
const helperCode = `function getNextSurah(currentId: number) {
  if (currentId >= 46 && currentId <= 114) {
    if (currentId === 46) return SURAH_LIST.find(s => s.id === 1);
    return SURAH_LIST.find(s => s.id === currentId - 1);
  } else {
    if (currentId === 45) return null; // Finished everything
    return SURAH_LIST.find(s => s.id === currentId + 1);
  }
}

export default function DailyInput() {`;
code = code.replace(helperRegex, helperCode);

// 2. Patch fetchExistingDeposit
const fetchRegex = /if \(type === 'hafalan'\) \{[\s\S]*?\} else if \(type === 'ummi'\)/;
const newFetch = `if (type === 'hafalan') {
          const shouldAdvance = lastDetails.grade === 'L' || lastDetails.grade === 'CL';
          const lastEnd = parseInt(lastDetails.verse_end) || parseInt(lastDetails.verse_start) || 0;
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
                 verse_start: lastEnd ? lastEnd + 1 : '',
                 verse_end: lastEnd ? lastEnd + 1 : '',
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
code = code.replace(fetchRegex, newFetch);

fs.writeFileSync('src/components/DailyInput.tsx', code);
