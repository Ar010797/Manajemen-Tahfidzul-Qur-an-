import { calculateTotalHafalanFromNameAndAyah } from './src/lib/quranUtils.ts';

const testCases = [
  "Abasa", "An Naziat", "Al Muthoffifin", "Al Infitar", "Al Ghasyiyah", "Al Lail", "Ad Dhuha", 
  "Asy Syarh", "At Tin", "Al Alaq", "Al Qodr", "Al Bayyinah", "Az Zalzalah", "Al Adiyat", 
  "Al Qoriah", "At Takatsur", "Al Ashr", "Al Humazah", "Al Fiil", "Quraisy", "Al Ma'un", 
  "Al Kautsar", "Al Kafirun", "An Nashr", "Al Lahab", "Al Ikhlash", "Al Falaq", "An Nas",
  "Al Baqoroh", "Ali Imron", "Al Maidah"
];

for (const t of testCases) {
  const res = calculateTotalHafalanFromNameAndAyah(t, 1, false);
  console.log(t, '->', res ? 'OK' : 'FAIL');
}
