import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Download, BookOpen, Search, Users, CheckCircle2, XCircle, Info, Calendar, Sparkles } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  KURIKULUM_TAHUNAN, 
  getCurriculumForGrade, 
  parseHafalanPosition, 
  parseTargetSpecification,
  evaluateHafalanAchievement 
} from '../lib/curriculumTargets';

export function parseGradeFromHalaqohName(name: string): number {
  if (!name) return 0;
  const lower = name.toLowerCase();
  
  // MTs check
  if (lower.includes('mts 1') || lower.includes('mts1') || lower.includes('kelas 7') || lower.includes('7 mts') || lower.includes('7a') || lower.includes('7b') || lower.includes('7c') || /\bvii\b/.test(lower)) return 7;
  if (lower.includes('mts 2') || lower.includes('mts2') || lower.includes('kelas 8') || lower.includes('8 mts') || lower.includes('8a') || lower.includes('8b') || lower.includes('8c') || /\bviii\b/.test(lower)) return 8;
  if (lower.includes('mts 3') || lower.includes('mts3') || lower.includes('kelas 9') || lower.includes('9 mts') || lower.includes('9a') || lower.includes('9b') || lower.includes('9c') || /\bix\b/.test(lower)) return 9;
  
  // Roman numerals check
  if (/\b(?:ix)\b/i.test(lower) || /kelas\s*ix/i.test(lower)) return 9;
  if (/\b(?:viii)\b/i.test(lower) || /kelas\s*viii/i.test(lower)) return 8;
  if (/\b(?:vii)\b/i.test(lower) || /kelas\s*vii/i.test(lower)) return 7;
  if (/\b(?:vi)\b/i.test(lower) || /kelas\s*vi/i.test(lower)) return 6;
  if (/\b(?:v)\b/i.test(lower) || /kelas\s*v/i.test(lower)) return 5;
  if (/\b(?:iv)\b/i.test(lower) || /kelas\s*iv/i.test(lower)) return 4;
  if (/\b(?:iii)\b/i.test(lower) || /kelas\s*iii/i.test(lower)) return 3;
  if (/\b(?:ii)\b/i.test(lower) || /kelas\s*ii/i.test(lower)) return 2;
  if (/\b(?:i)\b/i.test(lower) || /kelas\s*i\b/i.test(lower)) return 1;

  // Arabic numerals
  const match = lower.match(/(?:kelas|kategori|tingkat|sd|mts)?\s*([1-9])/i);
  if (match) return parseInt(match[1]);

  const rawDigit = lower.match(/([1-9])/);
  if (rawDigit) return parseInt(rawDigit[1]);

  return 0;
}

