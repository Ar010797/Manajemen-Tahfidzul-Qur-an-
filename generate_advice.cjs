const fs = require('fs');

const rawData = [
  {
    title: "Keikhlasan Dalam Beramal",
    quranSource: "QS. Al-Bayyinah: 5",
    arabic: "وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ",
    explanation: "Segala amal ibadah yang tak dilandasi ikhlas,\nIbarat membangun rumah di atas pasir yang lepas.\nTuluskan niat hanya untuk mengharap ridha-Nya,\nKelak pahala dan berkah akan mengalir tanpa batas."
  },
  {
    title: "Menjaga Lisan (Ghibah)",
    quranSource: "QS. Al-Hujurat: 12",
    arabic: "وَلَا يَغْتَب بَّعْضُكُم بَعْضًا",
    explanation: "Tajamnya pedang dapat menyayat raga,\nNamun tajamnya lisan menusuk hingga ke jiwa.\nTahanlah lisan dari membicarakan aib sesama,\nKarena ghibah itu memakan daging saudara."
  },
  {
    title: "Memaafkan Sesama",
    quranSource: "QS. Ali 'Imran: 134",
    arabic: "وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ",
    explanation: "Menyimpan dendam bagai menggenggam bara,\nHanya melukai diri yang menahannya.\nMaafkanlah mereka yang pernah membuatmu terluka,\nSungguh Allah mencintai hamba yang berlapang dada."
  },
  {
    title: "Menyambung Silaturahmi",
    hadithSource: "HR. Bukhari",
    arabic: "مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ، وَأَنْ يُنْسَأَ لَهُ فِي أَثَرِهِ، فَلْيَصِلْ رَحِمَهُ",
    explanation: "Bila rezeki terasa seret dan tak menentu,\nCobalah ketuk pintu kerabat yang telah lama jauh darimu.\nSilaturahmi itu merekatkan hati yang beku,\nMemanjangkan umur dan meluaskan rezekimu."
  },
  {
    title: "Mengingat Kematian",
    quranSource: "QS. Ali 'Imran: 185",
    arabic: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ",
    explanation: "Setiap jiwa pasti akan mereguk kepulangan,\nMenuju keabadian dan meninggalkan kefanaan.\nPersiapkanlah amal sebelum datangnya panggilan,\nKarena dunia ini hanyalah tempat persinggahan."
  },
  {
    title: "Sedekah Melapangkan Rezeki",
    quranSource: "QS. Saba: 39",
    arabic: "وَمَا أَنفَقْتُم مِّن شَيْءٍ فَهُوَ يُخْلِفُهُ",
    explanation: "Jangan takut miskin karena memberi,\nAllah yang Maha Kaya yang akan mengganti.\nSepercik sedekah yang kau beri saat ini,\nKelak meneduhkanmu di hari akhir nanti."
  },
  {
    title: "Doa Mustajab di Sepertiga Malam",
    hadithSource: "HR. Bukhari & Muslim",
    arabic: "يَنْزِلُ رَبُّنَا تَبَارَكَ وَتَعَالَى كُلَّ لَيْلَةٍ إِلَى السَّمَاءِ الدُّنْيَا حِينَ يَبْقَى ثُلُثُ اللَّيْلِ الآخِرُ",
    explanation: "Di kala dunia tertidur lelap dalam sunyi,\nBangunlah, bentangkan sajadahmu di malam sepi.\nSampaikan keluh kesahmu pada Sang Ilahi,\nDoa di sepertiga malam bagai anak panah yang pasti."
  },
  {
    title: "Menebar Salam",
    hadithSource: "HR. Muslim",
    arabic: "أَفْشُوا السَّلَامَ بَيْنَكُمْ",
    explanation: "Ucapkanlah salam pada yang kau kenal dan tidak kenal,\nSebuah sapaan ringan namun berpahala kekal.\nSalam menumbuhkan cinta di antara umat,\nMenyatukan hati dalam ikatan yang erat."
  },
  {
    title: "Menghormati Tetangga",
    hadithSource: "HR. Bukhari",
    arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ جَارَهُ",
    explanation: "Tetangga adalah saudara terdekat di kala duka,\nYang pertama datang bila bencana melanda.\nBerbuat baiklah dan jangan sakiti hatinya,\nItulah tanda iman yang luhur dan mulia."
  },
  {
    title: "Kasih Sayang Kepada Anak Yatim",
    hadithSource: "HR. Bukhari",
    arabic: "أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ هَكَذَا",
    explanation: "Usaplah kepala yatim dengan penuh kelembutan,\nBerikan mereka pelukan dan juga harapan.\nSiapa yang mengasihi mereka dengan ketulusan,\nKelak bersanding dengan Nabi di surga idaman."
  },
  {
    title: "Rendah Hati (Tawadhu')",
    hadithSource: "HR. Muslim",
    arabic: "وَمَا تَوَاضَعَ أَحَدٌ لِلَّهِ إِلَّا رَفَعَهُ اللَّهُ",
    explanation: "Seperti padi yang kian merunduk saat berisi,\nBegitulah jiwa yang berilmu dan rendah hati.\nJanganlah sombong menepuk dada sendiri,\nKarena Allah mengangkat derajat mereka yang tawadhu'."
  },
  {
    title: "Bersegera dalam Kebaikan",
    quranSource: "QS. Al-Baqarah: 148",
    arabic: "فَاسْتَبِقُوا الْخَيْرَاتِ",
    explanation: "Jangan menunda amal shalih hingga esok tiba,\nKarena esok belum pasti menjadi milik kita.\nBerlombalah dalam kebaikan saat raga masih bernyawa,\nSebelum datang masa penyesalan di alam baka."
  },
  {
    title: "Keutamaan Istighfar",
    quranSource: "QS. Nuh: 10-11",
    arabic: "فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا",
    explanation: "Bila jalan terasa buntu dan masalah menghimpit,\nPerbanyaklah istighfar walau hati terasa sempit.\nIa membuka pintu rezeki yang tadinya tertutup,\nMenghadirkan ketenangan dalam jiwa yang redup."
  },
  {
    title: "Menjaga Shalat Subuh",
    hadithSource: "HR. Muslim",
    arabic: "مَنْ صَلَّى الصُّبْحَ فَهُوَ فِي ذِمَّةِ اللَّهِ",
    explanation: "Udara pagi yang segar menjadi saksi,\nBagi hamba yang rela meninggalkan mimpi.\nShalat subuh menjamin dirimu dalam perlindungan Ilahi,\nMemulai hari dengan berkah yang suci."
  },
  {
    title: "Adab Berpakaian",
    quranSource: "QS. Al-A'raf: 26",
    arabic: "وَلِبَاسُ التَّقْوَىٰ ذَٰلِكَ خَيْرٌ",
    explanation: "Pakaian indah menutup aurat dan menghias raga,\nNamun ada yang lebih mulia dari sehelai sutra.\nItulah pakaian taqwa, penjaga jiwa dan etika,\nMembuatmu terhormat di mata manusia dan Pencipta."
  },
  {
    title: "Sifat Malu",
    hadithSource: "HR. Bukhari",
    arabic: "الْحَيَاءُ لَا يَأْتِي إِلَّا بِخَيْرٍ",
    explanation: "Malu berbuat maksiat di saat sendirian,\nMalu melanggar titah Sang Rahman.\nSifat malu adalah mahkota keimanan,\nYang senantiasa mendatangkan segala kebaikan."
  },
  {
    title: "Menghindari Marah",
    hadithSource: "HR. Bukhari",
    arabic: "لَا تَغْضَبْ وَلَكَ الْجَنَّةُ",
    explanation: "Amarah yang memuncak bagaikan api neraka,\nMembakar akal sehat dan merusak segala cinta.\nTahanlah emosimu, kendalikan asa,\nKarena surga menanti mereka yang sabar menjaga."
  },
  {
    title: "Membaca Al-Qur'an",
    hadithSource: "HR. Muslim",
    arabic: "اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لأَصْحَابِهِ",
    explanation: "Buku kehidupan penyejuk jiwa yang lara,\nBukan sekadar pajangan berdebu di lemari kaca.\nBacalah ayatnya, tadabburi maknanya,\nKelak ia datang sebagai pemberi syafa'at di padang mahsyar."
  },
  {
    title: "Qana'ah (Merasa Cukup)",
    hadithSource: "HR. Muslim",
    arabic: "قَدْ أَفْلَحَ مَنْ أَسْلَمَ وَرُزِقَ كَفَافًا وَقَنَّعَهُ اللَّهُ بِمَا آتَاهُ",
    explanation: "Bukan tentang seberapa banyak harta yang terkumpul,\nNamun tentang hati yang bersyukur dan tidak memukul.\nQana'ah membuat hidup terasa ringan dan damai,\nMenjadi orang kaya yang sejati nan pandai."
  },
  {
    title: "Pentingnya Doa Ibu",
    hadithSource: "HR. Tirmidzi",
    arabic: "رِضَا الرَّبِّ فِي رِضَا الْوَالِدِ وَسَخَطُ الرَّبِّ فِي سَخَطِ الْوَالِدِ",
    explanation: "Jangan pernah remehkan air mata ibumu,\nSetiap tetesnya bisa menjadi penentu nasibmu.\nDoanya sanggup menembus langit ketujuh,\nMeraih ridha-Nya, menggapai sukses yang teguh."
  }
];

