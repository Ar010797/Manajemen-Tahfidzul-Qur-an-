const Database = require('better-sqlite3');
const db = new Database('local.db');

const SURAH_PROGRESSION = [
  "", "annaba", "annaziat", "abasa", "attakwir", "alinfitar", "almuthaffifin", "alinsyiqaq", 
  "alburuj", "atthariq", "alala", "alghasyiyah", "alfajr", 
  "albalad", "asysyams", "allail", "addhuha", "asysyarh", "attin", "alalaq", 
  "alqadr", "albayyinah", "azzalzalah", "aladiyat", "alqariah", "attakatsur", "alasr", "alhumazah", "alfil", "quraisy", "almaun", "alkautsar", "alkafirun", "annasr", "almasad", "alikhlas", "alfalaq", "annas",
  "almulk", "alqalam", "alhaqqoh", "almaarij", "nuh", "aljin", "almuzammil", "almuddatsir", "alqiyamah", "alinsan", "almursalat",
  "attahrim", "atthalaq", "asshaff", "almumtahanah", "alhasyr", "almujadalah", "alhadid", "alwaqiah", "annajm", "adzdzariyat", "atthur", "qof", "alhujurat", "alfath"
];

const SURAH_ALIASES = {
  "attoriq": 9, "algosyiyah": 11, "alghosiyah": 11, "alhaqqah": 40, "alqolam": 39, "albayinah": 21,
  "alinfitor": 5, "almuthoffifin": 6, "almutaffifin": 6, "almuzzammil": 44, "almudasir": 45,
  "ashshaff": 51, "asshof": 51, "attaqabun": 50, "addzariyat": 58, "attur": 59, "qaf": 60,
  "albaqoroh": 99, "albaqarah": 99, "almaidah": 99, "aliimran": 99, "annisa": 99, "alanam": 99,
  "alaraf": 99, "alanfal": 99, "attaubah": 99, "yunus": 99, "hud": 99, "yusuf": 99, "arrad": 99,
  "ibrahim": 99, "alhijr": 99, "annahl": 99, "alisra": 99, "alkahfi": 99, "maryam": 99, "taha": 99,
  "alanbiya": 99, "alhaj": 99, "almuminun": 99, "annur": 99, "alfurqan": 99, "asysyuara": 99,
  "annaml": 99, "alqasas": 99, "alankabut": 99, "arrum": 99, "luqman": 99, "assajdah": 99,
  "alazhab": 99, "saba": 99, "fatir": 99, "yasin": 99, "yasiin": 99, "assaffat": 99, "sad": 99,
  "shod": 99, "azzumar": 99, "ghafir": 99, "fussilat": 99, "asysyura": 99, "azzukhruf": 99,
  "addukhan": 99, "aljasiyah": 99
};

function getHighestSurahIndex(rawText) {
  if (!rawText || rawText === 'Belum Ada Data' || rawText === 'Surah -') return 0;
  const text = rawText.toLowerCase().replace(/[^a-z0-9\s-]/g, '');
  const tokens = text.split(/[\s-]+/).filter(t => t !== 'surah' && t !== 'surat' && t !== 'qs' && t !== 'sampai' && t !== 'dan' && t !== 'juz');
  const fullJoined = tokens.join('');
  let maxIdx = 0;
  for (let i = 1; i < SURAH_PROGRESSION.length; i++) {
     if (fullJoined.includes(SURAH_PROGRESSION[i])) {
        if (i > maxIdx) maxIdx = i;
     }
  }
  for (const alias in SURAH_ALIASES) {
     if (fullJoined.includes(alias)) {
        if (SURAH_ALIASES[alias] > maxIdx) maxIdx = SURAH_ALIASES[alias];
     }
  }
  if (maxIdx === 0 && fullJoined.length > 3 && fullJoined.includes("juz")) maxIdx = 99;
  return maxIdx;
}

const students = db.prepare("SELECT * FROM students").all();
const halaqohs = db.prepare("SELECT * FROM halaqohs").all();
const deposits = db.prepare("SELECT * FROM deposits ORDER BY date DESC").all();

const halaqohMap = {};

students.forEach(student => {
   const studentDeposits = deposits.filter(d => d.student_id === student.id);
   const ummiDeps = studentDeposits.filter(d => d.type === 'ummi');
   const hafalanDeps = studentDeposits.filter(d => d.type === 'hafalan');
   
   const latestUmmi = ummiDeps[0];
   const latestTilawah = studentDeposits.filter(d => d.type === 'tilawah')[0];
   const latestHafalan = hafalanDeps[0];
   
   let levelScore = 0;
   if (latestTilawah && (!latestUmmi || latestTilawah.date >= latestUmmi.date)) {
      levelScore = 7;
   } else if (latestUmmi) {
      let details = {};
      try { details = JSON.parse(latestUmmi.details || '{}'); } catch(e){}
      const lvl = details.level;
      if (lvl === 'Al-Quran' || lvl == 7) levelScore = 7;
      else if (lvl) levelScore = parseInt(lvl) || 0;
   }
   
   let hafalanStr = 'Belum Ada Data';
   if (latestHafalan) {
      let details = {};
      try { details = JSON.parse(latestHafalan.details || '{}'); } catch(e){}
      hafalanStr = details.surah || '';
   }
   
   const studentSurahIdx = getHighestSurahIndex(hafalanStr);
   
   const hObj = halaqohs.find(h => h.id === student.halaqoh_id);
   const hName = hObj ? hObj.name : 'Tanpa Halaqoh';
   
   if (!halaqohMap[hName]) halaqohMap[hName] = { total: 0, achH: 0, achU: 0 };
   halaqohMap[hName].total++;
   
   let grade = 0;
   const match = hName.match(/([1-9])/);
   if (match) grade = parseInt(match[1]);
   
   let hAch = false;
   let uAch = false;
   
   if (grade > 0) {
       let tSurah = 0; let tLevel = 7;
       if (grade === 1) { tSurah = 3; tLevel = 2; }
       else if (grade === 2) { tSurah = 12; tLevel = 5; }
       else if (grade === 3) { tSurah = 37; tLevel = 7; }
       else if (grade === 4) { tSurah = 43; tLevel = 7; }
       else if (grade === 5) { tSurah = 48; tLevel = 7; }
       else if (grade >= 6) { tSurah = 1; tLevel = 7; } 
       
       hAch = studentSurahIdx >= tSurah;
       uAch = levelScore >= tLevel;
   } else {
       if (studentSurahIdx > 0) hAch = true;
       if (levelScore > 0) uAch = true;
   }
   
   if (hAch) halaqohMap[hName].achH++;
   if (uAch) halaqohMap[hName].achU++;
});

console.log("| Nama Kelas | Total Siswa | Hafalan Tercapai | Hafalan Belum | Hafalan % | Ummi Tercapai | Ummi Belum | Ummi % |");
console.log("|---|---|---|---|---|---|---|---|");
Object.keys(halaqohMap).sort((a,b) => {
   const ga = parseInt(a.match(/([1-9])/)?.[1] || 99);
   const gb = parseInt(b.match(/([1-9])/)?.[1] || 99);
   return ga - gb || a.localeCompare(b);
}).forEach(k => {
   const m = halaqohMap[k];
   const hP = Math.round((m.achH / m.total) * 100);
   const uP = Math.round((m.achU / m.total) * 100);
   console.log(`| ${k} | ${m.total} | ${m.achH} | ${m.total - m.achH} | ${hP}% | ${m.achU} | ${m.total - m.achU} | ${uP}% |`);
});
