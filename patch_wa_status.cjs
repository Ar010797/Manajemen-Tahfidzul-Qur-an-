const fs = require('fs');
let code = fs.readFileSync('src/components/DailyInput.tsx', 'utf-8');

const regex1 = /\/\/ Hafalan Segment\s+if \(hafalanData && hafalanData\.details && hafalanData\.details\.grade\) \{[\s\S]*?reportSegments\.push\([\s\S]*?\);\s*\}/;

const replacement1 = `// Hafalan Segment
    if (hafalanData && hafalanData.details && hafalanData.details.grade) {
      const d = hafalanData.details;
      const isGoodGrade = ['L', 'CL'].includes(d.grade);
      
      let currentStatus = '';
      if (d.is_ujian) {
         currentStatus = '*Ujian (Exam)*';
      } else if (isGoodGrade) {
         currentStatus = '*Ziyadah (Progressing)*';
      } else {
         currentStatus = '*Muroja\\'ah (Hafalan)*';
      }

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
      }
      reportSegments.push(\`📚 *Hafalan Al-Qur'an*\\n📌 Status: \${currentStatus}\\n📖 Materi: \${materiTitle}\\n⭐ Nilai: *\${d.grade}*\\n📝 PR: \${homework}\`);
    }`;

code = code.replace(regex1, replacement1);


const regex2 = /if \(hafalanData && hafalanData\.details && hafalanData\.details\.grade\) \{\s*hasData = true;\s*const d = hafalanData\.details;\s*const isGoodGrade = \['L', 'CL'\]\.includes\(d\.grade\);\s*let homework = '';[\s\S]*?depositNotes\.push\([\s\S]*?\);\s*\}/;

const replacement2 = `if (hafalanData && hafalanData.details && hafalanData.details.grade) {
        hasData = true;
        const d = hafalanData.details;
        const isGoodGrade = ['L', 'CL'].includes(d.grade);
        
        let currentStatus = '';
        if (d.is_ujian) {
           currentStatus = 'Ujian (Exam)';
        } else if (isGoodGrade) {
           currentStatus = 'Ziyadah (Progressing)';
        } else {
           currentStatus = 'Muroja\\'ah (Hafalan)';
        }

        let homework = '';
        let materiDesc = \`\${d.surah} (\${d.verse_start}\${d.verse_end ? '-' + d.verse_end : ''})\`;
        const surahInfo = SURAH_LIST.find(s => s.name.toLowerCase() === d.surah?.toLowerCase());

        if (d.is_ujian) {
           materiDesc = \`UJIAN \${d.surah}\`;
           if (isGoodGrade) {
              const nextSurah = surahInfo ? getNextSurah(surahInfo.id) : null;
              homework = nextSurah ? \`Lulus! Lanjut \${nextSurah.name}\` : 'Lulus!';
           } else {
              homework = \`Mengulang Ujian \${d.surah}\`;
           }
        } else {
           if (isGoodGrade) {
              const lastEnd = parseInt(d.verse_end) || parseInt(d.verse_start) || 0;
              if (surahInfo && lastEnd >= surahInfo.total_ayat) {
                 homework = \`Selesai! Besok Ujian \${d.surah}\`;
              } else {
                 const nextVerse = lastEnd ? lastEnd + 1 : '';
                 homework = \`Lanjut ayat \${nextVerse}\`;
              }
           } else {
              homework = \`Mengulang ayat \${d.verse_start}\${d.verse_end ? '-' + d.verse_end : ''}\`;
           }
        }

        depositNotes.push(\`- [\${currentStatus}] Hafalan: \${materiDesc} | Nilai: \${d.grade} | PR: \${homework}\`);
      }`;

code = code.replace(regex2, replacement2);

fs.writeFileSync('src/components/DailyInput.tsx', code);
console.log('Patched correctly');
