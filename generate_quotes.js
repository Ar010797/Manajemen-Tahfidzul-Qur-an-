const fs = require('fs');

const data = [
  {
    topic: "Sabar dalam Ujian",
    source: "QS. Al-Baqarah: 153",
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
    l1: [
      "Meski ujian datang silih berganti,",
      "Walau beban hidup terasa berat di hati,",
      "Jika air mata jatuh membasahi pipi,",
      "Saat jalan terasa buntu dan sepi,"
    ],
    l2: [
      "Janganlah engkau pernah bersedih hati.",
      "Ingatlah janji Allah yang pasti menanti.",
      "Ketahuilah rahmat-Nya takkan pernah henti.",
      "Sabar adalah lentera yang abadi."
    ],
    l3: [
      "Jadikan shalat sebagai tempat mengadu,",
      "Angkat kedua tanganmu dalam syahdu,",
      "Pasrahkan dirimu hanya kepada Rabb-mu,",
      "Usap dadamu dan sebut asma Tuhan-mu,"
    ],
    l4: [
      "Niscaya tenang akan menyelimuti jiwamu.",
      "Kelak surga bersiap menyambutmu.",
      "Pahala tanpa hisab akan jadi milikmu.",
      "Bersama kesulitan pasti ada langkah majumu."
    ]
  },
  {
    topic: "Rasa Syukur",
    source: "QS. Ibrahim: 7",
    arabic: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    l1: [
      "Lihatlah ke bawah untuk urusan duniawi,",
      "Tak perlu membandingkan rezeki setiap hari,",
      "Syukurilah nikmat dari Sang Ilahi,",
      "Berapapun rezeki yang kau dapati,"
    ],
    l2: [
      "Pasti hidup terasa lebih membahagiakan hati.",
      "Karena Allah membagi dengan sangat teliti.",
      "Cukupkanlah dirimu dengan yang kau miliki.",
      "Niscaya hidupmu terhindar dari rasa iri."
    ],
    l3: [
      "Lisan yang selalu mengucap alhamdulillah,",
      "Hati yang ridha atas segala anugerah,",
      "Raga yang tunduk dalam ruku' dan berserah,",
      "Jiwa yang mengerti arti bersusah payah,"
    ],
    l4: [
      "Akan mengundang limpahan rahmat dan berkah.",
      "Membuat hidup berubah menjadi lebih indah.",
      "Menjadikan setiap langkah tak kehilangan arah.",
      "Karena syukur adalah rahasia jiwa yang pasrah."
    ]
  },
  {
    topic: "Taubat dan Ampunan",
    source: "QS. Az-Zumar: 53",
    arabic: "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
    l1: [
      "Seberapa pun besar dosa di masa silam,",
      "Meski kau pernah tenggelam dalam kelam,",
      "Walau jejak noda telah tertanam,",
      "Saat dada sesak dan terasa muram,"
    ],
    l2: [
      "Jangan biarkan hatimu terus muram tenggelam.",
      "Rahmat-Nya merangkul di siang dan malam.",
      "Pintu ampunan terbuka bagi setiap alam.",
      "Kembalilah pada-Nya dengan salam."
    ],
    l3: [
      "Basahi wajahmu dengan air wudhu,",
      "Teteskan air mata taubat yang syahdu,",
      "Bersimpuhlah hamba yang merindu,",
      "Angkat tanganmu dan sebut asma Rabb-mu,"
    ],
    l4: [
      "Allah rindu mendengar lirih doamu.",
      "Dia akan membasuh bersih nodamu.",
      "Cinta kasih-Nya akan mendekapmu.",
      "Ampunan-Nya selalu seluas samudera untukmu."
    ]
  },
  {
    topic: "Tawakkal",
    source: "QS. At-Talaq: 3",
    arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    l1: [
      "Setelah lelah kau berikhtiar mencari jalan,",
      "Jika ikhtiar telah maksimal kau lakukan,",
      "Ketika semua daya telah kau kerahkan,",
      "Setelah doa dan usaha kau sejajarkan,"
    ],
    l2: [
      "Serahkan semua hasilnya pada Tuhan.",
      "Pasrahkan hati dalam rengkuhan keimanan.",
      "Tawakkal adalah puncak dari ketenangan.",
      "Percayakan takdir pada sang Maha Rahman."
    ],
    l3: [
      "Tak akan kecewa hati yang bertawakkal,",
      "Meski hasil kadang tak sesuai akal,",
      "Bukan tugas kita merisaukan hal yang kekal,",
      "Jadikan kepasrahan sebagai bekal,"
    ],
    l4: [
      "Karena rencana-Nya pasti takkan gagal.",
      "Hidup ini hanya tempat kita singgah dan tertinggal.",
      "Allah mencukupkan rezeki tanpa ada yang tercegal.",
      "Tenanglah, rahmat-Nya senantiasa takkan tanggal."
    ]
  },
  {
    topic: "Shalat Tiang Agama",
    source: "HR. Abu Daud",
    arabic: "إِنَّ أَوَّلَ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ مِنْ عَمَلِهِ صَلاتُهُ",
    l1: [
      "Sesibuk apapun urusan duniamu,",
      "Meskipun lelah membebat ragamu,",
      "Saat ujian datang menghempas jiwamu,",
      "Di saat senang maupun sedih hatimu,"
    ],
    l2: [
      "Jangan biarkan shalat luput dari waktumu.",
      "Sujudlah, rebahkan sejenak beban di pundakmu.",
      "Hanya pada-Nya engkau temukan penolongmu.",
      "Bawa keluh kesahmu dalam doa-doamu."
    ],
    l3: [
      "Shalat adalah pelita di gelapnya kubur,",
      "Mencegah diri dari perbuatan yang hancur,",
      "Membuat lisan ini senantiasa bersyukur,",
      "Membersihkan niat dari sifat yang takabbur,"
    ],
    l4: [
      "Niscaya hidupmu akan tenang dan teratur.",
      "Membawamu ke surga dengan langkah yang makmur.",
      "Menjadikan amalan lain mudah untuk diukur.",
      "Karena ia tiang kokoh yang takkan luntur."
    ]
  },
  {
    topic: "Menjernihkan Hati (Dzikir)",
    source: "QS. Ar-Ra'd: 28",
    arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    l1: [
      "Bila hati terasa sesak tak keruan,",
      "Saat gundah gulana datang merisaukan,",
      "Jika sepi menyelimuti sebuah kesendirian,",
      "Di kala pikiran pusing mencari pelarian,"
    ],
    l2: [
      "Perbanyaklah berdzikir menyebut nama Tuhan.",
      "Kalimat suci adalah penawar bagi perasaan.",
      "Jangan jauh dari sang Maha Rahman.",
      "Mengingat-Nya adalah sebuah perlindungan."
    ],
    l3: [
      "Satu tasbih mengikis debu di jiwa,",
      "Satu istighfar menghapus dosa yang terbawa,",
      "Satu tahmid mendatangkan bahagia,",
      "Satu tahlil memperkuat iman di dada,"
    ],
    l4: [
      "Hingga ketenangan hakiki kau rasakan nyata.",
      "Menyiram hati bagai embun di pagi buta.",
      "Mengingatkan bahwa dunia hanya sementara.",
      "Bersama Allah, segalanya akan baik-baik saja."
    ]
  },
  {
    topic: "Berbakti kepada Orang Tua",
    source: "QS. Luqman: 14",
    arabic: "وَوَصَّيْنَا الْإِنْسَانَ بِوَالِدَيْهِ",
    l1: [
      "Bila ingin hidup penuh dengan kemudahan,",
      "Saat kau mencari pintu sebuah kebahagiaan,",
      "Jika berharap rezeki yang berlimpahan,",
      "Di kala kau memohon sebuah perlindungan,"
    ],
    l2: [
      "Muliakanlah ayah bumdamu penuh penghormatan.",
      "Senyum mereka adalah kunci keberkahan.",
      "Jangan sekalipun kau tinggikan ucapan.",
      "Ridha mereka adalah jalan keselamatan."
    ],
    l3: [
      "Belaian ibu lebih hangat dari mentari,",
      "Peluh ayah mencari nafkah setiap hari,",
      "Kasih sayang mereka takkan pernah bisa dicari,",
      "Doa mereka penembus langit yang tak terperi,"
    ],
    l4: [
      "Kelak surga berada di bawah telapak kaki.",
      "Cintailah mereka sebelum ajal menghampiri.",
      "Cium tangannya, peluklah dengan sepenuh sanubari.",
      "Baktimu adalah harta yang kekal abadi."
    ]
  },
  {
    topic: "Hubungan Antar Sesama (Ukhuwah)",
    source: "HR. Bukhari",
    arabic: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    l1: [
      "Mari merajut kasih bersama saudara,",
      "Jangan biarkan benci tumbuh di dada,",
      "Hapus dendam yang membara tak terduga,",
      "Saling memaafkan adalah jalan utama,"
    ],
    l2: [
      "Karena mukmin itu ibarat satu raga.",
      "Senyummu pada sesama adalah sedekah bermakna.",
      "Menyambung silaturahmi perpanjang usia.",
      "Bantu sesama, Allah bantu kau di dunia."
    ],
    l3: [
      "Turunkan ego saat terjadi perselisihan,",
      "Pilih kata yang lembut dalam ucapan,",
      "Hindari prasangka tanpa sebuah pembuktian,",
      "Genggam tangannya eratkan persahabatan,"
    ],
    l4: [
      "Malaikat pun turun membawa keberkahan.",
      "Niscaya hidup rukun dalam kedamaian.",
      "Karena surga dihuni hati yang penuh kasih sayang.",
      "Pertahankan persaudaraan di atas segala perbedaan."
    ]
  },
  {
    topic: "Kejujuran dan Lisan",
    source: "HR. Muslim",
    arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    l1: [
      "Jagalah lisan agar tak melukai,",
      "Berkata jujur meski terasa pahit sekali,",
      "Setiap ucapan pasti diamati,",
      "Jangan dustai diri berulangkali,"
    ],
    l2: [
      "Karena satu dusta menuntut dusta lagi.",
      "Diam adalah emas bila ragu bicara hati.",
      "Kejujuran menuntun kita pada surgawi.",
      "Hanya kata yang baik yang pantas diberi."
    ],
    l3: [
      "Tinggalkan ghibah yang merusak nilai diri,",
      "Hindari fitnah yang membakar seisi bumi,",
      "Ubah umpatan dengan dzikir yang hakiki,",
      "Sampaikan kebenaran dengan lembut di nurani,"
    ],
    l4: [
      "Niscaya keselamatan menyertai setiap hari.",
      "Hati terhindar dari rasa pedih dan sepi.",
      "Timbangan amal kelak memberat tak terperi.",
      "Sebuah ketenangan jiwa jadi milik sejati."
    ]
  },
  {
    topic: "Dunia Hanya Sementara",
    source: "QS. Al-Hadid: 20",
    arabic: "وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا مَتَاعُ الْغُرُورِ",
    l1: [
      "Gemerlap dunia sungguh menipu mata,",
      "Harta dan tahta hanya titipan semata,",
      "Kejarlah akhirat yang abadi nyata,",
      "Jangan terpana pada fana dunia,"
    ],
    l2: [
      "Selembar kain kafan tak bersaku harta.",
      "Hanya amal shalih bekal kita ke sana.",
      "Waktu terus berputar tak pernah tertunda.",
      "Kematian pasti datang membawa cerita."
    ],
    l3: [
      "Gunakan hartamu menolong mereka yang papa,",
      "Sisihkan waktumu memetik hikmah berganda,",
      "Bangun akhirat sebelum nafas terhenti sirna,",
      "Jadikan dunia tempat menanam pahala surga,"
    ],
    l4: [
      "Maka kau akan tersenyum di hari penghisaban kelak sana.",
      "Bertemu Rasulullah di telaga yang mempesona.",
      "Menikmati nikmat yang tiada tara putusnya.",
      "Bahagia selamanya terhindar dari duka merana."
    ]
  }
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// Deterministic random to prevent changes across builds
let seed = 12345;
function random() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}
function pickRandom(arr) {
  return arr[Math.floor(random() * arr.length)];
}