const existingTitles = [
  "Sabar dalam Ujian", "Rasa Syukur", "Menjernihkan Hati (Dzikir)", "Shalat Tiang Agama", "Tawakkal", 
  "Taubat dan Ampunan", "Hubungan Antar Sesama (Ukhuwah)", "Dunia Hanya Sementara", "Kejujuran dan Lisan",
  "Berbakti kepada Orang Tua", "Berbuat Baik Pada Tetangga", "Bersedekah Seikhlas Hati", "Cinta Karena Allah",
  "Istiqomah di Jalan-Nya", "Kemulian Berprasangka Baik", "Keutamaan Menuntut Ilmu", "Khusyu' Dalam Shalat",
  "Mengelola Waktu dengan Bijak", "Menghindari Sifat Sombong", "Menjaga Pandangan (Ghadhul Basahar)"
];

// Let's create an array that blends new robust quotes with improved existing ones
const allQuotes = [
  ...rawData,
  {
    title: "Sabar dalam Ujian",
    quranSource: "QS. Al-Baqarah: 153",
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
    explanation: "Meski badai ujian datang silih berganti,\\nSabar adalah sauh agar perahu tak mati.\\nUsap dadamu dan pautkan asamu pada Ilahi,\\nDi setiap kesulitan ada kemudahan yang menanti."
  },
  {
    title: "Rasa Syukur",
    quranSource: "QS. Ibrahim: 7",
    arabic: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    explanation: "Syukurilah nikmat dari Sang Ilahi,\\nBerapapun rezeki yang kau dapati hari ini.\\nJiwa yang ruku' dalam kepasrahan dan berserah,\\nAkan mengundang turunnya beribu rahmat dan berkah."
  },
  {
    title: "Menjernihkan Hati (Dzikir)",
    quranSource: "QS. Ar-Ra'd: 28",
    arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    explanation: "Jika sepi menyelimuti jiwa dalam gulita,\\nMengingat-Nya adalah lentera di atas lentera.\\nSatu tasbih mengikis noda dan resah di dada,\\nBersama Allah, segala beban pasti sirna."
  },
  {
    title: "Shalat Tiang Agama",
    hadithSource: "HR. Abu Daud",
    arabic: "إِنَّ أَوَّلَ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ مِنْ عَمَلِهِ صَلاتُهُ",
    explanation: "Sesibuk apapun urusan duniamu melanda,\\nJangan biarkan shalat luput dari pandang mata.\\nShalat adalah pelita di gelap gulita alam baka,\\nPenentu utama saat engkau berhadapan dengan-Nya."
  },
  {
    title: "Tawakkal",
    quranSource: "QS. At-Talaq: 3",
    arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    explanation: "Jika ikhtiar maksimal sudah tercurahkan,\\nLepaskan resah, serahkan pada kekuasaan Tuhan.\\nTak akan kecewa hati yang tulus menyerahkan,\\nKarena skenario-Nya tak pernah salah tujuan."
  },
  {
    title: "Taubat dan Ampunan",
    quranSource: "QS. Az-Zumar: 53",
    arabic: "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
    explanation: "Meski tubuh pernah berlumur khilaf dan dosa,\\nPintu ampunan-Nya tak pernah tertutup selamanya.\\nTeteskan air mata taubat yang penuh makna,\\nAmpunan-Nya selalu seluas cakrawala."
  },
  {
    title: "Ukhuwah Islamiyah",
    hadithSource: "HR. Bukhari",
    arabic: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    explanation: "Hapus dendam yang membara di dalam jiwa,\\nSenyumanmu pada sesama adalah sedekah termulia.\\nGenggam tangan saudaramu eratkan ikatan cinta,\\nMalaikat pun turun merestui ukhuwah kita."
  },
  {
    title: "Dunia Hanya Sementara",
    quranSource: "QS. Al-Hadid: 20",
    arabic: "وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا مَتَاعُ الْغُرُورِ",
    explanation: "Harta, tahta, dan paras hanya titipan semata,\\nKain kafan kelak tak memiliki saku penyimpan harta.\\nBangunlah rumah abadi di surga sebelum masa tiba,\\nKelak engkau tersenyum manis di ujung usia."
  },
  {
    title: "Kejujuran dan Lisan",
    hadithSource: "HR. Muslim",
    arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    explanation: "Berkata jujur walau terkadang terasa getir di lisan,\\nHanya kata-kata bermakna yang pantas diucapkan.\\nSampaikan kebenaran dengan kelembutan dan kesabaran,\\nKelak lisanmu akan selamat dari pedihnya siksaan."
  },
  {
    title: "Berbakti kepada Orang Tua",
    quranSource: "QS. Al-Isra: 23",
    arabic: "وَبِالْوَالِدَيْنِ إِحْسَانًا",
    explanation: "Surga merunduk di bawah telapak kaki ibu,\\nDan keridhaan ayah adalah sayap kesuksesanmu.\\nRawatlah mereka selagi nafas masih menderu,\\nSebagaimana mereka merawatmu di waktu dulu."
  },
  {
    title: "Husnudzon (Berbaik Sangka)",
    hadithSource: "Hadits Qudsi HR. Bukhari",
    arabic: "أَنَا عِنْدَ ظَنِّ عَبْدِي بِي",
    explanation: "Jangan mudah mengeluh atas takdir yang pahit,\\nMungkin Allah sedang menyiapkan senyum yang legit.\\nBerbaik sangkalah pada Sang Maha Pengatur,\\nAgar hatimu damai dan tidurmu selalu nyenyak terlelap."
  },
  {
    title: "Kemuliaan Menuntut Ilmu",
    hadithSource: "HR. Muslim",
    arabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    explanation: "Ilmu adalah pelita penuntun langkah di kegelapan,\\nMengangkat derajat hamba melampaui gemerlap kekayaan.\\nTuntutlah ilmu dari buaian hingga ke liang lahat,\\nIa adalah warisan para Nabi dan bekal paling bermanfaat."
  },
  {
    title: "Khusyu' Dalam Shalat",
    quranSource: "QS. Al-Mu'minun: 1-2",
    arabic: "قَدْ أَفْلَحَ الْمُؤْمِنُونَ - الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ",
    explanation: "Menghadap kiblat jangan sekadar membalikkan badan,\\nHadirkan hatimu sepenuhnya pada Tuhan Semesta Alam.\\nShalat yang khusyu' menenangkan setiap kepanikan,\\nMenjadikan kehidupanmu selaras, tenang dan tentram."
  },
  {
    title: "Mengelola Waktu dengan Bijak",
    quranSource: "QS. Al-'Asr: 1-2",
    arabic: "وَالْعَصْرِ - إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
    explanation: "Waktu yang berlalu takkan mungkin kembali berputar,\\nJangan biarkan ia habis untuk hal yang hambar.\\nIsilah pergantian siang dan malam dengan zikir dan sabar,\\nKelak engkau tak merugi saat kiamat membakar."
  },
  {
    title: "Menghindari Sifat Sombong",
    hadithSource: "HR. Muslim",
    arabic: "لَا يَدْخُلُ الْجَنَّةَ مَنْ كَانَ فِي قَلْبِهِ مِثْقَالُ ذَرَّةٍ مِنْ كِبْرٍ",
    explanation: "Setitik debu kesombongan dalam relung hati,\\nCukup untuk menutup pintu surga dari diri ini.\\nIngatlah asalmmu yang hanya dari setetes mani,\\nDan tempat kembalimu hanyalah segunduk tanah sepi."
  },
  {
    title: "Membantu Kesulitan Saudara",
    hadithSource: "HR. Muslim",
    arabic: "وَاللَّهُ فِى عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِى عَوْنِ أَخِيهِ",
    explanation: "Ringankan tanganmu membantu mereka yang kesusahan,\\nSeburuk apapun kondisimu, jadilah perantara kebaikan.\\nSiapa yang melapangkan dada saudaranya dari kesulitan,\\nKelak Allah akan menolongnya di hari kebangkitan."
  }
];

