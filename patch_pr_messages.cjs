const fs = require('fs');
let code = fs.readFileSync('src/components/DailyInput.tsx', 'utf-8');

// --- Individual WA ---
// Hafalan
code = code.replace(
  /homework = \`Lanjut ayat berikutnya \(ayat \$\{nextVerse\}\)\`;/g,
  "homework = `Lanjut Surah ${d.surah} ayat ${nextVerse}`;"
);
code = code.replace(
  /homework = \`Mengulang ayat yang sama \(\$\{d\.verse_start\}\$\{d\.verse_end \? '-' \+ d\.verse_end : ''\}\)\`;/g,
  "homework = `Mengulang Surah ${d.surah} ayat ${d.verse_start}${d.verse_end ? '-' + d.verse_end : ''}`;"
);

// Ummi
code = code.replace(
  /homework = \`Lanjut halaman berikutnya \(hlm \$\{nextPage\}\)\`;/g,
  "homework = `Lanjut Jilid ${d.level} hlm ${nextPage}`;"
);
code = code.replace(
  /homework = \`Mengulang halaman yang sama \(hlm \$\{d\.page_start\}\$\{d\.page_end \? '-' \+ d\.page_end : ''\}\)\`;/g,
  "homework = `Mengulang Jilid ${d.level} hlm ${d.page_start}${d.page_end ? '-' + d.page_end : ''}`;"
);

// Tilawah (Individual)
code = code.replace(
  /homework = \`Lanjut ayat berikutnya \(ayat \$\{nextVerse\}\)\`;/g, // Re-runs but won't match if already replaced? Ah wait, the Tilawah one is exactly the same string? No, Tilawah says: homework = `Lanjut ayat berikutnya (ayat ${nextVerse})`; Let's check!
  "homework = `Lanjut Surah ${d.surah} ayat ${nextVerse}`;" // Wait, I already replaced this above, I should use a more precise regex if they differ.
);
// Actually, let's just do a blanket replace for the Group WA as well:
// Group Hafalan
code = code.replace(
  /homework = \`Lanjut ayat \$\{nextVerse\}\`;/g,
  "homework = `Lanjut Surah ${d.surah} ayat ${nextVerse}`;"
);
code = code.replace(
  /homework = \`Mengulang ayat \$\{d\.verse_start\}\$\{d\.verse_end \? '-' \+ d\.verse_end : ''\}\`;/g,
  "homework = `Mengulang Surah ${d.surah} ayat ${d.verse_start}${d.verse_end ? '-' + d.verse_end : ''}`;"
);

// Group Ummi
code = code.replace(
  /homework = \`Lanjut hlm \$\{nextPage\}\`;/g,
  "homework = `Lanjut Jilid ${d.level} hlm ${nextPage}`;"
);
code = code.replace(
  /homework = \`Mengulang hlm \$\{d\.page_start\}\$\{d\.page_end \? '-' \+ d\.page_end : ''\}\`;/g,
  "homework = `Mengulang Jilid ${d.level} hlm ${d.page_start}${d.page_end ? '-' + d.page_end : ''}`;"
);

fs.writeFileSync('src/components/DailyInput.tsx', code);
console.log('Patched PR messages');