let allQuotes = [];
let idCounter = 1;

for (let i = 0; i < data.length; i++) {
  const topic = data[i];
  // Generate 37 unique combinations for this topic
  let set = new Set();
  
  while (set.size < 37) {
    let i1 = Math.floor(random() * 4);
    let i2 = Math.floor(random() * 4);
    let i3 = Math.floor(random() * 4);
    let i4 = Math.floor(random() * 4);
    
    let key = i1+"-"+i2+"-"+i3+"-"+i4;
    if (!set.has(key)) {
      set.add(key);
      allQuotes.push({
        id: idCounter++,
        title: topic.topic,
        quranSource: topic.source.startsWith('QS') ? topic.source : undefined,
        hadithSource: topic.source.startsWith('HR') ? topic.source : undefined,
        arabic: topic.arabic,
        explanation: topic.l1[i1] + "\n" + topic.l2[i2] + "\n" + topic.l3[i3] + "\n" + topic.l4[i4]
      });
    }
  }
}

// Shuffle the 370 quotes so themes are mixed
for (let i = allQuotes.length - 1; i > 0; i--) {
  const j = Math.floor(random() * (i + 1));
  let temp = allQuotes[j];
  allQuotes[j] = allQuotes[i];
  allQuotes[i] = temp;
}

// Slice exactly 366 (leap year safe)
allQuotes = allQuotes.slice(0, 366);

// Rewrite allQuotes ids to be sequential
allQuotes.forEach((q, idx) => {
  q.id = idx + 1;
});

const tsCode = "export interface DailyAdvice {\n  id: number;\n  title: string;\n  explanation: string;\n  quranSource?: string;\n  hadithSource?: string;\n  arabic?: string;\n}\n\nexport const DAILY_ADVICE: DailyAdvice[] = " + JSON.stringify(allQuotes, null, 2) + ";\n\nexport const getAdviceForDay = (dayOfYear: number): DailyAdvice => {\n  const index = Math.max(0, Math.min((dayOfYear - 1) % DAILY_ADVICE.length, DAILY_ADVICE.length - 1));\n  return DAILY_ADVICE[index];\n};\n\nexport const getDayOfYear = (date: Date): number => {\n  const start = new Date(date.getFullYear(), 0, 0);\n  const diff = date.getTime() - start.getTime();\n  const oneDay = 1000 * 60 * 60 * 24;\n  return Math.floor(diff / oneDay) + 1;\n};\n";

fs.writeFileSync('src/constants/dailyAdvice.ts', tsCode, 'utf8');
console.log("Successfully generated src/constants/dailyAdvice.ts with 366 unique rhyming quotes.");