const COLORS = ['#10b981', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#14b8a6', '#06b6d4'];

export const AdminProgressReport = ({ globalData }: { globalData: Record<string, any> }) => {
  const [selectedSemester, setSelectedSemester] = useState<1 | 2>(1);
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuru, setSelectedGuru] = useState('all');
  const [selectedHalaqoh, setSelectedHalaqoh] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'achieved' | 'unachieved'>('all');
  const [isGenerating, setIsGenerating] = useState(false);

  // Perhitungan Data Siswa & Capaian Berdasarkan Semester yang Dipilih
  const { studentsProgress, jilidStats, hafalanStats, halaqohAchievement, grandTotal } = useMemo(() => {
    const studentsList: any[] = [];
    
    Object.keys(globalData).forEach(guru => {
      const d = globalData[guru];
      if (!d) return;
      const students = d.students || [];
      const deposits = d.daily_deposits || [];
      const halaqohs = d.halaqoh || d.halaqohs || [];

      students.forEach((student: any) => {
         const ummiDeposits = deposits.filter((dep: any) => dep.student_id === student.id && dep.type === 'ummi');
         ummiDeposits.sort((a: any, b: any) => b.date.localeCompare(a.date));

         const tilawahDeposits = deposits.filter((dep: any) => dep.student_id === student.id && dep.type === 'tilawah');
         tilawahDeposits.sort((a: any, b: any) => b.date.localeCompare(a.date));

         const halaqohObj = halaqohs.find((h: any) => String(h.id) === String(student.halaqoh_id));
         const halaqohName = halaqohObj?.name || student.halaqoh_name || student.group || 'Tidak Ada Halaqoh';
         const grade = parseGradeFromHalaqohName(student.grade || student.kelas || student.tingkat || halaqohName || student.name) || parseGradeFromHalaqohName(guru) || 1;

         // Target kurikulum untuk kelas dan semester yang dipilih
         let targetDetail = getCurriculumForGrade(grade, selectedSemester);

         // Jika guru menset target hafalan khusus untuk santri ini
         const explicitTarget = student.target || student.target_hafalan || (d.exams_hafalan || []).find((e: any) => e.student_id === student.id && e.target)?.target;
         if (explicitTarget) {
            const customTarget = parseTargetSpecification(explicitTarget, grade, selectedSemester);
            if (customTarget && customTarget.targetSurahIndex > 0) {
               targetDetail = customTarget;
            }
         }

         // Progress Ummi
         let currentLevelStr = 'Belum Ada Data';
         let category = 'Belum Ada Data';
         let levelScore = 0;
         let ummiAbsoluteScore = 0;
         
         const allLevels: any[] = [];
         tilawahDeposits.forEach((dep: any) => {
             allLevels.push({
                 score: 7 * 40,
                 levelScore: 7,
                 levelStr: "Al-Qur'an",
                 category: "Al-Qur'an"
             });
         });
         ummiDeposits.forEach((dep: any) => {
             const lvl = dep.details?.level;
             const page = parseInt(dep.details?.page || dep.details?.page_end || dep.details?.page_start || '0') || 0;
             if (lvl === 'Al-Quran' || lvl === 7 || lvl === '7') {
                 allLevels.push({
                     score: 7 * 40,
                     levelScore: 7,
                     levelStr: "Al-Qur'an",
                     category: "Al-Qur'an"
                 });
             } else if (lvl) {
                 const l = parseInt(lvl.toString()) || 0;
                 allLevels.push({
                     score: (l - 1) * 40 + page,
                     levelScore: l,
                     levelStr: `Jilid ${lvl}${page > 0 ? ` Hal ${page}` : ''}`,
                     category: `Jilid ${lvl}`
                 });
             }
         });

         if (allLevels.length > 0) {
             allLevels.sort((a, b) => b.score - a.score);
             levelScore = allLevels[0].levelScore;
             ummiAbsoluteScore = allLevels[0].score;
             currentLevelStr = allLevels[0].levelStr;
             category = allLevels[0].category;
         }

         // Scan semua setoran hafalan siswa
         const hafalanDeposits = deposits.filter((dep: any) => dep.student_id === student.id && dep.type === 'hafalan');
         hafalanDeposits.sort((a: any, b: any) => b.date.localeCompare(a.date));

         let bestHafalanPos = parseHafalanPosition('');
         let currentHafalanStr = 'Belum Ada Data';

         // 1. Scan setoran harian hafalan
         hafalanDeposits.forEach((dep: any) => {
             const dt = dep.details || {};
             const parsed = parseHafalanPosition({
                surah: dt.surah || '',
                verse_start: dt.verse_start,
                verse_end: dt.verse_end,
                ayah: dt.ayah
             });
             if (parsed.curriculumIndex > bestHafalanPos.curriculumIndex || 
                (parsed.curriculumIndex === bestHafalanPos.curriculumIndex && parsed.ayah > bestHafalanPos.ayah)) {
                bestHafalanPos = parsed;
                currentHafalanStr = `Surah ${parsed.surahName || dt.surah}${parsed.ayah ? ` ayat ${parsed.ayah}` : ''}`;
             }
             if (dt.next_surah) {
                const nextParsed = parseHafalanPosition(dt.next_surah);
                if (nextParsed.curriculumIndex > bestHafalanPos.curriculumIndex) {
                   bestHafalanPos = nextParsed;
                   currentHafalanStr = `Surah ${nextParsed.surahName || dt.next_surah}`;
                }
             }
         });

         // 2. Scan rekap bulanan guru
         const monthlyRecaps = d.monthly_recaps || [];
         monthlyRecaps.forEach((r: any) => {
             if (r.student_id === student.id && r.total_hafalan) {
                 const parsed = parseHafalanPosition(r.total_hafalan);
                 if (parsed.curriculumIndex > bestHafalanPos.curriculumIndex || 
                    (parsed.curriculumIndex === bestHafalanPos.curriculumIndex && parsed.ayah > bestHafalanPos.ayah)) {
                     bestHafalanPos = parsed;
                     currentHafalanStr = r.total_hafalan;
                 }
             }
         });

         // 3. Scan ujian hafalan (HANYA surah yang lulus diuji, BUKAN e.target!)
         const examsHafalan = d.exams_hafalan || [];
         let hasCompletedTargetExam = false;
         examsHafalan.forEach((e: any) => {
             if (e.student_id === student.id) {
                 const isCompleted = e.status === 'completed' || (e.note && /mutqin|lulus/i.test(e.note));
                 
                 // Cek apakah surah yang diuji dalam ujian ini mencapai target kurikulum
                 if (Array.isArray(e.surahs)) {
                     e.surahs.forEach((sObj: any) => {
                         const sName = typeof sObj === 'string' ? sObj : sObj?.name;
                         const sGrade = typeof sObj === 'object' ? sObj?.grade : null;
                         const isPass = !sGrade || sGrade === 'L' || sGrade === 'CL' || sGrade === 'A' || sGrade === 'B' || sGrade === 'C';
                         if (sName && isPass) {
                             const parsed = parseHafalanPosition(sName);
                             if (parsed.curriculumIndex > bestHafalanPos.curriculumIndex) {
                                 bestHafalanPos = parsed;
                                 if (currentHafalanStr === 'Belum Ada Data') currentHafalanStr = 'Surah ' + (parsed.surahName || sName);
                             }
                             if (isCompleted && parsed.curriculumIndex >= targetDetail.targetSurahIndex) {
                                 hasCompletedTargetExam = true;
                             }
                         }
                     });
                 }

                 // Jika ujian memiliki target spesifik dan dinyatakan completed
                 if (isCompleted && e.target) {
                     const examTgt = parseTargetSpecification(e.target);
                     if (examTgt.targetSurahIndex >= targetDetail.targetSurahIndex) {
                         hasCompletedTargetExam = true;
                     }
                 }
             }
         });

         // Cek apakah ada setoran berstatus Ujian dengan nilai Lulus pada surah target
         const passedExamInDeposits = hafalanDeposits.some((dep: any) => {
             const dt = dep.details || {};
             const isExam = dt.status === 'Ujian' || dt.is_ujian;
             const isPass = dt.grade === 'L' || dt.grade === 'CL';
             if (isExam && isPass && dt.surah) {
                 const p = parseHafalanPosition(dt);
                 return p.curriculumIndex >= targetDetail.targetSurahIndex;
             }
             return false;
         });
         if (passedExamInDeposits) {
             hasCompletedTargetExam = true;
         }

         // Evaluasi Capaian Target Hafalan berdasarkan Semester yang Dipilih
         const evalHafalan = evaluateHafalanAchievement(bestHafalanPos, targetDetail, hasCompletedTargetExam);

         // Evaluasi Capaian Target Ummi
         let ummiAchieved = false;
         let ummiStatus = 'Belum Ada Data';
         let ummiPercentage = 0;

         if (targetDetail.targetUmmiLevel === 0) {
             ummiAchieved = true;
             ummiStatus = 'Tercapai';
             ummiPercentage = 100;
         } else if (levelScore > 0) {
             const isPass = levelScore >= targetDetail.targetUmmiLevel && ummiAbsoluteScore >= targetDetail.targetUmmiAbsoluteScore;
             ummiAchieved = isPass;
             ummiStatus = isPass ? 'Tercapai' : 'Belum Mencapai Target';
             ummiPercentage = isPass ? 100 : Math.min(99, Math.round((ummiAbsoluteScore / targetDetail.targetUmmiAbsoluteScore) * 100));
         }

         studentsList.push({
             name: student.name,
             guru: guru,
             halaqoh: halaqohName,
             grade: grade,
             level: currentLevelStr,
             levelScore,
             category: category,
             hafalan: currentHafalanStr,
             hafalanPosition: bestHafalanPos,
             targetHafalan: targetDetail.hafalanLabel,
             targetUmmi: targetDetail.ummiLabel,
             hafalanStatus: evalHafalan.statusLabel,
             ummiStatus,
             hafalanAchieved: evalHafalan.achieved,
             ummiAchieved,
             hafalanPercentage: evalHafalan.percentage,
             ummiPercentage,
             keteranganHafalan: evalHafalan.keterangan
         });
      });
    });

    // Statistik Jilid
    const jilidCounts: Record<string, number> = {};
    studentsList.forEach(s => {
      jilidCounts[s.category] = (jilidCounts[s.category] || 0) + 1;
    });

    const totalStudents = studentsList.length;
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

    // Statistik Hafalan Terbanyak
    const hafalanCounts: Record<string, number> = {};
    studentsList.forEach(s => {
      const h = s.hafalanPosition?.surahName || (s.hafalan.startsWith('Surah ') ? s.hafalan.split(' ayat')[0].replace('Surah ', '') : s.hafalan);
      if (h && h !== 'Belum Ada Data' && h !== '-') {
        hafalanCounts[h] = (hafalanCounts[h] || 0) + 1;
      }
    });

    const hafalanStatsArr = Object.keys(hafalanCounts).map(k => ({
      name: k,
      count: hafalanCounts[k]
    })).sort((a, b) => b.count - a.count).slice(0, 10);

    // Rekap Target Per Halaqoh / Kelas
    const halaqohGroup: Record<string, any[]> = {};
    studentsList.forEach(s => {
      const groupKey = s.halaqoh || 'Lainnya';
      if (!halaqohGroup[groupKey]) halaqohGroup[groupKey] = [];
      halaqohGroup[groupKey].push(s);
    });

    let grandTotalStudents = 0;
    let totalAchievedHafalanAll = 0;
    let totalUnachievedHafalanAll = 0;
    let totalAchievedUmmiAll = 0;
    let totalUnachievedUmmiAll = 0;

    const halaqohAchievement = Object.keys(halaqohGroup).map(key => {
        const sArr = halaqohGroup[key];
        const tot = sArr.length;
        const passHafalan = sArr.filter(s => s.hafalanAchieved).length;
        const failHafalan = tot - passHafalan;
        const passUmmi = sArr.filter(s => s.ummiAchieved).length;
        const failUmmi = tot - passUmmi;

        grandTotalStudents += tot;
        totalAchievedHafalanAll += passHafalan;
        totalUnachievedHafalanAll += failHafalan;
        totalAchievedUmmiAll += passUmmi;
        totalUnachievedUmmiAll += failUmmi;

        return {
           name: key,
           total: tot,
           achievedHafalan: passHafalan,
           unachievedHafalan: failHafalan,
           percentageHafalan: tot > 0 ? Math.round((passHafalan / tot) * 100) : 0,
           achievedUmmi: passUmmi,
           unachievedUmmi: failUmmi,
           percentageUmmi: tot > 0 ? Math.round((passUmmi / tot) * 100) : 0
        };
    }).sort((a, b) => {
       const gradeA = a.name.match(/([1-9])/) ? parseInt(a.name.match(/([1-9])/)[1]) : 99;
       const gradeB = b.name.match(/([1-9])/) ? parseInt(b.name.match(/([1-9])/)[1]) : 99;
       if (gradeA !== gradeB) return gradeA - gradeB;
       return a.name.localeCompare(b.name);
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

    return { 
      studentsProgress: studentsList, 
      jilidStats: jilidStatsArr, 
      hafalanStats: hafalanStatsArr, 
      halaqohAchievement, 
      grandTotal 
    };
  }, [globalData, selectedSemester]);

  const uniqueGurus = useMemo(() => {
    const set = new Set<string>();
    studentsProgress.forEach(s => { if (s.guru) set.add(s.guru); });
    return Array.from(set).sort();
  }, [studentsProgress]);

  const uniqueHalaqohs = useMemo(() => {
    const set = new Set<string>();
    studentsProgress.forEach(s => { if (s.halaqoh) set.add(s.halaqoh); });
    return Array.from(set).sort();
  }, [studentsProgress]);

  const filteredStudents = useMemo(() => {
    return studentsProgress.filter(s => {
      if (selectedGuru !== 'all' && s.guru !== selectedGuru) return false;
      if (selectedHalaqoh !== 'all' && s.halaqoh !== selectedHalaqoh) return false;
      if (statusFilter === 'achieved' && !s.hafalanAchieved) return false;
      if (statusFilter === 'unachieved' && s.hafalanAchieved) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const mName = (s.name || '').toLowerCase().includes(q);
        const mHalaqoh = (s.halaqoh || '').toLowerCase().includes(q);
        const mGuru = (s.guru || '').toLowerCase().includes(q);
        const mHafalan = (s.hafalan || '').toLowerCase().includes(q);
        const mTarget = (s.targetHafalan || '').toLowerCase().includes(q);
        if (!mName && !mHalaqoh && !mGuru && !mHafalan && !mTarget) return false;
      }
      return true;
    });
  }, [studentsProgress, selectedGuru, selectedHalaqoh, statusFilter, searchQuery]);

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
        const smtName = selectedSemester === 1 ? 'SEMESTER 1 (GANJIL)' : 'SEMESTER 2 (GENAP)';
        
        // HEADER
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("LAPORAN PROGRESS BACAAN & HAFALAN", pdf.internal.pageSize.getWidth() / 2, startY, { align: 'center' });
        
        startY += 7;
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(79, 70, 229);
        pdf.text(`EVALUASI TARGET: ${smtName}`, pdf.internal.pageSize.getWidth() / 2, startY, { align: 'center' });
        
        startY += 6;
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(100, 116, 139);
        pdf.text(`Total Siswa Terdata: ${studentsProgress.length} Siswa | Tercapai: ${grandTotal.achievedHafalan} (${grandTotal.percentageHafalan}%) | Belum: ${grandTotal.unachievedHafalan}`, pdf.internal.pageSize.getWidth() / 2, startY, { align: 'center' });
        
        startY += 12;
        pdf.setTextColor(0, 0, 0);
        
        // 1. Data Rinci Seluruh Siswa
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text(`1. Data Rinci Capaian Siswa (${smtName})`, 14, startY);
        startY += 5;
        
        const studentsBody = studentsProgress.map((s, idx) => [
           (idx + 1).toString(),
           s.name, 
           s.halaqoh || '-',
           s.guru, 
           s.targetHafalan || '-',
           s.hafalan || '-',
           s.hafalanPercentage.toString() + '%',
           s.hafalanStatus,
           s.level,
           s.ummiStatus
        ]);
        
        autoTable(pdf, {
           startY: startY,
           head: [['No', 'Nama Siswa', 'Kelas / Halaqoh', 'Guru', `Target Hafalan (Smt ${selectedSemester})`, 'Hafalan Terakhir', '% Hafalan', 'Status Target', 'Progress Ummi', 'Status Ummi']],
           body: studentsBody,
           theme: 'striped',
           headStyles: { fillColor: [79, 70, 229] },
           styles: { fontSize: 7, cellPadding: 2 },
           columnStyles: {
             0: { cellWidth: 8, halign: 'center' },
             1: { fontStyle: 'bold' },
             6: { halign: 'center' },
             7: { halign: 'center', fontStyle: 'bold' }
           },
           margin: { left: 10, right: 10 }
        });
        
        startY = (pdf as any).lastAutoTable.finalY + 12;
        
        // 2. Persentase Pencapaian Target Per Kelas / Halaqoh
        if (halaqohAchievement.length > 0) {
           pdf.setFontSize(11);
           pdf.setFont("helvetica", "bold");
           pdf.text(`2. Rekap Target Per Kelas / Halaqoh (${smtName})`, 14, startY);
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
              head: [['Kelas / Halaqoh', 'Total', 'Hafalan Tercapai', 'Belum', '% Hafalan', 'Ummi Tercapai', 'Belum', '% Ummi']],
              body: halaqohBody,
              theme: 'grid',
              headStyles: { fillColor: [5, 150, 105] },
              styles: { fontSize: 8, cellPadding: 2.5, halign: 'center' },
              columnStyles: {
                 0: { halign: 'left', fontStyle: 'bold' }
              },
              margin: { left: 10, right: 10 }
           });
           
           startY = (pdf as any).lastAutoTable.finalY + 12;
        }

        // 3. Tabel Target Resmi Kurikulum
        if (startY > 230) {
           pdf.addPage();
           startY = 20;
        }

        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text("3. Standar Target & Kurikulum Hafalan Tahunan Resmi", 14, startY);
        startY += 5;

        const kurikulumBody = KURIKULUM_TAHUNAN.map(k => [
           k.gradeLabel,
           k.smtGanjil.hafalanLabel,
           k.smtGanjil.ummiLabel,
           k.smtGenap.hafalanLabel,
           k.smtGenap.ummiLabel
        ]);

        autoTable(pdf, {
           startY: startY,
           head: [['Kelas', 'Smt Ganjil: Hafalan', 'Smt Ganjil: Ummi', 'Smt Genap: Hafalan', 'Smt Genap: Ummi']],
           body: kurikulumBody,
           theme: 'grid',
           headStyles: { fillColor: [71, 85, 105] },
           styles: { fontSize: 7.5, cellPadding: 2 },
           columnStyles: {
              0: { fontStyle: 'bold' }
           },
           margin: { left: 10, right: 10 }
        });

        pdf.save(`Laporan_Progress_Hafalan_Smt${selectedSemester}_${new Date().toISOString().split('T')[0]}.pdf`);
      } catch (err: any) {
        console.error('PDF error', err);
        alert(`Gagal membuat PDF: ${err.message}`);
      } finally {
        setIsGenerating(false);
      }
    }, 200);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
       {/* Top Header Toolbar */}
       <div className="p-6 bg-stone-50 border-b border-stone-200 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                <Sparkles size={20} />
             </div>
             <div>
                <h2 className="text-xl font-bold text-stone-900 leading-tight">Laporan Progress & Evaluasi Target</h2>
                <p className="text-xs text-stone-500">Kalkulasi real-time capaian hafalan santri terhadap kurikulum resmi</p>
             </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
             {/* Semester Switcher */}
             <div className="flex items-center bg-white p-1 rounded-2xl border border-stone-300 shadow-xs">
                <button
                   onClick={() => setSelectedSemester(1)}
                   className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                      selectedSemester === 1 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                   }`}
                >
                   <Calendar size={13} />
                   <span>Semester 1 (Ganjil)</span>
                </button>
                <button
                   onClick={() => setSelectedSemester(2)}
                   className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                      selectedSemester === 2 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                   }`}
                >
                   <Calendar size={13} />
                   <span>Semester 2 (Genap)</span>
                </button>
             </div>

             {/* Panduan Target Button */}
             <button
                onClick={() => setShowCurriculumModal(true)}
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs"
             >
                <BookOpen size={14} /> Lihat Target Resmi
             </button>

             {/* Download PDF */}
             <button
                onClick={generatePDF}
                disabled={isGenerating}
                className="flex items-center gap-1.5 bg-stone-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs disabled:opacity-50"
             >
                <Download size={14} /> {isGenerating ? 'Memproses PDF...' : 'Download PDF'}
             </button>
          </div>
       </div>

       <div id="admin-progress-report-content" className="p-6 md:p-8 space-y-8 bg-white">
          {/* Header Banner */}
          <div className="text-center pb-2 border-b border-stone-100">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-3">
                <Calendar size={13} /> Target Aktif: Semester {selectedSemester} ({selectedSemester === 1 ? 'Ganjil' : 'Genap'})
             </div>
             <h1 className="text-2xl md:text-3xl font-black text-stone-900 leading-tight">
                LAPORAN PROGRESS BACAAN & HAFALAN
             </h1>
             <p className="text-stone-500 text-xs md:text-sm mt-1">
                Total Siswa Terdata: <strong className="text-stone-800">{studentsProgress.length} Siswa</strong> dari seluruh halaqoh guru yang telah sinkron
             </p>
          </div>

          {/* Quick KPI Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                   <span className="text-xs font-bold uppercase tracking-wider">Total Siswa</span>
                   <Users className="w-5 h-5 text-stone-400" />
                </div>
                <div>
                   <div className="text-2xl font-black text-stone-900">{grandTotal.totalStudents}</div>
                   <div className="text-[11px] text-stone-500 mt-0.5">Semua halaqoh terdata</div>
                </div>
             </div>

             <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-emerald-700 mb-2">
                   <span className="text-xs font-bold uppercase tracking-wider">Target Hafalan</span>
                   <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                   <div className="text-2xl font-black text-emerald-800">{grandTotal.achievedHafalan} Siswa</div>
                   <div className="text-[11px] font-bold text-emerald-600 mt-0.5">{grandTotal.percentageHafalan}% Sudah Tercapai (Smt {selectedSemester})</div>
                </div>
             </div>

             <div className="bg-rose-50/70 rounded-2xl p-4 border border-rose-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-rose-700 mb-2">
                   <span className="text-xs font-bold uppercase tracking-wider">Belum Capai Target</span>
                   <XCircle className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                   <div className="text-2xl font-black text-rose-800">{grandTotal.unachievedHafalan} Siswa</div>
                   <div className="text-[11px] font-bold text-rose-600 mt-0.5">{100 - grandTotal.percentageHafalan}% Perlu Bimbingan</div>
                </div>
             </div>

             <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-blue-700 mb-2">
                   <span className="text-xs font-bold uppercase tracking-wider">Target Ummi / Quran</span>
                   <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                   <div className="text-2xl font-black text-blue-800">{grandTotal.achievedUmmi} Siswa</div>
                   <div className="text-[11px] font-bold text-blue-600 mt-0.5">{grandTotal.percentageUmmi}% Sudah Tercapai</div>
                </div>
             </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200">
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

            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200">
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

          {/* Data Table Section */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
             <div className="p-4 border-b border-stone-200 bg-stone-50/70 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                   <h3 className="font-bold text-stone-800 text-base flex items-center gap-2">
                     <Users className="w-5 h-5 text-indigo-600" /> Data Rinci Capaian Target Siswa
                   </h3>
                   <p className="text-xs text-stone-500 mt-0.5">
                     Menampilkan {filteredStudents.length} dari {studentsProgress.length} siswa dievaluasi terhadap <strong>Target Semester {selectedSemester}</strong>
                   </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 bg-stone-200/60 p-1 rounded-xl text-xs font-bold">
                   <button
                     onClick={() => setStatusFilter('all')}
                     className={`px-3 py-1.5 rounded-lg transition-all ${statusFilter === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'}`}
                   >
                     Semua ({studentsProgress.length})
                   </button>
                   <button
                     onClick={() => setStatusFilter('achieved')}
                     className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${statusFilter === 'achieved' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700 hover:bg-emerald-50'}`}
                   >
                     <CheckCircle2 className="w-3.5 h-3.5" /> Tercapai ({grandTotal.achievedHafalan})
                   </button>
                   <button
                     onClick={() => setStatusFilter('unachieved')}
                     className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${statusFilter === 'unachieved' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-700 hover:bg-rose-50'}`}
                   >
                     <XCircle className="w-3.5 h-3.5" /> Belum Tercapai ({grandTotal.unachievedHafalan})
                   </button>
                </div>
             </div>

             {/* Search and Dropdowns toolbar */}
             <div className="p-4 border-b border-stone-200 bg-white flex flex-col md:flex-row items-stretch md:items-center gap-3">
                <div className="relative flex-1">
                   <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                   <input
                     type="text"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder="Cari nama siswa, kelas/halaqoh, guru, atau hafalan..."
                     className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white placeholder-stone-400"
                   />
                </div>

                <div className="flex items-center gap-2">
                   <select
                     value={selectedGuru}
                     onChange={(e) => setSelectedGuru(e.target.value)}
                     className="bg-stone-50 border border-stone-200 text-stone-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                   >
                     <option value="all">Semua Guru ({uniqueGurus.length})</option>
                     {uniqueGurus.map((g) => (
                       <option key={g} value={g}>{g}</option>
                     ))}
                   </select>

                   <select
                     value={selectedHalaqoh}
                     onChange={(e) => setSelectedHalaqoh(e.target.value)}
                     className="bg-stone-50 border border-stone-200 text-stone-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                   >
                     <option value="all">Semua Kelas/Halaqoh ({uniqueHalaqohs.length})</option>
                     {uniqueHalaqohs.map((h) => (
                       <option key={h} value={h}>{h}</option>
                     ))}
                   </select>
                </div>
             </div>

             {/* Students Table */}
             <div id="student-table-container" className="overflow-x-auto max-h-[550px] custom-scrollbar">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-stone-100 text-stone-900 sticky top-0 shadow-xs z-10 font-bold border-b border-stone-200">
                    <tr>
                      <th className="px-3 py-3 text-center w-10">No</th>
                      <th className="px-4 py-3">Nama Siswa</th>
                      <th className="px-4 py-3">Kelas / Halaqoh</th>
                      <th className="px-4 py-3">Guru</th>
                      <th className="px-4 py-3 bg-indigo-50/50 text-indigo-900">Target Hafalan (Smt {selectedSemester})</th>
                      <th className="px-4 py-3">Hafalan Terakhir</th>
                      <th className="px-4 py-3 text-center">% Capaian</th>
                      <th className="px-4 py-3 text-center">Status Target</th>
                      <th className="px-4 py-3">Progress Ummi</th>
                      <th className="px-4 py-3">Target Ummi</th>
                      <th className="px-4 py-3 text-center">Status Ummi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 bg-white">
                     {filteredStudents.map((s, i) => (
                       <tr key={i} className="hover:bg-stone-50 transition-colors">
                         <td className="px-3 py-2.5 text-center text-stone-400 font-mono">{i + 1}</td>
                         <td className="px-4 py-2.5 font-bold text-stone-900">{s.name}</td>
                         <td className="px-4 py-2.5 text-stone-600 font-medium">
                            <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                              {s.halaqoh}
                            </span>
                         </td>
                         <td className="px-4 py-2.5 text-stone-500">{s.guru}</td>
                         <td className="px-4 py-2.5 bg-indigo-50/30">
                            <span className="font-bold text-indigo-950">{s.targetHafalan || '-'}</span>
                         </td>
                         <td className="px-4 py-2.5">
                            <div className="font-semibold text-stone-900">{s.hafalan}</div>
                            {s.keteranganHafalan && (
                              <div className="text-[10px] text-stone-400 mt-0.5">{s.keteranganHafalan}</div>
                            )}
                         </td>
                         <td className="px-4 py-2.5 text-center font-bold text-stone-800">
                            <span className={s.hafalanPercentage === 100 ? 'text-emerald-600 font-black' : 'text-stone-700'}>
                              {s.hafalanPercentage}%
                            </span>
                         </td>
                         <td className="px-4 py-2.5 text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                               s.hafalanAchieved 
                                 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                 : s.hafalanStatus === 'Belum Mencapai Target' 
                                   ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                                   : 'bg-stone-100 text-stone-500'
                            }`}>
                               {s.hafalanAchieved ? <CheckCircle2 className="w-3 h-3" /> : s.hafalanStatus === 'Belum Mencapai Target' ? <XCircle className="w-3 h-3" /> : null}
                               {s.hafalanStatus}
                            </span>
                         </td>
                         <td className="px-4 py-2.5">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${s.level.includes("Al-Qur'an") ? 'bg-indigo-100 text-indigo-700' : s.level.includes('Jilid') ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                               {s.level}
                            </span>
                         </td>
                         <td className="px-4 py-2.5 text-stone-600 text-[11px]">
                            {s.targetUmmi}
                         </td>
                         <td className="px-4 py-2.5 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                               s.ummiAchieved 
                                 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                 : s.ummiStatus === 'Belum Mencapai Target' 
                                   ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                                   : 'bg-stone-100 text-stone-500'
                            }`}>
                               {s.ummiStatus}
                            </span>
                         </td>
                       </tr>
                     ))}
                     {filteredStudents.length === 0 && (
                       <tr>
                         <td colSpan={11} className="px-4 py-12 text-center text-stone-400">
                           <div className="flex flex-col items-center justify-center gap-1">
                             <Users className="w-8 h-8 text-stone-300" />
                             <span className="font-medium">Tidak ada data siswa yang cocok dengan filter pencarian.</span>
                           </div>
                         </td>
                       </tr>
                     )}
                  </tbody>
                </table>
             </div>
          </div>

          {/* Persentase Pencapaian Target Per Kelas / Halaqoh */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
             <div className="p-4 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-stone-800 text-sm">Persentase Pencapaian Target Per Kelas / Halaqoh</h3>
                  <p className="text-xs text-stone-500">Evaluasi berdasarkan data yang dikirim oleh guru untuk Semester {selectedSemester}</p>
                </div>
                <span className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-1 rounded-lg font-bold">
                  Smt {selectedSemester}
                </span>
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
                 <thead className="bg-stone-50 border-b border-stone-200">
                   <tr>
                     <th className="px-4 py-3 font-bold border-b text-stone-900" rowSpan={2}>Nama Kelas/Halaqoh</th>
                     <th className="px-4 py-3 font-bold border-b border-l text-stone-900 text-center" rowSpan={2}>Total Siswa</th>
                     <th className="px-4 py-2 font-bold border-b border-l text-stone-900 text-center bg-emerald-50/30" colSpan={3}>Target Hafalan (Smt {selectedSemester})</th>
                     <th className="px-4 py-2 font-bold border-b border-l text-stone-900 text-center bg-blue-50/30" colSpan={3}>Target Ummi/Tilawah (Smt {selectedSemester})</th>
                   </tr>
                   <tr>
                     <th className="px-4 py-2 font-bold border-b border-l text-emerald-700 text-center bg-emerald-50/50">Tercapai</th>
                     <th className="px-4 py-2 font-bold border-b text-rose-700 text-center bg-rose-50/50">Belum</th>
                     <th className="px-4 py-2 font-bold border-b text-stone-900 text-center bg-stone-50">%</th>
                     <th className="px-4 py-2 font-bold border-b border-l text-blue-700 text-center bg-blue-50/50">Tercapai</th>
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
                        
                        <td className="px-4 py-3 text-center text-blue-600 font-bold border-l border-stone-100 bg-blue-50/10">{item.achievedUmmi}</td>
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
                        <td colSpan={8} className="px-4 py-8 text-center text-stone-400">Belum ada data pencapaian halaqoh.</td>
                      </tr>
                    )}

                    {halaqohAchievement.length > 0 && (
                      <tr className="bg-stone-100/90 font-bold border-t-2 border-stone-200 text-stone-900">
                        <td className="px-4 py-3 text-right">Total Keseluruhan</td>
                        <td className="px-4 py-3 text-center border-l border-stone-200">{grandTotal.totalStudents}</td>
                        <td className="px-4 py-3 text-center text-emerald-700 border-l border-stone-200">{grandTotal.achievedHafalan}</td>
                        <td className="px-4 py-3 text-center text-rose-700 border-l border-stone-100">{grandTotal.unachievedHafalan}</td>
                        <td className="px-4 py-3 text-center text-stone-900 border-l border-stone-100">{grandTotal.percentageHafalan}%</td>
                        <td className="px-4 py-3 text-center text-blue-700 border-l border-stone-200">{grandTotal.achievedUmmi}</td>
                        <td className="px-4 py-3 text-center text-rose-700 border-l border-stone-100">{grandTotal.unachievedUmmi}</td>
                        <td className="px-4 py-3 text-center text-stone-900 border-l border-stone-100">{grandTotal.percentageUmmi}%</td>
                      </tr>
                    )}
                 </tbody>
               </table>
             </div>
          </div>

          {/* TABEL TARGET & KURIKULUM HAFALAN TAHUNAN RESMI (PERSIS SESUAI GAMBAR) */}
          <div id="target-kurikulum-section" className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
             <div className="p-4 bg-stone-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                   <h3 className="font-black text-base tracking-tight flex items-center gap-2">
                     <BookOpen className="w-5 h-5 text-amber-400" /> Target & Kurikulum Hafalan Tahunan
                   </h3>
                   <p className="text-xs text-stone-300">Standar resmi target hafalan Quran dan metode Ummi per semester</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold">
                   <span className="text-stone-300">Target yang sedang dihitung di atas:</span>
                   <span className="bg-indigo-500 text-white px-2.5 py-1 rounded-lg">
                     Semester {selectedSemester} ({selectedSemester === 1 ? 'Ganjil' : 'Genap'})
                   </span>
                </div>
             </div>

             <div className="overflow-x-auto text-xs text-stone-800">
               <table className="w-full text-left">
                 <thead className="bg-[#44403c] text-white">
                   <tr>
                     <th className="px-4 py-3 font-bold border-r border-stone-600 w-[14%]">Kelas</th>
                     <th className={`px-4 py-3 font-bold border-r border-stone-600 text-center ${selectedSemester === 1 ? 'bg-[#15803d]' : ''}`}>
                       Smt Ganjil: Hafalan {selectedSemester === 1 && '(Aktif)'}
                     </th>
                     <th className={`px-4 py-3 font-bold border-r border-stone-600 text-center ${selectedSemester === 1 ? 'bg-[#166534]' : ''}`}>
                       Smt Ganjil: Ummi
                     </th>
                     <th className={`px-4 py-3 font-bold border-r border-stone-600 text-center ${selectedSemester === 2 ? 'bg-[#15803d]' : ''}`}>
                       Smt Genap: Hafalan {selectedSemester === 2 && '(Aktif)'}
                     </th>
                     <th className={`px-4 py-3 font-bold text-center ${selectedSemester === 2 ? 'bg-[#166534]' : ''}`}>
                       Smt Genap: Ummi
                     </th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-stone-200 bg-white">
                    {KURIKULUM_TAHUNAN.map((item, i) => (
                      <React.Fragment key={i}>
                        <tr className="hover:bg-stone-50 transition-colors">
                          <td className="px-4 py-3 font-black text-stone-900 border-r border-stone-200 bg-stone-50/50">
                            {item.gradeLabel}
                          </td>
                          <td className={`px-4 py-3 font-semibold text-center border-r border-stone-200 ${selectedSemester === 1 ? 'bg-emerald-50 text-emerald-950 font-bold' : 'text-stone-800'}`}>
                            {item.smtGanjil.hafalanLabel}
                          </td>
                          <td className={`px-4 py-3 text-center border-r border-stone-200 ${selectedSemester === 1 ? 'bg-emerald-50/50 text-emerald-900 font-semibold' : 'text-stone-700'}`}>
                            {item.smtGanjil.ummiLabel}
                          </td>
                          <td className={`px-4 py-3 font-semibold text-center border-r border-stone-200 ${selectedSemester === 2 ? 'bg-emerald-50 text-emerald-950 font-bold' : 'text-stone-800'}`}>
                            {item.smtGenap.hafalanLabel}
                          </td>
                          <td className={`px-4 py-3 text-center ${selectedSemester === 2 ? 'bg-emerald-50/50 text-emerald-900 font-semibold' : 'text-stone-700'}`}>
                            {item.smtGenap.ummiLabel}
                          </td>
                        </tr>
                        {item.notes && (
                          <tr className="bg-stone-50/80">
                            <td colSpan={5} className="px-4 py-2 text-center italic text-stone-600 text-xs border-y border-stone-200 font-medium">
                              {item.notes}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                 </tbody>
               </table>
             </div>
          </div>
       </div>

       {/* Modal Panduan Target Kurikulum */}
       {showCurriculumModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
             <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                         <BookOpen size={20} />
                      </div>
                      <div>
                         <h3 className="text-xl font-black text-stone-900">Target & Kurikulum Hafalan Tahunan</h3>
                         <p className="text-xs text-stone-500">Standar resmi penilaian pencapaian target hafalan dan Ummi</p>
                      </div>
                   </div>
                   <button 
                      onClick={() => setShowCurriculumModal(false)}
                      className="text-stone-400 hover:text-stone-700 p-2 rounded-xl hover:bg-stone-100 transition"
                   >
                      <XCircle size={24} />
                   </button>
                </div>

                <div className="overflow-x-auto text-xs text-stone-800 rounded-2xl border border-stone-200">
                  <table className="w-full text-left">
                    <thead className="bg-[#44403c] text-white">
                      <tr>
                        <th className="px-4 py-3 font-bold border-r border-stone-600">Kelas</th>
                        <th className="px-4 py-3 font-bold border-r border-stone-600 text-center">Smt Ganjil: Hafalan</th>
                        <th className="px-4 py-3 font-bold border-r border-stone-600 text-center">Smt Ganjil: Ummi</th>
                        <th className="px-4 py-3 font-bold border-r border-stone-600 text-center">Smt Genap: Hafalan</th>
                        <th className="px-4 py-3 font-bold text-center">Smt Genap: Ummi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 bg-white">
                       {KURIKULUM_TAHUNAN.map((item, i) => (
                         <React.Fragment key={i}>
                           <tr className="hover:bg-stone-50 transition-colors">
                             <td className="px-4 py-3 font-black text-stone-900 border-r border-stone-200 bg-stone-50/50">
                               {item.gradeLabel}
                             </td>
                             <td className="px-4 py-3 font-semibold text-center border-r border-stone-200">
                               {item.smtGanjil.hafalanLabel}
                             </td>
                             <td className="px-4 py-3 text-center border-r border-stone-200 text-stone-600">
                               {item.smtGanjil.ummiLabel}
                             </td>
                             <td className="px-4 py-3 font-semibold text-center border-r border-stone-200">
                               {item.smtGenap.hafalanLabel}
                             </td>
                             <td className="px-4 py-3 text-center text-stone-600">
                               {item.smtGenap.ummiLabel}
                             </td>
                           </tr>
                           {item.notes && (
                             <tr className="bg-stone-50/80">
                               <td colSpan={5} className="px-4 py-2 text-center italic text-stone-600 text-xs border-y border-stone-200 font-medium">
                                 {item.notes}
                               </td>
                             </tr>
                           )}
                         </React.Fragment>
                       ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
                   <div className="font-bold flex items-center gap-1.5">
                      <Info size={14} /> Kriteria Kelulusan Target Hafalan:
                   </div>
                   <ul className="list-disc list-inside space-y-0.5 text-amber-800 pl-1">
                      <li>Siswa yang sudah mencapai atau melampaui surah dan batas ayat yang ditentukan (contoh: <em>Al-Haqqah : 8</em>, <em>Al-Jinn : 28</em>, <em>Al-Mursalat : 19</em>, atau <em>Al-Munafiqun : 4</em>) otomatis ditandai <strong>✅ Tercapai (100%)</strong>.</li>
                      <li>Siswa di tingkat Muroja'ah (Kelas 6, 7 Ganjil, 9) yang aktif menyetorkan muroja'ah ditandai <strong>✅ Tercapai</strong>.</li>
                      <li>Siswa yang lulus ujian hafalan dengan predikat Mutqin ditandai <strong>✅ Tercapai</strong>.</li>
                   </ul>
                </div>

                <div className="flex justify-end">
                   <button
                      onClick={() => setShowCurriculumModal(false)}
                      className="px-5 py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl transition"
                   >
                      Tutup Panduan
                   </button>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};