// We want enough elements so that it can be cycled smoothly.
// The component is using a Math.random() fallback for daily advice, but initially loads by dayOfYear.
// Let's create an array of 50-100 elements. We will duplicate/cycle them to reach 366.
const finalArray = [];
let id = 1;
for (let i = 0; i < 366; i++) {
  const quote = allQuotes[i % allQuotes.length];
  // make a shallow copy and sanitize newline characters for explanation
  const finalQuote = { ...quote, id };
  finalQuote.explanation = finalQuote.explanation.replace(/\\n/g, '\n');
  finalArray.push(finalQuote);
  id++;
}

// Ensure the exported code uses proper formatting
const fileContent = `export interface DailyAdvice {
  id: number;
  title: string;
  quranSource?: string;
  hadithSource?: string;
  arabic?: string;
  explanation: string;
}

export const DAILY_ADVICE: DailyAdvice[] = ${JSON.stringify(finalArray, null, 2)};

export const getAdviceForDay = (dayOfYear: number): DailyAdvice => {
  const index = Math.max(0, Math.min((dayOfYear - 1) % DAILY_ADVICE.length, DAILY_ADVICE.length - 1));
  return DAILY_ADVICE[index];
};

export const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay) + 1;
};
`;

fs.writeFileSync('src/constants/dailyAdvice.ts', fileContent);
console.log('Successfully generated robust daily advice!');
