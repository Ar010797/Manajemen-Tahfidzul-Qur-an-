var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var quranUtils_exports = {};
__export(quranUtils_exports, {
  CURRICULUM_ORDER: () => CURRICULUM_ORDER,
  calculateTotalHafalanFromJuzOnly: () => calculateTotalHafalanFromJuzOnly,
  calculateTotalHafalanFromNameAndAyah: () => calculateTotalHafalanFromNameAndAyah,
  juzData: () => juzData,
  parseAndCalculateTotalHafalan: () => parseAndCalculateTotalHafalan
});
module.exports = __toCommonJS(quranUtils_exports);
const juzData = {
  "1": [
    {
      "name": "Al-Faatiha",
      "start": 1,
      "end": 7
    },
    {
      "name": "Al-Baqara",
      "start": 1,
      "end": 141
    }
  ],
  "2": [
    {
      "name": "Al-Baqara",
      "start": 142,
      "end": 252
    }
  ],
  "3": [
    {
      "name": "Al-Baqara",
      "start": 253,
      "end": 286
    },
    {
      "name": "Aal-i-Imraan",
      "start": 1,
      "end": 92
    }
  ],
  "4": [
    {
      "name": "Aal-i-Imraan",
      "start": 93,
      "end": 200
    },
    {
      "name": "An-Nisaa",
      "start": 1,
      "end": 23
    }
  ],
  "5": [
    {
      "name": "An-Nisaa",
      "start": 24,
      "end": 147
    }
  ],
  "6": [
    {
      "name": "An-Nisaa",
      "start": 148,
      "end": 176
    },
    {
      "name": "Al-Maaida",
      "start": 1,
      "end": 81
    }
  ],
  "7": [
    {
      "name": "Al-Maaida",
      "start": 82,
      "end": 120
    },
    {
      "name": "Al-An'aam",
      "start": 1,
      "end": 110
    }
  ],
  "8": [
    {
      "name": "Al-An'aam",
      "start": 111,
      "end": 165
    },
    {
      "name": "Al-A'raaf",
      "start": 1,
      "end": 87
    }
  ],
  "9": [
    {
      "name": "Al-A'raaf",
      "start": 88,
      "end": 206
    },
    {
      "name": "Al-Anfaal",
      "start": 1,
      "end": 40
    }
  ],
  "10": [
    {
      "name": "Al-Anfaal",
      "start": 41,
      "end": 75
    },
    {
      "name": "At-Tawba",
      "start": 1,
      "end": 92
    }
  ],
  "11": [
    {
      "name": "At-Tawba",
      "start": 93,
      "end": 129
    },
    {
      "name": "Yunus",
      "start": 1,
      "end": 109
    },
    {
      "name": "Hud",
      "start": 1,
      "end": 5
    }
  ],
  "12": [
    {
      "name": "Hud",
      "start": 6,
      "end": 123
    },
    {
      "name": "Yusuf",
      "start": 1,
      "end": 52
    }
  ],
  "13": [
    {
      "name": "Yusuf",
      "start": 53,
      "end": 111
    },
    {
      "name": "Ar-Ra'd",
      "start": 1,
      "end": 43
    },
    {
      "name": "Ibrahim",
      "start": 1,
      "end": 52
    }
  ],
  "14": [
    {
      "name": "Al-Hijr",
      "start": 1,
      "end": 99
    },
    {
      "name": "An-Nahl",
      "start": 1,
      "end": 128
    }
  ],
  "15": [
    {
      "name": "Al-Israa",
      "start": 1,
      "end": 111
    },
    {
      "name": "Al-Kahf",
      "start": 1,
      "end": 74
    }
  ],
  "16": [
    {
      "name": "Al-Kahf",
      "start": 75,
      "end": 110
    },
    {
      "name": "Maryam",
      "start": 1,
      "end": 98
    },
    {
      "name": "Taa-Haa",
      "start": 1,
      "end": 135
    }
  ],
  "17": [
    {
      "name": "Al-Anbiyaa",
      "start": 1,
      "end": 112
    },
    {
      "name": "Al-Hajj",
      "start": 1,
      "end": 78
    }
  ],
  "18": [
    {
      "name": "Al-Muminoon",
      "start": 1,
      "end": 118
    },
    {
      "name": "An-Noor",
      "start": 1,
      "end": 64
    },
    {
      "name": "Al-Furqaan",
      "start": 1,
      "end": 20
    }
  ],
  "19": [
    {
      "name": "Al-Furqaan",
      "start": 21,
      "end": 77
    },
    {
      "name": "Ash-Shu'araa",
      "start": 1,
      "end": 227
    },
    {
      "name": "An-Naml",
      "start": 1,
      "end": 55
    }
  ],
  "20": [
    {
      "name": "An-Naml",
      "start": 56,
      "end": 93
    },
    {
      "name": "Al-Qasas",
      "start": 1,
      "end": 88
    },
    {
      "name": "Al-Ankaboot",
      "start": 1,
      "end": 45
    }
  ],
  "21": [
    {
      "name": "Al-Ankaboot",
      "start": 46,
      "end": 69
    },
    {
      "name": "Ar-Room",
      "start": 1,
      "end": 60
    },
    {
      "name": "Luqman",
      "start": 1,
      "end": 34
    },
    {
      "name": "As-Sajda",
      "start": 1,
      "end": 30
    },
    {
      "name": "Al-Ahzaab",
      "start": 1,
      "end": 30
    }
  ],
  "22": [
    {
      "name": "Al-Ahzaab",
      "start": 31,
      "end": 73
    },
    {
      "name": "Saba",
      "start": 1,
      "end": 54
    },
    {
      "name": "Faatir",
      "start": 1,
      "end": 45
    },
    {
      "name": "Yaseen",
      "start": 1,
      "end": 27
    }
  ],
  "23": [
    {
      "name": "Yaseen",
      "start": 28,
      "end": 83
    },
    {
      "name": "As-Saaffaat",
      "start": 1,
      "end": 182
    },
    {
      "name": "Saad",
      "start": 1,
      "end": 88
    },
    {
      "name": "Az-Zumar",
      "start": 1,
      "end": 31
    }
  ],
  "24": [
    {
      "name": "Az-Zumar",
      "start": 32,
      "end": 75
    },
    {
      "name": "Ghafir",
      "start": 1,
      "end": 85
    },
    {
      "name": "Fussilat",
      "start": 1,
      "end": 46
    }
  ],
  "25": [
    {
      "name": "Fussilat",
      "start": 47,
      "end": 54
    },
    {
      "name": "Ash-Shura",
      "start": 1,
      "end": 53
    },
    {
      "name": "Az-Zukhruf",
      "start": 1,
      "end": 89
    },
    {
      "name": "Ad-Dukhaan",
      "start": 1,
      "end": 59
    },
    {
      "name": "Al-Jaathiya",
      "start": 1,
      "end": 37
    }
  ],
  "26": [
    {
      "name": "Al-Ahqaf",
      "start": 1,
      "end": 35
    },
    {
      "name": "Muhammad",
      "start": 1,
      "end": 38
    },
    {
      "name": "Al-Fath",
      "start": 1,
      "end": 29
    },
    {
      "name": "Al-Hujuraat",
      "start": 1,
      "end": 18
    },
    {
      "name": "Qaaf",
      "start": 1,
      "end": 45
    },
    {
      "name": "Adh-Dhaariyat",
      "start": 1,
      "end": 30
    }
  ],
  "27": [
    {
      "name": "Adh-Dhaariyat",
      "start": 31,
      "end": 60
    },
    {
      "name": "At-Tur",
      "start": 1,
      "end": 49
    },
    {
      "name": "An-Najm",
      "start": 1,
      "end": 62
    },
    {
      "name": "Al-Qamar",
      "start": 1,
      "end": 55
    },
    {
      "name": "Ar-Rahmaan",
      "start": 1,
      "end": 78
    },
    {
      "name": "Al-Waaqia",
      "start": 1,
      "end": 96
    },
    {
      "name": "Al-Hadid",
      "start": 1,
      "end": 29
    }
  ],
  "28": [
    {
      "name": "Al-Mujaadila",
      "start": 1,
      "end": 22
    },
    {
      "name": "Al-Hashr",
      "start": 1,
      "end": 24
    },
    {
      "name": "Al-Mumtahana",
      "start": 1,
      "end": 13
    },
    {
      "name": "As-Saff",
      "start": 1,
      "end": 14
    },
    {
      "name": "Al-Jumu'a",
      "start": 1,
      "end": 11
    },
    {
      "name": "Al-Munaafiqoon",
      "start": 1,
      "end": 11
    },
    {
      "name": "At-Taghaabun",
      "start": 1,
      "end": 18
    },
    {
      "name": "At-Talaaq",
      "start": 1,
      "end": 12
    },
    {
      "name": "At-Tahrim",
      "start": 1,
      "end": 12
    }
  ],
  "29": [
    {
      "name": "Al-Mulk",
      "start": 1,
      "end": 30
    },
    {
      "name": "Al-Qalam",
      "start": 1,
      "end": 52
    },
    {
      "name": "Al-Haaqqa",
      "start": 1,
      "end": 52
    },
    {
      "name": "Al-Ma'aarij",
      "start": 1,
      "end": 44
    },
    {
      "name": "Nooh",
      "start": 1,
      "end": 28
    },
    {
      "name": "Al-Jinn",
      "start": 1,
      "end": 28
    },
    {
      "name": "Al-Muzzammil",
      "start": 1,
      "end": 20
    },
    {
      "name": "Al-Muddaththir",
      "start": 1,
      "end": 56
    },
    {
      "name": "Al-Qiyaama",
      "start": 1,
      "end": 40
    },
    {
      "name": "Al-Insaan",
      "start": 1,
      "end": 31
    },
    {
      "name": "Al-Mursalaat",
      "start": 1,
      "end": 50
    }
  ],
  "30": [
    {
      "name": "An-Naba",
      "start": 1,
      "end": 40
    },
    {
      "name": "An-Naazi'aat",
      "start": 1,
      "end": 46
    },
    {
      "name": "Abasa",
      "start": 1,
      "end": 42
    },
    {
      "name": "At-Takwir",
      "start": 1,
      "end": 29
    },
    {
      "name": "Al-Infitaar",
      "start": 1,
      "end": 19
    },
    {
      "name": "Al-Mutaffifin",
      "start": 1,
      "end": 36
    },
    {
      "name": "Al-Inshiqaaq",
      "start": 1,
      "end": 25
    },
    {
      "name": "Al-Burooj",
      "start": 1,
      "end": 22
    },
    {
      "name": "At-Taariq",
      "start": 1,
      "end": 17
    },
    {
      "name": "Al-A'laa",
      "start": 1,
      "end": 19
    },
    {
      "name": "Al-Ghaashiya",
      "start": 1,
      "end": 26
    },
    {
      "name": "Al-Fajr",
      "start": 1,
      "end": 30
    },
    {
      "name": "Al-Balad",
      "start": 1,
      "end": 20
    },
    {
      "name": "Ash-Shams",
      "start": 1,
      "end": 15
    },
    {
      "name": "Al-Lail",
      "start": 1,
      "end": 21
    },
    {
      "name": "Ad-Dhuhaa",
      "start": 1,
      "end": 11
    },
    {
      "name": "Ash-Sharh",
      "start": 1,
      "end": 8
    },
    {
      "name": "At-Tin",
      "start": 1,
      "end": 8
    },
    {
      "name": "Al-Alaq",
      "start": 1,
      "end": 19
    },
    {
      "name": "Al-Qadr",
      "start": 1,
      "end": 5
    },
    {
      "name": "Al-Bayyina",
      "start": 1,
      "end": 8
    },
    {
      "name": "Az-Zalzala",
      "start": 1,
      "end": 8
    },
    {
      "name": "Al-Aadiyaat",
      "start": 1,
      "end": 11
    },
    {
      "name": "Al-Qaari'a",
      "start": 1,
      "end": 11
    },
    {
      "name": "At-Takaathur",
      "start": 1,
      "end": 8
    },
    {
      "name": "Al-Asr",
      "start": 1,
      "end": 3
    },
    {
      "name": "Al-Humaza",
      "start": 1,
      "end": 9
    },
    {
      "name": "Al-Fil",
      "start": 1,
      "end": 5
    },
    {
      "name": "Quraish",
      "start": 1,
      "end": 4
    },
    {
      "name": "Al-Maa'un",
      "start": 1,
      "end": 7
    },
    {
      "name": "Al-Kawthar",
      "start": 1,
      "end": 3
    },
    {
      "name": "Al-Kaafiroon",
      "start": 1,
      "end": 6
    },
    {
      "name": "An-Nasr",
      "start": 1,
      "end": 3
    },
    {
      "name": "Al-Masad",
      "start": 1,
      "end": 5
    },
    {
      "name": "Al-Ikhlaas",
      "start": 1,
      "end": 4
    },
    {
      "name": "Al-Falaq",
      "start": 1,
      "end": 5
    },
    {
      "name": "An-Naas",
      "start": 1,
      "end": 6
    }
  ]
};
const CURRICULUM_ORDER = [30, 29, 28, 27, 26, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
function calculateTotalHafalanFromNameAndAyah(inputSurahStr, inputAyah, isUjian = false) {
  if (!inputSurahStr) return null;
  const normalize = (s) => s.toLowerCase().replace(/qolam/g, "qalam").replace(/takatsur/g, "takaathur").replace(/muthoffifin/g, "mutaffifin").replace(/muthaffifin/g, "mutaffifin").replace(/ghosiyah/g, "ghaashiya").replace(/ghoshiyah/g, "ghaashiya").replace(/waqiah/g, "waaqia").replace(/imron/g, "imraan").replace(/maidah/g, "maaida").replace(/baqoroh/g, "baqara").replace(/syuro/g, "shura").replace(/duha/g, "dhuhaa").replace(/thoha/g, "taahaa").replace(/jin/g, "jinn").replace(/[^a-z]/g, "").replace(/ee/g, "i").replace(/oo/g, "u").replace(/ah$/g, "a").replace(/thth/g, "ts").replace(/sh/g, "sy").replace(/dh/g, "dz").replace(/th/g, "t").replace(/kh/g, "k").replace(/gh/g, "g").replace(/q/g, "k").replace(/c/g, "k").replace(/([a-z])\1+/g, "$1").replace(/aw/g, "au");
  const normalizedInput = normalize(inputSurahStr);
  let foundJuz = -1;
  let surahListInJuz = [];
  let foundSurahIndexInJuz = -1;
  for (let j = 1; j <= 30; j++) {
    const sList = juzData[j];
    for (let i = 0; i < sList.length; i++) {
      const s = sList[i];
      const n = normalize(s.name);
      if (n === normalizedInput) {
        if (isNaN(inputAyah) || inputAyah >= s.start && inputAyah <= s.end) {
          foundJuz = j;
          surahListInJuz = sList;
          foundSurahIndexInJuz = i;
          break;
        }
      }
    }
    if (foundJuz !== -1) break;
  }
  if (foundJuz === -1) {
    let bestMatchScore = 0;
    for (let j = 1; j <= 30; j++) {
      const sList = juzData[j];
      for (let i = 0; i < sList.length; i++) {
        const s = sList[i];
        const n = normalize(s.name);
        if (n.includes(normalizedInput) || normalizedInput.includes(n)) {
          if (isNaN(inputAyah) || inputAyah >= s.start && inputAyah <= s.end) {
            const score = Math.max(n.length, normalizedInput.length);
            if (score > bestMatchScore) {
              bestMatchScore = score;
              foundJuz = j;
              surahListInJuz = sList;
              foundSurahIndexInJuz = i;
            }
          }
        }
      }
    }
  }
  if (foundJuz === -1) {
    let bestMatchScore = 0;
    for (let j = 1; j <= 30; j++) {
      const sList = juzData[j];
      for (let i = 0; i < sList.length; i++) {
        const s = sList[i];
        const n = normalize(s.name);
        if (n === normalizedInput || n.includes(normalizedInput) || normalizedInput.includes(n)) {
          const score = n === normalizedInput ? 100 : Math.max(n.length, normalizedInput.length);
          if (score > bestMatchScore) {
            bestMatchScore = score;
            foundJuz = j;
            surahListInJuz = sList;
            foundSurahIndexInJuz = i;
          }
        }
      }
    }
  }
  if (foundJuz === -1) return null;
  const currIdx = CURRICULUM_ORDER.indexOf(foundJuz);
  if (currIdx === -1) return null;
  let completedJuzCount = currIdx;
  let completedSurahsInJuzCount = foundSurahIndexInJuz;
  let ayahsMemorized = isNaN(inputAyah) ? 0 : inputAyah - surahListInJuz[foundSurahIndexInJuz].start + 1;
  if (isUjian) {
    completedSurahsInJuzCount += 1;
    ayahsMemorized = 0;
    if (completedSurahsInJuzCount >= surahListInJuz.length) {
      completedJuzCount += 1;
      completedSurahsInJuzCount = 0;
    }
  }
  return {
    juz: completedJuzCount,
    surah: completedSurahsInJuzCount,
    ayah: ayahsMemorized > 0 ? ayahsMemorized : 0
  };
}
function calculateTotalHafalanFromJuzOnly(juzNumber) {
  const currIdx = CURRICULUM_ORDER.indexOf(juzNumber);
  if (currIdx === -1) return null;
  return {
    juz: currIdx,
    surah: 0,
    ayah: 0
  };
}
function parseAndCalculateTotalHafalan(hafalanAkhStr) {
  if (!hafalanAkhStr || hafalanAkhStr === "-") return "";
  let surahStr = hafalanAkhStr;
  let ayah = NaN;
  let isUjian = false;
  if (/ujian/i.test(surahStr)) {
    isUjian = true;
    surahStr = surahStr.replace(/ujian/ig, "").trim();
  }
  let juzOnlyMatch = surahStr.trim().match(/^(?:j|juz)\s*(\d+)$/i);
  let result = null;
  if (juzOnlyMatch) {
    result = calculateTotalHafalanFromJuzOnly(parseInt(juzOnlyMatch[1]));
    if (result && isUjian) {
      result.juz += 1;
    }
  } else {
    let ayahMatch = surahStr.match(/(?:^|\s)(\d+)(?:-(\d+))?$/);
    if (ayahMatch && !surahStr.toLowerCase().startsWith("juz " + ayahMatch[1])) {
      ayah = parseInt(ayahMatch[2] || ayahMatch[1]);
      surahStr = surahStr.substring(0, ayahMatch.index).trim();
    }
    surahStr = surahStr.replace(/^J\d+\s+/, "").trim();
    surahStr = surahStr.replace(/^Juz \d+\s+/, "").trim();
    result = calculateTotalHafalanFromNameAndAyah(surahStr, ayah, isUjian);
  }
  if (!result) return hafalanAkhStr;
  let parts = [];
  if (result.juz > 0) parts.push(`${result.juz} Juz`);
  if (result.surah > 0) parts.push(`${result.surah} surat`);
  if (result.ayah > 0) parts.push(`${result.ayah} ayat`);
  if (parts.length === 0) {
    return result.juz === 0 && result.surah === 0 && result.ayah === 0 ? hafalanAkhStr : "0 Juz";
  }
  return parts.join(" ");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CURRICULUM_ORDER,
  calculateTotalHafalanFromJuzOnly,
  calculateTotalHafalanFromNameAndAyah,
  juzData,
  parseAndCalculateTotalHafalan
});
