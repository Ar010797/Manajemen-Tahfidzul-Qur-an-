import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Download, TrendingUp, BookOpen } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as htmlToImage from 'html-to-image';

const TARGET_KURIKULUM = [
  {
    grade: 'Kelas 1 (SD)',
    s1_hafalan: 'An Naba - Abasa', s1_ummi: 'Jilid 1-2 hal 20',
    s2_hafalan: 'At Takwir - Al Insyiqoq', s2_ummi: 'Jilid 2 hal 21 - Jilid 3 hal 40'
  },
  {
    grade: 'Kelas 2 (SD)',
    s1_hafalan: 'Al Buruj - Al Fajr', s1_ummi: 'Jilid 4-5 hal 20',
    s2_hafalan: 'Al Balad - Al \'Alaq', s2_ummi: 'Jilid 5 hal 21 - 6 hal 40'
  },
  {
    grade: 'Kelas 3 (SD)',
    s1_hafalan: 'Al Qodar - An Nas', s1_ummi: 'Al Qur\'an',
    s2_hafalan: 'Al Mulk - Al Haqqoh : 8', s2_ummi: 'Al Qur\'an'
  },
  {
    grade: 'Kelas 4 (SD)',
    s1_hafalan: 'Al Haqqoh : 9 - Al Jin : 28', s1_ummi: 'Al Qur\'an',
    s2_hafalan: 'Al Muzammil - Al Mursalat : 19', s2_ummi: 'Al Qur\'an'
  },
  {
    grade: 'Kelas 5 (SD)',
    s1_hafalan: 'Al Mursalat : 20 - Al Munafiqun : 4', s1_ummi: 'Al Qur\'an',
    s2_hafalan: 'Al Munafiqun', s2_ummi: 'Al Qur\'an'
  },
  {
    grade: 'Kelas 6 (SD)',
    full_text: 'Murojaah / setoran ulang hafalan yang didapat dan memutqinkan juz 30'
  },
  {
    grade: 'Kelas 7 (MTS)',
    s1_hafalan: "Muroja'ah hafalan", s1_ummi: '-',
    s2_hafalan: 'Menambah hafalan 1 juz', s2_ummi: '-'
  },
  {
    grade: 'Kelas 8 (MTS)',
    s1_hafalan: 'Nambah 1 juz', s1_ummi: '-',
    s2_hafalan: 'Nambah 1 juz', s2_ummi: '-'
  },
  {
    grade: 'Kelas 9 (MTS)',
    full_text: 'Memutqinkan hafalan yang didapat kelas 7 dan 8'
  }
];

