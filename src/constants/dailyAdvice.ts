export interface DailyAdvice {
  id: number;
  title: string;
  quranSource?: string;
  hadithSource?: string;
  arabic?: string;
  explanation: string;
}

export const DAILY_ADVICE: DailyAdvice[] = [
  {
    "title": "Keikhlasan Dalam Beramal",
    "quranSource": "QS. Al-Bayyinah: 5",
    "arabic": "وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ",
    "explanation": "Segala amal ibadah yang tak dilandasi ikhlas,\nIbarat membangun rumah di atas pasir yang lepas.\nTuluskan niat hanya untuk mengharap ridha-Nya,\nKelak pahala dan berkah akan mengalir tanpa batas.",
    "id": 1
  },
  {
    "title": "Menjaga Lisan (Ghibah)",
    "quranSource": "QS. Al-Hujurat: 12",
    "arabic": "وَلَا يَغْتَب بَّعْضُكُم بَعْضًا",
    "explanation": "Tajamnya pedang dapat menyayat raga,\nNamun tajamnya lisan menusuk hingga ke jiwa.\nTahanlah lisan dari membicarakan aib sesama,\nKarena ghibah itu memakan daging saudara.",
    "id": 2
  },
  {
    "title": "Memaafkan Sesama",
    "quranSource": "QS. Ali 'Imran: 134",
    "arabic": "وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ",
    "explanation": "Menyimpan dendam bagai menggenggam bara,\nHanya melukai diri yang menahannya.\nMaafkanlah mereka yang pernah membuatmu terluka,\nSungguh Allah mencintai hamba yang berlapang dada.",
    "id": 3
  },
  {
    "title": "Menyambung Silaturahmi",
    "hadithSource": "HR. Bukhari",
    "arabic": "مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ، وَأَنْ يُنْسَأَ لَهُ فِي أَثَرِهِ، فَلْيَصِلْ رَحِمَهُ",
    "explanation": "Bila rezeki terasa seret dan tak menentu,\nCobalah ketuk pintu kerabat yang telah lama jauh darimu.\nSilaturahmi itu merekatkan hati yang beku,\nMemanjangkan umur dan meluaskan rezekimu.",
    "id": 4
  },
  {
    "title": "Mengingat Kematian",
    "quranSource": "QS. Ali 'Imran: 185",
    "arabic": "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ",
    "explanation": "Setiap jiwa pasti akan mereguk kepulangan,\nMenuju keabadian dan meninggalkan kefanaan.\nPersiapkanlah amal sebelum datangnya panggilan,\nKarena dunia ini hanyalah tempat persinggahan.",
    "id": 5
  },
  {
    "title": "Sedekah Melapangkan Rezeki",
    "quranSource": "QS. Saba: 39",
    "arabic": "وَمَا أَنفَقْتُم مِّن شَيْءٍ فَهُوَ يُخْلِفُهُ",
    "explanation": "Jangan takut miskin karena memberi,\nAllah yang Maha Kaya yang akan mengganti.\nSepercik sedekah yang kau beri saat ini,\nKelak meneduhkanmu di hari akhir nanti.",
    "id": 6
  },
  {
    "title": "Doa Mustajab di Sepertiga Malam",
    "hadithSource": "HR. Bukhari & Muslim",
    "arabic": "يَنْزِلُ رَبُّنَا تَبَارَكَ وَتَعَالَى كُلَّ لَيْلَةٍ إِلَى السَّمَاءِ الدُّنْيَا حِينَ يَبْقَى ثُلُثُ اللَّيْلِ الآخِرُ",
    "explanation": "Di kala dunia tertidur lelap dalam sunyi,\nBangunlah, bentangkan sajadahmu di malam sepi.\nSampaikan keluh kesahmu pada Sang Ilahi,\nDoa di sepertiga malam bagai anak panah yang pasti.",
    "id": 7
  },
  {
    "title": "Menebar Salam",
    "hadithSource": "HR. Muslim",
    "arabic": "أَفْشُوا السَّلَامَ بَيْنَكُمْ",
    "explanation": "Ucapkanlah salam pada yang kau kenal dan tidak kenal,\nSebuah sapaan ringan namun berpahala kekal.\nSalam menumbuhkan cinta di antara umat,\nMenyatukan hati dalam ikatan yang erat.",
    "id": 8
  },
  {
    "title": "Menghormati Tetangga",
    "hadithSource": "HR. Bukhari",
    "arabic": "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ جَارَهُ",
    "explanation": "Tetangga adalah saudara terdekat di kala duka,\nYang pertama datang bila bencana melanda.\nBerbuat baiklah dan jangan sakiti hatinya,\nItulah tanda iman yang luhur dan mulia.",
    "id": 9
  },
  {
    "title": "Kasih Sayang Kepada Anak Yatim",
    "hadithSource": "HR. Bukhari",
    "arabic": "أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ هَكَذَا",
    "explanation": "Usaplah kepala yatim dengan penuh kelembutan,\nBerikan mereka pelukan dan juga harapan.\nSiapa yang mengasihi mereka dengan ketulusan,\nKelak bersanding dengan Nabi di surga idaman.",
    "id": 10
  },
  {
    "title": "Rendah Hati (Tawadhu')",
    "hadithSource": "HR. Muslim",
    "arabic": "وَمَا تَوَاضَعَ أَحَدٌ لِلَّهِ إِلَّا رَفَعَهُ اللَّهُ",
    "explanation": "Seperti padi yang kian merunduk saat berisi,\nBegitulah jiwa yang berilmu dan rendah hati.\nJanganlah sombong menepuk dada sendiri,\nKarena Allah mengangkat derajat mereka yang tawadhu'.",
    "id": 11
  },
  {
    "title": "Bersegera dalam Kebaikan",
    "quranSource": "QS. Al-Baqarah: 148",
    "arabic": "فَاسْتَبِقُوا الْخَيْرَاتِ",
    "explanation": "Jangan menunda amal shalih hingga esok tiba,\nKarena esok belum pasti menjadi milik kita.\nBerlombalah dalam kebaikan saat raga masih bernyawa,\nSebelum datang masa penyesalan di alam baka.",
    "id": 12
  },
  {
    "title": "Keutamaan Istighfar",
    "quranSource": "QS. Nuh: 10-11",
    "arabic": "فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا",
    "explanation": "Bila jalan terasa buntu dan masalah menghimpit,\nPerbanyaklah istighfar walau hati terasa sempit.\nIa membuka pintu rezeki yang tadinya tertutup,\nMenghadirkan ketenangan dalam jiwa yang redup.",
    "id": 13
  },
  {
    "title": "Menjaga Shalat Subuh",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ صَلَّى الصُّبْحَ فَهُوَ فِي ذِمَّةِ اللَّهِ",
    "explanation": "Udara pagi yang segar menjadi saksi,\nBagi hamba yang rela meninggalkan mimpi.\nShalat subuh menjamin dirimu dalam perlindungan Ilahi,\nMemulai hari dengan berkah yang suci.",
    "id": 14
  },
  {
    "title": "Adab Berpakaian",
    "quranSource": "QS. Al-A'raf: 26",
    "arabic": "وَلِبَاسُ التَّقْوَىٰ ذَٰلِكَ خَيْرٌ",
    "explanation": "Pakaian indah menutup aurat dan menghias raga,\nNamun ada yang lebih mulia dari sehelai sutra.\nItulah pakaian taqwa, penjaga jiwa dan etika,\nMembuatmu terhormat di mata manusia dan Pencipta.",
    "id": 15
  },
  {
    "title": "Sifat Malu",
    "hadithSource": "HR. Bukhari",
    "arabic": "الْحَيَاءُ لَا يَأْتِي إِلَّا بِخَيْرٍ",
    "explanation": "Malu berbuat maksiat di saat sendirian,\nMalu melanggar titah Sang Rahman.\nSifat malu adalah mahkota keimanan,\nYang senantiasa mendatangkan segala kebaikan.",
    "id": 16
  },
  {
    "title": "Menghindari Marah",
    "hadithSource": "HR. Bukhari",
    "arabic": "لَا تَغْضَبْ وَلَكَ الْجَنَّةُ",
    "explanation": "Amarah yang memuncak bagaikan api neraka,\nMembakar akal sehat dan merusak segala cinta.\nTahanlah emosimu, kendalikan asa,\nKarena surga menanti mereka yang sabar menjaga.",
    "id": 17
  },
  {
    "title": "Membaca Al-Qur'an",
    "hadithSource": "HR. Muslim",
    "arabic": "اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لأَصْحَابِهِ",
    "explanation": "Buku kehidupan penyejuk jiwa yang lara,\nBukan sekadar pajangan berdebu di lemari kaca.\nBacalah ayatnya, tadabburi maknanya,\nKelak ia datang sebagai pemberi syafa'at di padang mahsyar.",
    "id": 18
  },
  {
    "title": "Qana'ah (Merasa Cukup)",
    "hadithSource": "HR. Muslim",
    "arabic": "قَدْ أَفْلَحَ مَنْ أَسْلَمَ وَرُزِقَ كَفَافًا وَقَنَّعَهُ اللَّهُ بِمَا آتَاهُ",
    "explanation": "Bukan tentang seberapa banyak harta yang terkumpul,\nNamun tentang hati yang bersyukur dan tidak memukul.\nQana'ah membuat hidup terasa ringan dan damai,\nMenjadi orang kaya yang sejati nan pandai.",
    "id": 19
  },
  {
    "title": "Pentingnya Doa Ibu",
    "hadithSource": "HR. Tirmidzi",
    "arabic": "رِضَا الرَّبِّ فِي رِضَا الْوَالِدِ وَسَخَطُ الرَّبِّ فِي سَخَطِ الْوَالِدِ",
    "explanation": "Jangan pernah remehkan air mata ibumu,\nSetiap tetesnya bisa menjadi penentu nasibmu.\nDoanya sanggup menembus langit ketujuh,\nMeraih ridha-Nya, menggapai sukses yang teguh.",
    "id": 20
  },
  {
    "title": "Sabar dalam Ujian",
    "quranSource": "QS. Al-Baqarah: 153",
    "arabic": "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
    "explanation": "Meski badai ujian datang silih berganti,\nSabar adalah sauh agar perahu tak mati.\nUsap dadamu dan pautkan asamu pada Ilahi,\nDi setiap kesulitan ada kemudahan yang menanti.",
    "id": 21
  },
  {
    "title": "Rasa Syukur",
    "quranSource": "QS. Ibrahim: 7",
    "arabic": "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    "explanation": "Syukurilah nikmat dari Sang Ilahi,\nBerapapun rezeki yang kau dapati hari ini.\nJiwa yang ruku' dalam kepasrahan dan berserah,\nAkan mengundang turunnya beribu rahmat dan berkah.",
    "id": 22
  },
  {
    "title": "Menjernihkan Hati (Dzikir)",
    "quranSource": "QS. Ar-Ra'd: 28",
    "arabic": "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    "explanation": "Jika sepi menyelimuti jiwa dalam gulita,\nMengingat-Nya adalah lentera di atas lentera.\nSatu tasbih mengikis noda dan resah di dada,\nBersama Allah, segala beban pasti sirna.",
    "id": 23
  },
  {
    "title": "Shalat Tiang Agama",
    "hadithSource": "HR. Abu Daud",
    "arabic": "إِنَّ أَوَّلَ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ مِنْ عَمَلِهِ صَلاتُهُ",
    "explanation": "Sesibuk apapun urusan duniamu melanda,\nJangan biarkan shalat luput dari pandang mata.\nShalat adalah pelita di gelap gulita alam baka,\nPenentu utama saat engkau berhadapan dengan-Nya.",
    "id": 24
  },
  {
    "title": "Tawakkal",
    "quranSource": "QS. At-Talaq: 3",
    "arabic": "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    "explanation": "Jika ikhtiar maksimal sudah tercurahkan,\nLepaskan resah, serahkan pada kekuasaan Tuhan.\nTak akan kecewa hati yang tulus menyerahkan,\nKarena skenario-Nya tak pernah salah tujuan.",
    "id": 25
  },
  {
    "title": "Taubat dan Ampunan",
    "quranSource": "QS. Az-Zumar: 53",
    "arabic": "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
    "explanation": "Meski tubuh pernah berlumur khilaf dan dosa,\nPintu ampunan-Nya tak pernah tertutup selamanya.\nTeteskan air mata taubat yang penuh makna,\nAmpunan-Nya selalu seluas cakrawala.",
    "id": 26
  },
  {
    "title": "Ukhuwah Islamiyah",
    "hadithSource": "HR. Bukhari",
    "arabic": "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    "explanation": "Hapus dendam yang membara di dalam jiwa,\nSenyumanmu pada sesama adalah sedekah termulia.\nGenggam tangan saudaramu eratkan ikatan cinta,\nMalaikat pun turun merestui ukhuwah kita.",
    "id": 27
  },
  {
    "title": "Dunia Hanya Sementara",
    "quranSource": "QS. Al-Hadid: 20",
    "arabic": "وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا مَتَاعُ الْغُرُورِ",
    "explanation": "Harta, tahta, dan paras hanya titipan semata,\nKain kafan kelak tak memiliki saku penyimpan harta.\nBangunlah rumah abadi di surga sebelum masa tiba,\nKelak engkau tersenyum manis di ujung usia.",
    "id": 28
  },
  {
    "title": "Kejujuran dan Lisan",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    "explanation": "Berkata jujur walau terkadang terasa getir di lisan,\nHanya kata-kata bermakna yang pantas diucapkan.\nSampaikan kebenaran dengan kelembutan dan kesabaran,\nKelak lisanmu akan selamat dari pedihnya siksaan.",
    "id": 29
  },
  {
    "title": "Berbakti kepada Orang Tua",
    "quranSource": "QS. Al-Isra: 23",
    "arabic": "وَبِالْوَالِدَيْنِ إِحْسَانًا",
    "explanation": "Surga merunduk di bawah telapak kaki ibu,\nDan keridhaan ayah adalah sayap kesuksesanmu.\nRawatlah mereka selagi nafas masih menderu,\nSebagaimana mereka merawatmu di waktu dulu.",
    "id": 30
  },
  {
    "title": "Husnudzon (Berbaik Sangka)",
    "hadithSource": "Hadits Qudsi HR. Bukhari",
    "arabic": "أَنَا عِنْدَ ظَنِّ عَبْدِي بِي",
    "explanation": "Jangan mudah mengeluh atas takdir yang pahit,\nMungkin Allah sedang menyiapkan senyum yang legit.\nBerbaik sangkalah pada Sang Maha Pengatur,\nAgar hatimu damai dan tidurmu selalu nyenyak terlelap.",
    "id": 31
  },
  {
    "title": "Kemuliaan Menuntut Ilmu",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    "explanation": "Ilmu adalah pelita penuntun langkah di kegelapan,\nMengangkat derajat hamba melampaui gemerlap kekayaan.\nTuntutlah ilmu dari buaian hingga ke liang lahat,\nIa adalah warisan para Nabi dan bekal paling bermanfaat.",
    "id": 32
  },
  {
    "title": "Khusyu' Dalam Shalat",
    "quranSource": "QS. Al-Mu'minun: 1-2",
    "arabic": "قَدْ أَفْلَحَ الْمُؤْمِنُونَ - الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ",
    "explanation": "Menghadap kiblat jangan sekadar membalikkan badan,\nHadirkan hatimu sepenuhnya pada Tuhan Semesta Alam.\nShalat yang khusyu' menenangkan setiap kepanikan,\nMenjadikan kehidupanmu selaras, tenang dan tentram.",
    "id": 33
  },
  {
    "title": "Mengelola Waktu dengan Bijak",
    "quranSource": "QS. Al-'Asr: 1-2",
    "arabic": "وَالْعَصْرِ - إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
    "explanation": "Waktu yang berlalu takkan mungkin kembali berputar,\nJangan biarkan ia habis untuk hal yang hambar.\nIsilah pergantian siang dan malam dengan zikir dan sabar,\nKelak engkau tak merugi saat kiamat membakar.",
    "id": 34
  },
  {
    "title": "Menghindari Sifat Sombong",
    "hadithSource": "HR. Muslim",
    "arabic": "لَا يَدْخُلُ الْجَنَّةَ مَنْ كَانَ فِي قَلْبِهِ مِثْقَالُ ذَرَّةٍ مِنْ كِبْرٍ",
    "explanation": "Setitik debu kesombongan dalam relung hati,\nCukup untuk menutup pintu surga dari diri ini.\nIngatlah asalmmu yang hanya dari setetes mani,\nDan tempat kembalimu hanyalah segunduk tanah sepi.",
    "id": 35
  },
  {
    "title": "Membantu Kesulitan Saudara",
    "hadithSource": "HR. Muslim",
    "arabic": "وَاللَّهُ فِى عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِى عَوْنِ أَخِيهِ",
    "explanation": "Ringankan tanganmu membantu mereka yang kesusahan,\nSeburuk apapun kondisimu, jadilah perantara kebaikan.\nSiapa yang melapangkan dada saudaranya dari kesulitan,\nKelak Allah akan menolongnya di hari kebangkitan.",
    "id": 36
  },
  {
    "title": "Keikhlasan Dalam Beramal",
    "quranSource": "QS. Al-Bayyinah: 5",
    "arabic": "وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ",
    "explanation": "Segala amal ibadah yang tak dilandasi ikhlas,\nIbarat membangun rumah di atas pasir yang lepas.\nTuluskan niat hanya untuk mengharap ridha-Nya,\nKelak pahala dan berkah akan mengalir tanpa batas.",
    "id": 37
  },
  {
    "title": "Menjaga Lisan (Ghibah)",
    "quranSource": "QS. Al-Hujurat: 12",
    "arabic": "وَلَا يَغْتَب بَّعْضُكُم بَعْضًا",
    "explanation": "Tajamnya pedang dapat menyayat raga,\nNamun tajamnya lisan menusuk hingga ke jiwa.\nTahanlah lisan dari membicarakan aib sesama,\nKarena ghibah itu memakan daging saudara.",
    "id": 38
  },
  {
    "title": "Memaafkan Sesama",
    "quranSource": "QS. Ali 'Imran: 134",
    "arabic": "وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ",
    "explanation": "Menyimpan dendam bagai menggenggam bara,\nHanya melukai diri yang menahannya.\nMaafkanlah mereka yang pernah membuatmu terluka,\nSungguh Allah mencintai hamba yang berlapang dada.",
    "id": 39
  },
  {
    "title": "Menyambung Silaturahmi",
    "hadithSource": "HR. Bukhari",
    "arabic": "مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ، وَأَنْ يُنْسَأَ لَهُ فِي أَثَرِهِ، فَلْيَصِلْ رَحِمَهُ",
    "explanation": "Bila rezeki terasa seret dan tak menentu,\nCobalah ketuk pintu kerabat yang telah lama jauh darimu.\nSilaturahmi itu merekatkan hati yang beku,\nMemanjangkan umur dan meluaskan rezekimu.",
    "id": 40
  },
  {
    "title": "Mengingat Kematian",
    "quranSource": "QS. Ali 'Imran: 185",
    "arabic": "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ",
    "explanation": "Setiap jiwa pasti akan mereguk kepulangan,\nMenuju keabadian dan meninggalkan kefanaan.\nPersiapkanlah amal sebelum datangnya panggilan,\nKarena dunia ini hanyalah tempat persinggahan.",
    "id": 41
  },
  {
    "title": "Sedekah Melapangkan Rezeki",
    "quranSource": "QS. Saba: 39",
    "arabic": "وَمَا أَنفَقْتُم مِّن شَيْءٍ فَهُوَ يُخْلِفُهُ",
    "explanation": "Jangan takut miskin karena memberi,\nAllah yang Maha Kaya yang akan mengganti.\nSepercik sedekah yang kau beri saat ini,\nKelak meneduhkanmu di hari akhir nanti.",
    "id": 42
  },
  {
    "title": "Doa Mustajab di Sepertiga Malam",
    "hadithSource": "HR. Bukhari & Muslim",
    "arabic": "يَنْزِلُ رَبُّنَا تَبَارَكَ وَتَعَالَى كُلَّ لَيْلَةٍ إِلَى السَّمَاءِ الدُّنْيَا حِينَ يَبْقَى ثُلُثُ اللَّيْلِ الآخِرُ",
    "explanation": "Di kala dunia tertidur lelap dalam sunyi,\nBangunlah, bentangkan sajadahmu di malam sepi.\nSampaikan keluh kesahmu pada Sang Ilahi,\nDoa di sepertiga malam bagai anak panah yang pasti.",
    "id": 43
  },
  {
    "title": "Menebar Salam",
    "hadithSource": "HR. Muslim",
    "arabic": "أَفْشُوا السَّلَامَ بَيْنَكُمْ",
    "explanation": "Ucapkanlah salam pada yang kau kenal dan tidak kenal,\nSebuah sapaan ringan namun berpahala kekal.\nSalam menumbuhkan cinta di antara umat,\nMenyatukan hati dalam ikatan yang erat.",
    "id": 44
  },
  {
    "title": "Menghormati Tetangga",
    "hadithSource": "HR. Bukhari",
    "arabic": "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ جَارَهُ",
    "explanation": "Tetangga adalah saudara terdekat di kala duka,\nYang pertama datang bila bencana melanda.\nBerbuat baiklah dan jangan sakiti hatinya,\nItulah tanda iman yang luhur dan mulia.",
    "id": 45
  },
  {
    "title": "Kasih Sayang Kepada Anak Yatim",
    "hadithSource": "HR. Bukhari",
    "arabic": "أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ هَكَذَا",
    "explanation": "Usaplah kepala yatim dengan penuh kelembutan,\nBerikan mereka pelukan dan juga harapan.\nSiapa yang mengasihi mereka dengan ketulusan,\nKelak bersanding dengan Nabi di surga idaman.",
    "id": 46
  },
  {
    "title": "Rendah Hati (Tawadhu')",
    "hadithSource": "HR. Muslim",
    "arabic": "وَمَا تَوَاضَعَ أَحَدٌ لِلَّهِ إِلَّا رَفَعَهُ اللَّهُ",
    "explanation": "Seperti padi yang kian merunduk saat berisi,\nBegitulah jiwa yang berilmu dan rendah hati.\nJanganlah sombong menepuk dada sendiri,\nKarena Allah mengangkat derajat mereka yang tawadhu'.",
    "id": 47
  },
  {
    "title": "Bersegera dalam Kebaikan",
    "quranSource": "QS. Al-Baqarah: 148",
    "arabic": "فَاسْتَبِقُوا الْخَيْرَاتِ",
    "explanation": "Jangan menunda amal shalih hingga esok tiba,\nKarena esok belum pasti menjadi milik kita.\nBerlombalah dalam kebaikan saat raga masih bernyawa,\nSebelum datang masa penyesalan di alam baka.",
    "id": 48
  },
  {
    "title": "Keutamaan Istighfar",
    "quranSource": "QS. Nuh: 10-11",
    "arabic": "فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا",
    "explanation": "Bila jalan terasa buntu dan masalah menghimpit,\nPerbanyaklah istighfar walau hati terasa sempit.\nIa membuka pintu rezeki yang tadinya tertutup,\nMenghadirkan ketenangan dalam jiwa yang redup.",
    "id": 49
  },
  {
    "title": "Menjaga Shalat Subuh",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ صَلَّى الصُّبْحَ فَهُوَ فِي ذِمَّةِ اللَّهِ",
    "explanation": "Udara pagi yang segar menjadi saksi,\nBagi hamba yang rela meninggalkan mimpi.\nShalat subuh menjamin dirimu dalam perlindungan Ilahi,\nMemulai hari dengan berkah yang suci.",
    "id": 50
  },
  {
    "title": "Adab Berpakaian",
    "quranSource": "QS. Al-A'raf: 26",
    "arabic": "وَلِبَاسُ التَّقْوَىٰ ذَٰلِكَ خَيْرٌ",
    "explanation": "Pakaian indah menutup aurat dan menghias raga,\nNamun ada yang lebih mulia dari sehelai sutra.\nItulah pakaian taqwa, penjaga jiwa dan etika,\nMembuatmu terhormat di mata manusia dan Pencipta.",
    "id": 51
  },
  {
    "title": "Sifat Malu",
    "hadithSource": "HR. Bukhari",
    "arabic": "الْحَيَاءُ لَا يَأْتِي إِلَّا بِخَيْرٍ",
    "explanation": "Malu berbuat maksiat di saat sendirian,\nMalu melanggar titah Sang Rahman.\nSifat malu adalah mahkota keimanan,\nYang senantiasa mendatangkan segala kebaikan.",
    "id": 52
  },
  {
    "title": "Menghindari Marah",
    "hadithSource": "HR. Bukhari",
    "arabic": "لَا تَغْضَبْ وَلَكَ الْجَنَّةُ",
    "explanation": "Amarah yang memuncak bagaikan api neraka,\nMembakar akal sehat dan merusak segala cinta.\nTahanlah emosimu, kendalikan asa,\nKarena surga menanti mereka yang sabar menjaga.",
    "id": 53
  },
  {
    "title": "Membaca Al-Qur'an",
    "hadithSource": "HR. Muslim",
    "arabic": "اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لأَصْحَابِهِ",
    "explanation": "Buku kehidupan penyejuk jiwa yang lara,\nBukan sekadar pajangan berdebu di lemari kaca.\nBacalah ayatnya, tadabburi maknanya,\nKelak ia datang sebagai pemberi syafa'at di padang mahsyar.",
    "id": 54
  },
  {
    "title": "Qana'ah (Merasa Cukup)",
    "hadithSource": "HR. Muslim",
    "arabic": "قَدْ أَفْلَحَ مَنْ أَسْلَمَ وَرُزِقَ كَفَافًا وَقَنَّعَهُ اللَّهُ بِمَا آتَاهُ",
    "explanation": "Bukan tentang seberapa banyak harta yang terkumpul,\nNamun tentang hati yang bersyukur dan tidak memukul.\nQana'ah membuat hidup terasa ringan dan damai,\nMenjadi orang kaya yang sejati nan pandai.",
    "id": 55
  },
  {
    "title": "Pentingnya Doa Ibu",
    "hadithSource": "HR. Tirmidzi",
    "arabic": "رِضَا الرَّبِّ فِي رِضَا الْوَالِدِ وَسَخَطُ الرَّبِّ فِي سَخَطِ الْوَالِدِ",
    "explanation": "Jangan pernah remehkan air mata ibumu,\nSetiap tetesnya bisa menjadi penentu nasibmu.\nDoanya sanggup menembus langit ketujuh,\nMeraih ridha-Nya, menggapai sukses yang teguh.",
    "id": 56
  },
  {
    "title": "Sabar dalam Ujian",
    "quranSource": "QS. Al-Baqarah: 153",
    "arabic": "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
    "explanation": "Meski badai ujian datang silih berganti,\nSabar adalah sauh agar perahu tak mati.\nUsap dadamu dan pautkan asamu pada Ilahi,\nDi setiap kesulitan ada kemudahan yang menanti.",
    "id": 57
  },
  {
    "title": "Rasa Syukur",
    "quranSource": "QS. Ibrahim: 7",
    "arabic": "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    "explanation": "Syukurilah nikmat dari Sang Ilahi,\nBerapapun rezeki yang kau dapati hari ini.\nJiwa yang ruku' dalam kepasrahan dan berserah,\nAkan mengundang turunnya beribu rahmat dan berkah.",
    "id": 58
  },
  {
    "title": "Menjernihkan Hati (Dzikir)",
    "quranSource": "QS. Ar-Ra'd: 28",
    "arabic": "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    "explanation": "Jika sepi menyelimuti jiwa dalam gulita,\nMengingat-Nya adalah lentera di atas lentera.\nSatu tasbih mengikis noda dan resah di dada,\nBersama Allah, segala beban pasti sirna.",
    "id": 59
  },
  {
    "title": "Shalat Tiang Agama",
    "hadithSource": "HR. Abu Daud",
    "arabic": "إِنَّ أَوَّلَ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ مِنْ عَمَلِهِ صَلاتُهُ",
    "explanation": "Sesibuk apapun urusan duniamu melanda,\nJangan biarkan shalat luput dari pandang mata.\nShalat adalah pelita di gelap gulita alam baka,\nPenentu utama saat engkau berhadapan dengan-Nya.",
    "id": 60
  },
  {
    "title": "Tawakkal",
    "quranSource": "QS. At-Talaq: 3",
    "arabic": "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    "explanation": "Jika ikhtiar maksimal sudah tercurahkan,\nLepaskan resah, serahkan pada kekuasaan Tuhan.\nTak akan kecewa hati yang tulus menyerahkan,\nKarena skenario-Nya tak pernah salah tujuan.",
    "id": 61
  },
  {
    "title": "Taubat dan Ampunan",
    "quranSource": "QS. Az-Zumar: 53",
    "arabic": "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
    "explanation": "Meski tubuh pernah berlumur khilaf dan dosa,\nPintu ampunan-Nya tak pernah tertutup selamanya.\nTeteskan air mata taubat yang penuh makna,\nAmpunan-Nya selalu seluas cakrawala.",
    "id": 62
  },
  {
    "title": "Ukhuwah Islamiyah",
    "hadithSource": "HR. Bukhari",
    "arabic": "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    "explanation": "Hapus dendam yang membara di dalam jiwa,\nSenyumanmu pada sesama adalah sedekah termulia.\nGenggam tangan saudaramu eratkan ikatan cinta,\nMalaikat pun turun merestui ukhuwah kita.",
    "id": 63
  },
  {
    "title": "Dunia Hanya Sementara",
    "quranSource": "QS. Al-Hadid: 20",
    "arabic": "وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا مَتَاعُ الْغُرُورِ",
    "explanation": "Harta, tahta, dan paras hanya titipan semata,\nKain kafan kelak tak memiliki saku penyimpan harta.\nBangunlah rumah abadi di surga sebelum masa tiba,\nKelak engkau tersenyum manis di ujung usia.",
    "id": 64
  },
  {
    "title": "Kejujuran dan Lisan",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    "explanation": "Berkata jujur walau terkadang terasa getir di lisan,\nHanya kata-kata bermakna yang pantas diucapkan.\nSampaikan kebenaran dengan kelembutan dan kesabaran,\nKelak lisanmu akan selamat dari pedihnya siksaan.",
    "id": 65
  },
  {
    "title": "Berbakti kepada Orang Tua",
    "quranSource": "QS. Al-Isra: 23",
    "arabic": "وَبِالْوَالِدَيْنِ إِحْسَانًا",
    "explanation": "Surga merunduk di bawah telapak kaki ibu,\nDan keridhaan ayah adalah sayap kesuksesanmu.\nRawatlah mereka selagi nafas masih menderu,\nSebagaimana mereka merawatmu di waktu dulu.",
    "id": 66
  },
  {
    "title": "Husnudzon (Berbaik Sangka)",
    "hadithSource": "Hadits Qudsi HR. Bukhari",
    "arabic": "أَنَا عِنْدَ ظَنِّ عَبْدِي بِي",
    "explanation": "Jangan mudah mengeluh atas takdir yang pahit,\nMungkin Allah sedang menyiapkan senyum yang legit.\nBerbaik sangkalah pada Sang Maha Pengatur,\nAgar hatimu damai dan tidurmu selalu nyenyak terlelap.",
    "id": 67
  },
  {
    "title": "Kemuliaan Menuntut Ilmu",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    "explanation": "Ilmu adalah pelita penuntun langkah di kegelapan,\nMengangkat derajat hamba melampaui gemerlap kekayaan.\nTuntutlah ilmu dari buaian hingga ke liang lahat,\nIa adalah warisan para Nabi dan bekal paling bermanfaat.",
    "id": 68
  },
  {
    "title": "Khusyu' Dalam Shalat",
    "quranSource": "QS. Al-Mu'minun: 1-2",
    "arabic": "قَدْ أَفْلَحَ الْمُؤْمِنُونَ - الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ",
    "explanation": "Menghadap kiblat jangan sekadar membalikkan badan,\nHadirkan hatimu sepenuhnya pada Tuhan Semesta Alam.\nShalat yang khusyu' menenangkan setiap kepanikan,\nMenjadikan kehidupanmu selaras, tenang dan tentram.",
    "id": 69
  },
  {
    "title": "Mengelola Waktu dengan Bijak",
    "quranSource": "QS. Al-'Asr: 1-2",
    "arabic": "وَالْعَصْرِ - إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
    "explanation": "Waktu yang berlalu takkan mungkin kembali berputar,\nJangan biarkan ia habis untuk hal yang hambar.\nIsilah pergantian siang dan malam dengan zikir dan sabar,\nKelak engkau tak merugi saat kiamat membakar.",
    "id": 70
  },
  {
    "title": "Menghindari Sifat Sombong",
    "hadithSource": "HR. Muslim",
    "arabic": "لَا يَدْخُلُ الْجَنَّةَ مَنْ كَانَ فِي قَلْبِهِ مِثْقَالُ ذَرَّةٍ مِنْ كِبْرٍ",
    "explanation": "Setitik debu kesombongan dalam relung hati,\nCukup untuk menutup pintu surga dari diri ini.\nIngatlah asalmmu yang hanya dari setetes mani,\nDan tempat kembalimu hanyalah segunduk tanah sepi.",
    "id": 71
  },
  {
    "title": "Membantu Kesulitan Saudara",
    "hadithSource": "HR. Muslim",
    "arabic": "وَاللَّهُ فِى عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِى عَوْنِ أَخِيهِ",
    "explanation": "Ringankan tanganmu membantu mereka yang kesusahan,\nSeburuk apapun kondisimu, jadilah perantara kebaikan.\nSiapa yang melapangkan dada saudaranya dari kesulitan,\nKelak Allah akan menolongnya di hari kebangkitan.",
    "id": 72
  },
  {
    "title": "Keikhlasan Dalam Beramal",
    "quranSource": "QS. Al-Bayyinah: 5",
    "arabic": "وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ",
    "explanation": "Segala amal ibadah yang tak dilandasi ikhlas,\nIbarat membangun rumah di atas pasir yang lepas.\nTuluskan niat hanya untuk mengharap ridha-Nya,\nKelak pahala dan berkah akan mengalir tanpa batas.",
    "id": 73
  },
  {
    "title": "Menjaga Lisan (Ghibah)",
    "quranSource": "QS. Al-Hujurat: 12",
    "arabic": "وَلَا يَغْتَب بَّعْضُكُم بَعْضًا",
    "explanation": "Tajamnya pedang dapat menyayat raga,\nNamun tajamnya lisan menusuk hingga ke jiwa.\nTahanlah lisan dari membicarakan aib sesama,\nKarena ghibah itu memakan daging saudara.",
    "id": 74
  },
  {
    "title": "Memaafkan Sesama",
    "quranSource": "QS. Ali 'Imran: 134",
    "arabic": "وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ",
    "explanation": "Menyimpan dendam bagai menggenggam bara,\nHanya melukai diri yang menahannya.\nMaafkanlah mereka yang pernah membuatmu terluka,\nSungguh Allah mencintai hamba yang berlapang dada.",
    "id": 75
  },
  {
    "title": "Menyambung Silaturahmi",
    "hadithSource": "HR. Bukhari",
    "arabic": "مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ، وَأَنْ يُنْسَأَ لَهُ فِي أَثَرِهِ، فَلْيَصِلْ رَحِمَهُ",
    "explanation": "Bila rezeki terasa seret dan tak menentu,\nCobalah ketuk pintu kerabat yang telah lama jauh darimu.\nSilaturahmi itu merekatkan hati yang beku,\nMemanjangkan umur dan meluaskan rezekimu.",
    "id": 76
  },
  {
    "title": "Mengingat Kematian",
    "quranSource": "QS. Ali 'Imran: 185",
    "arabic": "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ",
    "explanation": "Setiap jiwa pasti akan mereguk kepulangan,\nMenuju keabadian dan meninggalkan kefanaan.\nPersiapkanlah amal sebelum datangnya panggilan,\nKarena dunia ini hanyalah tempat persinggahan.",
    "id": 77
  },
  {
    "title": "Sedekah Melapangkan Rezeki",
    "quranSource": "QS. Saba: 39",
    "arabic": "وَمَا أَنفَقْتُم مِّن شَيْءٍ فَهُوَ يُخْلِفُهُ",
    "explanation": "Jangan takut miskin karena memberi,\nAllah yang Maha Kaya yang akan mengganti.\nSepercik sedekah yang kau beri saat ini,\nKelak meneduhkanmu di hari akhir nanti.",
    "id": 78
  },
  {
    "title": "Doa Mustajab di Sepertiga Malam",
    "hadithSource": "HR. Bukhari & Muslim",
    "arabic": "يَنْزِلُ رَبُّنَا تَبَارَكَ وَتَعَالَى كُلَّ لَيْلَةٍ إِلَى السَّمَاءِ الدُّنْيَا حِينَ يَبْقَى ثُلُثُ اللَّيْلِ الآخِرُ",
    "explanation": "Di kala dunia tertidur lelap dalam sunyi,\nBangunlah, bentangkan sajadahmu di malam sepi.\nSampaikan keluh kesahmu pada Sang Ilahi,\nDoa di sepertiga malam bagai anak panah yang pasti.",
    "id": 79
  },
  {
    "title": "Menebar Salam",
    "hadithSource": "HR. Muslim",
    "arabic": "أَفْشُوا السَّلَامَ بَيْنَكُمْ",
    "explanation": "Ucapkanlah salam pada yang kau kenal dan tidak kenal,\nSebuah sapaan ringan namun berpahala kekal.\nSalam menumbuhkan cinta di antara umat,\nMenyatukan hati dalam ikatan yang erat.",
    "id": 80
  },
  {
    "title": "Menghormati Tetangga",
    "hadithSource": "HR. Bukhari",
    "arabic": "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ جَارَهُ",
    "explanation": "Tetangga adalah saudara terdekat di kala duka,\nYang pertama datang bila bencana melanda.\nBerbuat baiklah dan jangan sakiti hatinya,\nItulah tanda iman yang luhur dan mulia.",
    "id": 81
  },
  {
    "title": "Kasih Sayang Kepada Anak Yatim",
    "hadithSource": "HR. Bukhari",
    "arabic": "أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ هَكَذَا",
    "explanation": "Usaplah kepala yatim dengan penuh kelembutan,\nBerikan mereka pelukan dan juga harapan.\nSiapa yang mengasihi mereka dengan ketulusan,\nKelak bersanding dengan Nabi di surga idaman.",
    "id": 82
  },
  {
    "title": "Rendah Hati (Tawadhu')",
    "hadithSource": "HR. Muslim",
    "arabic": "وَمَا تَوَاضَعَ أَحَدٌ لِلَّهِ إِلَّا رَفَعَهُ اللَّهُ",
    "explanation": "Seperti padi yang kian merunduk saat berisi,\nBegitulah jiwa yang berilmu dan rendah hati.\nJanganlah sombong menepuk dada sendiri,\nKarena Allah mengangkat derajat mereka yang tawadhu'.",
    "id": 83
  },
  {
    "title": "Bersegera dalam Kebaikan",
    "quranSource": "QS. Al-Baqarah: 148",
    "arabic": "فَاسْتَبِقُوا الْخَيْرَاتِ",
    "explanation": "Jangan menunda amal shalih hingga esok tiba,\nKarena esok belum pasti menjadi milik kita.\nBerlombalah dalam kebaikan saat raga masih bernyawa,\nSebelum datang masa penyesalan di alam baka.",
    "id": 84
  },
  {
    "title": "Keutamaan Istighfar",
    "quranSource": "QS. Nuh: 10-11",
    "arabic": "فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا",
    "explanation": "Bila jalan terasa buntu dan masalah menghimpit,\nPerbanyaklah istighfar walau hati terasa sempit.\nIa membuka pintu rezeki yang tadinya tertutup,\nMenghadirkan ketenangan dalam jiwa yang redup.",
    "id": 85
  },
  {
    "title": "Menjaga Shalat Subuh",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ صَلَّى الصُّبْحَ فَهُوَ فِي ذِمَّةِ اللَّهِ",
    "explanation": "Udara pagi yang segar menjadi saksi,\nBagi hamba yang rela meninggalkan mimpi.\nShalat subuh menjamin dirimu dalam perlindungan Ilahi,\nMemulai hari dengan berkah yang suci.",
    "id": 86
  },
  {
    "title": "Adab Berpakaian",
    "quranSource": "QS. Al-A'raf: 26",
    "arabic": "وَلِبَاسُ التَّقْوَىٰ ذَٰلِكَ خَيْرٌ",
    "explanation": "Pakaian indah menutup aurat dan menghias raga,\nNamun ada yang lebih mulia dari sehelai sutra.\nItulah pakaian taqwa, penjaga jiwa dan etika,\nMembuatmu terhormat di mata manusia dan Pencipta.",
    "id": 87
  },
  {
    "title": "Sifat Malu",
    "hadithSource": "HR. Bukhari",
    "arabic": "الْحَيَاءُ لَا يَأْتِي إِلَّا بِخَيْرٍ",
    "explanation": "Malu berbuat maksiat di saat sendirian,\nMalu melanggar titah Sang Rahman.\nSifat malu adalah mahkota keimanan,\nYang senantiasa mendatangkan segala kebaikan.",
    "id": 88
  },
  {
    "title": "Menghindari Marah",
    "hadithSource": "HR. Bukhari",
    "arabic": "لَا تَغْضَبْ وَلَكَ الْجَنَّةُ",
    "explanation": "Amarah yang memuncak bagaikan api neraka,\nMembakar akal sehat dan merusak segala cinta.\nTahanlah emosimu, kendalikan asa,\nKarena surga menanti mereka yang sabar menjaga.",
    "id": 89
  },
  {
    "title": "Membaca Al-Qur'an",
    "hadithSource": "HR. Muslim",
    "arabic": "اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لأَصْحَابِهِ",
    "explanation": "Buku kehidupan penyejuk jiwa yang lara,\nBukan sekadar pajangan berdebu di lemari kaca.\nBacalah ayatnya, tadabburi maknanya,\nKelak ia datang sebagai pemberi syafa'at di padang mahsyar.",
    "id": 90
  },
  {
    "title": "Qana'ah (Merasa Cukup)",
    "hadithSource": "HR. Muslim",
    "arabic": "قَدْ أَفْلَحَ مَنْ أَسْلَمَ وَرُزِقَ كَفَافًا وَقَنَّعَهُ اللَّهُ بِمَا آتَاهُ",
    "explanation": "Bukan tentang seberapa banyak harta yang terkumpul,\nNamun tentang hati yang bersyukur dan tidak memukul.\nQana'ah membuat hidup terasa ringan dan damai,\nMenjadi orang kaya yang sejati nan pandai.",
    "id": 91
  },
  {
    "title": "Pentingnya Doa Ibu",
    "hadithSource": "HR. Tirmidzi",
    "arabic": "رِضَا الرَّبِّ فِي رِضَا الْوَالِدِ وَسَخَطُ الرَّبِّ فِي سَخَطِ الْوَالِدِ",
    "explanation": "Jangan pernah remehkan air mata ibumu,\nSetiap tetesnya bisa menjadi penentu nasibmu.\nDoanya sanggup menembus langit ketujuh,\nMeraih ridha-Nya, menggapai sukses yang teguh.",
    "id": 92
  },
  {
    "title": "Sabar dalam Ujian",
    "quranSource": "QS. Al-Baqarah: 153",
    "arabic": "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
    "explanation": "Meski badai ujian datang silih berganti,\nSabar adalah sauh agar perahu tak mati.\nUsap dadamu dan pautkan asamu pada Ilahi,\nDi setiap kesulitan ada kemudahan yang menanti.",
    "id": 93
  },
  {
    "title": "Rasa Syukur",
    "quranSource": "QS. Ibrahim: 7",
    "arabic": "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    "explanation": "Syukurilah nikmat dari Sang Ilahi,\nBerapapun rezeki yang kau dapati hari ini.\nJiwa yang ruku' dalam kepasrahan dan berserah,\nAkan mengundang turunnya beribu rahmat dan berkah.",
    "id": 94
  },
  {
    "title": "Menjernihkan Hati (Dzikir)",
    "quranSource": "QS. Ar-Ra'd: 28",
    "arabic": "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    "explanation": "Jika sepi menyelimuti jiwa dalam gulita,\nMengingat-Nya adalah lentera di atas lentera.\nSatu tasbih mengikis noda dan resah di dada,\nBersama Allah, segala beban pasti sirna.",
    "id": 95
  },
  {
    "title": "Shalat Tiang Agama",
    "hadithSource": "HR. Abu Daud",
    "arabic": "إِنَّ أَوَّلَ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ مِنْ عَمَلِهِ صَلاتُهُ",
    "explanation": "Sesibuk apapun urusan duniamu melanda,\nJangan biarkan shalat luput dari pandang mata.\nShalat adalah pelita di gelap gulita alam baka,\nPenentu utama saat engkau berhadapan dengan-Nya.",
    "id": 96
  },
  {
    "title": "Tawakkal",
    "quranSource": "QS. At-Talaq: 3",
    "arabic": "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    "explanation": "Jika ikhtiar maksimal sudah tercurahkan,\nLepaskan resah, serahkan pada kekuasaan Tuhan.\nTak akan kecewa hati yang tulus menyerahkan,\nKarena skenario-Nya tak pernah salah tujuan.",
    "id": 97
  },
  {
    "title": "Taubat dan Ampunan",
    "quranSource": "QS. Az-Zumar: 53",
    "arabic": "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
    "explanation": "Meski tubuh pernah berlumur khilaf dan dosa,\nPintu ampunan-Nya tak pernah tertutup selamanya.\nTeteskan air mata taubat yang penuh makna,\nAmpunan-Nya selalu seluas cakrawala.",
    "id": 98
  },
  {
    "title": "Ukhuwah Islamiyah",
    "hadithSource": "HR. Bukhari",
    "arabic": "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    "explanation": "Hapus dendam yang membara di dalam jiwa,\nSenyumanmu pada sesama adalah sedekah termulia.\nGenggam tangan saudaramu eratkan ikatan cinta,\nMalaikat pun turun merestui ukhuwah kita.",
    "id": 99
  },
  {
    "title": "Dunia Hanya Sementara",
    "quranSource": "QS. Al-Hadid: 20",
    "arabic": "وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا مَتَاعُ الْغُرُورِ",
    "explanation": "Harta, tahta, dan paras hanya titipan semata,\nKain kafan kelak tak memiliki saku penyimpan harta.\nBangunlah rumah abadi di surga sebelum masa tiba,\nKelak engkau tersenyum manis di ujung usia.",
    "id": 100
  },
  {
    "title": "Kejujuran dan Lisan",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    "explanation": "Berkata jujur walau terkadang terasa getir di lisan,\nHanya kata-kata bermakna yang pantas diucapkan.\nSampaikan kebenaran dengan kelembutan dan kesabaran,\nKelak lisanmu akan selamat dari pedihnya siksaan.",
    "id": 101
  },
  {
    "title": "Berbakti kepada Orang Tua",
    "quranSource": "QS. Al-Isra: 23",
    "arabic": "وَبِالْوَالِدَيْنِ إِحْسَانًا",
    "explanation": "Surga merunduk di bawah telapak kaki ibu,\nDan keridhaan ayah adalah sayap kesuksesanmu.\nRawatlah mereka selagi nafas masih menderu,\nSebagaimana mereka merawatmu di waktu dulu.",
    "id": 102
  },
  {
    "title": "Husnudzon (Berbaik Sangka)",
    "hadithSource": "Hadits Qudsi HR. Bukhari",
    "arabic": "أَنَا عِنْدَ ظَنِّ عَبْدِي بِي",
    "explanation": "Jangan mudah mengeluh atas takdir yang pahit,\nMungkin Allah sedang menyiapkan senyum yang legit.\nBerbaik sangkalah pada Sang Maha Pengatur,\nAgar hatimu damai dan tidurmu selalu nyenyak terlelap.",
    "id": 103
  },
  {
    "title": "Kemuliaan Menuntut Ilmu",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    "explanation": "Ilmu adalah pelita penuntun langkah di kegelapan,\nMengangkat derajat hamba melampaui gemerlap kekayaan.\nTuntutlah ilmu dari buaian hingga ke liang lahat,\nIa adalah warisan para Nabi dan bekal paling bermanfaat.",
    "id": 104
  },
  {
    "title": "Khusyu' Dalam Shalat",
    "quranSource": "QS. Al-Mu'minun: 1-2",
    "arabic": "قَدْ أَفْلَحَ الْمُؤْمِنُونَ - الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ",
    "explanation": "Menghadap kiblat jangan sekadar membalikkan badan,\nHadirkan hatimu sepenuhnya pada Tuhan Semesta Alam.\nShalat yang khusyu' menenangkan setiap kepanikan,\nMenjadikan kehidupanmu selaras, tenang dan tentram.",
    "id": 105
  },
  {
    "title": "Mengelola Waktu dengan Bijak",
    "quranSource": "QS. Al-'Asr: 1-2",
    "arabic": "وَالْعَصْرِ - إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
    "explanation": "Waktu yang berlalu takkan mungkin kembali berputar,\nJangan biarkan ia habis untuk hal yang hambar.\nIsilah pergantian siang dan malam dengan zikir dan sabar,\nKelak engkau tak merugi saat kiamat membakar.",
    "id": 106
  },
  {
    "title": "Menghindari Sifat Sombong",
    "hadithSource": "HR. Muslim",
    "arabic": "لَا يَدْخُلُ الْجَنَّةَ مَنْ كَانَ فِي قَلْبِهِ مِثْقَالُ ذَرَّةٍ مِنْ كِبْرٍ",
    "explanation": "Setitik debu kesombongan dalam relung hati,\nCukup untuk menutup pintu surga dari diri ini.\nIngatlah asalmmu yang hanya dari setetes mani,\nDan tempat kembalimu hanyalah segunduk tanah sepi.",
    "id": 107
  },
  {
    "title": "Membantu Kesulitan Saudara",
    "hadithSource": "HR. Muslim",
    "arabic": "وَاللَّهُ فِى عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِى عَوْنِ أَخِيهِ",
    "explanation": "Ringankan tanganmu membantu mereka yang kesusahan,\nSeburuk apapun kondisimu, jadilah perantara kebaikan.\nSiapa yang melapangkan dada saudaranya dari kesulitan,\nKelak Allah akan menolongnya di hari kebangkitan.",
    "id": 108
  },
  {
    "title": "Keikhlasan Dalam Beramal",
    "quranSource": "QS. Al-Bayyinah: 5",
    "arabic": "وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ",
    "explanation": "Segala amal ibadah yang tak dilandasi ikhlas,\nIbarat membangun rumah di atas pasir yang lepas.\nTuluskan niat hanya untuk mengharap ridha-Nya,\nKelak pahala dan berkah akan mengalir tanpa batas.",
    "id": 109
  },
  {
    "title": "Menjaga Lisan (Ghibah)",
    "quranSource": "QS. Al-Hujurat: 12",
    "arabic": "وَلَا يَغْتَب بَّعْضُكُم بَعْضًا",
    "explanation": "Tajamnya pedang dapat menyayat raga,\nNamun tajamnya lisan menusuk hingga ke jiwa.\nTahanlah lisan dari membicarakan aib sesama,\nKarena ghibah itu memakan daging saudara.",
    "id": 110
  },
  {
    "title": "Memaafkan Sesama",
    "quranSource": "QS. Ali 'Imran: 134",
    "arabic": "وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ",
    "explanation": "Menyimpan dendam bagai menggenggam bara,\nHanya melukai diri yang menahannya.\nMaafkanlah mereka yang pernah membuatmu terluka,\nSungguh Allah mencintai hamba yang berlapang dada.",
    "id": 111
  },
  {
    "title": "Menyambung Silaturahmi",
    "hadithSource": "HR. Bukhari",
    "arabic": "مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ، وَأَنْ يُنْسَأَ لَهُ فِي أَثَرِهِ، فَلْيَصِلْ رَحِمَهُ",
    "explanation": "Bila rezeki terasa seret dan tak menentu,\nCobalah ketuk pintu kerabat yang telah lama jauh darimu.\nSilaturahmi itu merekatkan hati yang beku,\nMemanjangkan umur dan meluaskan rezekimu.",
    "id": 112
  },
  {
    "title": "Mengingat Kematian",
    "quranSource": "QS. Ali 'Imran: 185",
    "arabic": "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ",
    "explanation": "Setiap jiwa pasti akan mereguk kepulangan,\nMenuju keabadian dan meninggalkan kefanaan.\nPersiapkanlah amal sebelum datangnya panggilan,\nKarena dunia ini hanyalah tempat persinggahan.",
    "id": 113
  },
  {
    "title": "Sedekah Melapangkan Rezeki",
    "quranSource": "QS. Saba: 39",
    "arabic": "وَمَا أَنفَقْتُم مِّن شَيْءٍ فَهُوَ يُخْلِفُهُ",
    "explanation": "Jangan takut miskin karena memberi,\nAllah yang Maha Kaya yang akan mengganti.\nSepercik sedekah yang kau beri saat ini,\nKelak meneduhkanmu di hari akhir nanti.",
    "id": 114
  },
  {
    "title": "Doa Mustajab di Sepertiga Malam",
    "hadithSource": "HR. Bukhari & Muslim",
    "arabic": "يَنْزِلُ رَبُّنَا تَبَارَكَ وَتَعَالَى كُلَّ لَيْلَةٍ إِلَى السَّمَاءِ الدُّنْيَا حِينَ يَبْقَى ثُلُثُ اللَّيْلِ الآخِرُ",
    "explanation": "Di kala dunia tertidur lelap dalam sunyi,\nBangunlah, bentangkan sajadahmu di malam sepi.\nSampaikan keluh kesahmu pada Sang Ilahi,\nDoa di sepertiga malam bagai anak panah yang pasti.",
    "id": 115
  },
  {
    "title": "Menebar Salam",
    "hadithSource": "HR. Muslim",
    "arabic": "أَفْشُوا السَّلَامَ بَيْنَكُمْ",
    "explanation": "Ucapkanlah salam pada yang kau kenal dan tidak kenal,\nSebuah sapaan ringan namun berpahala kekal.\nSalam menumbuhkan cinta di antara umat,\nMenyatukan hati dalam ikatan yang erat.",
    "id": 116
  },
  {
    "title": "Menghormati Tetangga",
    "hadithSource": "HR. Bukhari",
    "arabic": "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ جَارَهُ",
    "explanation": "Tetangga adalah saudara terdekat di kala duka,\nYang pertama datang bila bencana melanda.\nBerbuat baiklah dan jangan sakiti hatinya,\nItulah tanda iman yang luhur dan mulia.",
    "id": 117
  },
  {
    "title": "Kasih Sayang Kepada Anak Yatim",
    "hadithSource": "HR. Bukhari",
    "arabic": "أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ هَكَذَا",
    "explanation": "Usaplah kepala yatim dengan penuh kelembutan,\nBerikan mereka pelukan dan juga harapan.\nSiapa yang mengasihi mereka dengan ketulusan,\nKelak bersanding dengan Nabi di surga idaman.",
    "id": 118
  },
  {
    "title": "Rendah Hati (Tawadhu')",
    "hadithSource": "HR. Muslim",
    "arabic": "وَمَا تَوَاضَعَ أَحَدٌ لِلَّهِ إِلَّا رَفَعَهُ اللَّهُ",
    "explanation": "Seperti padi yang kian merunduk saat berisi,\nBegitulah jiwa yang berilmu dan rendah hati.\nJanganlah sombong menepuk dada sendiri,\nKarena Allah mengangkat derajat mereka yang tawadhu'.",
    "id": 119
  },
  {
    "title": "Bersegera dalam Kebaikan",
    "quranSource": "QS. Al-Baqarah: 148",
    "arabic": "فَاسْتَبِقُوا الْخَيْرَاتِ",
    "explanation": "Jangan menunda amal shalih hingga esok tiba,\nKarena esok belum pasti menjadi milik kita.\nBerlombalah dalam kebaikan saat raga masih bernyawa,\nSebelum datang masa penyesalan di alam baka.",
    "id": 120
  },
  {
    "title": "Keutamaan Istighfar",
    "quranSource": "QS. Nuh: 10-11",
    "arabic": "فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا",
    "explanation": "Bila jalan terasa buntu dan masalah menghimpit,\nPerbanyaklah istighfar walau hati terasa sempit.\nIa membuka pintu rezeki yang tadinya tertutup,\nMenghadirkan ketenangan dalam jiwa yang redup.",
    "id": 121
  },
  {
    "title": "Menjaga Shalat Subuh",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ صَلَّى الصُّبْحَ فَهُوَ فِي ذِمَّةِ اللَّهِ",
    "explanation": "Udara pagi yang segar menjadi saksi,\nBagi hamba yang rela meninggalkan mimpi.\nShalat subuh menjamin dirimu dalam perlindungan Ilahi,\nMemulai hari dengan berkah yang suci.",
    "id": 122
  },
  {
    "title": "Adab Berpakaian",
    "quranSource": "QS. Al-A'raf: 26",
    "arabic": "وَلِبَاسُ التَّقْوَىٰ ذَٰلِكَ خَيْرٌ",
    "explanation": "Pakaian indah menutup aurat dan menghias raga,\nNamun ada yang lebih mulia dari sehelai sutra.\nItulah pakaian taqwa, penjaga jiwa dan etika,\nMembuatmu terhormat di mata manusia dan Pencipta.",
    "id": 123
  },
  {
    "title": "Sifat Malu",
    "hadithSource": "HR. Bukhari",
    "arabic": "الْحَيَاءُ لَا يَأْتِي إِلَّا بِخَيْرٍ",
    "explanation": "Malu berbuat maksiat di saat sendirian,\nMalu melanggar titah Sang Rahman.\nSifat malu adalah mahkota keimanan,\nYang senantiasa mendatangkan segala kebaikan.",
    "id": 124
  },
  {
    "title": "Menghindari Marah",
    "hadithSource": "HR. Bukhari",
    "arabic": "لَا تَغْضَبْ وَلَكَ الْجَنَّةُ",
    "explanation": "Amarah yang memuncak bagaikan api neraka,\nMembakar akal sehat dan merusak segala cinta.\nTahanlah emosimu, kendalikan asa,\nKarena surga menanti mereka yang sabar menjaga.",
    "id": 125
  },
  {
    "title": "Membaca Al-Qur'an",
    "hadithSource": "HR. Muslim",
    "arabic": "اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لأَصْحَابِهِ",
    "explanation": "Buku kehidupan penyejuk jiwa yang lara,\nBukan sekadar pajangan berdebu di lemari kaca.\nBacalah ayatnya, tadabburi maknanya,\nKelak ia datang sebagai pemberi syafa'at di padang mahsyar.",
    "id": 126
  },
  {
    "title": "Qana'ah (Merasa Cukup)",
    "hadithSource": "HR. Muslim",
    "arabic": "قَدْ أَفْلَحَ مَنْ أَسْلَمَ وَرُزِقَ كَفَافًا وَقَنَّعَهُ اللَّهُ بِمَا آتَاهُ",
    "explanation": "Bukan tentang seberapa banyak harta yang terkumpul,\nNamun tentang hati yang bersyukur dan tidak memukul.\nQana'ah membuat hidup terasa ringan dan damai,\nMenjadi orang kaya yang sejati nan pandai.",
    "id": 127
  },
  {
    "title": "Pentingnya Doa Ibu",
    "hadithSource": "HR. Tirmidzi",
    "arabic": "رِضَا الرَّبِّ فِي رِضَا الْوَالِدِ وَسَخَطُ الرَّبِّ فِي سَخَطِ الْوَالِدِ",
    "explanation": "Jangan pernah remehkan air mata ibumu,\nSetiap tetesnya bisa menjadi penentu nasibmu.\nDoanya sanggup menembus langit ketujuh,\nMeraih ridha-Nya, menggapai sukses yang teguh.",
    "id": 128
  },
  {
    "title": "Sabar dalam Ujian",
    "quranSource": "QS. Al-Baqarah: 153",
    "arabic": "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
    "explanation": "Meski badai ujian datang silih berganti,\nSabar adalah sauh agar perahu tak mati.\nUsap dadamu dan pautkan asamu pada Ilahi,\nDi setiap kesulitan ada kemudahan yang menanti.",
    "id": 129
  },
  {
    "title": "Rasa Syukur",
    "quranSource": "QS. Ibrahim: 7",
    "arabic": "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    "explanation": "Syukurilah nikmat dari Sang Ilahi,\nBerapapun rezeki yang kau dapati hari ini.\nJiwa yang ruku' dalam kepasrahan dan berserah,\nAkan mengundang turunnya beribu rahmat dan berkah.",
    "id": 130
  },
  {
    "title": "Menjernihkan Hati (Dzikir)",
    "quranSource": "QS. Ar-Ra'd: 28",
    "arabic": "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    "explanation": "Jika sepi menyelimuti jiwa dalam gulita,\nMengingat-Nya adalah lentera di atas lentera.\nSatu tasbih mengikis noda dan resah di dada,\nBersama Allah, segala beban pasti sirna.",
    "id": 131
  },
  {
    "title": "Shalat Tiang Agama",
    "hadithSource": "HR. Abu Daud",
    "arabic": "إِنَّ أَوَّلَ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ مِنْ عَمَلِهِ صَلاتُهُ",
    "explanation": "Sesibuk apapun urusan duniamu melanda,\nJangan biarkan shalat luput dari pandang mata.\nShalat adalah pelita di gelap gulita alam baka,\nPenentu utama saat engkau berhadapan dengan-Nya.",
    "id": 132
  },
  {
    "title": "Tawakkal",
    "quranSource": "QS. At-Talaq: 3",
    "arabic": "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    "explanation": "Jika ikhtiar maksimal sudah tercurahkan,\nLepaskan resah, serahkan pada kekuasaan Tuhan.\nTak akan kecewa hati yang tulus menyerahkan,\nKarena skenario-Nya tak pernah salah tujuan.",
    "id": 133
  },
  {
    "title": "Taubat dan Ampunan",
    "quranSource": "QS. Az-Zumar: 53",
    "arabic": "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
    "explanation": "Meski tubuh pernah berlumur khilaf dan dosa,\nPintu ampunan-Nya tak pernah tertutup selamanya.\nTeteskan air mata taubat yang penuh makna,\nAmpunan-Nya selalu seluas cakrawala.",
    "id": 134
  },
  {
    "title": "Ukhuwah Islamiyah",
    "hadithSource": "HR. Bukhari",
    "arabic": "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    "explanation": "Hapus dendam yang membara di dalam jiwa,\nSenyumanmu pada sesama adalah sedekah termulia.\nGenggam tangan saudaramu eratkan ikatan cinta,\nMalaikat pun turun merestui ukhuwah kita.",
    "id": 135
  },
  {
    "title": "Dunia Hanya Sementara",
    "quranSource": "QS. Al-Hadid: 20",
    "arabic": "وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا مَتَاعُ الْغُرُورِ",
    "explanation": "Harta, tahta, dan paras hanya titipan semata,\nKain kafan kelak tak memiliki saku penyimpan harta.\nBangunlah rumah abadi di surga sebelum masa tiba,\nKelak engkau tersenyum manis di ujung usia.",
    "id": 136
  },
  {
    "title": "Kejujuran dan Lisan",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    "explanation": "Berkata jujur walau terkadang terasa getir di lisan,\nHanya kata-kata bermakna yang pantas diucapkan.\nSampaikan kebenaran dengan kelembutan dan kesabaran,\nKelak lisanmu akan selamat dari pedihnya siksaan.",
    "id": 137
  },
  {
    "title": "Berbakti kepada Orang Tua",
    "quranSource": "QS. Al-Isra: 23",
    "arabic": "وَبِالْوَالِدَيْنِ إِحْسَانًا",
    "explanation": "Surga merunduk di bawah telapak kaki ibu,\nDan keridhaan ayah adalah sayap kesuksesanmu.\nRawatlah mereka selagi nafas masih menderu,\nSebagaimana mereka merawatmu di waktu dulu.",
    "id": 138
  },
  {
    "title": "Husnudzon (Berbaik Sangka)",
    "hadithSource": "Hadits Qudsi HR. Bukhari",
    "arabic": "أَنَا عِنْدَ ظَنِّ عَبْدِي بِي",
    "explanation": "Jangan mudah mengeluh atas takdir yang pahit,\nMungkin Allah sedang menyiapkan senyum yang legit.\nBerbaik sangkalah pada Sang Maha Pengatur,\nAgar hatimu damai dan tidurmu selalu nyenyak terlelap.",
    "id": 139
  },
  {
    "title": "Kemuliaan Menuntut Ilmu",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    "explanation": "Ilmu adalah pelita penuntun langkah di kegelapan,\nMengangkat derajat hamba melampaui gemerlap kekayaan.\nTuntutlah ilmu dari buaian hingga ke liang lahat,\nIa adalah warisan para Nabi dan bekal paling bermanfaat.",
    "id": 140
  },
  {
    "title": "Khusyu' Dalam Shalat",
    "quranSource": "QS. Al-Mu'minun: 1-2",
    "arabic": "قَدْ أَفْلَحَ الْمُؤْمِنُونَ - الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ",
    "explanation": "Menghadap kiblat jangan sekadar membalikkan badan,\nHadirkan hatimu sepenuhnya pada Tuhan Semesta Alam.\nShalat yang khusyu' menenangkan setiap kepanikan,\nMenjadikan kehidupanmu selaras, tenang dan tentram.",
    "id": 141
  },
  {
    "title": "Mengelola Waktu dengan Bijak",
    "quranSource": "QS. Al-'Asr: 1-2",
    "arabic": "وَالْعَصْرِ - إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
    "explanation": "Waktu yang berlalu takkan mungkin kembali berputar,\nJangan biarkan ia habis untuk hal yang hambar.\nIsilah pergantian siang dan malam dengan zikir dan sabar,\nKelak engkau tak merugi saat kiamat membakar.",
    "id": 142
  },
  {
    "title": "Menghindari Sifat Sombong",
    "hadithSource": "HR. Muslim",
    "arabic": "لَا يَدْخُلُ الْجَنَّةَ مَنْ كَانَ فِي قَلْبِهِ مِثْقَالُ ذَرَّةٍ مِنْ كِبْرٍ",
    "explanation": "Setitik debu kesombongan dalam relung hati,\nCukup untuk menutup pintu surga dari diri ini.\nIngatlah asalmmu yang hanya dari setetes mani,\nDan tempat kembalimu hanyalah segunduk tanah sepi.",
    "id": 143
  },
  {
    "title": "Membantu Kesulitan Saudara",
    "hadithSource": "HR. Muslim",
    "arabic": "وَاللَّهُ فِى عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِى عَوْنِ أَخِيهِ",
    "explanation": "Ringankan tanganmu membantu mereka yang kesusahan,\nSeburuk apapun kondisimu, jadilah perantara kebaikan.\nSiapa yang melapangkan dada saudaranya dari kesulitan,\nKelak Allah akan menolongnya di hari kebangkitan.",
    "id": 144
  },
  {
    "title": "Keikhlasan Dalam Beramal",
    "quranSource": "QS. Al-Bayyinah: 5",
    "arabic": "وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ",
    "explanation": "Segala amal ibadah yang tak dilandasi ikhlas,\nIbarat membangun rumah di atas pasir yang lepas.\nTuluskan niat hanya untuk mengharap ridha-Nya,\nKelak pahala dan berkah akan mengalir tanpa batas.",
    "id": 145
  },
  {
    "title": "Menjaga Lisan (Ghibah)",
    "quranSource": "QS. Al-Hujurat: 12",
    "arabic": "وَلَا يَغْتَب بَّعْضُكُم بَعْضًا",
    "explanation": "Tajamnya pedang dapat menyayat raga,\nNamun tajamnya lisan menusuk hingga ke jiwa.\nTahanlah lisan dari membicarakan aib sesama,\nKarena ghibah itu memakan daging saudara.",
    "id": 146
  },
  {
    "title": "Memaafkan Sesama",
    "quranSource": "QS. Ali 'Imran: 134",
    "arabic": "وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ",
    "explanation": "Menyimpan dendam bagai menggenggam bara,\nHanya melukai diri yang menahannya.\nMaafkanlah mereka yang pernah membuatmu terluka,\nSungguh Allah mencintai hamba yang berlapang dada.",
    "id": 147
  },
  {
    "title": "Menyambung Silaturahmi",
    "hadithSource": "HR. Bukhari",
    "arabic": "مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ، وَأَنْ يُنْسَأَ لَهُ فِي أَثَرِهِ، فَلْيَصِلْ رَحِمَهُ",
    "explanation": "Bila rezeki terasa seret dan tak menentu,\nCobalah ketuk pintu kerabat yang telah lama jauh darimu.\nSilaturahmi itu merekatkan hati yang beku,\nMemanjangkan umur dan meluaskan rezekimu.",
    "id": 148
  },
  {
    "title": "Mengingat Kematian",
    "quranSource": "QS. Ali 'Imran: 185",
    "arabic": "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ",
    "explanation": "Setiap jiwa pasti akan mereguk kepulangan,\nMenuju keabadian dan meninggalkan kefanaan.\nPersiapkanlah amal sebelum datangnya panggilan,\nKarena dunia ini hanyalah tempat persinggahan.",
    "id": 149
  },
  {
    "title": "Sedekah Melapangkan Rezeki",
    "quranSource": "QS. Saba: 39",
    "arabic": "وَمَا أَنفَقْتُم مِّن شَيْءٍ فَهُوَ يُخْلِفُهُ",
    "explanation": "Jangan takut miskin karena memberi,\nAllah yang Maha Kaya yang akan mengganti.\nSepercik sedekah yang kau beri saat ini,\nKelak meneduhkanmu di hari akhir nanti.",
    "id": 150
  },
  {
    "title": "Doa Mustajab di Sepertiga Malam",
    "hadithSource": "HR. Bukhari & Muslim",
    "arabic": "يَنْزِلُ رَبُّنَا تَبَارَكَ وَتَعَالَى كُلَّ لَيْلَةٍ إِلَى السَّمَاءِ الدُّنْيَا حِينَ يَبْقَى ثُلُثُ اللَّيْلِ الآخِرُ",
    "explanation": "Di kala dunia tertidur lelap dalam sunyi,\nBangunlah, bentangkan sajadahmu di malam sepi.\nSampaikan keluh kesahmu pada Sang Ilahi,\nDoa di sepertiga malam bagai anak panah yang pasti.",
    "id": 151
  },
  {
    "title": "Menebar Salam",
    "hadithSource": "HR. Muslim",
    "arabic": "أَفْشُوا السَّلَامَ بَيْنَكُمْ",
    "explanation": "Ucapkanlah salam pada yang kau kenal dan tidak kenal,\nSebuah sapaan ringan namun berpahala kekal.\nSalam menumbuhkan cinta di antara umat,\nMenyatukan hati dalam ikatan yang erat.",
    "id": 152
  },
  {
    "title": "Menghormati Tetangga",
    "hadithSource": "HR. Bukhari",
    "arabic": "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ جَارَهُ",
    "explanation": "Tetangga adalah saudara terdekat di kala duka,\nYang pertama datang bila bencana melanda.\nBerbuat baiklah dan jangan sakiti hatinya,\nItulah tanda iman yang luhur dan mulia.",
    "id": 153
  },
  {
    "title": "Kasih Sayang Kepada Anak Yatim",
    "hadithSource": "HR. Bukhari",
    "arabic": "أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ هَكَذَا",
    "explanation": "Usaplah kepala yatim dengan penuh kelembutan,\nBerikan mereka pelukan dan juga harapan.\nSiapa yang mengasihi mereka dengan ketulusan,\nKelak bersanding dengan Nabi di surga idaman.",
    "id": 154
  },
  {
    "title": "Rendah Hati (Tawadhu')",
    "hadithSource": "HR. Muslim",
    "arabic": "وَمَا تَوَاضَعَ أَحَدٌ لِلَّهِ إِلَّا رَفَعَهُ اللَّهُ",
    "explanation": "Seperti padi yang kian merunduk saat berisi,\nBegitulah jiwa yang berilmu dan rendah hati.\nJanganlah sombong menepuk dada sendiri,\nKarena Allah mengangkat derajat mereka yang tawadhu'.",
    "id": 155
  },
  {
    "title": "Bersegera dalam Kebaikan",
    "quranSource": "QS. Al-Baqarah: 148",
    "arabic": "فَاسْتَبِقُوا الْخَيْرَاتِ",
    "explanation": "Jangan menunda amal shalih hingga esok tiba,\nKarena esok belum pasti menjadi milik kita.\nBerlombalah dalam kebaikan saat raga masih bernyawa,\nSebelum datang masa penyesalan di alam baka.",
    "id": 156
  },
  {
    "title": "Keutamaan Istighfar",
    "quranSource": "QS. Nuh: 10-11",
    "arabic": "فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا",
    "explanation": "Bila jalan terasa buntu dan masalah menghimpit,\nPerbanyaklah istighfar walau hati terasa sempit.\nIa membuka pintu rezeki yang tadinya tertutup,\nMenghadirkan ketenangan dalam jiwa yang redup.",
    "id": 157
  },
  {
    "title": "Menjaga Shalat Subuh",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ صَلَّى الصُّبْحَ فَهُوَ فِي ذِمَّةِ اللَّهِ",
    "explanation": "Udara pagi yang segar menjadi saksi,\nBagi hamba yang rela meninggalkan mimpi.\nShalat subuh menjamin dirimu dalam perlindungan Ilahi,\nMemulai hari dengan berkah yang suci.",
    "id": 158
  },
  {
    "title": "Adab Berpakaian",
    "quranSource": "QS. Al-A'raf: 26",
    "arabic": "وَلِبَاسُ التَّقْوَىٰ ذَٰلِكَ خَيْرٌ",
    "explanation": "Pakaian indah menutup aurat dan menghias raga,\nNamun ada yang lebih mulia dari sehelai sutra.\nItulah pakaian taqwa, penjaga jiwa dan etika,\nMembuatmu terhormat di mata manusia dan Pencipta.",
    "id": 159
  },
  {
    "title": "Sifat Malu",
    "hadithSource": "HR. Bukhari",
    "arabic": "الْحَيَاءُ لَا يَأْتِي إِلَّا بِخَيْرٍ",
    "explanation": "Malu berbuat maksiat di saat sendirian,\nMalu melanggar titah Sang Rahman.\nSifat malu adalah mahkota keimanan,\nYang senantiasa mendatangkan segala kebaikan.",
    "id": 160
  },
  {
    "title": "Menghindari Marah",
    "hadithSource": "HR. Bukhari",
    "arabic": "لَا تَغْضَبْ وَلَكَ الْجَنَّةُ",
    "explanation": "Amarah yang memuncak bagaikan api neraka,\nMembakar akal sehat dan merusak segala cinta.\nTahanlah emosimu, kendalikan asa,\nKarena surga menanti mereka yang sabar menjaga.",
    "id": 161
  },
  {
    "title": "Membaca Al-Qur'an",
    "hadithSource": "HR. Muslim",
    "arabic": "اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لأَصْحَابِهِ",
    "explanation": "Buku kehidupan penyejuk jiwa yang lara,\nBukan sekadar pajangan berdebu di lemari kaca.\nBacalah ayatnya, tadabburi maknanya,\nKelak ia datang sebagai pemberi syafa'at di padang mahsyar.",
    "id": 162
  },
  {
    "title": "Qana'ah (Merasa Cukup)",
    "hadithSource": "HR. Muslim",
    "arabic": "قَدْ أَفْلَحَ مَنْ أَسْلَمَ وَرُزِقَ كَفَافًا وَقَنَّعَهُ اللَّهُ بِمَا آتَاهُ",
    "explanation": "Bukan tentang seberapa banyak harta yang terkumpul,\nNamun tentang hati yang bersyukur dan tidak memukul.\nQana'ah membuat hidup terasa ringan dan damai,\nMenjadi orang kaya yang sejati nan pandai.",
    "id": 163
  },
  {
    "title": "Pentingnya Doa Ibu",
    "hadithSource": "HR. Tirmidzi",
    "arabic": "رِضَا الرَّبِّ فِي رِضَا الْوَالِدِ وَسَخَطُ الرَّبِّ فِي سَخَطِ الْوَالِدِ",
    "explanation": "Jangan pernah remehkan air mata ibumu,\nSetiap tetesnya bisa menjadi penentu nasibmu.\nDoanya sanggup menembus langit ketujuh,\nMeraih ridha-Nya, menggapai sukses yang teguh.",
    "id": 164
  },
  {
    "title": "Sabar dalam Ujian",
    "quranSource": "QS. Al-Baqarah: 153",
    "arabic": "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
    "explanation": "Meski badai ujian datang silih berganti,\nSabar adalah sauh agar perahu tak mati.\nUsap dadamu dan pautkan asamu pada Ilahi,\nDi setiap kesulitan ada kemudahan yang menanti.",
    "id": 165
  },
  {
    "title": "Rasa Syukur",
    "quranSource": "QS. Ibrahim: 7",
    "arabic": "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    "explanation": "Syukurilah nikmat dari Sang Ilahi,\nBerapapun rezeki yang kau dapati hari ini.\nJiwa yang ruku' dalam kepasrahan dan berserah,\nAkan mengundang turunnya beribu rahmat dan berkah.",
    "id": 166
  },
  {
    "title": "Menjernihkan Hati (Dzikir)",
    "quranSource": "QS. Ar-Ra'd: 28",
    "arabic": "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    "explanation": "Jika sepi menyelimuti jiwa dalam gulita,\nMengingat-Nya adalah lentera di atas lentera.\nSatu tasbih mengikis noda dan resah di dada,\nBersama Allah, segala beban pasti sirna.",
    "id": 167
  },
  {
    "title": "Shalat Tiang Agama",
    "hadithSource": "HR. Abu Daud",
    "arabic": "إِنَّ أَوَّلَ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ مِنْ عَمَلِهِ صَلاتُهُ",
    "explanation": "Sesibuk apapun urusan duniamu melanda,\nJangan biarkan shalat luput dari pandang mata.\nShalat adalah pelita di gelap gulita alam baka,\nPenentu utama saat engkau berhadapan dengan-Nya.",
    "id": 168
  },
  {
    "title": "Tawakkal",
    "quranSource": "QS. At-Talaq: 3",
    "arabic": "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    "explanation": "Jika ikhtiar maksimal sudah tercurahkan,\nLepaskan resah, serahkan pada kekuasaan Tuhan.\nTak akan kecewa hati yang tulus menyerahkan,\nKarena skenario-Nya tak pernah salah tujuan.",
    "id": 169
  },
  {
    "title": "Taubat dan Ampunan",
    "quranSource": "QS. Az-Zumar: 53",
    "arabic": "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
    "explanation": "Meski tubuh pernah berlumur khilaf dan dosa,\nPintu ampunan-Nya tak pernah tertutup selamanya.\nTeteskan air mata taubat yang penuh makna,\nAmpunan-Nya selalu seluas cakrawala.",
    "id": 170
  },
  {
    "title": "Ukhuwah Islamiyah",
    "hadithSource": "HR. Bukhari",
    "arabic": "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    "explanation": "Hapus dendam yang membara di dalam jiwa,\nSenyumanmu pada sesama adalah sedekah termulia.\nGenggam tangan saudaramu eratkan ikatan cinta,\nMalaikat pun turun merestui ukhuwah kita.",
    "id": 171
  },
  {
    "title": "Dunia Hanya Sementara",
    "quranSource": "QS. Al-Hadid: 20",
    "arabic": "وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا مَتَاعُ الْغُرُورِ",
    "explanation": "Harta, tahta, dan paras hanya titipan semata,\nKain kafan kelak tak memiliki saku penyimpan harta.\nBangunlah rumah abadi di surga sebelum masa tiba,\nKelak engkau tersenyum manis di ujung usia.",
    "id": 172
  },
  {
    "title": "Kejujuran dan Lisan",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    "explanation": "Berkata jujur walau terkadang terasa getir di lisan,\nHanya kata-kata bermakna yang pantas diucapkan.\nSampaikan kebenaran dengan kelembutan dan kesabaran,\nKelak lisanmu akan selamat dari pedihnya siksaan.",
    "id": 173
  },
  {
    "title": "Berbakti kepada Orang Tua",
    "quranSource": "QS. Al-Isra: 23",
    "arabic": "وَبِالْوَالِدَيْنِ إِحْسَانًا",
    "explanation": "Surga merunduk di bawah telapak kaki ibu,\nDan keridhaan ayah adalah sayap kesuksesanmu.\nRawatlah mereka selagi nafas masih menderu,\nSebagaimana mereka merawatmu di waktu dulu.",
    "id": 174
  },
  {
    "title": "Husnudzon (Berbaik Sangka)",
    "hadithSource": "Hadits Qudsi HR. Bukhari",
    "arabic": "أَنَا عِنْدَ ظَنِّ عَبْدِي بِي",
    "explanation": "Jangan mudah mengeluh atas takdir yang pahit,\nMungkin Allah sedang menyiapkan senyum yang legit.\nBerbaik sangkalah pada Sang Maha Pengatur,\nAgar hatimu damai dan tidurmu selalu nyenyak terlelap.",
    "id": 175
  },
  {
    "title": "Kemuliaan Menuntut Ilmu",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    "explanation": "Ilmu adalah pelita penuntun langkah di kegelapan,\nMengangkat derajat hamba melampaui gemerlap kekayaan.\nTuntutlah ilmu dari buaian hingga ke liang lahat,\nIa adalah warisan para Nabi dan bekal paling bermanfaat.",
    "id": 176
  },
  {
    "title": "Khusyu' Dalam Shalat",
    "quranSource": "QS. Al-Mu'minun: 1-2",
    "arabic": "قَدْ أَفْلَحَ الْمُؤْمِنُونَ - الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ",
    "explanation": "Menghadap kiblat jangan sekadar membalikkan badan,\nHadirkan hatimu sepenuhnya pada Tuhan Semesta Alam.\nShalat yang khusyu' menenangkan setiap kepanikan,\nMenjadikan kehidupanmu selaras, tenang dan tentram.",
    "id": 177
  },
  {
    "title": "Mengelola Waktu dengan Bijak",
    "quranSource": "QS. Al-'Asr: 1-2",
    "arabic": "وَالْعَصْرِ - إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
    "explanation": "Waktu yang berlalu takkan mungkin kembali berputar,\nJangan biarkan ia habis untuk hal yang hambar.\nIsilah pergantian siang dan malam dengan zikir dan sabar,\nKelak engkau tak merugi saat kiamat membakar.",
    "id": 178
  },
  {
    "title": "Menghindari Sifat Sombong",
    "hadithSource": "HR. Muslim",
    "arabic": "لَا يَدْخُلُ الْجَنَّةَ مَنْ كَانَ فِي قَلْبِهِ مِثْقَالُ ذَرَّةٍ مِنْ كِبْرٍ",
    "explanation": "Setitik debu kesombongan dalam relung hati,\nCukup untuk menutup pintu surga dari diri ini.\nIngatlah asalmmu yang hanya dari setetes mani,\nDan tempat kembalimu hanyalah segunduk tanah sepi.",
    "id": 179
  },
  {
    "title": "Membantu Kesulitan Saudara",
    "hadithSource": "HR. Muslim",
    "arabic": "وَاللَّهُ فِى عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِى عَوْنِ أَخِيهِ",
    "explanation": "Ringankan tanganmu membantu mereka yang kesusahan,\nSeburuk apapun kondisimu, jadilah perantara kebaikan.\nSiapa yang melapangkan dada saudaranya dari kesulitan,\nKelak Allah akan menolongnya di hari kebangkitan.",
    "id": 180
  },
  {
    "title": "Keikhlasan Dalam Beramal",
    "quranSource": "QS. Al-Bayyinah: 5",
    "arabic": "وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ",
    "explanation": "Segala amal ibadah yang tak dilandasi ikhlas,\nIbarat membangun rumah di atas pasir yang lepas.\nTuluskan niat hanya untuk mengharap ridha-Nya,\nKelak pahala dan berkah akan mengalir tanpa batas.",
    "id": 181
  },
  {
    "title": "Menjaga Lisan (Ghibah)",
    "quranSource": "QS. Al-Hujurat: 12",
    "arabic": "وَلَا يَغْتَب بَّعْضُكُم بَعْضًا",
    "explanation": "Tajamnya pedang dapat menyayat raga,\nNamun tajamnya lisan menusuk hingga ke jiwa.\nTahanlah lisan dari membicarakan aib sesama,\nKarena ghibah itu memakan daging saudara.",
    "id": 182
  },
  {
    "title": "Memaafkan Sesama",
    "quranSource": "QS. Ali 'Imran: 134",
    "arabic": "وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ",
    "explanation": "Menyimpan dendam bagai menggenggam bara,\nHanya melukai diri yang menahannya.\nMaafkanlah mereka yang pernah membuatmu terluka,\nSungguh Allah mencintai hamba yang berlapang dada.",
    "id": 183
  },
  {
    "title": "Menyambung Silaturahmi",
    "hadithSource": "HR. Bukhari",
    "arabic": "مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ، وَأَنْ يُنْسَأَ لَهُ فِي أَثَرِهِ، فَلْيَصِلْ رَحِمَهُ",
    "explanation": "Bila rezeki terasa seret dan tak menentu,\nCobalah ketuk pintu kerabat yang telah lama jauh darimu.\nSilaturahmi itu merekatkan hati yang beku,\nMemanjangkan umur dan meluaskan rezekimu.",
    "id": 184
  },
  {
    "title": "Mengingat Kematian",
    "quranSource": "QS. Ali 'Imran: 185",
    "arabic": "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ",
    "explanation": "Setiap jiwa pasti akan mereguk kepulangan,\nMenuju keabadian dan meninggalkan kefanaan.\nPersiapkanlah amal sebelum datangnya panggilan,\nKarena dunia ini hanyalah tempat persinggahan.",
    "id": 185
  },
  {
    "title": "Sedekah Melapangkan Rezeki",
    "quranSource": "QS. Saba: 39",
    "arabic": "وَمَا أَنفَقْتُم مِّن شَيْءٍ فَهُوَ يُخْلِفُهُ",
    "explanation": "Jangan takut miskin karena memberi,\nAllah yang Maha Kaya yang akan mengganti.\nSepercik sedekah yang kau beri saat ini,\nKelak meneduhkanmu di hari akhir nanti.",
    "id": 186
  },
  {
    "title": "Doa Mustajab di Sepertiga Malam",
    "hadithSource": "HR. Bukhari & Muslim",
    "arabic": "يَنْزِلُ رَبُّنَا تَبَارَكَ وَتَعَالَى كُلَّ لَيْلَةٍ إِلَى السَّمَاءِ الدُّنْيَا حِينَ يَبْقَى ثُلُثُ اللَّيْلِ الآخِرُ",
    "explanation": "Di kala dunia tertidur lelap dalam sunyi,\nBangunlah, bentangkan sajadahmu di malam sepi.\nSampaikan keluh kesahmu pada Sang Ilahi,\nDoa di sepertiga malam bagai anak panah yang pasti.",
    "id": 187
  },
  {
    "title": "Menebar Salam",
    "hadithSource": "HR. Muslim",
    "arabic": "أَفْشُوا السَّلَامَ بَيْنَكُمْ",
    "explanation": "Ucapkanlah salam pada yang kau kenal dan tidak kenal,\nSebuah sapaan ringan namun berpahala kekal.\nSalam menumbuhkan cinta di antara umat,\nMenyatukan hati dalam ikatan yang erat.",
    "id": 188
  },
  {
    "title": "Menghormati Tetangga",
    "hadithSource": "HR. Bukhari",
    "arabic": "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ جَارَهُ",
    "explanation": "Tetangga adalah saudara terdekat di kala duka,\nYang pertama datang bila bencana melanda.\nBerbuat baiklah dan jangan sakiti hatinya,\nItulah tanda iman yang luhur dan mulia.",
    "id": 189
  },
  {
    "title": "Kasih Sayang Kepada Anak Yatim",
    "hadithSource": "HR. Bukhari",
    "arabic": "أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ هَكَذَا",
    "explanation": "Usaplah kepala yatim dengan penuh kelembutan,\nBerikan mereka pelukan dan juga harapan.\nSiapa yang mengasihi mereka dengan ketulusan,\nKelak bersanding dengan Nabi di surga idaman.",
    "id": 190
  },
  {
    "title": "Rendah Hati (Tawadhu')",
    "hadithSource": "HR. Muslim",
    "arabic": "وَمَا تَوَاضَعَ أَحَدٌ لِلَّهِ إِلَّا رَفَعَهُ اللَّهُ",
    "explanation": "Seperti padi yang kian merunduk saat berisi,\nBegitulah jiwa yang berilmu dan rendah hati.\nJanganlah sombong menepuk dada sendiri,\nKarena Allah mengangkat derajat mereka yang tawadhu'.",
    "id": 191
  },
  {
    "title": "Bersegera dalam Kebaikan",
    "quranSource": "QS. Al-Baqarah: 148",
    "arabic": "فَاسْتَبِقُوا الْخَيْرَاتِ",
    "explanation": "Jangan menunda amal shalih hingga esok tiba,\nKarena esok belum pasti menjadi milik kita.\nBerlombalah dalam kebaikan saat raga masih bernyawa,\nSebelum datang masa penyesalan di alam baka.",
    "id": 192
  },
  {
    "title": "Keutamaan Istighfar",
    "quranSource": "QS. Nuh: 10-11",
    "arabic": "فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا",
    "explanation": "Bila jalan terasa buntu dan masalah menghimpit,\nPerbanyaklah istighfar walau hati terasa sempit.\nIa membuka pintu rezeki yang tadinya tertutup,\nMenghadirkan ketenangan dalam jiwa yang redup.",
    "id": 193
  },
  {
    "title": "Menjaga Shalat Subuh",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ صَلَّى الصُّبْحَ فَهُوَ فِي ذِمَّةِ اللَّهِ",
    "explanation": "Udara pagi yang segar menjadi saksi,\nBagi hamba yang rela meninggalkan mimpi.\nShalat subuh menjamin dirimu dalam perlindungan Ilahi,\nMemulai hari dengan berkah yang suci.",
    "id": 194
  },
  {
    "title": "Adab Berpakaian",
    "quranSource": "QS. Al-A'raf: 26",
    "arabic": "وَلِبَاسُ التَّقْوَىٰ ذَٰلِكَ خَيْرٌ",
    "explanation": "Pakaian indah menutup aurat dan menghias raga,\nNamun ada yang lebih mulia dari sehelai sutra.\nItulah pakaian taqwa, penjaga jiwa dan etika,\nMembuatmu terhormat di mata manusia dan Pencipta.",
    "id": 195
  },
  {
    "title": "Sifat Malu",
    "hadithSource": "HR. Bukhari",
    "arabic": "الْحَيَاءُ لَا يَأْتِي إِلَّا بِخَيْرٍ",
    "explanation": "Malu berbuat maksiat di saat sendirian,\nMalu melanggar titah Sang Rahman.\nSifat malu adalah mahkota keimanan,\nYang senantiasa mendatangkan segala kebaikan.",
    "id": 196
  },
  {
    "title": "Menghindari Marah",
    "hadithSource": "HR. Bukhari",
    "arabic": "لَا تَغْضَبْ وَلَكَ الْجَنَّةُ",
    "explanation": "Amarah yang memuncak bagaikan api neraka,\nMembakar akal sehat dan merusak segala cinta.\nTahanlah emosimu, kendalikan asa,\nKarena surga menanti mereka yang sabar menjaga.",
    "id": 197
  },
  {
    "title": "Membaca Al-Qur'an",
    "hadithSource": "HR. Muslim",
    "arabic": "اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لأَصْحَابِهِ",
    "explanation": "Buku kehidupan penyejuk jiwa yang lara,\nBukan sekadar pajangan berdebu di lemari kaca.\nBacalah ayatnya, tadabburi maknanya,\nKelak ia datang sebagai pemberi syafa'at di padang mahsyar.",
    "id": 198
  },
  {
    "title": "Qana'ah (Merasa Cukup)",
    "hadithSource": "HR. Muslim",
    "arabic": "قَدْ أَفْلَحَ مَنْ أَسْلَمَ وَرُزِقَ كَفَافًا وَقَنَّعَهُ اللَّهُ بِمَا آتَاهُ",
    "explanation": "Bukan tentang seberapa banyak harta yang terkumpul,\nNamun tentang hati yang bersyukur dan tidak memukul.\nQana'ah membuat hidup terasa ringan dan damai,\nMenjadi orang kaya yang sejati nan pandai.",
    "id": 199
  },
  {
    "title": "Pentingnya Doa Ibu",
    "hadithSource": "HR. Tirmidzi",
    "arabic": "رِضَا الرَّبِّ فِي رِضَا الْوَالِدِ وَسَخَطُ الرَّبِّ فِي سَخَطِ الْوَالِدِ",
    "explanation": "Jangan pernah remehkan air mata ibumu,\nSetiap tetesnya bisa menjadi penentu nasibmu.\nDoanya sanggup menembus langit ketujuh,\nMeraih ridha-Nya, menggapai sukses yang teguh.",
    "id": 200
  },
  {
    "title": "Sabar dalam Ujian",
    "quranSource": "QS. Al-Baqarah: 153",
    "arabic": "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
    "explanation": "Meski badai ujian datang silih berganti,\nSabar adalah sauh agar perahu tak mati.\nUsap dadamu dan pautkan asamu pada Ilahi,\nDi setiap kesulitan ada kemudahan yang menanti.",
    "id": 201
  },
  {
    "title": "Rasa Syukur",
    "quranSource": "QS. Ibrahim: 7",
    "arabic": "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    "explanation": "Syukurilah nikmat dari Sang Ilahi,\nBerapapun rezeki yang kau dapati hari ini.\nJiwa yang ruku' dalam kepasrahan dan berserah,\nAkan mengundang turunnya beribu rahmat dan berkah.",
    "id": 202
  },
  {
    "title": "Menjernihkan Hati (Dzikir)",
    "quranSource": "QS. Ar-Ra'd: 28",
    "arabic": "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    "explanation": "Jika sepi menyelimuti jiwa dalam gulita,\nMengingat-Nya adalah lentera di atas lentera.\nSatu tasbih mengikis noda dan resah di dada,\nBersama Allah, segala beban pasti sirna.",
    "id": 203
  },
  {
    "title": "Shalat Tiang Agama",
    "hadithSource": "HR. Abu Daud",
    "arabic": "إِنَّ أَوَّلَ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ مِنْ عَمَلِهِ صَلاتُهُ",
    "explanation": "Sesibuk apapun urusan duniamu melanda,\nJangan biarkan shalat luput dari pandang mata.\nShalat adalah pelita di gelap gulita alam baka,\nPenentu utama saat engkau berhadapan dengan-Nya.",
    "id": 204
  },
  {
    "title": "Tawakkal",
    "quranSource": "QS. At-Talaq: 3",
    "arabic": "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    "explanation": "Jika ikhtiar maksimal sudah tercurahkan,\nLepaskan resah, serahkan pada kekuasaan Tuhan.\nTak akan kecewa hati yang tulus menyerahkan,\nKarena skenario-Nya tak pernah salah tujuan.",
    "id": 205
  },
  {
    "title": "Taubat dan Ampunan",
    "quranSource": "QS. Az-Zumar: 53",
    "arabic": "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
    "explanation": "Meski tubuh pernah berlumur khilaf dan dosa,\nPintu ampunan-Nya tak pernah tertutup selamanya.\nTeteskan air mata taubat yang penuh makna,\nAmpunan-Nya selalu seluas cakrawala.",
    "id": 206
  },
  {
    "title": "Ukhuwah Islamiyah",
    "hadithSource": "HR. Bukhari",
    "arabic": "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    "explanation": "Hapus dendam yang membara di dalam jiwa,\nSenyumanmu pada sesama adalah sedekah termulia.\nGenggam tangan saudaramu eratkan ikatan cinta,\nMalaikat pun turun merestui ukhuwah kita.",
    "id": 207
  },
  {
    "title": "Dunia Hanya Sementara",
    "quranSource": "QS. Al-Hadid: 20",
    "arabic": "وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا مَتَاعُ الْغُرُورِ",
    "explanation": "Harta, tahta, dan paras hanya titipan semata,\nKain kafan kelak tak memiliki saku penyimpan harta.\nBangunlah rumah abadi di surga sebelum masa tiba,\nKelak engkau tersenyum manis di ujung usia.",
    "id": 208
  },
  {
    "title": "Kejujuran dan Lisan",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    "explanation": "Berkata jujur walau terkadang terasa getir di lisan,\nHanya kata-kata bermakna yang pantas diucapkan.\nSampaikan kebenaran dengan kelembutan dan kesabaran,\nKelak lisanmu akan selamat dari pedihnya siksaan.",
    "id": 209
  },
  {
    "title": "Berbakti kepada Orang Tua",
    "quranSource": "QS. Al-Isra: 23",
    "arabic": "وَبِالْوَالِدَيْنِ إِحْسَانًا",
    "explanation": "Surga merunduk di bawah telapak kaki ibu,\nDan keridhaan ayah adalah sayap kesuksesanmu.\nRawatlah mereka selagi nafas masih menderu,\nSebagaimana mereka merawatmu di waktu dulu.",
    "id": 210
  },
  {
    "title": "Husnudzon (Berbaik Sangka)",
    "hadithSource": "Hadits Qudsi HR. Bukhari",
    "arabic": "أَنَا عِنْدَ ظَنِّ عَبْدِي بِي",
    "explanation": "Jangan mudah mengeluh atas takdir yang pahit,\nMungkin Allah sedang menyiapkan senyum yang legit.\nBerbaik sangkalah pada Sang Maha Pengatur,\nAgar hatimu damai dan tidurmu selalu nyenyak terlelap.",
    "id": 211
  },
  {
    "title": "Kemuliaan Menuntut Ilmu",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    "explanation": "Ilmu adalah pelita penuntun langkah di kegelapan,\nMengangkat derajat hamba melampaui gemerlap kekayaan.\nTuntutlah ilmu dari buaian hingga ke liang lahat,\nIa adalah warisan para Nabi dan bekal paling bermanfaat.",
    "id": 212
  },
  {
    "title": "Khusyu' Dalam Shalat",
    "quranSource": "QS. Al-Mu'minun: 1-2",
    "arabic": "قَدْ أَفْلَحَ الْمُؤْمِنُونَ - الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ",
    "explanation": "Menghadap kiblat jangan sekadar membalikkan badan,\nHadirkan hatimu sepenuhnya pada Tuhan Semesta Alam.\nShalat yang khusyu' menenangkan setiap kepanikan,\nMenjadikan kehidupanmu selaras, tenang dan tentram.",
    "id": 213
  },
  {
    "title": "Mengelola Waktu dengan Bijak",
    "quranSource": "QS. Al-'Asr: 1-2",
    "arabic": "وَالْعَصْرِ - إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
    "explanation": "Waktu yang berlalu takkan mungkin kembali berputar,\nJangan biarkan ia habis untuk hal yang hambar.\nIsilah pergantian siang dan malam dengan zikir dan sabar,\nKelak engkau tak merugi saat kiamat membakar.",
    "id": 214
  },
  {
    "title": "Menghindari Sifat Sombong",
    "hadithSource": "HR. Muslim",
    "arabic": "لَا يَدْخُلُ الْجَنَّةَ مَنْ كَانَ فِي قَلْبِهِ مِثْقَالُ ذَرَّةٍ مِنْ كِبْرٍ",
    "explanation": "Setitik debu kesombongan dalam relung hati,\nCukup untuk menutup pintu surga dari diri ini.\nIngatlah asalmmu yang hanya dari setetes mani,\nDan tempat kembalimu hanyalah segunduk tanah sepi.",
    "id": 215
  },
  {
    "title": "Membantu Kesulitan Saudara",
    "hadithSource": "HR. Muslim",
    "arabic": "وَاللَّهُ فِى عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِى عَوْنِ أَخِيهِ",
    "explanation": "Ringankan tanganmu membantu mereka yang kesusahan,\nSeburuk apapun kondisimu, jadilah perantara kebaikan.\nSiapa yang melapangkan dada saudaranya dari kesulitan,\nKelak Allah akan menolongnya di hari kebangkitan.",
    "id": 216
  },
  {
    "title": "Keikhlasan Dalam Beramal",
    "quranSource": "QS. Al-Bayyinah: 5",
    "arabic": "وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ",
    "explanation": "Segala amal ibadah yang tak dilandasi ikhlas,\nIbarat membangun rumah di atas pasir yang lepas.\nTuluskan niat hanya untuk mengharap ridha-Nya,\nKelak pahala dan berkah akan mengalir tanpa batas.",
    "id": 217
  },
  {
    "title": "Menjaga Lisan (Ghibah)",
    "quranSource": "QS. Al-Hujurat: 12",
    "arabic": "وَلَا يَغْتَب بَّعْضُكُم بَعْضًا",
    "explanation": "Tajamnya pedang dapat menyayat raga,\nNamun tajamnya lisan menusuk hingga ke jiwa.\nTahanlah lisan dari membicarakan aib sesama,\nKarena ghibah itu memakan daging saudara.",
    "id": 218
  },
  {
    "title": "Memaafkan Sesama",
    "quranSource": "QS. Ali 'Imran: 134",
    "arabic": "وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ",
    "explanation": "Menyimpan dendam bagai menggenggam bara,\nHanya melukai diri yang menahannya.\nMaafkanlah mereka yang pernah membuatmu terluka,\nSungguh Allah mencintai hamba yang berlapang dada.",
    "id": 219
  },
  {
    "title": "Menyambung Silaturahmi",
    "hadithSource": "HR. Bukhari",
    "arabic": "مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ، وَأَنْ يُنْسَأَ لَهُ فِي أَثَرِهِ، فَلْيَصِلْ رَحِمَهُ",
    "explanation": "Bila rezeki terasa seret dan tak menentu,\nCobalah ketuk pintu kerabat yang telah lama jauh darimu.\nSilaturahmi itu merekatkan hati yang beku,\nMemanjangkan umur dan meluaskan rezekimu.",
    "id": 220
  },
  {
    "title": "Mengingat Kematian",
    "quranSource": "QS. Ali 'Imran: 185",
    "arabic": "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ",
    "explanation": "Setiap jiwa pasti akan mereguk kepulangan,\nMenuju keabadian dan meninggalkan kefanaan.\nPersiapkanlah amal sebelum datangnya panggilan,\nKarena dunia ini hanyalah tempat persinggahan.",
    "id": 221
  },
  {
    "title": "Sedekah Melapangkan Rezeki",
    "quranSource": "QS. Saba: 39",
    "arabic": "وَمَا أَنفَقْتُم مِّن شَيْءٍ فَهُوَ يُخْلِفُهُ",
    "explanation": "Jangan takut miskin karena memberi,\nAllah yang Maha Kaya yang akan mengganti.\nSepercik sedekah yang kau beri saat ini,\nKelak meneduhkanmu di hari akhir nanti.",
    "id": 222
  },
  {
    "title": "Doa Mustajab di Sepertiga Malam",
    "hadithSource": "HR. Bukhari & Muslim",
    "arabic": "يَنْزِلُ رَبُّنَا تَبَارَكَ وَتَعَالَى كُلَّ لَيْلَةٍ إِلَى السَّمَاءِ الدُّنْيَا حِينَ يَبْقَى ثُلُثُ اللَّيْلِ الآخِرُ",
    "explanation": "Di kala dunia tertidur lelap dalam sunyi,\nBangunlah, bentangkan sajadahmu di malam sepi.\nSampaikan keluh kesahmu pada Sang Ilahi,\nDoa di sepertiga malam bagai anak panah yang pasti.",
    "id": 223
  },
  {
    "title": "Menebar Salam",
    "hadithSource": "HR. Muslim",
    "arabic": "أَفْشُوا السَّلَامَ بَيْنَكُمْ",
    "explanation": "Ucapkanlah salam pada yang kau kenal dan tidak kenal,\nSebuah sapaan ringan namun berpahala kekal.\nSalam menumbuhkan cinta di antara umat,\nMenyatukan hati dalam ikatan yang erat.",
    "id": 224
  },
  {
    "title": "Menghormati Tetangga",
    "hadithSource": "HR. Bukhari",
    "arabic": "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ جَارَهُ",
    "explanation": "Tetangga adalah saudara terdekat di kala duka,\nYang pertama datang bila bencana melanda.\nBerbuat baiklah dan jangan sakiti hatinya,\nItulah tanda iman yang luhur dan mulia.",
    "id": 225
  },
  {
    "title": "Kasih Sayang Kepada Anak Yatim",
    "hadithSource": "HR. Bukhari",
    "arabic": "أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ هَكَذَا",
    "explanation": "Usaplah kepala yatim dengan penuh kelembutan,\nBerikan mereka pelukan dan juga harapan.\nSiapa yang mengasihi mereka dengan ketulusan,\nKelak bersanding dengan Nabi di surga idaman.",
    "id": 226
  },
  {
    "title": "Rendah Hati (Tawadhu')",
    "hadithSource": "HR. Muslim",
    "arabic": "وَمَا تَوَاضَعَ أَحَدٌ لِلَّهِ إِلَّا رَفَعَهُ اللَّهُ",
    "explanation": "Seperti padi yang kian merunduk saat berisi,\nBegitulah jiwa yang berilmu dan rendah hati.\nJanganlah sombong menepuk dada sendiri,\nKarena Allah mengangkat derajat mereka yang tawadhu'.",
    "id": 227
  },
  {
    "title": "Bersegera dalam Kebaikan",
    "quranSource": "QS. Al-Baqarah: 148",
    "arabic": "فَاسْتَبِقُوا الْخَيْرَاتِ",
    "explanation": "Jangan menunda amal shalih hingga esok tiba,\nKarena esok belum pasti menjadi milik kita.\nBerlombalah dalam kebaikan saat raga masih bernyawa,\nSebelum datang masa penyesalan di alam baka.",
    "id": 228
  },
  {
    "title": "Keutamaan Istighfar",
    "quranSource": "QS. Nuh: 10-11",
    "arabic": "فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا",
    "explanation": "Bila jalan terasa buntu dan masalah menghimpit,\nPerbanyaklah istighfar walau hati terasa sempit.\nIa membuka pintu rezeki yang tadinya tertutup,\nMenghadirkan ketenangan dalam jiwa yang redup.",
    "id": 229
  },
  {
    "title": "Menjaga Shalat Subuh",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ صَلَّى الصُّبْحَ فَهُوَ فِي ذِمَّةِ اللَّهِ",
    "explanation": "Udara pagi yang segar menjadi saksi,\nBagi hamba yang rela meninggalkan mimpi.\nShalat subuh menjamin dirimu dalam perlindungan Ilahi,\nMemulai hari dengan berkah yang suci.",
    "id": 230
  },
  {
    "title": "Adab Berpakaian",
    "quranSource": "QS. Al-A'raf: 26",
    "arabic": "وَلِبَاسُ التَّقْوَىٰ ذَٰلِكَ خَيْرٌ",
    "explanation": "Pakaian indah menutup aurat dan menghias raga,\nNamun ada yang lebih mulia dari sehelai sutra.\nItulah pakaian taqwa, penjaga jiwa dan etika,\nMembuatmu terhormat di mata manusia dan Pencipta.",
    "id": 231
  },
  {
    "title": "Sifat Malu",
    "hadithSource": "HR. Bukhari",
    "arabic": "الْحَيَاءُ لَا يَأْتِي إِلَّا بِخَيْرٍ",
    "explanation": "Malu berbuat maksiat di saat sendirian,\nMalu melanggar titah Sang Rahman.\nSifat malu adalah mahkota keimanan,\nYang senantiasa mendatangkan segala kebaikan.",
    "id": 232
  },
  {
    "title": "Menghindari Marah",
    "hadithSource": "HR. Bukhari",
    "arabic": "لَا تَغْضَبْ وَلَكَ الْجَنَّةُ",
    "explanation": "Amarah yang memuncak bagaikan api neraka,\nMembakar akal sehat dan merusak segala cinta.\nTahanlah emosimu, kendalikan asa,\nKarena surga menanti mereka yang sabar menjaga.",
    "id": 233
  },
  {
    "title": "Membaca Al-Qur'an",
    "hadithSource": "HR. Muslim",
    "arabic": "اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لأَصْحَابِهِ",
    "explanation": "Buku kehidupan penyejuk jiwa yang lara,\nBukan sekadar pajangan berdebu di lemari kaca.\nBacalah ayatnya, tadabburi maknanya,\nKelak ia datang sebagai pemberi syafa'at di padang mahsyar.",
    "id": 234
  },
  {
    "title": "Qana'ah (Merasa Cukup)",
    "hadithSource": "HR. Muslim",
    "arabic": "قَدْ أَفْلَحَ مَنْ أَسْلَمَ وَرُزِقَ كَفَافًا وَقَنَّعَهُ اللَّهُ بِمَا آتَاهُ",
    "explanation": "Bukan tentang seberapa banyak harta yang terkumpul,\nNamun tentang hati yang bersyukur dan tidak memukul.\nQana'ah membuat hidup terasa ringan dan damai,\nMenjadi orang kaya yang sejati nan pandai.",
    "id": 235
  },
  {
    "title": "Pentingnya Doa Ibu",
    "hadithSource": "HR. Tirmidzi",
    "arabic": "رِضَا الرَّبِّ فِي رِضَا الْوَالِدِ وَسَخَطُ الرَّبِّ فِي سَخَطِ الْوَالِدِ",
    "explanation": "Jangan pernah remehkan air mata ibumu,\nSetiap tetesnya bisa menjadi penentu nasibmu.\nDoanya sanggup menembus langit ketujuh,\nMeraih ridha-Nya, menggapai sukses yang teguh.",
    "id": 236
  },
  {
    "title": "Sabar dalam Ujian",
    "quranSource": "QS. Al-Baqarah: 153",
    "arabic": "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
    "explanation": "Meski badai ujian datang silih berganti,\nSabar adalah sauh agar perahu tak mati.\nUsap dadamu dan pautkan asamu pada Ilahi,\nDi setiap kesulitan ada kemudahan yang menanti.",
    "id": 237
  },
  {
    "title": "Rasa Syukur",
    "quranSource": "QS. Ibrahim: 7",
    "arabic": "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    "explanation": "Syukurilah nikmat dari Sang Ilahi,\nBerapapun rezeki yang kau dapati hari ini.\nJiwa yang ruku' dalam kepasrahan dan berserah,\nAkan mengundang turunnya beribu rahmat dan berkah.",
    "id": 238
  },
  {
    "title": "Menjernihkan Hati (Dzikir)",
    "quranSource": "QS. Ar-Ra'd: 28",
    "arabic": "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    "explanation": "Jika sepi menyelimuti jiwa dalam gulita,\nMengingat-Nya adalah lentera di atas lentera.\nSatu tasbih mengikis noda dan resah di dada,\nBersama Allah, segala beban pasti sirna.",
    "id": 239
  },
  {
    "title": "Shalat Tiang Agama",
    "hadithSource": "HR. Abu Daud",
    "arabic": "إِنَّ أَوَّلَ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ مِنْ عَمَلِهِ صَلاتُهُ",
    "explanation": "Sesibuk apapun urusan duniamu melanda,\nJangan biarkan shalat luput dari pandang mata.\nShalat adalah pelita di gelap gulita alam baka,\nPenentu utama saat engkau berhadapan dengan-Nya.",
    "id": 240
  },
  {
    "title": "Tawakkal",
    "quranSource": "QS. At-Talaq: 3",
    "arabic": "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    "explanation": "Jika ikhtiar maksimal sudah tercurahkan,\nLepaskan resah, serahkan pada kekuasaan Tuhan.\nTak akan kecewa hati yang tulus menyerahkan,\nKarena skenario-Nya tak pernah salah tujuan.",
    "id": 241
  },
  {
    "title": "Taubat dan Ampunan",
    "quranSource": "QS. Az-Zumar: 53",
    "arabic": "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
    "explanation": "Meski tubuh pernah berlumur khilaf dan dosa,\nPintu ampunan-Nya tak pernah tertutup selamanya.\nTeteskan air mata taubat yang penuh makna,\nAmpunan-Nya selalu seluas cakrawala.",
    "id": 242
  },
  {
    "title": "Ukhuwah Islamiyah",
    "hadithSource": "HR. Bukhari",
    "arabic": "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    "explanation": "Hapus dendam yang membara di dalam jiwa,\nSenyumanmu pada sesama adalah sedekah termulia.\nGenggam tangan saudaramu eratkan ikatan cinta,\nMalaikat pun turun merestui ukhuwah kita.",
    "id": 243
  },
  {
    "title": "Dunia Hanya Sementara",
    "quranSource": "QS. Al-Hadid: 20",
    "arabic": "وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا مَتَاعُ الْغُرُورِ",
    "explanation": "Harta, tahta, dan paras hanya titipan semata,\nKain kafan kelak tak memiliki saku penyimpan harta.\nBangunlah rumah abadi di surga sebelum masa tiba,\nKelak engkau tersenyum manis di ujung usia.",
    "id": 244
  },
  {
    "title": "Kejujuran dan Lisan",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    "explanation": "Berkata jujur walau terkadang terasa getir di lisan,\nHanya kata-kata bermakna yang pantas diucapkan.\nSampaikan kebenaran dengan kelembutan dan kesabaran,\nKelak lisanmu akan selamat dari pedihnya siksaan.",
    "id": 245
  },
  {
    "title": "Berbakti kepada Orang Tua",
    "quranSource": "QS. Al-Isra: 23",
    "arabic": "وَبِالْوَالِدَيْنِ إِحْسَانًا",
    "explanation": "Surga merunduk di bawah telapak kaki ibu,\nDan keridhaan ayah adalah sayap kesuksesanmu.\nRawatlah mereka selagi nafas masih menderu,\nSebagaimana mereka merawatmu di waktu dulu.",
    "id": 246
  },
  {
    "title": "Husnudzon (Berbaik Sangka)",
    "hadithSource": "Hadits Qudsi HR. Bukhari",
    "arabic": "أَنَا عِنْدَ ظَنِّ عَبْدِي بِي",
    "explanation": "Jangan mudah mengeluh atas takdir yang pahit,\nMungkin Allah sedang menyiapkan senyum yang legit.\nBerbaik sangkalah pada Sang Maha Pengatur,\nAgar hatimu damai dan tidurmu selalu nyenyak terlelap.",
    "id": 247
  },
  {
    "title": "Kemuliaan Menuntut Ilmu",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    "explanation": "Ilmu adalah pelita penuntun langkah di kegelapan,\nMengangkat derajat hamba melampaui gemerlap kekayaan.\nTuntutlah ilmu dari buaian hingga ke liang lahat,\nIa adalah warisan para Nabi dan bekal paling bermanfaat.",
    "id": 248
  },
  {
    "title": "Khusyu' Dalam Shalat",
    "quranSource": "QS. Al-Mu'minun: 1-2",
    "arabic": "قَدْ أَفْلَحَ الْمُؤْمِنُونَ - الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ",
    "explanation": "Menghadap kiblat jangan sekadar membalikkan badan,\nHadirkan hatimu sepenuhnya pada Tuhan Semesta Alam.\nShalat yang khusyu' menenangkan setiap kepanikan,\nMenjadikan kehidupanmu selaras, tenang dan tentram.",
    "id": 249
  },
  {
    "title": "Mengelola Waktu dengan Bijak",
    "quranSource": "QS. Al-'Asr: 1-2",
    "arabic": "وَالْعَصْرِ - إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
    "explanation": "Waktu yang berlalu takkan mungkin kembali berputar,\nJangan biarkan ia habis untuk hal yang hambar.\nIsilah pergantian siang dan malam dengan zikir dan sabar,\nKelak engkau tak merugi saat kiamat membakar.",
    "id": 250
  },
  {
    "title": "Menghindari Sifat Sombong",
    "hadithSource": "HR. Muslim",
    "arabic": "لَا يَدْخُلُ الْجَنَّةَ مَنْ كَانَ فِي قَلْبِهِ مِثْقَالُ ذَرَّةٍ مِنْ كِبْرٍ",
    "explanation": "Setitik debu kesombongan dalam relung hati,\nCukup untuk menutup pintu surga dari diri ini.\nIngatlah asalmmu yang hanya dari setetes mani,\nDan tempat kembalimu hanyalah segunduk tanah sepi.",
    "id": 251
  },
  {
    "title": "Membantu Kesulitan Saudara",
    "hadithSource": "HR. Muslim",
    "arabic": "وَاللَّهُ فِى عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِى عَوْنِ أَخِيهِ",
    "explanation": "Ringankan tanganmu membantu mereka yang kesusahan,\nSeburuk apapun kondisimu, jadilah perantara kebaikan.\nSiapa yang melapangkan dada saudaranya dari kesulitan,\nKelak Allah akan menolongnya di hari kebangkitan.",
    "id": 252
  },
  {
    "title": "Keikhlasan Dalam Beramal",
    "quranSource": "QS. Al-Bayyinah: 5",
    "arabic": "وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ",
    "explanation": "Segala amal ibadah yang tak dilandasi ikhlas,\nIbarat membangun rumah di atas pasir yang lepas.\nTuluskan niat hanya untuk mengharap ridha-Nya,\nKelak pahala dan berkah akan mengalir tanpa batas.",
    "id": 253
  },
  {
    "title": "Menjaga Lisan (Ghibah)",
    "quranSource": "QS. Al-Hujurat: 12",
    "arabic": "وَلَا يَغْتَب بَّعْضُكُم بَعْضًا",
    "explanation": "Tajamnya pedang dapat menyayat raga,\nNamun tajamnya lisan menusuk hingga ke jiwa.\nTahanlah lisan dari membicarakan aib sesama,\nKarena ghibah itu memakan daging saudara.",
    "id": 254
  },
  {
    "title": "Memaafkan Sesama",
    "quranSource": "QS. Ali 'Imran: 134",
    "arabic": "وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ",
    "explanation": "Menyimpan dendam bagai menggenggam bara,\nHanya melukai diri yang menahannya.\nMaafkanlah mereka yang pernah membuatmu terluka,\nSungguh Allah mencintai hamba yang berlapang dada.",
    "id": 255
  },
  {
    "title": "Menyambung Silaturahmi",
    "hadithSource": "HR. Bukhari",
    "arabic": "مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ، وَأَنْ يُنْسَأَ لَهُ فِي أَثَرِهِ، فَلْيَصِلْ رَحِمَهُ",
    "explanation": "Bila rezeki terasa seret dan tak menentu,\nCobalah ketuk pintu kerabat yang telah lama jauh darimu.\nSilaturahmi itu merekatkan hati yang beku,\nMemanjangkan umur dan meluaskan rezekimu.",
    "id": 256
  },
  {
    "title": "Mengingat Kematian",
    "quranSource": "QS. Ali 'Imran: 185",
    "arabic": "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ",
    "explanation": "Setiap jiwa pasti akan mereguk kepulangan,\nMenuju keabadian dan meninggalkan kefanaan.\nPersiapkanlah amal sebelum datangnya panggilan,\nKarena dunia ini hanyalah tempat persinggahan.",
    "id": 257
  },
  {
    "title": "Sedekah Melapangkan Rezeki",
    "quranSource": "QS. Saba: 39",
    "arabic": "وَمَا أَنفَقْتُم مِّن شَيْءٍ فَهُوَ يُخْلِفُهُ",
    "explanation": "Jangan takut miskin karena memberi,\nAllah yang Maha Kaya yang akan mengganti.\nSepercik sedekah yang kau beri saat ini,\nKelak meneduhkanmu di hari akhir nanti.",
    "id": 258
  },
  {
    "title": "Doa Mustajab di Sepertiga Malam",
    "hadithSource": "HR. Bukhari & Muslim",
    "arabic": "يَنْزِلُ رَبُّنَا تَبَارَكَ وَتَعَالَى كُلَّ لَيْلَةٍ إِلَى السَّمَاءِ الدُّنْيَا حِينَ يَبْقَى ثُلُثُ اللَّيْلِ الآخِرُ",
    "explanation": "Di kala dunia tertidur lelap dalam sunyi,\nBangunlah, bentangkan sajadahmu di malam sepi.\nSampaikan keluh kesahmu pada Sang Ilahi,\nDoa di sepertiga malam bagai anak panah yang pasti.",
    "id": 259
  },
  {
    "title": "Menebar Salam",
    "hadithSource": "HR. Muslim",
    "arabic": "أَفْشُوا السَّلَامَ بَيْنَكُمْ",
    "explanation": "Ucapkanlah salam pada yang kau kenal dan tidak kenal,\nSebuah sapaan ringan namun berpahala kekal.\nSalam menumbuhkan cinta di antara umat,\nMenyatukan hati dalam ikatan yang erat.",
    "id": 260
  },
  {
    "title": "Menghormati Tetangga",
    "hadithSource": "HR. Bukhari",
    "arabic": "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ جَارَهُ",
    "explanation": "Tetangga adalah saudara terdekat di kala duka,\nYang pertama datang bila bencana melanda.\nBerbuat baiklah dan jangan sakiti hatinya,\nItulah tanda iman yang luhur dan mulia.",
    "id": 261
  },
  {
    "title": "Kasih Sayang Kepada Anak Yatim",
    "hadithSource": "HR. Bukhari",
    "arabic": "أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ هَكَذَا",
    "explanation": "Usaplah kepala yatim dengan penuh kelembutan,\nBerikan mereka pelukan dan juga harapan.\nSiapa yang mengasihi mereka dengan ketulusan,\nKelak bersanding dengan Nabi di surga idaman.",
    "id": 262
  },
  {
    "title": "Rendah Hati (Tawadhu')",
    "hadithSource": "HR. Muslim",
    "arabic": "وَمَا تَوَاضَعَ أَحَدٌ لِلَّهِ إِلَّا رَفَعَهُ اللَّهُ",
    "explanation": "Seperti padi yang kian merunduk saat berisi,\nBegitulah jiwa yang berilmu dan rendah hati.\nJanganlah sombong menepuk dada sendiri,\nKarena Allah mengangkat derajat mereka yang tawadhu'.",
    "id": 263
  },
  {
    "title": "Bersegera dalam Kebaikan",
    "quranSource": "QS. Al-Baqarah: 148",
    "arabic": "فَاسْتَبِقُوا الْخَيْرَاتِ",
    "explanation": "Jangan menunda amal shalih hingga esok tiba,\nKarena esok belum pasti menjadi milik kita.\nBerlombalah dalam kebaikan saat raga masih bernyawa,\nSebelum datang masa penyesalan di alam baka.",
    "id": 264
  },
  {
    "title": "Keutamaan Istighfar",
    "quranSource": "QS. Nuh: 10-11",
    "arabic": "فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا",
    "explanation": "Bila jalan terasa buntu dan masalah menghimpit,\nPerbanyaklah istighfar walau hati terasa sempit.\nIa membuka pintu rezeki yang tadinya tertutup,\nMenghadirkan ketenangan dalam jiwa yang redup.",
    "id": 265
  },
  {
    "title": "Menjaga Shalat Subuh",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ صَلَّى الصُّبْحَ فَهُوَ فِي ذِمَّةِ اللَّهِ",
    "explanation": "Udara pagi yang segar menjadi saksi,\nBagi hamba yang rela meninggalkan mimpi.\nShalat subuh menjamin dirimu dalam perlindungan Ilahi,\nMemulai hari dengan berkah yang suci.",
    "id": 266
  },
  {
    "title": "Adab Berpakaian",
    "quranSource": "QS. Al-A'raf: 26",
    "arabic": "وَلِبَاسُ التَّقْوَىٰ ذَٰلِكَ خَيْرٌ",
    "explanation": "Pakaian indah menutup aurat dan menghias raga,\nNamun ada yang lebih mulia dari sehelai sutra.\nItulah pakaian taqwa, penjaga jiwa dan etika,\nMembuatmu terhormat di mata manusia dan Pencipta.",
    "id": 267
  },
  {
    "title": "Sifat Malu",
    "hadithSource": "HR. Bukhari",
    "arabic": "الْحَيَاءُ لَا يَأْتِي إِلَّا بِخَيْرٍ",
    "explanation": "Malu berbuat maksiat di saat sendirian,\nMalu melanggar titah Sang Rahman.\nSifat malu adalah mahkota keimanan,\nYang senantiasa mendatangkan segala kebaikan.",
    "id": 268
  },
  {
    "title": "Menghindari Marah",
    "hadithSource": "HR. Bukhari",
    "arabic": "لَا تَغْضَبْ وَلَكَ الْجَنَّةُ",
    "explanation": "Amarah yang memuncak bagaikan api neraka,\nMembakar akal sehat dan merusak segala cinta.\nTahanlah emosimu, kendalikan asa,\nKarena surga menanti mereka yang sabar menjaga.",
    "id": 269
  },
  {
    "title": "Membaca Al-Qur'an",
    "hadithSource": "HR. Muslim",
    "arabic": "اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لأَصْحَابِهِ",
    "explanation": "Buku kehidupan penyejuk jiwa yang lara,\nBukan sekadar pajangan berdebu di lemari kaca.\nBacalah ayatnya, tadabburi maknanya,\nKelak ia datang sebagai pemberi syafa'at di padang mahsyar.",
    "id": 270
  },
  {
    "title": "Qana'ah (Merasa Cukup)",
    "hadithSource": "HR. Muslim",
    "arabic": "قَدْ أَفْلَحَ مَنْ أَسْلَمَ وَرُزِقَ كَفَافًا وَقَنَّعَهُ اللَّهُ بِمَا آتَاهُ",
    "explanation": "Bukan tentang seberapa banyak harta yang terkumpul,\nNamun tentang hati yang bersyukur dan tidak memukul.\nQana'ah membuat hidup terasa ringan dan damai,\nMenjadi orang kaya yang sejati nan pandai.",
    "id": 271
  },
  {
    "title": "Pentingnya Doa Ibu",
    "hadithSource": "HR. Tirmidzi",
    "arabic": "رِضَا الرَّبِّ فِي رِضَا الْوَالِدِ وَسَخَطُ الرَّبِّ فِي سَخَطِ الْوَالِدِ",
    "explanation": "Jangan pernah remehkan air mata ibumu,\nSetiap tetesnya bisa menjadi penentu nasibmu.\nDoanya sanggup menembus langit ketujuh,\nMeraih ridha-Nya, menggapai sukses yang teguh.",
    "id": 272
  },
  {
    "title": "Sabar dalam Ujian",
    "quranSource": "QS. Al-Baqarah: 153",
    "arabic": "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
    "explanation": "Meski badai ujian datang silih berganti,\nSabar adalah sauh agar perahu tak mati.\nUsap dadamu dan pautkan asamu pada Ilahi,\nDi setiap kesulitan ada kemudahan yang menanti.",
    "id": 273
  },
  {
    "title": "Rasa Syukur",
    "quranSource": "QS. Ibrahim: 7",
    "arabic": "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    "explanation": "Syukurilah nikmat dari Sang Ilahi,\nBerapapun rezeki yang kau dapati hari ini.\nJiwa yang ruku' dalam kepasrahan dan berserah,\nAkan mengundang turunnya beribu rahmat dan berkah.",
    "id": 274
  },
  {
    "title": "Menjernihkan Hati (Dzikir)",
    "quranSource": "QS. Ar-Ra'd: 28",
    "arabic": "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    "explanation": "Jika sepi menyelimuti jiwa dalam gulita,\nMengingat-Nya adalah lentera di atas lentera.\nSatu tasbih mengikis noda dan resah di dada,\nBersama Allah, segala beban pasti sirna.",
    "id": 275
  },
  {
    "title": "Shalat Tiang Agama",
    "hadithSource": "HR. Abu Daud",
    "arabic": "إِنَّ أَوَّلَ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ مِنْ عَمَلِهِ صَلاتُهُ",
    "explanation": "Sesibuk apapun urusan duniamu melanda,\nJangan biarkan shalat luput dari pandang mata.\nShalat adalah pelita di gelap gulita alam baka,\nPenentu utama saat engkau berhadapan dengan-Nya.",
    "id": 276
  },
  {
    "title": "Tawakkal",
    "quranSource": "QS. At-Talaq: 3",
    "arabic": "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    "explanation": "Jika ikhtiar maksimal sudah tercurahkan,\nLepaskan resah, serahkan pada kekuasaan Tuhan.\nTak akan kecewa hati yang tulus menyerahkan,\nKarena skenario-Nya tak pernah salah tujuan.",
    "id": 277
  },
  {
    "title": "Taubat dan Ampunan",
    "quranSource": "QS. Az-Zumar: 53",
    "arabic": "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
    "explanation": "Meski tubuh pernah berlumur khilaf dan dosa,\nPintu ampunan-Nya tak pernah tertutup selamanya.\nTeteskan air mata taubat yang penuh makna,\nAmpunan-Nya selalu seluas cakrawala.",
    "id": 278
  },
  {
    "title": "Ukhuwah Islamiyah",
    "hadithSource": "HR. Bukhari",
    "arabic": "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    "explanation": "Hapus dendam yang membara di dalam jiwa,\nSenyumanmu pada sesama adalah sedekah termulia.\nGenggam tangan saudaramu eratkan ikatan cinta,\nMalaikat pun turun merestui ukhuwah kita.",
    "id": 279
  },
  {
    "title": "Dunia Hanya Sementara",
    "quranSource": "QS. Al-Hadid: 20",
    "arabic": "وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا مَتَاعُ الْغُرُورِ",
    "explanation": "Harta, tahta, dan paras hanya titipan semata,\nKain kafan kelak tak memiliki saku penyimpan harta.\nBangunlah rumah abadi di surga sebelum masa tiba,\nKelak engkau tersenyum manis di ujung usia.",
    "id": 280
  },
  {
    "title": "Kejujuran dan Lisan",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    "explanation": "Berkata jujur walau terkadang terasa getir di lisan,\nHanya kata-kata bermakna yang pantas diucapkan.\nSampaikan kebenaran dengan kelembutan dan kesabaran,\nKelak lisanmu akan selamat dari pedihnya siksaan.",
    "id": 281
  },
  {
    "title": "Berbakti kepada Orang Tua",
    "quranSource": "QS. Al-Isra: 23",
    "arabic": "وَبِالْوَالِدَيْنِ إِحْسَانًا",
    "explanation": "Surga merunduk di bawah telapak kaki ibu,\nDan keridhaan ayah adalah sayap kesuksesanmu.\nRawatlah mereka selagi nafas masih menderu,\nSebagaimana mereka merawatmu di waktu dulu.",
    "id": 282
  },
  {
    "title": "Husnudzon (Berbaik Sangka)",
    "hadithSource": "Hadits Qudsi HR. Bukhari",
    "arabic": "أَنَا عِنْدَ ظَنِّ عَبْدِي بِي",
    "explanation": "Jangan mudah mengeluh atas takdir yang pahit,\nMungkin Allah sedang menyiapkan senyum yang legit.\nBerbaik sangkalah pada Sang Maha Pengatur,\nAgar hatimu damai dan tidurmu selalu nyenyak terlelap.",
    "id": 283
  },
  {
    "title": "Kemuliaan Menuntut Ilmu",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    "explanation": "Ilmu adalah pelita penuntun langkah di kegelapan,\nMengangkat derajat hamba melampaui gemerlap kekayaan.\nTuntutlah ilmu dari buaian hingga ke liang lahat,\nIa adalah warisan para Nabi dan bekal paling bermanfaat.",
    "id": 284
  },
  {
    "title": "Khusyu' Dalam Shalat",
    "quranSource": "QS. Al-Mu'minun: 1-2",
    "arabic": "قَدْ أَفْلَحَ الْمُؤْمِنُونَ - الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ",
    "explanation": "Menghadap kiblat jangan sekadar membalikkan badan,\nHadirkan hatimu sepenuhnya pada Tuhan Semesta Alam.\nShalat yang khusyu' menenangkan setiap kepanikan,\nMenjadikan kehidupanmu selaras, tenang dan tentram.",
    "id": 285
  },
  {
    "title": "Mengelola Waktu dengan Bijak",
    "quranSource": "QS. Al-'Asr: 1-2",
    "arabic": "وَالْعَصْرِ - إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
    "explanation": "Waktu yang berlalu takkan mungkin kembali berputar,\nJangan biarkan ia habis untuk hal yang hambar.\nIsilah pergantian siang dan malam dengan zikir dan sabar,\nKelak engkau tak merugi saat kiamat membakar.",
    "id": 286
  },
  {
    "title": "Menghindari Sifat Sombong",
    "hadithSource": "HR. Muslim",
    "arabic": "لَا يَدْخُلُ الْجَنَّةَ مَنْ كَانَ فِي قَلْبِهِ مِثْقَالُ ذَرَّةٍ مِنْ كِبْرٍ",
    "explanation": "Setitik debu kesombongan dalam relung hati,\nCukup untuk menutup pintu surga dari diri ini.\nIngatlah asalmmu yang hanya dari setetes mani,\nDan tempat kembalimu hanyalah segunduk tanah sepi.",
    "id": 287
  },
  {
    "title": "Membantu Kesulitan Saudara",
    "hadithSource": "HR. Muslim",
    "arabic": "وَاللَّهُ فِى عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِى عَوْنِ أَخِيهِ",
    "explanation": "Ringankan tanganmu membantu mereka yang kesusahan,\nSeburuk apapun kondisimu, jadilah perantara kebaikan.\nSiapa yang melapangkan dada saudaranya dari kesulitan,\nKelak Allah akan menolongnya di hari kebangkitan.",
    "id": 288
  },
  {
    "title": "Keikhlasan Dalam Beramal",
    "quranSource": "QS. Al-Bayyinah: 5",
    "arabic": "وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ",
    "explanation": "Segala amal ibadah yang tak dilandasi ikhlas,\nIbarat membangun rumah di atas pasir yang lepas.\nTuluskan niat hanya untuk mengharap ridha-Nya,\nKelak pahala dan berkah akan mengalir tanpa batas.",
    "id": 289
  },
  {
    "title": "Menjaga Lisan (Ghibah)",
    "quranSource": "QS. Al-Hujurat: 12",
    "arabic": "وَلَا يَغْتَب بَّعْضُكُم بَعْضًا",
    "explanation": "Tajamnya pedang dapat menyayat raga,\nNamun tajamnya lisan menusuk hingga ke jiwa.\nTahanlah lisan dari membicarakan aib sesama,\nKarena ghibah itu memakan daging saudara.",
    "id": 290
  },
  {
    "title": "Memaafkan Sesama",
    "quranSource": "QS. Ali 'Imran: 134",
    "arabic": "وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ",
    "explanation": "Menyimpan dendam bagai menggenggam bara,\nHanya melukai diri yang menahannya.\nMaafkanlah mereka yang pernah membuatmu terluka,\nSungguh Allah mencintai hamba yang berlapang dada.",
    "id": 291
  },
  {
    "title": "Menyambung Silaturahmi",
    "hadithSource": "HR. Bukhari",
    "arabic": "مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ، وَأَنْ يُنْسَأَ لَهُ فِي أَثَرِهِ، فَلْيَصِلْ رَحِمَهُ",
    "explanation": "Bila rezeki terasa seret dan tak menentu,\nCobalah ketuk pintu kerabat yang telah lama jauh darimu.\nSilaturahmi itu merekatkan hati yang beku,\nMemanjangkan umur dan meluaskan rezekimu.",
    "id": 292
  },
  {
    "title": "Mengingat Kematian",
    "quranSource": "QS. Ali 'Imran: 185",
    "arabic": "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ",
    "explanation": "Setiap jiwa pasti akan mereguk kepulangan,\nMenuju keabadian dan meninggalkan kefanaan.\nPersiapkanlah amal sebelum datangnya panggilan,\nKarena dunia ini hanyalah tempat persinggahan.",
    "id": 293
  },
  {
    "title": "Sedekah Melapangkan Rezeki",
    "quranSource": "QS. Saba: 39",
    "arabic": "وَمَا أَنفَقْتُم مِّن شَيْءٍ فَهُوَ يُخْلِفُهُ",
    "explanation": "Jangan takut miskin karena memberi,\nAllah yang Maha Kaya yang akan mengganti.\nSepercik sedekah yang kau beri saat ini,\nKelak meneduhkanmu di hari akhir nanti.",
    "id": 294
  },
  {
    "title": "Doa Mustajab di Sepertiga Malam",
    "hadithSource": "HR. Bukhari & Muslim",
    "arabic": "يَنْزِلُ رَبُّنَا تَبَارَكَ وَتَعَالَى كُلَّ لَيْلَةٍ إِلَى السَّمَاءِ الدُّنْيَا حِينَ يَبْقَى ثُلُثُ اللَّيْلِ الآخِرُ",
    "explanation": "Di kala dunia tertidur lelap dalam sunyi,\nBangunlah, bentangkan sajadahmu di malam sepi.\nSampaikan keluh kesahmu pada Sang Ilahi,\nDoa di sepertiga malam bagai anak panah yang pasti.",
    "id": 295
  },
  {
    "title": "Menebar Salam",
    "hadithSource": "HR. Muslim",
    "arabic": "أَفْشُوا السَّلَامَ بَيْنَكُمْ",
    "explanation": "Ucapkanlah salam pada yang kau kenal dan tidak kenal,\nSebuah sapaan ringan namun berpahala kekal.\nSalam menumbuhkan cinta di antara umat,\nMenyatukan hati dalam ikatan yang erat.",
    "id": 296
  },
  {
    "title": "Menghormati Tetangga",
    "hadithSource": "HR. Bukhari",
    "arabic": "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ جَارَهُ",
    "explanation": "Tetangga adalah saudara terdekat di kala duka,\nYang pertama datang bila bencana melanda.\nBerbuat baiklah dan jangan sakiti hatinya,\nItulah tanda iman yang luhur dan mulia.",
    "id": 297
  },
  {
    "title": "Kasih Sayang Kepada Anak Yatim",
    "hadithSource": "HR. Bukhari",
    "arabic": "أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ هَكَذَا",
    "explanation": "Usaplah kepala yatim dengan penuh kelembutan,\nBerikan mereka pelukan dan juga harapan.\nSiapa yang mengasihi mereka dengan ketulusan,\nKelak bersanding dengan Nabi di surga idaman.",
    "id": 298
  },
  {
    "title": "Rendah Hati (Tawadhu')",
    "hadithSource": "HR. Muslim",
    "arabic": "وَمَا تَوَاضَعَ أَحَدٌ لِلَّهِ إِلَّا رَفَعَهُ اللَّهُ",
    "explanation": "Seperti padi yang kian merunduk saat berisi,\nBegitulah jiwa yang berilmu dan rendah hati.\nJanganlah sombong menepuk dada sendiri,\nKarena Allah mengangkat derajat mereka yang tawadhu'.",
    "id": 299
  },
  {
    "title": "Bersegera dalam Kebaikan",
    "quranSource": "QS. Al-Baqarah: 148",
    "arabic": "فَاسْتَبِقُوا الْخَيْرَاتِ",
    "explanation": "Jangan menunda amal shalih hingga esok tiba,\nKarena esok belum pasti menjadi milik kita.\nBerlombalah dalam kebaikan saat raga masih bernyawa,\nSebelum datang masa penyesalan di alam baka.",
    "id": 300
  },
  {
    "title": "Keutamaan Istighfar",
    "quranSource": "QS. Nuh: 10-11",
    "arabic": "فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا",
    "explanation": "Bila jalan terasa buntu dan masalah menghimpit,\nPerbanyaklah istighfar walau hati terasa sempit.\nIa membuka pintu rezeki yang tadinya tertutup,\nMenghadirkan ketenangan dalam jiwa yang redup.",
    "id": 301
  },
  {
    "title": "Menjaga Shalat Subuh",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ صَلَّى الصُّبْحَ فَهُوَ فِي ذِمَّةِ اللَّهِ",
    "explanation": "Udara pagi yang segar menjadi saksi,\nBagi hamba yang rela meninggalkan mimpi.\nShalat subuh menjamin dirimu dalam perlindungan Ilahi,\nMemulai hari dengan berkah yang suci.",
    "id": 302
  },
  {
    "title": "Adab Berpakaian",
    "quranSource": "QS. Al-A'raf: 26",
    "arabic": "وَلِبَاسُ التَّقْوَىٰ ذَٰلِكَ خَيْرٌ",
    "explanation": "Pakaian indah menutup aurat dan menghias raga,\nNamun ada yang lebih mulia dari sehelai sutra.\nItulah pakaian taqwa, penjaga jiwa dan etika,\nMembuatmu terhormat di mata manusia dan Pencipta.",
    "id": 303
  },
  {
    "title": "Sifat Malu",
    "hadithSource": "HR. Bukhari",
    "arabic": "الْحَيَاءُ لَا يَأْتِي إِلَّا بِخَيْرٍ",
    "explanation": "Malu berbuat maksiat di saat sendirian,\nMalu melanggar titah Sang Rahman.\nSifat malu adalah mahkota keimanan,\nYang senantiasa mendatangkan segala kebaikan.",
    "id": 304
  },
  {
    "title": "Menghindari Marah",
    "hadithSource": "HR. Bukhari",
    "arabic": "لَا تَغْضَبْ وَلَكَ الْجَنَّةُ",
    "explanation": "Amarah yang memuncak bagaikan api neraka,\nMembakar akal sehat dan merusak segala cinta.\nTahanlah emosimu, kendalikan asa,\nKarena surga menanti mereka yang sabar menjaga.",
    "id": 305
  },
  {
    "title": "Membaca Al-Qur'an",
    "hadithSource": "HR. Muslim",
    "arabic": "اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لأَصْحَابِهِ",
    "explanation": "Buku kehidupan penyejuk jiwa yang lara,\nBukan sekadar pajangan berdebu di lemari kaca.\nBacalah ayatnya, tadabburi maknanya,\nKelak ia datang sebagai pemberi syafa'at di padang mahsyar.",
    "id": 306
  },
  {
    "title": "Qana'ah (Merasa Cukup)",
    "hadithSource": "HR. Muslim",
    "arabic": "قَدْ أَفْلَحَ مَنْ أَسْلَمَ وَرُزِقَ كَفَافًا وَقَنَّعَهُ اللَّهُ بِمَا آتَاهُ",
    "explanation": "Bukan tentang seberapa banyak harta yang terkumpul,\nNamun tentang hati yang bersyukur dan tidak memukul.\nQana'ah membuat hidup terasa ringan dan damai,\nMenjadi orang kaya yang sejati nan pandai.",
    "id": 307
  },
  {
    "title": "Pentingnya Doa Ibu",
    "hadithSource": "HR. Tirmidzi",
    "arabic": "رِضَا الرَّبِّ فِي رِضَا الْوَالِدِ وَسَخَطُ الرَّبِّ فِي سَخَطِ الْوَالِدِ",
    "explanation": "Jangan pernah remehkan air mata ibumu,\nSetiap tetesnya bisa menjadi penentu nasibmu.\nDoanya sanggup menembus langit ketujuh,\nMeraih ridha-Nya, menggapai sukses yang teguh.",
    "id": 308
  },
  {
    "title": "Sabar dalam Ujian",
    "quranSource": "QS. Al-Baqarah: 153",
    "arabic": "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
    "explanation": "Meski badai ujian datang silih berganti,\nSabar adalah sauh agar perahu tak mati.\nUsap dadamu dan pautkan asamu pada Ilahi,\nDi setiap kesulitan ada kemudahan yang menanti.",
    "id": 309
  },
  {
    "title": "Rasa Syukur",
    "quranSource": "QS. Ibrahim: 7",
    "arabic": "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    "explanation": "Syukurilah nikmat dari Sang Ilahi,\nBerapapun rezeki yang kau dapati hari ini.\nJiwa yang ruku' dalam kepasrahan dan berserah,\nAkan mengundang turunnya beribu rahmat dan berkah.",
    "id": 310
  },
  {
    "title": "Menjernihkan Hati (Dzikir)",
    "quranSource": "QS. Ar-Ra'd: 28",
    "arabic": "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    "explanation": "Jika sepi menyelimuti jiwa dalam gulita,\nMengingat-Nya adalah lentera di atas lentera.\nSatu tasbih mengikis noda dan resah di dada,\nBersama Allah, segala beban pasti sirna.",
    "id": 311
  },
  {
    "title": "Shalat Tiang Agama",
    "hadithSource": "HR. Abu Daud",
    "arabic": "إِنَّ أَوَّلَ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ مِنْ عَمَلِهِ صَلاتُهُ",
    "explanation": "Sesibuk apapun urusan duniamu melanda,\nJangan biarkan shalat luput dari pandang mata.\nShalat adalah pelita di gelap gulita alam baka,\nPenentu utama saat engkau berhadapan dengan-Nya.",
    "id": 312
  },
  {
    "title": "Tawakkal",
    "quranSource": "QS. At-Talaq: 3",
    "arabic": "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    "explanation": "Jika ikhtiar maksimal sudah tercurahkan,\nLepaskan resah, serahkan pada kekuasaan Tuhan.\nTak akan kecewa hati yang tulus menyerahkan,\nKarena skenario-Nya tak pernah salah tujuan.",
    "id": 313
  },
  {
    "title": "Taubat dan Ampunan",
    "quranSource": "QS. Az-Zumar: 53",
    "arabic": "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
    "explanation": "Meski tubuh pernah berlumur khilaf dan dosa,\nPintu ampunan-Nya tak pernah tertutup selamanya.\nTeteskan air mata taubat yang penuh makna,\nAmpunan-Nya selalu seluas cakrawala.",
    "id": 314
  },
  {
    "title": "Ukhuwah Islamiyah",
    "hadithSource": "HR. Bukhari",
    "arabic": "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    "explanation": "Hapus dendam yang membara di dalam jiwa,\nSenyumanmu pada sesama adalah sedekah termulia.\nGenggam tangan saudaramu eratkan ikatan cinta,\nMalaikat pun turun merestui ukhuwah kita.",
    "id": 315
  },
  {
    "title": "Dunia Hanya Sementara",
    "quranSource": "QS. Al-Hadid: 20",
    "arabic": "وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا مَتَاعُ الْغُرُورِ",
    "explanation": "Harta, tahta, dan paras hanya titipan semata,\nKain kafan kelak tak memiliki saku penyimpan harta.\nBangunlah rumah abadi di surga sebelum masa tiba,\nKelak engkau tersenyum manis di ujung usia.",
    "id": 316
  },
  {
    "title": "Kejujuran dan Lisan",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    "explanation": "Berkata jujur walau terkadang terasa getir di lisan,\nHanya kata-kata bermakna yang pantas diucapkan.\nSampaikan kebenaran dengan kelembutan dan kesabaran,\nKelak lisanmu akan selamat dari pedihnya siksaan.",
    "id": 317
  },
  {
    "title": "Berbakti kepada Orang Tua",
    "quranSource": "QS. Al-Isra: 23",
    "arabic": "وَبِالْوَالِدَيْنِ إِحْسَانًا",
    "explanation": "Surga merunduk di bawah telapak kaki ibu,\nDan keridhaan ayah adalah sayap kesuksesanmu.\nRawatlah mereka selagi nafas masih menderu,\nSebagaimana mereka merawatmu di waktu dulu.",
    "id": 318
  },
  {
    "title": "Husnudzon (Berbaik Sangka)",
    "hadithSource": "Hadits Qudsi HR. Bukhari",
    "arabic": "أَنَا عِنْدَ ظَنِّ عَبْدِي بِي",
    "explanation": "Jangan mudah mengeluh atas takdir yang pahit,\nMungkin Allah sedang menyiapkan senyum yang legit.\nBerbaik sangkalah pada Sang Maha Pengatur,\nAgar hatimu damai dan tidurmu selalu nyenyak terlelap.",
    "id": 319
  },
  {
    "title": "Kemuliaan Menuntut Ilmu",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    "explanation": "Ilmu adalah pelita penuntun langkah di kegelapan,\nMengangkat derajat hamba melampaui gemerlap kekayaan.\nTuntutlah ilmu dari buaian hingga ke liang lahat,\nIa adalah warisan para Nabi dan bekal paling bermanfaat.",
    "id": 320
  },
  {
    "title": "Khusyu' Dalam Shalat",
    "quranSource": "QS. Al-Mu'minun: 1-2",
    "arabic": "قَدْ أَفْلَحَ الْمُؤْمِنُونَ - الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ",
    "explanation": "Menghadap kiblat jangan sekadar membalikkan badan,\nHadirkan hatimu sepenuhnya pada Tuhan Semesta Alam.\nShalat yang khusyu' menenangkan setiap kepanikan,\nMenjadikan kehidupanmu selaras, tenang dan tentram.",
    "id": 321
  },
  {
    "title": "Mengelola Waktu dengan Bijak",
    "quranSource": "QS. Al-'Asr: 1-2",
    "arabic": "وَالْعَصْرِ - إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
    "explanation": "Waktu yang berlalu takkan mungkin kembali berputar,\nJangan biarkan ia habis untuk hal yang hambar.\nIsilah pergantian siang dan malam dengan zikir dan sabar,\nKelak engkau tak merugi saat kiamat membakar.",
    "id": 322
  },
  {
    "title": "Menghindari Sifat Sombong",
    "hadithSource": "HR. Muslim",
    "arabic": "لَا يَدْخُلُ الْجَنَّةَ مَنْ كَانَ فِي قَلْبِهِ مِثْقَالُ ذَرَّةٍ مِنْ كِبْرٍ",
    "explanation": "Setitik debu kesombongan dalam relung hati,\nCukup untuk menutup pintu surga dari diri ini.\nIngatlah asalmmu yang hanya dari setetes mani,\nDan tempat kembalimu hanyalah segunduk tanah sepi.",
    "id": 323
  },
  {
    "title": "Membantu Kesulitan Saudara",
    "hadithSource": "HR. Muslim",
    "arabic": "وَاللَّهُ فِى عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِى عَوْنِ أَخِيهِ",
    "explanation": "Ringankan tanganmu membantu mereka yang kesusahan,\nSeburuk apapun kondisimu, jadilah perantara kebaikan.\nSiapa yang melapangkan dada saudaranya dari kesulitan,\nKelak Allah akan menolongnya di hari kebangkitan.",
    "id": 324
  },
  {
    "title": "Keikhlasan Dalam Beramal",
    "quranSource": "QS. Al-Bayyinah: 5",
    "arabic": "وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ",
    "explanation": "Segala amal ibadah yang tak dilandasi ikhlas,\nIbarat membangun rumah di atas pasir yang lepas.\nTuluskan niat hanya untuk mengharap ridha-Nya,\nKelak pahala dan berkah akan mengalir tanpa batas.",
    "id": 325
  },
  {
    "title": "Menjaga Lisan (Ghibah)",
    "quranSource": "QS. Al-Hujurat: 12",
    "arabic": "وَلَا يَغْتَب بَّعْضُكُم بَعْضًا",
    "explanation": "Tajamnya pedang dapat menyayat raga,\nNamun tajamnya lisan menusuk hingga ke jiwa.\nTahanlah lisan dari membicarakan aib sesama,\nKarena ghibah itu memakan daging saudara.",
    "id": 326
  },
  {
    "title": "Memaafkan Sesama",
    "quranSource": "QS. Ali 'Imran: 134",
    "arabic": "وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ",
    "explanation": "Menyimpan dendam bagai menggenggam bara,\nHanya melukai diri yang menahannya.\nMaafkanlah mereka yang pernah membuatmu terluka,\nSungguh Allah mencintai hamba yang berlapang dada.",
    "id": 327
  },
  {
    "title": "Menyambung Silaturahmi",
    "hadithSource": "HR. Bukhari",
    "arabic": "مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ، وَأَنْ يُنْسَأَ لَهُ فِي أَثَرِهِ، فَلْيَصِلْ رَحِمَهُ",
    "explanation": "Bila rezeki terasa seret dan tak menentu,\nCobalah ketuk pintu kerabat yang telah lama jauh darimu.\nSilaturahmi itu merekatkan hati yang beku,\nMemanjangkan umur dan meluaskan rezekimu.",
    "id": 328
  },
  {
    "title": "Mengingat Kematian",
    "quranSource": "QS. Ali 'Imran: 185",
    "arabic": "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ",
    "explanation": "Setiap jiwa pasti akan mereguk kepulangan,\nMenuju keabadian dan meninggalkan kefanaan.\nPersiapkanlah amal sebelum datangnya panggilan,\nKarena dunia ini hanyalah tempat persinggahan.",
    "id": 329
  },
  {
    "title": "Sedekah Melapangkan Rezeki",
    "quranSource": "QS. Saba: 39",
    "arabic": "وَمَا أَنفَقْتُم مِّن شَيْءٍ فَهُوَ يُخْلِفُهُ",
    "explanation": "Jangan takut miskin karena memberi,\nAllah yang Maha Kaya yang akan mengganti.\nSepercik sedekah yang kau beri saat ini,\nKelak meneduhkanmu di hari akhir nanti.",
    "id": 330
  },
  {
    "title": "Doa Mustajab di Sepertiga Malam",
    "hadithSource": "HR. Bukhari & Muslim",
    "arabic": "يَنْزِلُ رَبُّنَا تَبَارَكَ وَتَعَالَى كُلَّ لَيْلَةٍ إِلَى السَّمَاءِ الدُّنْيَا حِينَ يَبْقَى ثُلُثُ اللَّيْلِ الآخِرُ",
    "explanation": "Di kala dunia tertidur lelap dalam sunyi,\nBangunlah, bentangkan sajadahmu di malam sepi.\nSampaikan keluh kesahmu pada Sang Ilahi,\nDoa di sepertiga malam bagai anak panah yang pasti.",
    "id": 331
  },
  {
    "title": "Menebar Salam",
    "hadithSource": "HR. Muslim",
    "arabic": "أَفْشُوا السَّلَامَ بَيْنَكُمْ",
    "explanation": "Ucapkanlah salam pada yang kau kenal dan tidak kenal,\nSebuah sapaan ringan namun berpahala kekal.\nSalam menumbuhkan cinta di antara umat,\nMenyatukan hati dalam ikatan yang erat.",
    "id": 332
  },
  {
    "title": "Menghormati Tetangga",
    "hadithSource": "HR. Bukhari",
    "arabic": "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ جَارَهُ",
    "explanation": "Tetangga adalah saudara terdekat di kala duka,\nYang pertama datang bila bencana melanda.\nBerbuat baiklah dan jangan sakiti hatinya,\nItulah tanda iman yang luhur dan mulia.",
    "id": 333
  },
  {
    "title": "Kasih Sayang Kepada Anak Yatim",
    "hadithSource": "HR. Bukhari",
    "arabic": "أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ هَكَذَا",
    "explanation": "Usaplah kepala yatim dengan penuh kelembutan,\nBerikan mereka pelukan dan juga harapan.\nSiapa yang mengasihi mereka dengan ketulusan,\nKelak bersanding dengan Nabi di surga idaman.",
    "id": 334
  },
  {
    "title": "Rendah Hati (Tawadhu')",
    "hadithSource": "HR. Muslim",
    "arabic": "وَمَا تَوَاضَعَ أَحَدٌ لِلَّهِ إِلَّا رَفَعَهُ اللَّهُ",
    "explanation": "Seperti padi yang kian merunduk saat berisi,\nBegitulah jiwa yang berilmu dan rendah hati.\nJanganlah sombong menepuk dada sendiri,\nKarena Allah mengangkat derajat mereka yang tawadhu'.",
    "id": 335
  },
  {
    "title": "Bersegera dalam Kebaikan",
    "quranSource": "QS. Al-Baqarah: 148",
    "arabic": "فَاسْتَبِقُوا الْخَيْرَاتِ",
    "explanation": "Jangan menunda amal shalih hingga esok tiba,\nKarena esok belum pasti menjadi milik kita.\nBerlombalah dalam kebaikan saat raga masih bernyawa,\nSebelum datang masa penyesalan di alam baka.",
    "id": 336
  },
  {
    "title": "Keutamaan Istighfar",
    "quranSource": "QS. Nuh: 10-11",
    "arabic": "فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا",
    "explanation": "Bila jalan terasa buntu dan masalah menghimpit,\nPerbanyaklah istighfar walau hati terasa sempit.\nIa membuka pintu rezeki yang tadinya tertutup,\nMenghadirkan ketenangan dalam jiwa yang redup.",
    "id": 337
  },
  {
    "title": "Menjaga Shalat Subuh",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ صَلَّى الصُّبْحَ فَهُوَ فِي ذِمَّةِ اللَّهِ",
    "explanation": "Udara pagi yang segar menjadi saksi,\nBagi hamba yang rela meninggalkan mimpi.\nShalat subuh menjamin dirimu dalam perlindungan Ilahi,\nMemulai hari dengan berkah yang suci.",
    "id": 338
  },
  {
    "title": "Adab Berpakaian",
    "quranSource": "QS. Al-A'raf: 26",
    "arabic": "وَلِبَاسُ التَّقْوَىٰ ذَٰلِكَ خَيْرٌ",
    "explanation": "Pakaian indah menutup aurat dan menghias raga,\nNamun ada yang lebih mulia dari sehelai sutra.\nItulah pakaian taqwa, penjaga jiwa dan etika,\nMembuatmu terhormat di mata manusia dan Pencipta.",
    "id": 339
  },
  {
    "title": "Sifat Malu",
    "hadithSource": "HR. Bukhari",
    "arabic": "الْحَيَاءُ لَا يَأْتِي إِلَّا بِخَيْرٍ",
    "explanation": "Malu berbuat maksiat di saat sendirian,\nMalu melanggar titah Sang Rahman.\nSifat malu adalah mahkota keimanan,\nYang senantiasa mendatangkan segala kebaikan.",
    "id": 340
  },
  {
    "title": "Menghindari Marah",
    "hadithSource": "HR. Bukhari",
    "arabic": "لَا تَغْضَبْ وَلَكَ الْجَنَّةُ",
    "explanation": "Amarah yang memuncak bagaikan api neraka,\nMembakar akal sehat dan merusak segala cinta.\nTahanlah emosimu, kendalikan asa,\nKarena surga menanti mereka yang sabar menjaga.",
    "id": 341
  },
  {
    "title": "Membaca Al-Qur'an",
    "hadithSource": "HR. Muslim",
    "arabic": "اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لأَصْحَابِهِ",
    "explanation": "Buku kehidupan penyejuk jiwa yang lara,\nBukan sekadar pajangan berdebu di lemari kaca.\nBacalah ayatnya, tadabburi maknanya,\nKelak ia datang sebagai pemberi syafa'at di padang mahsyar.",
    "id": 342
  },
  {
    "title": "Qana'ah (Merasa Cukup)",
    "hadithSource": "HR. Muslim",
    "arabic": "قَدْ أَفْلَحَ مَنْ أَسْلَمَ وَرُزِقَ كَفَافًا وَقَنَّعَهُ اللَّهُ بِمَا آتَاهُ",
    "explanation": "Bukan tentang seberapa banyak harta yang terkumpul,\nNamun tentang hati yang bersyukur dan tidak memukul.\nQana'ah membuat hidup terasa ringan dan damai,\nMenjadi orang kaya yang sejati nan pandai.",
    "id": 343
  },
  {
    "title": "Pentingnya Doa Ibu",
    "hadithSource": "HR. Tirmidzi",
    "arabic": "رِضَا الرَّبِّ فِي رِضَا الْوَالِدِ وَسَخَطُ الرَّبِّ فِي سَخَطِ الْوَالِدِ",
    "explanation": "Jangan pernah remehkan air mata ibumu,\nSetiap tetesnya bisa menjadi penentu nasibmu.\nDoanya sanggup menembus langit ketujuh,\nMeraih ridha-Nya, menggapai sukses yang teguh.",
    "id": 344
  },
  {
    "title": "Sabar dalam Ujian",
    "quranSource": "QS. Al-Baqarah: 153",
    "arabic": "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
    "explanation": "Meski badai ujian datang silih berganti,\nSabar adalah sauh agar perahu tak mati.\nUsap dadamu dan pautkan asamu pada Ilahi,\nDi setiap kesulitan ada kemudahan yang menanti.",
    "id": 345
  },
  {
    "title": "Rasa Syukur",
    "quranSource": "QS. Ibrahim: 7",
    "arabic": "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    "explanation": "Syukurilah nikmat dari Sang Ilahi,\nBerapapun rezeki yang kau dapati hari ini.\nJiwa yang ruku' dalam kepasrahan dan berserah,\nAkan mengundang turunnya beribu rahmat dan berkah.",
    "id": 346
  },
  {
    "title": "Menjernihkan Hati (Dzikir)",
    "quranSource": "QS. Ar-Ra'd: 28",
    "arabic": "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    "explanation": "Jika sepi menyelimuti jiwa dalam gulita,\nMengingat-Nya adalah lentera di atas lentera.\nSatu tasbih mengikis noda dan resah di dada,\nBersama Allah, segala beban pasti sirna.",
    "id": 347
  },
  {
    "title": "Shalat Tiang Agama",
    "hadithSource": "HR. Abu Daud",
    "arabic": "إِنَّ أَوَّلَ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ مِنْ عَمَلِهِ صَلاتُهُ",
    "explanation": "Sesibuk apapun urusan duniamu melanda,\nJangan biarkan shalat luput dari pandang mata.\nShalat adalah pelita di gelap gulita alam baka,\nPenentu utama saat engkau berhadapan dengan-Nya.",
    "id": 348
  },
  {
    "title": "Tawakkal",
    "quranSource": "QS. At-Talaq: 3",
    "arabic": "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    "explanation": "Jika ikhtiar maksimal sudah tercurahkan,\nLepaskan resah, serahkan pada kekuasaan Tuhan.\nTak akan kecewa hati yang tulus menyerahkan,\nKarena skenario-Nya tak pernah salah tujuan.",
    "id": 349
  },
  {
    "title": "Taubat dan Ampunan",
    "quranSource": "QS. Az-Zumar: 53",
    "arabic": "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
    "explanation": "Meski tubuh pernah berlumur khilaf dan dosa,\nPintu ampunan-Nya tak pernah tertutup selamanya.\nTeteskan air mata taubat yang penuh makna,\nAmpunan-Nya selalu seluas cakrawala.",
    "id": 350
  },
  {
    "title": "Ukhuwah Islamiyah",
    "hadithSource": "HR. Bukhari",
    "arabic": "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    "explanation": "Hapus dendam yang membara di dalam jiwa,\nSenyumanmu pada sesama adalah sedekah termulia.\nGenggam tangan saudaramu eratkan ikatan cinta,\nMalaikat pun turun merestui ukhuwah kita.",
    "id": 351
  },
  {
    "title": "Dunia Hanya Sementara",
    "quranSource": "QS. Al-Hadid: 20",
    "arabic": "وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا مَتَاعُ الْغُرُورِ",
    "explanation": "Harta, tahta, dan paras hanya titipan semata,\nKain kafan kelak tak memiliki saku penyimpan harta.\nBangunlah rumah abadi di surga sebelum masa tiba,\nKelak engkau tersenyum manis di ujung usia.",
    "id": 352
  },
  {
    "title": "Kejujuran dan Lisan",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    "explanation": "Berkata jujur walau terkadang terasa getir di lisan,\nHanya kata-kata bermakna yang pantas diucapkan.\nSampaikan kebenaran dengan kelembutan dan kesabaran,\nKelak lisanmu akan selamat dari pedihnya siksaan.",
    "id": 353
  },
  {
    "title": "Berbakti kepada Orang Tua",
    "quranSource": "QS. Al-Isra: 23",
    "arabic": "وَبِالْوَالِدَيْنِ إِحْسَانًا",
    "explanation": "Surga merunduk di bawah telapak kaki ibu,\nDan keridhaan ayah adalah sayap kesuksesanmu.\nRawatlah mereka selagi nafas masih menderu,\nSebagaimana mereka merawatmu di waktu dulu.",
    "id": 354
  },
  {
    "title": "Husnudzon (Berbaik Sangka)",
    "hadithSource": "Hadits Qudsi HR. Bukhari",
    "arabic": "أَنَا عِنْدَ ظَنِّ عَبْدِي بِي",
    "explanation": "Jangan mudah mengeluh atas takdir yang pahit,\nMungkin Allah sedang menyiapkan senyum yang legit.\nBerbaik sangkalah pada Sang Maha Pengatur,\nAgar hatimu damai dan tidurmu selalu nyenyak terlelap.",
    "id": 355
  },
  {
    "title": "Kemuliaan Menuntut Ilmu",
    "hadithSource": "HR. Muslim",
    "arabic": "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    "explanation": "Ilmu adalah pelita penuntun langkah di kegelapan,\nMengangkat derajat hamba melampaui gemerlap kekayaan.\nTuntutlah ilmu dari buaian hingga ke liang lahat,\nIa adalah warisan para Nabi dan bekal paling bermanfaat.",
    "id": 356
  },
  {
    "title": "Khusyu' Dalam Shalat",
    "quranSource": "QS. Al-Mu'minun: 1-2",
    "arabic": "قَدْ أَفْلَحَ الْمُؤْمِنُونَ - الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ",
    "explanation": "Menghadap kiblat jangan sekadar membalikkan badan,\nHadirkan hatimu sepenuhnya pada Tuhan Semesta Alam.\nShalat yang khusyu' menenangkan setiap kepanikan,\nMenjadikan kehidupanmu selaras, tenang dan tentram.",
    "id": 357
  },
  {
    "title": "Mengelola Waktu dengan Bijak",
    "quranSource": "QS. Al-'Asr: 1-2",
    "arabic": "وَالْعَصْرِ - إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
    "explanation": "Waktu yang berlalu takkan mungkin kembali berputar,\nJangan biarkan ia habis untuk hal yang hambar.\nIsilah pergantian siang dan malam dengan zikir dan sabar,\nKelak engkau tak merugi saat kiamat membakar.",
    "id": 358
  },
  {
    "title": "Menghindari Sifat Sombong",
    "hadithSource": "HR. Muslim",
    "arabic": "لَا يَدْخُلُ الْجَنَّةَ مَنْ كَانَ فِي قَلْبِهِ مِثْقَالُ ذَرَّةٍ مِنْ كِبْرٍ",
    "explanation": "Setitik debu kesombongan dalam relung hati,\nCukup untuk menutup pintu surga dari diri ini.\nIngatlah asalmmu yang hanya dari setetes mani,\nDan tempat kembalimu hanyalah segunduk tanah sepi.",
    "id": 359
  },
  {
    "title": "Membantu Kesulitan Saudara",
    "hadithSource": "HR. Muslim",
    "arabic": "وَاللَّهُ فِى عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِى عَوْنِ أَخِيهِ",
    "explanation": "Ringankan tanganmu membantu mereka yang kesusahan,\nSeburuk apapun kondisimu, jadilah perantara kebaikan.\nSiapa yang melapangkan dada saudaranya dari kesulitan,\nKelak Allah akan menolongnya di hari kebangkitan.",
    "id": 360
  },
  {
    "title": "Keikhlasan Dalam Beramal",
    "quranSource": "QS. Al-Bayyinah: 5",
    "arabic": "وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ",
    "explanation": "Segala amal ibadah yang tak dilandasi ikhlas,\nIbarat membangun rumah di atas pasir yang lepas.\nTuluskan niat hanya untuk mengharap ridha-Nya,\nKelak pahala dan berkah akan mengalir tanpa batas.",
    "id": 361
  },
  {
    "title": "Menjaga Lisan (Ghibah)",
    "quranSource": "QS. Al-Hujurat: 12",
    "arabic": "وَلَا يَغْتَب بَّعْضُكُم بَعْضًا",
    "explanation": "Tajamnya pedang dapat menyayat raga,\nNamun tajamnya lisan menusuk hingga ke jiwa.\nTahanlah lisan dari membicarakan aib sesama,\nKarena ghibah itu memakan daging saudara.",
    "id": 362
  },
  {
    "title": "Memaafkan Sesama",
    "quranSource": "QS. Ali 'Imran: 134",
    "arabic": "وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ",
    "explanation": "Menyimpan dendam bagai menggenggam bara,\nHanya melukai diri yang menahannya.\nMaafkanlah mereka yang pernah membuatmu terluka,\nSungguh Allah mencintai hamba yang berlapang dada.",
    "id": 363
  },
  {
    "title": "Menyambung Silaturahmi",
    "hadithSource": "HR. Bukhari",
    "arabic": "مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ، وَأَنْ يُنْسَأَ لَهُ فِي أَثَرِهِ، فَلْيَصِلْ رَحِمَهُ",
    "explanation": "Bila rezeki terasa seret dan tak menentu,\nCobalah ketuk pintu kerabat yang telah lama jauh darimu.\nSilaturahmi itu merekatkan hati yang beku,\nMemanjangkan umur dan meluaskan rezekimu.",
    "id": 364
  },
  {
    "title": "Mengingat Kematian",
    "quranSource": "QS. Ali 'Imran: 185",
    "arabic": "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ",
    "explanation": "Setiap jiwa pasti akan mereguk kepulangan,\nMenuju keabadian dan meninggalkan kefanaan.\nPersiapkanlah amal sebelum datangnya panggilan,\nKarena dunia ini hanyalah tempat persinggahan.",
    "id": 365
  },
  {
    "title": "Sedekah Melapangkan Rezeki",
    "quranSource": "QS. Saba: 39",
    "arabic": "وَمَا أَنفَقْتُم مِّن شَيْءٍ فَهُوَ يُخْلِفُهُ",
    "explanation": "Jangan takut miskin karena memberi,\nAllah yang Maha Kaya yang akan mengganti.\nSepercik sedekah yang kau beri saat ini,\nKelak meneduhkanmu di hari akhir nanti.",
    "id": 366
  }
];

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
