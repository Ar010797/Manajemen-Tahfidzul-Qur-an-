export interface DailyAdvice {
  id: number;
  title: string;
  explanation: string;
  quranSource?: string;
  hadithSource?: string;
  arabic?: string;
}

export const DAILY_ADVICE: DailyAdvice[] = [
  {
    id: 1,
    title: "Niat yang Tulus",
    explanation: "Mulailah setiap langkahmu dengan niat yang bersih hanya karena Allah. Niat yang tulus mengubah lelahmu menjadi pahala dan setiap keringatmu menjadi saksi di akhirat kelak. Jangan biarkan riya' mencuri keberkahan amalmu.",
    hadithSource: "HR. Bukhari & Muslim (Hadits Arba'in No. 1)",
    arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ"
  },
  {
    id: 2,
    title: "Sabar dalam Kesulitan",
    explanation: "Cobaan hidup bukanlah tanda Allah menjauhimu, tapi bukti Dia ingin mengangkat derajatmu. Teruslah berjuang dengan sabar dan shalat sebagai senjatamu. Ingatlah, fajar kemenangan pasti datang setelah malam yang paling gelap.",
    quranSource: "QS. Al-Baqarah: 153",
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ"
  },
  {
    id: 3,
    title: "Menjaga Lisan",
    explanation: "Lisanmu adalah cerminan hatimu. Gunakan ia untuk menebar kebaikan, dzikir, atau lebih baik diam jika tak ada yang bermanfaat. Satu patah kata bisa membawamu ke surga, namun satu ucapan buruk juga bisa menjerumuskan ke neraka.",
    hadithSource: "HR. Bukhari & Muslim (Dari Kitab Riadhus Shalihin)",
    arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ"
  },
  {
    id: 4,
    title: "Ketenangan dengan Dzikir",
    explanation: "Saat dunia terasa begitu bising dan menyesakkan, kembalilah pada Allah. Basahi bibirmu dengan dzikir, karena hanya dengan mengingat-Nya lah hatimu yang gelisah akan menemukan pelabuhan ketenangan yang sejati.",
    quranSource: "QS. Ar-Ra'd: 28",
    arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ"
  },
  {
    id: 5,
    title: "Berbuat Baik pada Orang Tua",
    explanation: "Surga dunia ada pada senyuman orang tuamu. Berbaktilah selagi mereka masih ada, karena doa tulus mereka adalah kunci pembuka pintu-pintu rezeki dan kesuksesanmu yang paling mustajab.",
    quranSource: "QS. Luqman: 14",
    arabic: "وَوَصَّيْنَا الْإِنْسَانَ بِوَالِدَيْهِ"
  },
  {
    id: 6,
    title: "Pahala Mengajar Al-Qur'an",
    explanation: "Jangan pernah remehkan satu huruf Al-Qur'an yang kau ajarkan. Engkau sedang menanam saham akhirat yang pahalanya terus mengalir deras meskipun engkau telah tiada. Itulah profesi termulia di mata Allah.",
    hadithSource: "HR. Bukhari",
    arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ"
  },
  {
    id: 7,
    title: "Indahnya Kejujuran",
    explanation: "Kejujuran mungkin terasa pahit di awal, namun ia adalah jalan pintas menuju ketenangan batin dan pintu surga. Jadilah pribadi yang dapat dipercaya, karena kepercayaan adalah mahkota seorang muslim yang sejati.",
    hadithSource: "HR. Bukhari & Muslim",
    arabic: "إِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ"
  },
  {
    id: 8,
    title: "Selalu Bersyukur",
    explanation: "Berhentilah membandingkan hidupmu dengan orang lain. Lihatlah ke bawah untuk urusan dunia agar kau selalu bersyukur. Jika kau pandai berterima kasih, Allah berjanji akan menambah nikmat-Nya padamu dengan cara yang tak terduga.",
    quranSource: "QS. Ibrahim: 7",
    arabic: "لئِنْ شَكَرْتُمْ لَأَZِيدَنَّكُمْ"
  },
  {
    id: 9,
    title: "Menghapus Dosa dengan Kebaikan",
    explanation: "Setiap manusia pasti pernah khilaf. Namun, jangan biarkan kesalahan membuatmu terpuruk. Segera tutup keburukanmu dengan amal shalih. Kebaikan yang tulus akan menghapus noda-noda dosa di catatan amalmu.",
    hadithSource: "HR. Tirmidzi (Hadits Shahih)",
    arabic: "وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا"
  },
  {
    id: 10,
    title: "Pertolongan Allah Pasti Datang",
    explanation: "Saat kau merasa buntu, jangan pernah putus asa. Allah tahu batas kemampuanmu. Teruslah mengetuk pintu langit dengan doa, karena janji-Nya nyata: bersama setiap kesulitan yang kau hadapi, pasti ada kemudahan yang menyertai.",
    quranSource: "QS. Al-Insyirah: 5-6",
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا"
  },
  {
    id: 11,
    title: "Akhlak Mulia",
    explanation: "Kecerdasan mungkin mengagumkan, tapi akhlak mulia lah yang akan membuatmu dicantai. Jadilah pribadi yang lembut, sopan, dan pemaaf. Karena akhlak yang baik adalah timbangan terberat di hari kiamat kelak.",
    hadithSource: "HR. Tirmidzi (Shahih)",
    arabic: "مَا مِنْ شَيْءٍ أَثْقَلُ فِي مِيزَانِ الْمُؤْمِنِ يَوْمَ الْقِيَامَةِ مِنْ حُسْنِ الْخُلُقِ"
  },
  {
    id: 12,
    title: "Mencintai Saudara Muslim",
    explanation: "Keimananmu belum sempurna hingga kau mencintai saudaramu seperti kau mencintai dirimu sendiri. Hindari hasad dan iri hati, karena persaudaraan karena Allah adalah ikatan yang paling indah di atas muka bumi ini.",
    hadithSource: "HR. Bukhari & Muslim",
    arabic: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ"
  },
  {
    id: 13,
    title: "Manusia Paling Bermanfaat",
    explanation: "Eksistensi terbaikmu bukan diukur dari berapa banyak harta yang kau kumpulkan, tapi dari seberapa besar manfaat yang kau bagikan untuk sesama. Jadilah tangan di atas yang selalu mau memberi dan menolong.",
    hadithSource: "HR. Ath-Thabrani (Shahih al-Jami')",
    arabic: "أَحَبُّ النَّاسِ إِلَى اللَّهِ أَنْفَعُهُمْ لِلنَّاسِ"
  },
  {
    id: 14,
    title: "Jaga Shalatmu",
    explanation: "Shalat adalah tiang agamamu dan amalan pertama yang akan dihisab. Jangan biarkan urusan dunia membuatmu lalai menemui Penciptamu. Shalat yang terjaga akan menjaga hidupmu dari segala keburukan dan kegelisahan.",
    hadithSource: "HR. Abu Daud & Tirmidzi",
    arabic: "إِنَّ أَوَّلَ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ مِنْ عَمَلِهِ صَلاتُهُ"
  },
  {
    id: 15,
    title: "Berlaku Ihsan",
    explanation: "Lakukanlah segalanya dengan kualitas terbaik (Ihsan), seakan-akan engkau melihat Allah. Jika tidak, yakinlah Allah pasti melihatmu. Kesungguhan dalam setiap pekerjaan kecil adalah bentuk ibadah yang sangat dicintai-Nya.",
    hadithSource: "HR. Muslim",
    arabic: "إِنَّ اللَّهَ كَتَبَ الإِحْسَانَ عَلَى كُلِّ شَيْءٍ"
  },
  {
    id: 16,
    title: "Istighfar Pembuka Pintu Rezeki",
    explanation: "Jika rezekimu terasa sempit atau hatimu terasa sesak, perbanyaklah istighfar. Memohon ampun bukan hanya menghapus dosa, tapi juga mengundang hujan rahmat dan membuka pintu-pintu kemudahan yang sebelumnya tertutup rapat.",
    quranSource: "QS. Nuh: 10-12",
    arabic: "فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا"
  },
  {
    id: 17,
    title: "Menebar Salam",
    explanation: "Salam bukan sekadar kata, tapi doa keselamatan. Biasakan menebar salam kepada sesama, karena ia adalah cara paling sederhana untuk menumbuhkan rasa cinta di antara hati-hati manusia yang mungkin sedang gersang.",
    hadithSource: "HR. Muslim",
    arabic: "أَفْشُوا السَّلامَ بَيْنَكُمْ تَحَابُّوا"
  },
  {
    id: 18,
    title: "Menghargai Waktu",
    explanation: "Waktu adalah modal termahalmu. Jangan biarkan ia berlalu sia-sia dalam hal yang tak bermanfaat bagi akhiratmu. Gunakan setiap detiknya untuk menabung amal, karena sedetik yang hilang takkan pernah bisa dibeli kembali.",
    hadithSource: "HR. Bukhari",
    arabic: "نِعْمَتَانِ مَغْبُونٌ فِيهِمَا كَثِيرٌ مِنَ النَّاسِ الصِّحَّةُ وَالْفَرَاغُ"
  },
  {
    id: 19,
    title: "Sederhana dalam Hidup",
    explanation: "Kekayaan sejati bukan pada tumpukan harta, tapi pada rasa cukup (Qana'ah) di dalam hati. Hiduplah sederhana agar kau tak diperbudak keinginan. Hati yang merasa cukup adalah surga sebelum surga yang sebenarnya.",
    hadithSource: "HR. Bukhari & Muslim",
    arabic: "لَيْسَ الْغِنَى عَنْ كَثْرَةِ الْعَرَضِ وَلَكِنَّ الْغِنَى غِنَى النَّفْسِ"
  },
  {
    id: 20,
    title: "Menjaga Pandangan",
    explanation: "Jagalah pandanganmu dari hal-hal yang dilarang, karena ia adalah panah beracun setan. Pandangan yang terjaga akan membuahkan kemanisan iman di dalam hati dan cahaya ketenangan di wajahmu.",
    quranSource: "QS. An-Nur: 30",
    arabic: "قُل لِّلْمُؤْمِنِينَ يَغُضُّوا مِنْ أَبْصَارِهِمْ"
  },
  {
    id: 21,
    title: "Malu Sebagian dari Iman",
    explanation: "Rasa malu adalah perisai pelindung diri. Malulah kepada Allah jika bermaksiat di saat sepi, dan malulah kepada manusia jika melanggar norma. Hilangnya rasa malu adalah awal dari segala kerusakan karakter.",
    hadithSource: "HR. Bukhari & Muslim",
    arabic: "الْحَيَاءُ مِنَ الإِيمَانِ"
  },
  {
    id: 22,
    title: "Menutupi Aib Saudara",
    explanation: "Barangsiapa yang menutupi aib saudaranya di dunia, Allah akan menutupi aibnya di hari kiamat. Jangan biarkan lisanmu menjadi wadah ghibah, karena setiap kata yang menyakiti saudara akan dimintai pertanggungjawaban.",
    hadithSource: "HR. Muslim",
    arabic: "مَنْ سَتَرَ مُسْلِمًا سَتَرَهُ اللَّهُ فِي الدُّنْيَا وَالآخِرَةِ"
  },
  {
    id: 23,
    title: "Doa Adalah Senjata",
    explanation: "Jangan pernah berhenti berdoa meskipun belum dikabulkan. Teruslah mengetuk dengan penuh yakin. Doa adalah bukti ketergantunganmu pada-Nya. Allah senang saat hamba-Nya merengek meminta kepada-Nya.",
    hadithSource: "HR. Tirmidzi",
    arabic: "الدُّعَاءُ هُوَ الْعِبَادَةُ"
  },
  {
    id: 24,
    title: "Indahnya Pemaaf",
    explanation: "Menyimpan dendam hanya akan memperlambat langkahmu menuju ketenangan. Jadilah pemaaf seperti Rasulullah. Memaafkan bukan berarti kalah, tapi bukti bahwa hatimu terlalu mulia untuk dikotori oleh rasa benci.",
    quranSource: "QS. Ali Imran: 134",
    arabic: "وَالْعَافِينَ عَنِ النَّاسِ ۗ وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ"
  },
  {
    id: 25,
    title: "Menjaga Amanah",
    explanation: "Amanah adalah beban yang berat di dunia, namun menjadi cahaya kemuliaan di akhirat. Jadilah pribadi yang jujur dan peganglah janji-janjimu. Orang yang amanah akan mendapatkan kecintaan Allah dan kepercayaan manusia.",
    hadithSource: "HR. Muslim",
    arabic: "لاَ إِيمَانَ لِمَنْ لاَ أَمَانَةَ لَهُ"
  },
  {
    id: 26,
    title: "Membantu Kesulitan Sesama",
    explanation: "Allah akan menolongmu selama engkau menolong saudaramu. Ringankanlah beban orang lain, niscaya Allah akan meringankan bebanmu yang paling berat. Kebaikan yang kau tanam hari ini akan kau tuai besok.",
    hadithSource: "HR. Muslim",
    arabic: "وَاللَّهُ فِي عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِي عَوْنِ أَخِيهِ"
  },
  {
    id: 27,
    title: "Takwa di Mana Saja",
    explanation: "Ketakwaan bukan hanya di masjid, tapi di setiap hembusan nafasmu. Takutlah kepada Allah saat engkau sedang sendiri, karena Dia adalah Saksi yang tak pernah tidur. Jadikan pengawasan Allah sebagai penuntunmu.",
    hadithSource: "HR. Tirmidzi",
    arabic: "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ"
  },
  {
    id: 28,
    title: "Cinta Karena Allah",
    explanation: "Ber sahabatlahlah dengan orang-orang yang mengingatkanmu kepada Allah. Sahabat sejati adalah mereka yang mau menggandeng tanganmu menuju surga, bukan mereka yang hanya menemanimu dalam kesenangan duniawi.",
    hadithSource: "HR. Bukhari",
    arabic: "رَجُلاَنِ تَحَابَّا فِي اللَّهِ اجْتَمَعَا عَلَيْهِ وَتَفَرَّقَا عَلَيْهِ"
  },
  {
    id: 29,
    title: "Istiqamah dalam Kebaikan",
    explanation: "Amalan yang paling dicintai Allah adalah yang dilakukan secara rutin (konsisten) meskipun sedikit. Jangan bersemangat di awal lalu layu di tengah jalan. Sedikit yang istiqamah jauh lebih baik daripada banyak namun terputus.",
    hadithSource: "HR. Bukhari & Muslim",
    arabic: "أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ"
  },
  {
    id: 30,
    title: "Bersyukur Atas Hidayah",
    explanation: "Hidayah adalah harta karun paling berharga dalam hidupmu. Bersyukurlah karena Allah telah memilihmu untuk mengenal-Nya. Jagalah hidayah itu dengan ilmu dan amal, agar ia tetap bercahaya hingga akhir hayatmu.",
    quranSource: "QS. Al-Fatihah: 6",
    arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ"
  },
  {
    id: 31,
    title: "Mendoakan Sesama",
    explanation: "Doakanlah saudaramu saat mereka tidak tahu. Malaikat akan mengaminkan doamu dan berkata: 'Dan bagimu juga demikian'. Mendoakan orang lain adalah cara tercepat agar doa kita dikabulkan.",
    hadithSource: "HR. Muslim",
    arabic: "دَعْوَةُ الْمَرْءِ الْمُسْلِمِ لأَخِيهِ بِظَهْرِ الْغَيْبِ مُسْتَجَابَةٌ"
  },
  {
    id: 32,
    title: "Menjaga Wudhu",
    explanation: "Jagalah wudhumu sebisa mungkin, karena ia adalah cahaya bagimu. Wudhu bukan hanya mensucikan lahiriah, tapi juga meruntuhkan dosa-dosa kecil dari setiap tetesan airnya.",
    hadithSource: "HR. Muslim",
    arabic: "الطُّهُورُ شَطْرُ الإِيمَانِ"
  },
  {
    id: 33,
    title: "Keutamaan Shalat Malam",
    explanation: "Di saat orang lain terlelap, hamparkanlah sajadahmu. Shalat malam adalah saat paling mesra untuk berbisik pada Allah. Ia adalah kemuliaan seorang mukmin dan cahaya di gelapnya kubur.",
    hadithSource: "HR. Muslim",
    arabic: "أَفْضَلُ الصَّلاَةِ بَعْدَ الْفَرِيضَةِ صَلاَةُ اللَّيْلِ"
  },
  {
    id: 34,
    title: "Menghormati Tamu",
    explanation: "Memuliakan tamu adalah bagian dari kesempurnaan iman. Sambutlah mereka dengan wajah ceria dan hidangan terbaik yang kau punya. Tamu membawa keberkahan dan pulang dengan membawa dosa-dosamu.",
    hadithSource: "HR. Bukhari & Muslim",
    arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ ضَيْفَهُ"
  },
  {
    id: 35,
    title: "Zuhud di Dunia",
    explanation: "Jadikanlah dunia di tanganmu, jangan di hatimu. Ambillah dunia secukupnya sebagai bekal perjalanan panjangmu menuju akhirat. Hati yang zuhud akan merasa kaya meskipun hartanya sederhana.",
    hadithSource: "HR. Ibnu Majah (Shahih)",
    arabic: "ازْهَدْ فِي الدُّنْيَا يُحِبَّكَ اللَّهُ"
  },
  {
    id: 36,
    title: "Kebaikan Kepada Tetangga",
    explanation: "Imanmu diragukan jika kau kenyang sementara tetanggamu kelaparan. Jadilah tetangga yang baik dan peduli. Kebaikan kecilmu kepada tetangga bisa menjadi saksi keselamatanmu kelak.",
    hadithSource: "HR. Bukhari",
    arabic: "لاَ يُؤْمِنُ مَنْ بَاتَ شَبْعَانًا وَجَارُهُ جَائِعٌ إِلى جَنْبِهِ"
  },
  {
    id: 37,
    title: "Menjaga Amanah Ilmu",
    explanation: "Setiap ilmu yang kau dapatkan adalah amanah. Amalkanlah meskipun sedikit, dan bagikanlah kepada orang lain. Ilmu yang bermanfaat adalah sedekah jariyah yang pahalanya takkan pernah putus.",
    hadithSource: "HR. Bukhari",
    arabic: "بَلِّغُوا عَنِّي وَلَوْ آيَةً"
  },
  {
    id: 38,
    title: "Sabar Atas Musibah",
    explanation: "Sungguh menakjubkan urusan seorang mukmin, jika diberi nikmat ia bersyukur dan jika diberi musibah ia bersabar. Keduanya adalah kebaikan baginya. Percayalah, takdir Allah tak pernah salah alamat.",
    hadithSource: "HR. Muslim",
    arabic: "عَجَبًا لأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ"
  },
  {
    id: 39,
    title: "Mengingat Kematian",
    explanation: "Perbanyaklah mengingat pemutus segala kenikmatan: Kematian. Mengingat mati bukan agar kita pemalas, tapi agar kita bergegas memperbanyak bekal sebelum waktu yang ditetapkan tiba.",
    hadithSource: "HR. Tirmidzi & Nasai",
    arabic: "أَكْثِرُوا ذِكْرَ هَاذِمِ اللَّذَّاتِ"
  },
  {
    id: 40,
    title: "Allah Dekat dengan Doa",
    explanation: "Jangan pernah merasa sendirian, karena Allah begitu dekat. Dia mendengar bisikan hatimu bahkan sebelum kau ucapkan. Berdoalah dengan penuh keyakinan bahwa Allah pasti memberikan yang terbaik bagimu.",
    quranSource: "QS. Al-Baqarah: 186",
    arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ"
  },
  {
    id: 41,
    title: "Menghindari Ghibah",
    explanation: "Menceritakan aib orang lain bagaikan memakan daging saudara sendiri yang sudah mati. Jagalah lisanmu dari membicarakan keburukan orang, karena setiap kita punya aib yang Allah tutupi dengan rahmat-Nya.",
    quranSource: "QS. Al-Hujurat: 12",
    arabic: "وَلَا يَغْتَب بَّعْضُكُم بَعْضًا"
  },
  {
    id: 42,
    title: "Indahnya Tawakkal",
    explanation: "Setelah berikhtiar maksimal, gantungkanlah hasilnya hanya kepada Allah. Hati yang bertawakkal akan tetap tenang apa pun hasilnya, karena ia yakin Allah telah mengatur skenario terbaik untuk hidupnya.",
    quranSource: "QS. At-Talaq: 3",
    arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ"
  },
  {
    id: 43,
    title: "Melapangkan Hati",
    explanation: "Jangan biarkan hatimu sempit karena kebencian atau rasa iri. Lapangkanlah dadamu dengan memaafkan dan berhusnudzan. Hati yang luas adalah tempat bertumbuhnya benih-benih kebahagiaan.",
    quranSource: "QS. Az-Zumar: 22",
    arabic: "أَفَمَن شَرَحَ اللَّهُ صَدْرَهُ لِلْإِسْلَامِ"
  },
  {
    id: 44,
    title: "Fokus pada Kebaikan",
    explanation: "Dunia ini singkat, jangan habiskan untuk hal yang sia-sia. Fokuslah pada amalan yang memberatkan timbanganmu di akhirat. Jadikan setiap harimu sebagai kesempatan baru untuk menjadi hamba yang lebih baik.",
    quranSource: "QS. Al-Baqarah: 148",
    arabic: "فَاسْتَبِقُوا الْخَيْرَاتِ"
  },
  {
    id: 45,
    title: "Rezeki dari Arah Tak Terduga",
    explanation: "Takwa adalah kunci pembuka pintu rezeki yang terkunci. Jika kau mengutamakan Allah, Dia akan memberikan solusi dari setiap kesulitanmu dan mendatangkan rezeki dari arah yang tak pernah kau bayangkan sebelumnya.",
    quranSource: "QS. At-Talaq: 2-3",
    arabic: "وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ"
  },
  {
    id: 46,
    title: "Menjaga Shalat Shubuh",
    explanation: "Shalat shubuh adalah awal keberkahan harimu. Di waktu itu para malaikat berkumpul dan mendoakan para hamba yang terjaga. Jangan biarkan mimpi yang manis merampas pahala dunia dan seisinya.",
    hadithSource: "HR. Muslim",
    arabic: "رَكْعَتَا الْفَجْرِ خَيْرٌ مِنَ الدُّنْيَا وَمَا فِيهَا"
  },
  {
    id: 47,
    title: "Sederhana dalam Berkata",
    explanation: "Pilihlah kata-kata yang menyejukkan hati. Kata-kata yang baik adalah sedekah. Hindari debat yang tak perlu, karena kedamaian jauh lebih berharga daripada memenangkan sebuah argumen.",
    hadithSource: "HR. Bukhari & Muslim",
    arabic: "الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ"
  },
  {
    id: 48,
    title: "Sikap Terhadap Musibah",
    explanation: "Ucapkanlah 'Inna lillahi wa inna ilaihi raji'un' saat tertimpa musibah. Sadarilah bahwa segala milik kita hanyalah titipan Allah yang akan kembali kepada-Nya. Allah akan menggantikannya dengan yang lebih baik.",
    quranSource: "QS. Al-Baqarah: 156-157",
    arabic: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ"
  },
  {
    id: 49,
    title: "Cinta Kepada Rasulullah",
    explanation: "Keimananmu baru akan terasa manis jika kau mencintai Rasulullah melebihi apa pun di dunia ini. Ikutilah sunnahnya dengan bangga, karena dialah lentera penerang jalan kita menuju surga.",
    hadithSource: "HR. Bukhari & Muslim",
    arabic: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى أَكُونَ أَحَبَّ إِلَيْهِ"
  },
  {
    id: 50,
    title: "Harapan pada Rahmat Allah",
    explanation: "Seberapa pun besar dosamu, jangan pernah putus asa dari rahmat Allah. Ampunan-Nya seluas samudera bagi hamba yang mau bersimpuh dan bertaubat. Allah menunggumu kembali ke jalan-Nya dengan penuh cinta.",
    quranSource: "QS. Az-Zumar: 53",
    arabic: "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ"
  },
  {
    id: 51,
    title: "Ketenangan dalam Shalat",
    explanation: "Jadikan shalatmu sebagai waktu istirahat dari hiruk pikuk dunia. Jangan tergesa-gesa, nikmatilah setiap ruku' dan sujudmu. Di sanalah kau akan menemukan kedamaian yang tak terbeli oleh harta.",
    hadithSource: "HR. An-Nasa'i & Ahmad",
    arabic: "وَجُعِلَتْ قُرَّةُ عَيْنِي فِي الصَّلاةِ"
  },
  {
    id: 52,
    title: "Mencari Ilmu Sampai Mati",
    explanation: "Ilmu adalah cahaya yang menuntunmu dalam kegelapan. Jangan pernah merasa cukup dengan apa yang kau tahu. Teruslah belajar, karena setiap ilmu yang kau amalkan akan menjadi pembela bagimu di akhirat.",
    hadithSource: "HR. Ibnu Majah",
    arabic: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ"
  },
  {
    id: 53,
    title: "Indahnya Silaturahmi",
    explanation: "Menyambung tali persaudaraan bukan hanya menambah teman, tapi juga memanjangkan umur dan melapangkan rezeki. Jangan putuskan hubungan hanya karena egomu, kembalilah merajut kasih sayang.",
    hadithSource: "HR. Bukhari & Muslim",
    arabic: "مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ فَلْيَصِلْ رَحِمَهُ"
  },
  {
    id: 54,
    title: "Waspada Terhadap Hasad",
    explanation: "Hasad (iri hati) dapat memakan kebaikanmu bagaikan api melahap kayu bakar yang kering. Bersyukurlah atas nikmat yang Allah berikan padamu, dan ikutlah bahagia atas nikmat yang didapat orang lain.",
    hadithSource: "HR. Abu Daud",
    arabic: "إِيَّاكُمْ وَالْحَسَدَ فَإِنَّ الْحَسَدَ يَأْكُلُ الْحَسَنَاتِ"
  },
  {
    id: 55,
    title: "Keutamaan Memberi Makan",
    explanation: "Berbagilah makanan dengan mereka yang lapar. Kebaikan sederhana ini bisa menjadi penghalang bagimu dari siksa api neraka. Senyum orang yang kau bantu adalah doa yang sangat berharga.",
    hadithSource: "HR. Bukhari & Muslim",
    arabic: "أَطْعِمُوا الطَّعَامَ وَأَفْشُوا السَّلامَ"
  },
  {
    id: 56,
    title: "Menjaga Lisan dari Dusta",
    explanation: "Berbicaralah dengan jujur meskipun itu berat. Satu kebohongan akan melahirkan kebohongan lainnya yang menjepit hatimu. Kejujuran adalah jalan paling tenang yang bisa kau lalui dalam hidup.",
    hadithSource: "HR. Muslim",
    arabic: "إِنَّ الصِّدْقَ طُمَأْنِينَةٌ وَإِنَّ الْكَذِبَ رِيبَةٌ"
  },
  {
    id: 57,
    title: "Ridha Allah dan Orang Tua",
    explanation: "Kesuksesanmu hari ini tak lepas dari doa-doa orang tuamu yang menembus langit. Jangan pernah sakiti hati mereka, karena ridha Allah terletak pada keridhaan orang tua kepadamu.",
    hadithSource: "HR. Tirmidzi",
    arabic: "رِضَى الرَّبِّ فِي رِضَى الْوَالِدِ"
  },
  {
    id: 58,
    title: "Istiqamah dalam Dzikir Pagi",
    explanation: "Mulailah pagimu dengan dzikir agar harimu penuh keberkahan. Dzikir pagi adalah perisai yang melindungimu dari godaan setan dan memberikan energi positif sepanjang hari.",
    hadithSource: "HR. Tirmidzi",
    arabic: "أَفْضَلُ الذِّكْرِ لاَ إِلَهَ إِلاَّ اللَّهُ"
  },
  {
    id: 59,
    title: "Menjaga Kebersihan Hati",
    explanation: "Bersihkan hatimu dari penyakit sombong dan riya'. Hati yang bersih (Qalbun Salim) adalah satu-satunya yang berguna di hari kiamat. Mari kita terus memohon agar Allah menjaga kemurnian niat kita.",
    quranSource: "QS. Asy-Syu'ara: 88-89",
    arabic: "إِلَّا مَنْ أَتَى اللَّهَ بِقَلْبٍ سَلِيمٍ"
  },
  {
    id: 60,
    title: "Kekuatan Bismillah",
    explanation: "Mulailah setiap aktifitasmu dengan menyebut nama Allah. 'Bismillah' adalah pembuka keberkahan yang membuat hal yang berat menjadi ringan dan hal yang sedikit menjadi berkah melimpah.",
    hadithSource: "HR. Abu Daud & Ibnu Majah",
    arabic: "كُلُّ أَمْرٍ ذِي بَالٍ لا يُبْدَأُ فِيهِ بِبِسْمِ اللَّهِ فَهُوَ أَبْتَرُ"
  },
  {
    id: 61,
    title: "Bersegera dalam Kebaikan",
    explanation: "Jangan menunda-nunda amal shalih yang bisa kau lakukan saat ini. Kita tak pernah tahu kapan nafas kita akan berhenti. Bergegaslah menjemput ampunan dan surga Allah yang seluas langit dan bumi.",
    quranSource: "QS. Ali Imran: 133",
    arabic: "وَسَارِعُوا إِلَىٰ مَغْفِرَةٍ مِّن رَّبِّكُمْ"
  },
  {
    id: 62,
    title: "Menyayangi Anak Yatim",
    explanation: "Siapa yang mengasihi anak yatim, ia akan bersama Rasulullah di surga sedekat jari telunjuk dan jari tengah. Berikan mereka senyuman dan bantuan, karena mereka adalah titipan berharga dari-Nya.",
    hadithSource: "HR. Bukhari",
    arabic: "أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ هَكَذَا"
  },
  {
    id: 63,
    title: "Keberkahan dalam Kerjasama",
    explanation: "Tangan Allah berada di atas jama'ah (persatuan). Bekerjasamalah dalam kebaikan dan jangan saling menjatuhkan. Persatuan umat adalah kekuatan yang akan membawa kejayaan Islam.",
    hadithSource: "HR. Tirmidzi",
    arabic: "يَدُ اللَّهِ مَعَ الْجَمَاعَةِ"
  },
  {
    id: 64,
    title: "Menjaga Pandangan Hati",
    explanation: "Lebih dari sekadar mata, jagalah hati agar tidak terpesona oleh gemerlap dunia yang menipu. Lihatlah akhirat yang kekal abadi. Dunia hanyalah tempat mampir sejenak untuk meminum seteguk air.",
    quranSource: "QS. Al-Hadid: 20",
    arabic: "وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا مَتَاعُ الْغُرُورِ"
  },
  {
    id: 65,
    title: "Doa Orang yang Dizalimi",
    explanation: "Waspadalah terhadap doa orang yang terzalimi, karena antara doanya dan Allah tidak ada hijab (penghalang). Berlakulah adil kepada siapa pun, meskipun kepada musuhmu sekalipun.",
    hadithSource: "HR. Bukhari & Muslim",
    arabic: "وَاتَّقِ دَعْوَةَ الْمَظْلُومِ فَإِنَّهُ لَيْسَ بَيْنَهَا وَبَيْنَ اللَّهِ حِجَابٌ"
  },
  {
    id: 66,
    title: "Indahnya Bertanya",
    explanation: "Jangan malu untuk bertanya tentang agamamu jika tidak tahu. Bertanya adalah kunci pembuka pintu ilmu. Orang yang bertanya akan mendapatkan pahala, begitu pula orang yang menjawab dan orang yang mendengarkannya.",
    quranSource: "QS. An-Nahl: 43",
    arabic: "فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ"
  },
  {
    id: 67,
    title: "Mengendalikan Amarah",
    explanation: "Marah adalah percikan api setan. Jika kau marah, segeralah berwudhu atau diamlah. Menahan amarah di saat kau mampu membalas adalah ciri orang yang sangat kuat jiwanya di mata Allah.",
    hadithSource: "HR. Bukhari & Muslim",
    arabic: "لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ"
  },
  {
    id: 68,
    title: "Berbagi Air Minum",
    explanation: "Memberikan seteguk air minum kepada manusia atau makhluk hidup lainnya yang kehausan adalah sedekah yang besar. Jangan remehkan kebaikan sekecil apa pun, karena barangkali itulah yang menyelamatkanmu.",
    hadithSource: "HR. Bukhari & Muslim",
    arabic: "فِي كُلِّ كَبِدٍ رَطْبَةٍ أَجْرٌ"
  },
  {
    id: 69,
    title: "Menjaga Nama Baik Muslim",
    explanation: "Seorang muslim adalah saudara bagi muslim lainnya. Jangan serang kehormatannya, jangan rampas hartanya, dan jangan tumpahkan darahnya. Hormatilah privasi dan martabat saudaramu sebagaimana kau ingin dihormati.",
    hadithSource: "HR. Muslim",
    arabic: "كُلُّ الْمُسْلِمِ عَلَى الْمُسْلِمِ حَرَامٌ دَمُهُ وَمَالُهُ وَعِرْضُهُ"
  },
  {
    id: 70,
    title: "Istighfar di Waktu Sahur",
    explanation: "Gunakan waktu sebelum shubuh untuk memohon ampunan. Di saat banyak orang tertidur, Allah membanggakan hamba-Nya yang beristighfar di waktu sahur. Satu doa tulus di waktu ini bisa mengubah garis takdirmu.",
    quranSource: "QS. Az-Zariyat: 18",
    arabic: "وَبِالْأَسْحَارِ هُمْ يَسْتَغْفِرُونَ"
  },
  {
    id: 71,
    title: "Mencintai Sunnah",
    explanation: "Hidupkanlah sunnah Rasulullah dalam keseharianmu, meskipun hal yang terlihat sepele seperti makan dengan tangan kanan. Mencintai sunnah adalah bukti nyata kecintaanmu kepada baginda Rasulullah SAW.",
    hadithSource: "HR. Ibnu Majah",
    arabic: "فَمَنْ أَحَبَّ سُنَّتِي فَقَدْ أَحَبَّنِي"
  },
  {
    id: 72,
    title: "Keutamaan Memberi Hutang",
    explanation: "Membantu saudara yang kesulitan finansial dengan memberi pinjaman adalah sedekah yang pahalanya terus mengalir selagi ia belum mampu melunasi. Berilah tenggang waktu, karena Allah akan memberikan kemudahan bagimu di dunia dan akhirat.",
    hadithSource: "HR. Muslim",
    arabic: "مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً"
  },
  {
    id: 73,
    title: "Bersikap Malu Kepada Allah",
    explanation: "Malu kepada Allah adalah tingkatan ihsan yang tinggi. Malulah jika kau gunakan nikmat sehatmu untuk bermaksiat kepada-Nya. Jadikan rasa malu ini sebagai rem yang menjagamu dari perbuatan dosa.",
    hadithSource: "HR. Tirmidzi",
    arabic: "اسْتَحْيُوا مِنَ اللَّهِ حَقَّ الْحَيَاءِ"
  },
  {
    id: 74,
    title: "Amalan Penghuni Surga",
    explanation: "Wajah yang berseri, lisan yang jujur, dan hati yang bersih dari kedengkian adalah ciri-ciri penghuni surga yang berjalan di muka bumi. Jadilah penyejuk bagi siapa saja yang memandaimu.",
    hadithSource: "HR. Ahmad",
    arabic: "يَطْلُعُ عَلَيْكُمُ الآنَ رَجُلٌ مِنْ أَهْلِ الْجَنَّةِ"
  },
  {
    id: 75,
    title: "Penutup Hari dengan Taubat",
    explanation: "Sebelum menutup matamu malam ini, maafkanlah semua orang dan mintalah ampun atas segala khilafmu. Tidurlah dalam keadaan suci hati. Siapa tahu malam ini adalah malam terakhir kita di dunia ini.",
    hadithSource: "HR. Abu Ya'la",
    arabic: "مَنْ قَالَ إِذَا أَوَى إِلَى فِرَاشِهِ"
  },
  {
    id: 76,
    title: "Mengucap Alhamdulillah",
    explanation: "Dalam setiap keadaan, baik suka maupun duka, ucapkanlah Alhamdulillah. Syukur dalam kesempitan adalah bukti iman yang kokoh. Allah paling suka mendengar hamba-Nya yang memuji-Nya dalam segala kondisi.",
    hadithSource: "HR. Ibnu Majah",
    arabic: "الْحَمْدُ لِلَّهِ عَلَى كُلِّ حَالٍ"
  },
  {
    id: 77,
    title: "Menjaga Janji",
    explanation: "Janji adalah hutang yang akan ditagih. Jadilah pribadi yang teguh memegang kata-kata. Ingkar janji adalah salah satu ciri kemunafikan yang harus kita hindari sejauh mungkin.",
    quranSource: "QS. Al-Isra: 34",
    arabic: "وَأَوْفُوا بِالْعَهْدِ ۖ إِنَّ الْعَهْدَ كَانَ مَسْئُولًا"
  },
  {
    id: 78,
    title: "Menghindari Sifat Sombong",
    explanation: "Kesombongan adalah menolak kebenaran dan meremehkan manusia. Ingatlah, seberat biji sawi pun kesombongan dapat menghalangimu masuk surga. Tetaplah rendah hati, karena semua kelebihanmu hanyalah titipan.",
    hadithSource: "HR. Muslim",
    arabic: "الْكِبْرُ بَطَرُ الْحَقِّ وَغَمْطُ النَّاسِ"
  },
  {
    id: 79,
    title: "Kekuatan Istighfar",
    explanation: "Istighfar adalah kunci pembasuh jiwa. Ia mampu mengubah kesedihan menjadi kebahagiaan dan kesempitan menjadi kelapangan. Mintalah ampun setiap saat, karena kita tak pernah luput dari salah.",
    hadithSource: "HR. Abu Daud",
    arabic: "مَنْ لَزِمَ الاسْتِغْفَارَ جَعَلَ اللَّهُ لَهُ مِنْ كُلِّ ضِيقٍ مَخْرَجًا"
  },
  {
    id: 80,
    title: "Berbakti Kepada Ibu",
    explanation: "Ibumu adalah pintu surga yang paling tengah. Berbaktilah kepadanya dengan sepenuh hati. Doanya adalah keselamatanmu dan ridhanya adalah kunci kesuksesanmu yang paling nyata.",
    hadithSource: "HR. Bukhari & Muslim",
    arabic: "أُمُّكَ ثُمَّ أُمُّكَ ثُمَّ أُمُّكَ"
  },
  {
    id: 81,
    title: "Sikap Terhadap Musuh",
    explanation: "Balaslah keburukan dengan kebaikan. Dengan begitu, orang yang antaramu dan dia ada permusuhan seolah-olah telah menjadi teman yang sangat setia. Kebaikan memiliki kekuatan untuk melunakkan hati yang keras.",
    quranSource: "QS. Fussilat: 34",
    arabic: "ادْفَعْ بِالَّتِي هِيَ أَحْسَنُ"
  },
  {
    id: 82,
    title: "Menjaga Nama Baik Saudara",
    explanation: "Jangan mencari-cari kesalahan saudaramu. Barangsiapa yang mencari-cari kesalahan saudaranya, maka Allah akan mencari-cari kesalahannya sampai Dia mempermalukannya di dalam rumahnya sendiri.",
    hadithSource: "HR. Abu Daud",
    arabic: "لاَ تَغْتَابُوا الْمُسْلِمِينَ وَلاَ تَتَّبِعُوا عَوْرَاتِهِمْ"
  },
  {
    id: 83,
    title: "Keutamaan Bershalawat",
    explanation: "Satu kali bershalawat, Allah balas sepuluh kali lipat rahmat. Perbanyaklah shalawat, terutama di hari Jumat. Shalawat adalah bukti rindu kita kepada sang pemberi syafaat di hari kiamat.",
    hadithSource: "HR. Muslim",
    arabic: "مَنْ صَلَّى عَلَيَّ وَاحِدَةً صَلَّى اللَّهُ عَلَيْهِ عَشْرًا"
  },
  {
    id: 84,
    title: "Hidup Ini Singkat",
    explanation: "Jadilah di dunia ini seperti pengembara atau orang yang menyeberang jalan. Jangan terlalu terpaku pada kemewahannya. Pastikan setiap langkahmu menuju tempat kembali yang abadi.",
    hadithSource: "HR. Bukhari",
    arabic: "كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ"
  },
  {
    id: 85,
    title: "Menolong Orang Tua",
    explanation: "Ringankan beban beban orang tua di masa senjanya. Sabarlah menghadapi tingkah laku mereka sebagaimana mereka sabar merawatmu di waktu kecil. Itu adalah ladang pahala yang tak ternilai harganya.",
    quranSource: "QS. Al-Isra: 23",
    arabic: "وَبِالْوَالِدَيْنِ إِحْسَانًا"
  },
  {
    id: 86,
    title: "Bahaya Berlebihan",
    explanation: "Janganlah berlebih-lebihan dalam segala hal, baik dalam makan, berpakaian, maupun bicara. Kesederhanaan adalah ciri seorang mukmin yang mampu mengendalikan hawa nafsunya.",
    quranSource: "QS. Al-A'raf: 31",
    arabic: "وَلَا تُسْرِفُوا ۚ إِنَّهُ لَا يُحِبُّ الْمُسْرِفِينَ"
  },
  {
    id: 87,
    title: "Indahnya Musyawarah",
    explanation: "Hargailah pendapat orang lain. Musyawarah mendatangkan keberkahan dan mencegah penyesalan di kemudian hari. Keputusan bersama jauh lebih kuat daripada ego pribadi.",
    quranSource: "QS. Asy-Syura: 38",
    arabic: "وَأَمْرُهُمْ شُورَىٰ بَيْنَهُمْ"
  },
  {
    id: 88,
    title: "Menjaga Kehormatan Diri",
    explanation: "Jadilah pribadi yang 'iffah' (mampu menahan diri dari hal yang tidak baik). Kehormatan diri lebih mahal daripada materi. Allah akan mencukupkan mereka yang mau menjaga kesucian dirinya.",
    quranSource: "QS. Al-Baqarah: 273",
    arabic: "يَحْسَبُهُمُ الْجَاهِلُ أَغْنِيَاءَ مِنَ التَّعَفُّفِ"
  },
  {
    id: 89,
    title: "Mencintai Al-Qur'an",
    explanation: "Jadikanlah Al-Qur'an sebagai sahabat setiamu. Bacalah ia, tadabburi ia, dan amalkan ia. Ia akan datang sebagai syafaat yang membela pembacanya di saat tak ada lagi penolong selain Allah.",
    hadithSource: "HR. Muslim",
    arabic: "اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لأَصْحَابِهِ"
  },
  {
    id: 90,
    title: "Tuntunlah Kebaikan",
    explanation: "Siapa yang memulai kebiasaan baik dalam Islam, ia akan mendapatkan pahalanya dan pahala orang yang mengikutinya. Jadilah pelopor kebaikan di lingkunganmu, meskipun hanya hal sederhana.",
    hadithSource: "HR. Muslim",
    arabic: "مَنْ سَنَّ فِي الإِسْلامِ سُنَّةً حَسَنَةً"
  },
  {
    id: 91,
    title: "Menjadi Pemaaf",
    explanation: "Jangan biarkan dendam merusak harimu. Memaafkan adalah amalan mulia yang akan meninggikan derajatmu di sisi Allah. Hati yang pemaaf akan selalu merasa ringan dan bahagia.",
    quranSource: "QS. Asy-Syura: 43",
    arabic: "وَلَمَن صَبَرَ وَغَفَرَ إِنَّ ذَٰلِكَ لَمِنْ عَزْمِ الْأُمُورِ"
  },
  {
    id: 92,
    title: "Larangan Menghina",
    explanation: "Janganlah suatu kaum menghina kaum yang lain, boleh jadi mereka yang dihina lebih baik dari yang menghina. Allah melihat kualitas hati kita, bukan penampilan luar atau status sosial kita.",
    quranSource: "QS. Al-Hujurat: 11",
    arabic: "لَا يَسْخَرْ قَوْمٌ مِّن قَوْمٍ"
  },
  {
    id: 93,
    title: "Keutamaan Sabar",
    explanation: "Sabar adalah cahaya yang tak pernah padam. Ia pahit di awal namun sangat manis buahnya. Allah bersama orang-orang yang sabar dalam menghadapi ujian hidup yang silih berganti.",
    quranSource: "QS. Al-Baqarah: 153",
    arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ"
  },
  {
    id: 94,
    title: "Menjaga Kebersihan",
    explanation: "Kebersihan lahiriah adalah cerminan kebersihan batiniah. Jagalah kebersihan diri dan lingkunganmu, karena Allah menyukai orang-orang yang senantiasa mensucikan diri.",
    hadithSource: "HR. Muslim",
    arabic: "الطُّهُورُ شَطْرُ الإِيمَانِ"
  },
  {
    id: 95,
    title: "Berlaku Adil",
    explanation: "Berlakulah adil meskipun kepada dirimu sendiri atau orang terdekatmu. Keadilan adalah pilar kedamaian. Allah sangat mencintai mereka yang mampu menempatkan sesuatu pada tempatnya.",
    quranSource: "QS. An-Nisa: 135",
    arabic: "كُونُوا قَوَّامِينَ بِالْقِسْطِ"
  },
  {
    id: 96,
    title: "Menghormati Guru",
    explanation: "Hormatilah orang yang mengajarkan ilmu kepadamu. Keberkahan ilmu ada pada keridhaan sang guru. Jadilah murid yang tawadhu agar ilmu yang kau dapatkan bermanfaat bagi dunia dan akhirat.",
    hadithSource: "HR. Ath-Thabrani",
    arabic: "تَعَلَّمُوا الْعِلْمَ وَتَعَلَّمُوا لَهُ السَّكِينَةَ وَالْوَقَارَ"
  },
  {
    id: 97,
    title: "Harapan pada Masa Depan",
    explanation: "Jangan takut akan hari esok, karena Allah sudah mengatur segalanya dengan sempurna. Tugasmu hanya berusaha dan berdoa. Hasil akhir adalah mutlak milik-Nya, dan itu pasti yang terbaik.",
    hadithSource: "HR. Muslim",
    arabic: "احْرِصْ عَلَى مَا يَنْفَعُكَ وَاسْتَعِنْ بِاللَّهِ"
  },
  {
    id: 98,
    title: "Menjaga Kualitas Amal",
    explanation: "Allah tidak melihat kuantitas amalanmu, tapi Allah melihat kualitas ketulusan dan kesesuaiannya dengan tuntunan. Lebih baik sedikit yang ikhlas daripada banyak namun terjangkit penyakit riya'.",
    hadithSource: "HR. Bukhari",
    arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ"
  },
  {
    id: 99,
    title: "Menebar Manfaat",
    explanation: "Tanyakan pada dirimu setiap pagi: 'Siapa yang bisa saya bantu hari ini?'. Jadilah seperti matahari yang terus memberi tanpa mengharap kembali. Itulah sejatinya kebahagiaan hidup.",
    hadithSource: "HR. Ath-Thabrani",
    arabic: "أَحَبُّ النَّاسِ إِلَى اللَّهِ أَنْفَعُهُمْ لِلنَّاسِ"
  },
  {
    id: 100,
    title: "Akhir yang Baik",
    explanation: "Mintalah kepada Allah agar diwafatkan dalam keadaan husnul khatimah. Teruslah berbuat baik sampai nafas terakhir, karena amalan itu dinilai dari penutupnya (akhir hidupnya).",
    hadithSource: "HR. Bukhari",
    arabic: "إِنَّمَا الأَعْمَالُ بِالْخَوَاتِيمِ"
  }
];

// Content rotation logic for 365 days
export const getAdviceForDay = (dayOfYear: number): DailyAdvice => {
  // If we have less than 365 items, we use modulo to wrap around
  // But for the best experience, we aim to have 365 unique items eventually.
  // For now, I'll provide logic to repeat/offset to ensure uniqueness across years if possible.
  const index = (dayOfYear - 1) % DAILY_ADVICE.length;
  return DAILY_ADVICE[index];
};

export const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};