export const AdminProgressReport = ({ globalData }: { globalData: Record<string, any> }) => {
  const { studentsProgress, jilidStats, hafalanStats, halaqohAchievement, grandTotal } = useMemo(() => {
    const studentsList: any[] = [];
    
    Object.keys(globalData).forEach(guru => {
      const d = globalData[guru];
      if (!d) return;
      const students = d.students || [];
      const deposits = d.daily_deposits || [];
      const halaqohs = d.halaqoh || [];

      students.forEach((student: any) => {
         if (!student) return;
         const ummiDeposits = deposits.filter((dep: any) => dep.student_id === student.id && dep.type === 'ummi');
         ummiDeposits.sort((a: any, b: any) => (b.date || '').localeCompare(a.date || ''));
         const latestUmmi = ummiDeposits[0];

         const tilawahDeposits = deposits.filter((dep: any) => dep.student_id === student.id && dep.type === 'tilawah');
         tilawahDeposits.sort((a: any, b: any) => (b.date || '').localeCompare(a.date || ''));
         const latestTilawah = tilawahDeposits[0];

         let currentLevelStr = 'Belum Ada Data';
         let category = 'Belum Ada Data'; // For charting
         let levelScore = 0;
         
         if (latestTilawah && (!latestUmmi || (latestTilawah.date || '') >= (latestUmmi.date || ''))) {
             currentLevelStr = 'Al-Qur\'an';
             category = 'Al-Qur\'an';
             levelScore = 7;
         } else if (latestUmmi) {
             const lvl = latestUmmi.details?.level;
             if (lvl === 'Al-Quran' || lvl === 7 || lvl === '7') {
                 currentLevelStr = 'Al-Qur\'an';
                 category = 'Al-Qur\'an';
                 levelScore = 7;
             } else if (lvl) {
                 currentLevelStr = `Jilid ${lvl}`;
                 category = `Jilid ${lvl}`;
                 levelScore = parseInt(lvl.toString()) || 0;
             }
         }
         
         const hafalanDeposits = deposits.filter((dep: any) => dep.student_id === student.id && dep.type === 'hafalan');
         hafalanDeposits.sort((a: any, b: any) => (b.date || '').localeCompare(a.date || ''));
         const latestHafalan = hafalanDeposits[0];
         let currentHafalanStr = 'Belum Ada Data';
         let normalizedHafalan = '';
         if (latestHafalan) {
            currentHafalanStr = `Surah ${latestHafalan.details?.surah || '-'}`;
            normalizedHafalan = (latestHafalan.details?.surah || '').toLowerCase().replace(/[^a-z]/g, '').replace(/^(surah|surat|qs)/, '');
         }

         studentsList.push({
            name: student.name,
            guru: guru,
            halaqoh: student.halaqoh_name || halaqohs.find((h: any) => h && h.id === student.halaqoh_id)?.name || 'Tanpa Halaqoh',
            level: currentLevelStr,
            levelScore,
            category: category,
            hafalan: currentHafalanStr,
            normalizedHafalan,
         });
      });
    });

    const jilidCounts: Record<string, number> = {};
    studentsList.forEach(s => {
      jilidCounts[s.category] = (jilidCounts[s.category] || 0) + 1;
    });

    const totalStudents = studentsList.length;
    
    // Sort logic for Jilid
    const order = ['Jilid 1', 'Jilid 2', 'Jilid 3', 'Jilid 4', 'Jilid 5', 'Jilid 6', 'Al-Qur\'an', 'Belum Ada Data', 'Lainnya'];
    const jilidStatsArr = Object.keys(jilidCounts).map(k => ({
      name: k,
      value: jilidCounts[k],
      percentage: totalStudents ? ((jilidCounts[k] / totalStudents) * 100).toFixed(1) : '0'
    })).sort((a, b) => {
      const idxA = order.indexOf(a.name);
      const idxB = order.indexOf(b.name);
      return (idxA > -1 ? idxA : 99) - (idxB > -1 ? idxB : 99);
    });

    // Top Hafalan
    const hafalanCounts: Record<string, number> = {};
    studentsList.forEach(s => {
      if (s.hafalan !== 'Belum Ada Data') {
         hafalanCounts[s.hafalan] = (hafalanCounts[s.hafalan] || 0) + 1;
      }
    });

    const hafalanStatsArr = Object.keys(hafalanCounts).map(k => ({
      name: k,
      count: hafalanCounts[k]
    })).sort((a, b) => b.count - a.count).slice(0, 10); // top 10

    // Progression sequence from Juz 30 -> Juz 29 -> Juz 28
    const SURAH_PROGRESSION = [
      "", // 0
      "annaba", "annaziat", "abasa", // 1-3
      "attakwir", "alinfitar", "almuthaffifin", "alinsyiqaq", // 4-7
      "alburuj", "atthariq", "alala", "alghasyiyah", "alfajr", // 8-12
      "albalad", "asysyams", "allail", "addhuha", "asysyarh", "attin", "alalaq", // 13-19
      "alqadr", "albayyinah", "azzalzalah", "aladiyat", "alqariah", "attakatsur", "alasr", "alhumazah", "alfil", "quraisy", "almaun", "alkautsar", "alkafirun", "annasr", "almasad", "alikhlas", "alfalaq", "annas", // 20-37
      "almulk", "alqalam", "alhaqqoh", "almaarij", "nuh", "aljin", "almuzammil", "almuddatsir", "alqiyamah", "alinsan", "almursalat", // 38-48
      "attahrim", "atthalaq", "asshaff", "almumtahanah", "alhasyr", "almujadalah", "alhadid", "alwaqiah", "annajm", "adzdzariyat", "atthur", "qof", "alhujurat", "alfath" // 49-62
    ];

    const SURAH_ALIASES: Record<string, number> = {
      "attoriq": 9,
      "algosyiyah": 11,
      "alghosiyah": 11,
      "alhaqqah": 40,
      "alqolam": 39,
      "albayinah": 21,
      "alinfitor": 5,
      "almuthoffifin": 6,
      "almutaffifin": 6,
      "almuzzammil": 44,
      "almudasir": 45,
      "ashshaff": 51,
      "asshof": 51,
      "attaqabun": 50,
      "addzariyat": 58,
      "attur": 59,
      "qaf": 60,
      "albaqoroh": 99,
      "albaqarah": 99,
      "almaidah": 99,
      "aliimran": 99,
      "annisa": 99,
      "alanam": 99,
      "alaraf": 99,
      "alanfal": 99,
      "attaubah": 99,
      "yunus": 99,
      "hud": 99,
      "yusuf": 99,
      "arrad": 99,
      "ibrahim": 99,
      "alhijr": 99,
      "annahl": 99,
      "alisra": 99,
      "alkahfi": 99,
      "maryam": 99,
      "taha": 99,
      "alanbiya": 99,
      "alhaj": 99,
      "almuminun": 99,
      "annur": 99,
      "alfurqan": 99,
      "asysyuara": 99,
      "annaml": 99,
      "alqasas": 99,
      "alankabut": 99,
      "arrum": 99,
      "luqman": 99,
      "assajdah": 99,
      "alazhab": 99,
      "saba": 99,
      "fatir": 99,
      "yasin": 99,
      "yasiin": 99,
      "assaffat": 99,
      "sad": 99,
      "shod": 99,
      "azzumar": 99,
      "ghafir": 99,
      "fussilat": 99,
      "asysyura": 99,
      "azzukhruf": 99,
      "addukhan": 99,
      "aljasiyah": 99
    };
    
    function getHighestSurahIndex(rawText: string): number {
      if (!rawText || typeof rawText !== 'string' || rawText === 'Belum Ada Data' || rawText === 'Belum Ada Data' || rawText === 'Surah -') return 0;
      
      const text = rawText.toLowerCase().replace(/[^a-z0-9\s-]/g, '');
      const tokens = text.split(/[\s-]+/).filter((t: string) => t !== 'surah' && t !== 'surat' && t !== 'qs' && t !== 'sampai' && t !== 'dan' && t !== 'juz');
      const fullJoined = tokens.join('');
      
      let maxIdx = 0;
      
      for (let i = 1; i < SURAH_PROGRESSION.length; i++) {
         const p = SURAH_PROGRESSION[i];
         if (fullJoined.includes(p)) {
            if (i > maxIdx) maxIdx = i;
         }
      }
      
      for (const alias in SURAH_ALIASES) {
         if (fullJoined.includes(alias)) {
            if (SURAH_ALIASES[alias] > maxIdx) maxIdx = SURAH_ALIASES[alias];
         }
      }
      
      if (maxIdx === 0 && fullJoined.length > 3) {
         if (fullJoined.includes("juz")) maxIdx = 99;
      }
      
      return maxIdx;
    }
    
    // Calculate achievement per Halaqoh
    const halaqohMap: Record<string, { total: number, achievedHafalan: number, achievedUmmi: number }> = {};
    
    studentsList.forEach(s => {
       const h = String(s.halaqoh || 'Tanpa Halaqoh');
       if (!halaqohMap[h]) halaqohMap[h] = { total: 0, achievedHafalan: 0, achievedUmmi: 0 };
       halaqohMap[h].total++;
       
       let grade = 0;
       const match = h.match(/([1-9])/);
       if (match) grade = parseInt(match[1]);
       
       let hafalanAchieved = false;
       let ummiAchieved = false;
       
       if (grade > 0) {
           let targetSurahIndex = 0;
           let targetLevel = 7; // Default to Al-Qur'an (Level 7)
           
           if (grade === 1) { targetSurahIndex = 3; targetLevel = 2; }
           else if (grade === 2) { targetSurahIndex = 12; targetLevel = 5; }
           else if (grade === 3) { targetSurahIndex = 37; targetLevel = 7; }
           else if (grade === 4) { targetSurahIndex = 43; targetLevel = 7; }
           else if (grade === 5) { targetSurahIndex = 48; targetLevel = 7; }
           else if (grade >= 6) { targetSurahIndex = 1; targetLevel = 7; } 
           
           let studentSurahIdx = getHighestSurahIndex(s.hafalan);
           
           hafalanAchieved = studentSurahIdx >= targetSurahIndex;
           ummiAchieved = s.levelScore >= targetLevel;
       } else {
           if (s.hafalan && s.hafalan !== 'Belum Ada Data') hafalanAchieved = true;
           if (s.levelScore > 0) ummiAchieved = true;
       }
       
       if (hafalanAchieved) halaqohMap[h].achievedHafalan++;
       if (ummiAchieved) halaqohMap[h].achievedUmmi++;
    });
    
    let totalAchievedHafalanAll = 0;
    let totalAchievedUmmiAll = 0;
    let totalUnachievedHafalanAll = 0;
    let totalUnachievedUmmiAll = 0;
    let grandTotalStudents = 0;

    const halaqohAchievement = Object.keys(halaqohMap).map(k => {
       grandTotalStudents += halaqohMap[k].total;
       totalAchievedHafalanAll += halaqohMap[k].achievedHafalan;
       totalAchievedUmmiAll += halaqohMap[k].achievedUmmi;
       totalUnachievedHafalanAll += (halaqohMap[k].total - halaqohMap[k].achievedHafalan);
       totalUnachievedUmmiAll += (halaqohMap[k].total - halaqohMap[k].achievedUmmi);

       return {
       name: k,
       total: halaqohMap[k].total,
       achievedHafalan: halaqohMap[k].achievedHafalan,
       achievedUmmi: halaqohMap[k].achievedUmmi,
       unachievedHafalan: halaqohMap[k].total - halaqohMap[k].achievedHafalan,
       unachievedUmmi: halaqohMap[k].total - halaqohMap[k].achievedUmmi,
       percentageHafalan: halaqohMap[k].total > 0 ? Math.round((halaqohMap[k].achievedHafalan / halaqohMap[k].total) * 100) : 0,
       percentageUmmi: halaqohMap[k].total > 0 ? Math.round((halaqohMap[k].achievedUmmi / halaqohMap[k].total) * 100) : 0
       };
    }).sort((a,b) => {
       const strA = String(a.name || '');
       const gradeA = strA.match(/([1-9])/) ? parseInt(a.name.match(/([1-9])/)[1]) : 99;
       const strB = String(b.name || '');
       const gradeB = strB.match(/([1-9])/) ? parseInt(b.name.match(/([1-9])/)[1]) : 99;
       if (gradeA !== gradeB) return gradeA - gradeB;
       return strA.localeCompare(strB);
    });

    const grandTotal = {
       totalStudents: grandTotalStudents,
       achievedHafalan: totalAchievedHafalanAll,
       achievedUmmi: totalAchievedUmmiAll,
       unachievedHafalan: totalUnachievedHafalanAll,
       unachievedUmmi: totalUnachievedUmmiAll,
       percentageHafalan: grandTotalStudents > 0 ? Math.round((totalAchievedHafalanAll / grandTotalStudents) * 100) : 0,
       percentageUmmi: grandTotalStudents > 0 ? Math.round((totalAchievedUmmiAll / grandTotalStudents) * 100) : 0
    };

    return { studentsProgress: studentsList, jilidStats: jilidStatsArr, hafalanStats: hafalanStatsArr, halaqohAchievement, grandTotal };
  }, [globalData]);


  const [isGenerating, setIsGenerating] = React.useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      try {
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true
        });
        
        let startY = 20;
        
        // HEADER
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("LAPORAN PROGRESS BACAAN & HAFALAN", pdf.internal.pageSize.getWidth() / 2, startY, { align: 'center' });
        
        startY += 8;
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Total Siswa Terdata: ${studentsProgress.length} Siswa`, pdf.internal.pageSize.getWidth() / 2, startY, { align: 'center' });
        
        startY += 15;
        
        // 1. Data Rinci Seluruh Siswa
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Data Rinci Seluruh Siswa", 14, startY);
        startY += 5;
        
        const studentsBody = studentsProgress.map((s) => [
           s.name, 
           s.guru, 
           s.level, 
           s.hafalan || '-'
        ]);
        
        autoTable(pdf, {
           startY: startY,
           head: [['Nama Siswa', 'Guru', 'Progress Ummi/Quran', 'Hafalan Terakhir']],
           body: studentsBody,
           theme: 'striped',
           headStyles: { fillColor: [59, 130, 246] }, // Tailwind blue-500
           styles: { fontSize: 8 },
           margin: { left: 14, right: 14 }
        });
        
        startY = (pdf as any).lastAutoTable.finalY + 15;
        
        // 2. Persentase Pencapaian Target Per Kelas / Halaqoh
        if (halaqohAchievement.length > 0) {
           pdf.setFontSize(12);
           pdf.setFont("helvetica", "bold");
           pdf.text("Persentase Pencapaian Target Per Kelas / Halaqoh", 14, startY);
           startY += 5;
           
           const halaqohBody = halaqohAchievement.map((h) => [
              h.name,
              h.total.toString(),
              h.achievedHafalan.toString(),
              h.unachievedHafalan.toString(),
              h.percentageHafalan.toString() + '%',
              h.achievedUmmi.toString(),
              h.unachievedUmmi.toString(),
              h.percentageUmmi.toString() + '%'
           ]);
           
           // Add grand total
           halaqohBody.push([
              "Total Keseluruhan",
              grandTotal.totalStudents.toString(),
              grandTotal.achievedHafalan.toString(),
              grandTotal.unachievedHafalan.toString(),
              grandTotal.percentageHafalan.toString() + '%',
              grandTotal.achievedUmmi.toString(),
              grandTotal.unachievedUmmi.toString(),
              grandTotal.percentageUmmi.toString() + '%'
           ]);
           
           autoTable(pdf, {
              startY: startY,
              head: [
                ['Nama Kelas', 'Total Siswa', 'Hafalan Tercapai', 'Hafalan Belum', 'Hafalan %', 'Ummi Tercapai', 'Ummi Belum', 'Ummi %']
              ],
              body: halaqohBody,
              theme: 'striped',
              headStyles: { fillColor: [16, 185, 129] }, // Tailwind emerald-500
              styles: { fontSize: 8 },
              margin: { left: 14, right: 14 },
              didParseCell: function(data) {
                 if (data.row.index === halaqohBody.length - 1) {
                    data.cell.styles.fontStyle = 'bold';
                    data.cell.styles.fillColor = [240, 240, 240];
                 }
              }
           });
           
           startY = (pdf as any).lastAutoTable.finalY + 15;
        }
        
        
        // 3. Target & Kurikulum Hafalan Tahunan
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        
        // check page break
        if (startY > pdf.internal.pageSize.getHeight() - 40) {
            pdf.addPage();
            startY = 20;
        }
        
        pdf.text("Target & Kurikulum Hafalan Tahunan", 14, startY);
        startY += 5;
        
        const kurikulumBody = [];
        // TARGET_KURIKULUM is defined globally in the file
        TARGET_KURIKULUM.forEach((t) => {
           if (t.full_text) {
              kurikulumBody.push([{ content: t.full_text, colSpan: 5, styles: { fontStyle: 'italic', halign: 'center' } }]);
           } else {
              kurikulumBody.push([
                 t.grade,
                 t.s1_hafalan,
                 t.s1_ummi,
                 t.s2_hafalan,
                 t.s2_ummi
              ]);
           }
        });
        
        autoTable(pdf, {
           startY: startY,
           head: [
              ['Kelas', 'Smt Ganjil: Hafalan', 'Smt Ganjil: Ummi', 'Smt Genap: Hafalan', 'Smt Genap: Ummi']
           ],
           body: kurikulumBody,
           theme: 'striped',
           headStyles: { fillColor: [87, 83, 78] }, // Tailwind stone-600
           styles: { fontSize: 8 },
           margin: { left: 14, right: 14 }
        });
        
        const fileName = `Laporan_Progress_Global_Tahfidz.pdf`;
        const median = (window as any).median;

        if (median) {
          const base64PDF = pdf.output('datauristring');
          if (median.share?.download) {
            median.share.download({ url: base64PDF, filename: fileName });
          } else if (median.download?.downloadFile) {
            median.download.downloadFile({ url: base64PDF, filename: fileName });
          } else if (median.fileDownload?.download) {
            median.fileDownload.download({ url: base64PDF, filename: fileName });
          } else {
            pdf.save(fileName);
          }
        } else {
          pdf.save(fileName);
        }
      } catch (e) {
        console.error(e);
        alert('Gagal membuat PDF');
      } finally {
        setIsGenerating(false);
      }
    }, 500);
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e', '#94a3b8', '#64748b'];

  return (
    <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm mt-8">
       <div className="p-6 border-b border-stone-100 bg-stone-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="font-bold text-stone-800 text-xl flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            Laporan Perkembangan Seluruh Siswa
          </h2>
          <button 
             onClick={generatePDF}
             disabled={isGenerating}
             className={`px-4 py-2 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-sm ${isGenerating ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
             <Download size={16} /> {isGenerating ? 'Memproses PDF...' : 'Download PDF'}
          </button>
       </div>

       <div id="admin-progress-report-content" className="p-8 space-y-10 bg-white">
          <div className="text-center mb-8">
             <h1 className="text-2xl font-black text-stone-900 leading-tight">LAPORAN PROGRESS BACAAN & HAFALAN</h1>
             <p className="text-stone-500">Total Siswa Terdata: {studentsProgress.length} Siswa</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
               <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
                 <BookOpen className="w-4 h-4 text-emerald-500" /> Rekap Jilid & Al-Qur'an
               </h3>
               <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                 <div className="h-64 w-full md:w-1/2">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie data={jilidStats} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                         {jilidStats.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                       </Pie>
                       <Tooltip formatter={(value: any, name: any, props: any) => [`${value} Siswa (${props.payload.percentage}%)`, name]} />
                     </PieChart>
                   </ResponsiveContainer>
                 </div>
                 <div className="w-full md:w-1/2 space-y-2">
                   {jilidStats.map((item, i) => (
                     <div key={i} className="flex items-center justify-between text-sm">
                       <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                          <span className="font-medium text-stone-700">{item.name}</span>
                       </div>
                       <div className="font-bold text-stone-900 border-b border-stone-200 border-dotted flex-1 mx-3" />
                       <span className="font-bold text-stone-900">{item.value} <span className="text-stone-400 font-normal text-xs">({item.percentage}%)</span></span>
                     </div>
                   ))}
                 </div>
               </div>
            </div>

            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
               <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
                 <BookOpen className="w-4 h-4 text-amber-500" /> Hafalan Terbanyak Dikerjakan (Top 10)
               </h3>
               <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={hafalanStats} layout="vertical" margin={{ left: 10, right: 10, top: 0, bottom: 0 }}>
                       <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                       <XAxis type="number" hide />
                       <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                       <Tooltip />
                       <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]}>
                         {hafalanStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                         ))}
                       </Bar>
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </div>

          <div className="bg-stone-50 rounded-2xl p-0 border border-stone-100 overflow-hidden mt-8">
             <div className="p-4 border-b border-stone-200 bg-stone-100/50">
               <h3 className="font-bold text-stone-800 text-sm">Data Rinci Seluruh Siswa</h3>
             </div>
             <div id="student-table-container" className="overflow-x-auto max-h-96 custom-scrollbar">
               <table className="w-full text-left text-xs text-stone-700">
                 <thead className="bg-white sticky top-0 shadow-sm z-10">
                   <tr>
                     <th className="px-4 py-3 font-bold border-b text-stone-900">Nama Siswa</th>
                     <th className="px-4 py-3 font-bold border-b text-stone-900">Guru</th>
                     <th className="px-4 py-3 font-bold border-b text-stone-900">Progress Ummi/Quran</th>
                     <th className="px-4 py-3 font-bold border-b text-stone-900">Hafalan Terakhir</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-stone-100">
                    {studentsProgress.map((s, i) => (
                      <tr key={i} className="hover:bg-white/50 transition-colors">
                        <td className="px-4 py-2 font-medium">{s.name}</td>
                        <td className="px-4 py-2 text-stone-500">{s.guru}</td>
                        <td className="px-4 py-2">
                           <span className={`px-2 py-1 rounded-md font-bold ${s.level === "Al-Qur'an" ? 'bg-indigo-100 text-indigo-700' : s.level.includes('Jilid') ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                             {s.level}
                           </span>
                        </td>
                        <td className="px-4 py-2 text-stone-600 font-medium">{s.hafalan}</td>
                      </tr>
                    ))}
                    {studentsProgress.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-stone-400">Belum ada data siswa.</td>
                      </tr>
                    )}
                 </tbody>
               </table>

             </div>
          </div>

          <div className="bg-stone-50 rounded-2xl p-0 border border-stone-100 overflow-hidden mt-8">
             <div className="p-4 border-b border-stone-200 bg-stone-100/50">
               <h3 className="font-bold text-stone-800 text-sm">Persentase Pencapaian Target Per Kelas / Halaqoh</h3>
             </div>
             
             {halaqohAchievement.length > 0 && (
               <div className="p-6 bg-white border-b border-stone-100">
                 <div className="h-72 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={halaqohAchievement} margin={{ top: 20, right: 30, left: 0, bottom: 25 }}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
                       <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#78716c' }} axisLine={false} tickLine={false} angle={-45} textAnchor="end" height={60} />
                       <YAxis tick={{ fontSize: 11, fill: '#78716c' }} axisLine={false} tickLine={false} unit="%" />
                       <Tooltip cursor={{ fill: '#f5f5f4' }} formatter={(value: any, name: any) => [`${value}%`, name === 'percentageHafalan' ? 'Target Hafalan' : 'Target Ummi']} labelStyle={{color: '#1c1917', fontWeight: 'bold'}} />
                       <Bar dataKey="percentageHafalan" name="Target Hafalan" fill="#059669" radius={[4, 4, 0, 0]} barSize={24} />
                       <Bar dataKey="percentageUmmi" name="Target Ummi" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
                 <div className="flex justify-center gap-8 mt-6">
                   <div className="flex items-center gap-2">
                     <div className="w-4 h-4 rounded bg-[#059669]"></div>
                     <span className="text-xs text-stone-700 font-bold">Hafalan Tercapai</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="w-4 h-4 rounded bg-[#3b82f6]"></div>
                     <span className="text-xs text-stone-700 font-bold">Ummi/Tilawah Tercapai</span>
                   </div>
                 </div>
               </div>
             )}
             <div className="overflow-x-auto text-xs text-stone-700">
               <table className="w-full text-left">
                 <thead className="bg-white sticky top-0 shadow-sm z-10">
                   <tr>
                     <th className="px-4 py-3 font-bold border-b text-stone-900" rowSpan={2}>Nama Kelas/Halaqoh</th>
                     <th className="px-4 py-3 font-bold border-b border-l text-stone-900 text-center" rowSpan={2}>Total Siswa</th>
                     <th className="px-4 py-2 font-bold border-b border-l text-stone-900 text-center" colSpan={3}>Target Hafalan</th>
                     <th className="px-4 py-2 font-bold border-b border-l text-stone-900 text-center" colSpan={3}>Target Ummi/Tilawah</th>
                   </tr>
                   <tr>
                     <th className="px-4 py-2 font-bold border-b border-l text-emerald-700 text-center bg-emerald-50/50">Tercapai</th>
                     <th className="px-4 py-2 font-bold border-b text-rose-700 text-center bg-rose-50/50">Belum</th>
                     <th className="px-4 py-2 font-bold border-b text-stone-900 text-center bg-stone-50">%</th>
                     <th className="px-4 py-2 font-bold border-b border-l text-emerald-700 text-center bg-emerald-50/50">Tercapai</th>
                     <th className="px-4 py-2 font-bold border-b text-rose-700 text-center bg-rose-50/50">Belum</th>
                     <th className="px-4 py-2 font-bold border-b text-stone-900 text-center bg-stone-50">%</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-stone-100 bg-white">
                    {halaqohAchievement.map((item, i) => (
                      <tr key={i} className="hover:bg-stone-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-stone-800">{item.name}</td>
                        <td className="px-4 py-3 text-center border-l border-stone-100">{item.total}</td>
                        
                        <td className="px-4 py-3 text-center text-emerald-600 font-bold border-l border-stone-100 bg-emerald-50/10">{item.achievedHafalan}</td>
                        <td className="px-4 py-3 text-center text-rose-600 font-bold bg-rose-50/10">{item.unachievedHafalan}</td>
                        <td className="px-4 py-3 text-center font-bold bg-stone-50/10">
                           <span className={item.percentageHafalan >= 75 ? 'text-emerald-600' : item.percentageHafalan >= 50 ? 'text-indigo-600' : 'text-amber-500'}>
                             {item.percentageHafalan}%
                           </span>
                        </td>
                        
                        <td className="px-4 py-3 text-center text-emerald-600 font-bold border-l border-stone-100 bg-emerald-50/10">{item.achievedUmmi}</td>
                        <td className="px-4 py-3 text-center text-rose-600 font-bold bg-rose-50/10">{item.unachievedUmmi}</td>
                        <td className="px-4 py-3 text-center font-bold bg-stone-50/10">
                           <span className={item.percentageUmmi >= 75 ? 'text-emerald-600' : item.percentageUmmi >= 50 ? 'text-indigo-600' : 'text-amber-500'}>
                             {item.percentageUmmi}%
                           </span>
                        </td>
                      </tr>
                    ))}
                    {halaqohAchievement.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-stone-400">Belum ada data pencapaian.</td>
                      </tr>
                    )}

                    {halaqohAchievement.length > 0 && (
                      <tr className="bg-stone-100/80 font-bold border-t-2 border-stone-200 text-stone-900">
                        <td className="px-4 py-3 text-right">Total Keseluruhan</td>
                        <td className="px-4 py-3 text-center border-l border-stone-200">{grandTotal.totalStudents}</td>
                        <td className="px-4 py-3 text-center text-emerald-700 border-l border-stone-200">{grandTotal.achievedHafalan}</td>
                        <td className="px-4 py-3 text-center text-rose-700 border-l border-stone-100">{grandTotal.unachievedHafalan}</td>
                        <td className="px-4 py-3 text-center text-stone-900 border-l border-stone-100">{grandTotal.percentageHafalan}%</td>
                        <td className="px-4 py-3 text-center text-emerald-700 border-l border-stone-200">{grandTotal.achievedUmmi}</td>
                        <td className="px-4 py-3 text-center text-rose-700 border-l border-stone-100">{grandTotal.unachievedUmmi}</td>
                        <td className="px-4 py-3 text-center text-stone-900 border-l border-stone-100">{grandTotal.percentageUmmi}%</td>
                      </tr>
                    )}
                 </tbody>
               </table>
             </div>
          </div>

          {/* TARGET KURIKULUM SECTION */}
          <div className="bg-stone-50 rounded-2xl p-0 border border-stone-100 overflow-hidden mt-8">
             <div className="p-4 border-b border-stone-200 bg-stone-100/50">
               <h3 className="font-bold text-stone-800 text-sm">Target & Kurikulum Hafalan Tahunan</h3>
             </div>
             <div className="overflow-x-auto text-xs text-stone-700">
               <table className="w-full text-left">
                 <thead className="bg-stone-100 text-stone-900 border-b border-stone-200">
                   <tr>
                     <th className="px-4 py-3 font-bold border-r border-stone-200 w-[15%]" rowSpan={2}>Kelas</th>
                     <th className="px-4 py-2 font-bold border-b border-r border-stone-200 text-center" colSpan={2}>Semester Ganjil</th>
                     <th className="px-4 py-2 font-bold border-b border-stone-200 text-center" colSpan={2}>Semester Genap</th>
                   </tr>
                   <tr>
                     <th className="px-4 py-2 font-bold bg-white border-r border-stone-200 text-center">Target Hafalan</th>
                     <th className="px-4 py-2 font-bold bg-white border-r border-stone-200 text-center">Ummi/Tilawah</th>
                     <th className="px-4 py-2 font-bold bg-white border-r border-stone-200 text-center">Target Hafalan</th>
                     <th className="px-4 py-2 font-bold bg-white text-center">Ummi/Tilawah</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-stone-100 bg-white">
                    {TARGET_KURIKULUM.map((item, i) => (
                      <tr key={i} className="hover:bg-stone-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-stone-800 border-r border-stone-100">{item.grade}</td>
                        {item.full_text ? (
                          <td className="px-4 py-3 text-center italic text-stone-600 bg-stone-50/50" colSpan={4}>{item.full_text}</td>
                        ) : (
                          <>
                            <td className="px-4 py-3 border-r border-stone-100 bg-emerald-50/30 text-emerald-900 text-center">{item.s1_hafalan}</td>
                            <td className="px-4 py-3 border-r border-stone-100 bg-blue-50/30 text-blue-900 text-center">{item.s1_ummi}</td>
                            <td className="px-4 py-3 border-r border-stone-100 bg-emerald-50/30 text-emerald-900 text-center">{item.s2_hafalan}</td>
                            <td className="px-4 py-3 bg-blue-50/30 text-blue-900 text-center">{item.s2_ummi}</td>
                          </>
                        )}
                      </tr>
                    ))}
                 </tbody>
               </table>
             </div>
          </div>
       </div>
    </div>
  );
};
