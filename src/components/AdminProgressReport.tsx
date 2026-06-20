import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Download, TrendingUp, BookOpen } from 'lucide-react';
import jsPDF from 'jspdf';
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
  const { studentsProgress, jilidStats, hafalanStats, halaqohAchievement } = useMemo(() => {
    const studentsList: any[] = [];
    
    Object.keys(globalData).forEach(guru => {
      const d = globalData[guru];
      const students = d.students || [];
      const deposits = d.daily_deposits || [];

      students.forEach((student: any) => {
         const ummiDeposits = deposits.filter((dep: any) => dep.student_id === student.id && dep.type === 'ummi');
         ummiDeposits.sort((a: any, b: any) => b.date.localeCompare(a.date));
         const latestUmmi = ummiDeposits[0];

         const tilawahDeposits = deposits.filter((dep: any) => dep.student_id === student.id && dep.type === 'tilawah');
         tilawahDeposits.sort((a: any, b: any) => b.date.localeCompare(a.date));
         const latestTilawah = tilawahDeposits[0];

         let currentLevelStr = 'Belum Ada Data';
         let category = 'Belum Ada Data'; // For charting
         let levelScore = 0;
         
         if (latestTilawah && (!latestUmmi || latestTilawah.date >= latestUmmi.date)) {
             currentLevelStr = 'Al-Qur\'an';
             category = 'Al-Qur\'an';
             levelScore = 10;
         } else if (latestUmmi) {
             const lvl = latestUmmi.details?.level;
             if (lvl === 'Al-Quran' || lvl === 7 || lvl === '7') {
                 currentLevelStr = 'Al-Qur\'an';
                 category = 'Al-Qur\'an';
                 levelScore = 10;
             } else if (lvl) {
                 currentLevelStr = `Jilid ${lvl}`;
                 category = `Jilid ${lvl}`;
                 levelScore = parseInt(lvl.toString()) || 0;
             }
         }
         
         const hafalanDeposits = deposits.filter((dep: any) => dep.student_id === student.id && dep.type === 'hafalan');
         hafalanDeposits.sort((a: any, b: any) => b.date.localeCompare(a.date));
         const latestHafalan = hafalanDeposits[0];
         let currentHafalanStr = 'Belum Ada Data';
         let normalizedHafalan = '';
         if (latestHafalan) {
            currentHafalanStr = `Surah ${latestHafalan.details?.surah || '-'}`;
            normalizedHafalan = (latestHafalan.details?.surah || '').toLowerCase().replace(/[^a-z]/g, '');
         }

         studentsList.push({
            name: student.name,
            guru: guru,
            halaqoh: student.halaqoh_name || 'Tanpa Halaqoh',
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

    // JUZ 30 Surahs for scoring (Forward progression)
    const JUZ30 = [
      "annaba", "annaziat", "abasa", "attakwir", "alinfitar", "almutaffifin", "alinsyiqaq", 
      "alburuj", "attariq", "alala", "algasyiyah", "alfajr", "albalad", "asysyams", "allail", 
      "adduha", "asysyarh", "attin", "alalaq", "alqadr", "albayyinah", "azzalzalah", "aladiyat", 
      "alqariah", "attakasur", "alasr", "alhumazah", "alfil", "quraisy", "almaun", "alkausar", 
      "alkafirun", "annasr", "allahab", "alikhlas", "alfalaq", "annas"
    ];
    
    // Calculate achievement per Halaqoh
    const halaqohMap: Record<string, { total: number, achievedHafalan: number, achievedUmmi: number }> = {};
    
    studentsList.forEach(s => {
       const h = s.halaqoh;
       if (!halaqohMap[h]) halaqohMap[h] = { total: 0, achievedHafalan: 0, achievedUmmi: 0 };
       halaqohMap[h].total++;
       
       let grade = 0;
       const match = h.match(/([1-9])/);
       if (match) grade = parseInt(match[1]);
       
       let hafalanAchieved = false;
       let ummiAchieved = false;
       
       if (grade > 0) {
           let targetSurahIndex = 0;
           let targetLevel = 0;
           
           if (grade === 1) { targetSurahIndex = 6; targetLevel = 3; } // Al-Insyiqaq, Jilid 3
           else if (grade === 2) { targetSurahIndex = 18; targetLevel = 6; } // Al-'Alaq, Jilid 6
           else if (grade >= 3) { targetSurahIndex = 36; targetLevel = 10; } // An-Nas, Al-Quran
           
           let studentSurahIdx = JUZ30.indexOf(s.normalizedHafalan);
           // Special handling for juz 29 or random text (assume achieved if they aren't in juz 30 but grade is higher? Or just check if hafalan is anything valid)
           if (studentSurahIdx === -1 && s.normalizedHafalan.length > 3) {
               // Might be parsing external surah or Juz 29/etc
               // Let's assume if grade>=7 it's achieved just by having some data
               if (grade >= 6) studentSurahIdx = 99; 
           }
           
           hafalanAchieved = studentSurahIdx >= targetSurahIndex;
           ummiAchieved = s.levelScore >= targetLevel;
       } else {
           // No grade detected, just check if they have any data
           if (s.normalizedHafalan) hafalanAchieved = true;
           if (s.levelScore > 0) ummiAchieved = true;
       }
       
       if (hafalanAchieved) halaqohMap[h].achievedHafalan++;
       if (ummiAchieved) halaqohMap[h].achievedUmmi++;
    });
    
    const halaqohAchievement = Object.keys(halaqohMap).map(k => ({
       name: k,
       total: halaqohMap[k].total,
       achievedHafalan: halaqohMap[k].achievedHafalan,
       achievedUmmi: halaqohMap[k].achievedUmmi,
       unachievedHafalan: halaqohMap[k].total - halaqohMap[k].achievedHafalan,
       unachievedUmmi: halaqohMap[k].total - halaqohMap[k].achievedUmmi,
       percentageHafalan: halaqohMap[k].total > 0 ? Math.round((halaqohMap[k].achievedHafalan / halaqohMap[k].total) * 100) : 0,
       percentageUmmi: halaqohMap[k].total > 0 ? Math.round((halaqohMap[k].achievedUmmi / halaqohMap[k].total) * 100) : 0
    })).sort((a,b) => b.percentageHafalan - a.percentageHafalan);

    return { studentsProgress: studentsList, jilidStats: jilidStatsArr, hafalanStats: hafalanStatsArr, halaqohAchievement };
  }, [globalData]);


  const [isGenerating, setIsGenerating] = React.useState(false);

  const generatePDF = async () => {
    const el = document.getElementById('admin-progress-report-content');
    if (!el || isGenerating) return;
    
    setIsGenerating(true);
    
    setTimeout(async () => {
      try {
        // Temporarily expand height to capture max-h elements correctly or we just capture what's visible
        const oldMaxHeight = document.getElementById('student-table-container')?.style.maxHeight;
        const tcontainer = document.getElementById('student-table-container');
        let hasMaxHClass = false;
        
        if (tcontainer) {
          tcontainer.style.maxHeight = 'none';
          hasMaxHClass = tcontainer.classList.contains('max-h-96');
          if (hasMaxHClass) tcontainer.classList.remove('max-h-96');
        }

        // Fix fonts locally before render
        const fontPromise = (document as any).fonts ? (document as any).fonts.ready : Promise.resolve();
        await fontPromise;

        const imgData = await htmlToImage.toJpeg(el, { 
          quality: 0.95,
          pixelRatio: 2, 
          backgroundColor: '#ffffff',
          style: {
            transform: 'none',
            margin: '0',
            maxHeight: 'none',
          }
        });
        
        if (tcontainer) {
           tcontainer.style.maxHeight = oldMaxHeight || '';
           if (hasMaxHClass) tcontainer.classList.add('max-h-96');
        }

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfPageHeight = pdf.internal.pageSize.getHeight();
        const imgProps = pdf.getImageProperties(imgData);
        const totalPdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        // Paginate if necessary
        let heightLeft = totalPdfHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, totalPdfHeight, undefined, 'FAST');
        heightLeft -= pdfPageHeight;
        
        while (heightLeft > 1) {
           position = heightLeft - totalPdfHeight;
           pdf.addPage();
           pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, totalPdfHeight, undefined, 'FAST');
           heightLeft -= pdfPageHeight;
        }
        
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
