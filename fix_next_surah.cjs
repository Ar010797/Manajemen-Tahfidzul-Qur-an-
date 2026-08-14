const fs = require('fs');
let code = fs.readFileSync('src/components/DailyInput.tsx', 'utf-8');

const startIndex = code.indexOf('function getNextSurah(currentId: number)');
const endIndex = code.indexOf('export default function DailyInput() {');

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `function getNextSurah(currentId: number) {
  if (currentId >= 78 && currentId < 114) return SURAH_LIST.find(s => s.id === currentId + 1);
  if (currentId === 114) return SURAH_LIST.find(s => s.id === 67); // to Juz 29
  if (currentId >= 67 && currentId < 77) return SURAH_LIST.find(s => s.id === currentId + 1);
  if (currentId === 77) return SURAH_LIST.find(s => s.id === 58); // to Juz 28
  if (currentId >= 58 && currentId < 66) return SURAH_LIST.find(s => s.id === currentId + 1);
  if (currentId === 66) return SURAH_LIST.find(s => s.id === 51); // to Juz 27
  if (currentId >= 51 && currentId < 57) return SURAH_LIST.find(s => s.id === currentId + 1);
  if (currentId === 57) return SURAH_LIST.find(s => s.id === 46); // to Juz 26
  if (currentId >= 46 && currentId < 50) return SURAH_LIST.find(s => s.id === currentId + 1);
  if (currentId === 50) return SURAH_LIST.find(s => s.id === 1); // to Juz 1
  if (currentId >= 1 && currentId < 45) return SURAH_LIST.find(s => s.id === currentId + 1);
  return null;
}

`;

  code = code.substring(0, startIndex) + replacement + code.substring(endIndex);
  fs.writeFileSync('src/components/DailyInput.tsx', code);
}
