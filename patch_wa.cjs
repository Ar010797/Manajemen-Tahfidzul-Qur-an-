const fs = require('fs');
let code = fs.readFileSync('src/components/DailyInput.tsx', 'utf-8');

// 1. Patch WA Message
const waRegex = /const isGoodGrade = \['L', 'CL'\]\.includes\(d\.grade\);\n\s*let homework = '';\n\s*if \(isGoodGrade\) \{\n\s*const nextVerse = d\.verse_end \? parseInt\(d\.verse_end\) \+ 1 : \(parseInt\(d\.verse_start\) \+ 1 \|\| ''\);\n\s*homework = \`Lanjut ayat berikutnya \(ayat \$\{nextVerse\}\)\`;\n\s*\} else \{\n\s*homework = \`Mengulang ayat yang sama \(\$\{d\.verse_start\}\$\{d\.verse_end \? '-' \+ d\.verse_end : ''\}\)\`;\n\s*\}/;

const newWa = `const isGoodGrade = ['L', 'CL'].includes(d.grade);
      let homework = '';
      let materiTitle = \`Surah \${d.surah}, ayat \${d.verse_start}\${d.verse_end ? '-' + d.verse_end : ''}\`;
      
      const surahInfo = SURAH_LIST.find(s => s.name.toLowerCase() === d.surah?.toLowerCase());
      
      if (d.is_ujian) {
         materiTitle = \`*UJIAN SURAH \${d.surah}*\`;
         if (isGoodGrade) {
            const nextSurah = surahInfo ? getNextSurah(surahInfo.id) : null;
            homework = nextSurah ? \`Lulus Ujian! Lanjut ke Surah \${nextSurah.name}\` : 'Lulus Ujian!';
         } else {
            homework = \`Mengulang Ujian Surah \${d.surah}\`;
         }
      } else {
         if (isGoodGrade) {
            const lastEnd = parseInt(d.verse_end) || parseInt(d.verse_start) || 0;
            if (surahInfo && lastEnd >= surahInfo.total_ayat) {
               homework = \`Selesai Surah! Besok Ujian Surah \${d.surah}\`;
            } else {
               const nextVerse = lastEnd ? lastEnd + 1 : '';
               homework = \`Lanjut ayat berikutnya (ayat \${nextVerse})\`;
            }
         } else {
            homework = \`Mengulang ayat yang sama (\${d.verse_start}\${d.verse_end ? '-' + d.verse_end : ''})\`;
         }
      }`;

code = code.replace(waRegex, newWa);
code = code.replace(/📖 Materi: Surah \$\{d\.surah\}, ayat \$\{d\.verse_start\}\$\{d\.verse_end \? '-' \+ d\.verse_end : ''\}/, "📖 Materi: ${materiTitle}");

// Also update the UI to include the is_ujian toggle
const uiRegex = /onChange=\{e => setDetails\(\{\.\.\.details, surah: e\.target\.value\}\)\}\n\s*\/>\n\s*<\/div>\n\s*<div className="grid grid-cols-2 gap-4">/;
const newUi = `onChange={e => setDetails({...details, surah: e.target.value})}
                      />
                      <div className="flex items-center gap-3 mt-4 bg-white p-3 rounded-xl border border-stone-200">
                        <input 
                          type="checkbox" 
                          id="is_ujian"
                          checked={details.is_ujian || false}
                          onChange={e => setDetails({...details, is_ujian: e.target.checked})}
                          className="w-5 h-5 rounded text-stone-900 focus:ring-stone-900 border-stone-300"
                        />
                        <label htmlFor="is_ujian" className="text-sm font-bold text-stone-700 cursor-pointer">Setoran ini adalah Ujian Surah</label>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">`;
code = code.replace(uiRegex, newUi);

fs.writeFileSync('src/components/DailyInput.tsx', code);
