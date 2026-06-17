import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Printer, Search, Download, Eye, GraduationCap, ChevronLeft, Settings, Edit2, X, Save, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as htmlToImage from 'html-to-image';
import { cn } from '../lib/utils';
import { storage } from '../services/storage';
import ConfirmModal from './ConfirmModal';

export default function ReportCard() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [semester, setSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');
  const [examData, setExamData] = useState<any>(null);
  const [institution, setInstitution] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [recapSettings, setRecapSettings] = useState<any>(null);
  const [showListOnMobile, setShowListOnMobile] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [principalSigSize, setPrincipalSigSize] = useState(80);
  const [coordinatorSigSize, setCoordinatorSigSize] = useState(80);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<{ type: 'ummi' | 'hafalan', id: string } | null>(null);
  const [editingExam, setEditingExam] = useState<{ type: 'ummi' | 'hafalan', data: any } | null>(null);
  const [themeColor, setThemeColor] = useState('emerald');

  useEffect(() => {
    const inst = storage.getInstitution();
    setThemeColor(inst.theme_color || 'emerald');
    if (inst.principal_signature_size) setPrincipalSigSize(inst.principal_signature_size);
    if (inst.coordinator_signature_size) setCoordinatorSigSize(inst.coordinator_signature_size);
  }, []);

  const handlePrincipalSigSizeChange = (newSize: number) => {
    setPrincipalSigSize(newSize);
    storage.updateInstitution({ principal_signature_size: newSize });
  };

  const handleCoordinatorSigSizeChange = (newSize: number) => {
    setCoordinatorSigSize(newSize);
    storage.updateInstitution({ coordinator_signature_size: newSize });
  };

  useEffect(() => {
    const fetchData = () => {
      const sData = storage.getStudents();
      setStudents(sData);
      setInstitution(storage.getInstitution());
    };
    fetchData();
  }, [selectedStudent]);

  const groupedStudents = useMemo(() => {
    const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
    const groups: Record<string, any[]> = {};
    
    filtered.forEach(s => {
      const groupName = s.halaqoh_name || 'Tanpa Halaqoh';
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(s);
    });
    
    // Ensure students within each group are sorted by order_index
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => a.order_index - b.order_index);
    });
    
    return Object.keys(groups)
      .sort((a, b) => {
        if (a === 'Tanpa Halaqoh') return 1;
        if (b === 'Tanpa Halaqoh') return -1;
        return a.localeCompare(b);
      })
      .reduce((acc, key) => {
        acc[key] = groups[key];
        return acc;
      }, {} as Record<string, any[]>);
  }, [students, search]);

  const fetchExamData = (student: any) => {
    const eData = storage.getStudentExams(student.id);
    const sData = storage.getRecapSettings(student.id, format(new Date(), 'yyyy-MM'));
    
    setExamData(eData);
    setRecapSettings(sData);
    setSelectedStudent(student);
    setShowListOnMobile(false);
  };

  const currentHalaqohStudents = useMemo(() => {
    if (!selectedStudent) return [];
    const groupName = selectedStudent.halaqoh_name || 'Tanpa Halaqoh';
    return groupedStudents[groupName] || [];
  }, [selectedStudent, groupedStudents]);

  const handlePrevStudent = () => {
    if (!selectedStudent || currentHalaqohStudents.length === 0) return;
    const currentIndex = currentHalaqohStudents.findIndex(s => s.id === selectedStudent.id);
    if (currentIndex > 0) {
      fetchExamData(currentHalaqohStudents[currentIndex - 1]);
    }
  };

  const handleNextStudent = () => {
    if (!selectedStudent || currentHalaqohStudents.length === 0) return;
    const currentIndex = currentHalaqohStudents.findIndex(s => s.id === selectedStudent.id);
    if (currentIndex > -1 && currentIndex < currentHalaqohStudents.length - 1) {
      fetchExamData(currentHalaqohStudents[currentIndex + 1]);
    }
  };

  const resetExam = (type: 'ummi' | 'hafalan', id: string) => {
    setExamToDelete({ type, id });
    setIsDeleteModalOpen(true);
  };

  const confirmResetExam = () => {
    if (examToDelete) {
      storage.deleteExam(examToDelete.type, examToDelete.id);
      alert('Data ujian berhasil dihapus.');
      if (selectedStudent) fetchExamData(selectedStudent);
      setExamToDelete(null);
    }
  };

  const handleUpdateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExam) return;

    if (editingExam.type === 'ummi') {
      storage.updateUmmiExam(editingExam.data.id, editingExam.data);
    } else {
      storage.updateHafalanExam(editingExam.data.id, editingExam.data);
    }

    alert('Data ujian berhasil diperbarui.');
    setEditingExam(null);
    if (selectedStudent) fetchExamData(selectedStudent);
  };

  const [reportNote, setReportNote] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [tempNote, setTempNote] = useState('');

  const generateAutoNote = () => {
    if (!examData) return '';
    const hafalanExams = examData.hafalan.filter((e: any) => e.semester === semester);
    const ummiExams = examData.ummi.filter((e: any) => e.semester === semester);
    
    let notes = [];
    let adviceList = [];
    
    if (hafalanExams.length > 0) {
      const lastHafalan = hafalanExams[0];
      const target = lastHafalan.target && lastHafalan.target.trim() !== '' ? lastHafalan.target : '';
      
      let latestSurahGrades: Record<string, string> = {};
      [...hafalanExams].reverse().forEach((exam: any) => {
        (exam.surahs || []).forEach((s: any) => {
           if (s.name) latestSurahGrades[s.name] = s.grade || s.predicate || '';
        });
      });
      
      let needImprovementSurahs: string[] = [];
      Object.entries(latestSurahGrades).forEach(([name, grade]) => {
         if (grade.startsWith('C') || grade === 'D') {
            needImprovementSurahs.push(name);
         }
      });
      
      const allSurahsPass = needImprovementSurahs.length === 0;
      
      const gradeComment = allSurahsPass 
        ? "dengan capaian kelancaran yang membanggakan (mumtaaz/jayyid jiddan)"
        : "dengan beberapa catatan tajwid/kelancaran yang perlu diperbaiki";
        
      if (target) {
        notes.push(`Alhamdulillah, ananda telah menyelesaikan ujian hafalan dengan pencapaian yang tertulis di atas, yang mana target hafalan pada semester ini adalah menuntaskan hafalan sampai ${target}.`);
      } else {
        notes.push(`Alhamdulillah, ananda telah menyelesaikan ujian hafalan pada semester ini ${gradeComment}.`);
      }
      
      if (!allSurahsPass) {
         adviceList.push(`Perbanyak murajaah kembali untuk hafalan surah: ${needImprovementSurahs.join(', ')}.`);
      }
    }
    
    if (ummiExams.length > 0) {
      let highestUmmiExam = ummiExams[0];
      
      ummiExams.forEach((exam: any) => {
         if (Number(exam.level) > Number(highestUmmiExam.level)) {
             highestUmmiExam = exam;
         }
      });
      
      const lastUmmi = highestUmmiExam;
      let target = lastUmmi.target;
      if (!target) {
         // Fallback if highest exam doesn't have target, find any from same level
         const sameLevel = ummiExams.find(e => Number(e.level) === Number(lastUmmi.level) && e.target);
         if (sameLevel) target = sameLevel.target;
      }
      
      const isTilawah = Number(lastUmmi.level) === 7;
      const levelStr = isTilawah ? 'Al-Qur\'an (Tilawah)' : `jilid ${lastUmmi.level}`;
      
      let targetStr = '';
      let targetNum = 99;
      if (target && String(target).trim() !== '') {
        const tStr = String(target).trim();
        const tStrLower = tStr.toLowerCase();
        
        if (isTilawah) {
          targetStr = tStr; // For Tilawah, target is treated as the surah/ayat tested.
          targetNum = 7;
        } else if (tStrLower === '7' || tStrLower.includes('tilawah')) {
          targetStr = "Al-Qur'an (Tilawah)";
          targetNum = 7;
        } else if (!tStrLower.includes('jilid')) {
          targetStr = `jilid ${tStr}`;
          targetNum = parseInt(tStrLower.replace(/\D/g, '')) || 99;
        } else {
          targetStr = tStr;
          targetNum = parseInt(tStrLower.replace(/\D/g, '')) || 99;
        }
      }
      
      let latestUmmiScores: Record<string, string> = {};
      [...ummiExams].reverse().forEach((exam: any) => {
         Object.entries(exam.scores || {}).forEach(([indicator, s]) => {
            latestUmmiScores[indicator] = String(s);
         });
      });
      
      let improvementAreas: string[] = [];
      Object.entries(latestUmmiScores).forEach(([indicator, scoreStr]) => {
         if (scoreStr.startsWith('C') || scoreStr === 'D') {
            improvementAreas.push(indicator);
         }
      });
      
      const hasC = improvementAreas.length > 0;
      
      const readingComment = hasC 
            ? "meski masih ada catatan yang perlu disempurnakan" 
            : "dengan pencapaian fashohah dan bacaan yang memuaskan";
            
      const hasReachedTarget = targetStr ? (Number(lastUmmi.level) >= targetNum || (levelStr.includes('Tilawah') && targetStr.includes('Tilawah'))) : false;
      
      if (isTilawah && targetStr) {
        // Special phrase for Tilawah where target is interpreted as the Surah/Ayat.
        notes.push(`Untuk penguasaan bacaan Al-Qur'an (Tilawah), Ananda telah diujikan pada surat/ayat ${targetStr} ${readingComment}.`);
      } else if (isTilawah) {
        notes.push(`Untuk penguasaan bacaan Al-Qur'an (Tilawah), Ananda telah menyelesaikan ujian ${readingComment}.`);
      } else if (targetStr && hasReachedTarget) {
        notes.push(`Untuk penguasaan bacaan Ummi, Ananda telah berhasil mencapai target ${targetStr} dan menyelesaikan tahapan bacaan ${levelStr} ${readingComment}.`);
      } else if (targetStr) {
        notes.push(`Untuk penguasaan bacaan Ummi, Ananda baru menyelesaikan tahapan bacaan ${levelStr} dari target ${targetStr} yang ditetapkan, ${readingComment}.`);
      } else {
        notes.push(`Untuk penguasaan bacaan Ummi, Ananda telah mencapai tahapan bacaan ${levelStr} ${readingComment}.`);
      }
      
      if (improvementAreas.length > 0) {
        adviceList.push(`Untuk bacaan Ummi, perlu ada pendampingan/latihan lebih rajin pada poin: ${improvementAreas.join(', ')}.`);
      }
    }
    
    const motivasiList = [
      "Tetap tawadhu', jangan mudah puas, dan teruslah perbaiki bacaan serta hafalanmu. Semoga kelak memakaikan mahkota kemuliaan bagi ayah dan ibu didalam syurga.",
      "Barakallah fii ilmik. Teruslah bersemangat dalam menggali ilmu-ilmu Allah. Jadilah permata hati keluarga yang membanggakan.",
      "Anak sholih/sholihah, jadikan Al-Qur'an sebagai sahabatmu di masa depan. Perbanyak doa dan selalu semangat untuk murajaah hafalannya di rumah.",
      "Semoga Allah memberkahi, jagalah terus shalat lima waktu, berbakti kepada orang tua, dan perbanyak murajaah agar hafalan semakin mutqin."
    ];
    
    const randomMotivasi = motivasiList[Math.floor(Math.random() * motivasiList.length)];
    
    let manualNotes: string[] = [];
    hafalanExams.forEach((e: any) => {
       if (e.note && e.note.trim() !== '') {
          manualNotes.push(e.note.trim());
       }
    });

    const evaluationHeader = "\n\n📌 Catatan Evaluasi (Mohon menjadi perhatian khusus bagi Orang Tua agar kedepannya Ananda bisa lebih baik lagi):\n- ";

    if (manualNotes.length > 0) {
       // If manual notes exist, do NOT use auto-generated notes at all
       return manualNotes.join('. ');
    }

    if (notes.length === 0) {
      if (adviceList.length > 0) {
         return "Sebuah motivasi untuk ananda: " + randomMotivasi + evaluationHeader + adviceList.join('\n- ');
      }
      return "Sebuah motivasi untuk ananda: " + randomMotivasi;
    }
    
    let finalNote = notes.join(' ') + ' ' + randomMotivasi;
    
    if (adviceList.length > 0) {
      finalNote += evaluationHeader + adviceList.join('\n- ');
    }
    
    return finalNote;
  };

  useEffect(() => {
    if (selectedStudent && examData) {
      const savedNote = storage.getReportNote(selectedStudent.id, semester);
      if (savedNote) {
        setReportNote(savedNote);
      } else {
        setReportNote(generateAutoNote());
      }
    }
  }, [selectedStudent, examData, semester]);

  const handleSaveNote = () => {
    if (selectedStudent) {
      storage.saveReportNote(selectedStudent.id, semester, tempNote);
      setReportNote(tempNote);
      setIsEditingNote(false);
      alert('Catatan Rapor berhasil disimpan.');
    }
  };

  const handleResetNote = () => {
    const autoNote = generateAutoNote();
    setTempNote(autoNote);
  };

  const generateImage = async (imgFormat: 'jpg' | 'png') => {
    if (!selectedStudent || !examData || isGenerating) return;

    const element = document.getElementById('report-card-preview');
    if (!element) {
      alert('Elemen rapor tidak ditemukan.');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Ensure images and fonts are loaded
      const images = element.getElementsByTagName('img');
      const fontPromise = (document as any).fonts ? (document as any).fonts.ready : Promise.resolve();
      
      await Promise.all([
        fontPromise,
        ...Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      ]);

      // Small delay to ensure rendering is stable
      await new Promise(resolve => setTimeout(resolve, 500));

      // Set high pixel ratio (4) consistently to get ultra-high-resolution images for WhatsApp sharing and printing without blurriness
      const pixelRatio = 4;

      // High-end capture for Image
      const canvas = await htmlToImage.toCanvas(element, {
        width: element.scrollWidth,
        height: element.scrollHeight,
        pixelRatio: pixelRatio, 
        backgroundColor: '#ffffff',
        style: {
          transform: 'none',
          boxShadow: 'none',
          width: `${element.scrollWidth}px`,
          height: `${element.scrollHeight}px`
        }
      });
      
      const type = imgFormat === 'jpg' ? 'image/jpeg' : 'image/png';
      const safeName = (selectedStudent.name || 'Siswa').replace(/[^a-z0-9]/gi, '_');
      const fileName = `Rapor_${safeName}_Semester_${semester}.${imgFormat}`;

      canvas.toBlob(async (blob) => {
        try {
          if (!blob) throw new Error('Blob creation failed');

          // Median/GoNative bridge support
          const median = (window as any).median || (window as any).gonative;
          if (median) {
            const reader = new FileReader();
            reader.onloadend = () => {
              try {
                const base64data = reader.result as string;
                // Try share.download first as requested by user
                if (median.share && typeof median.share.download === 'function') {
                  median.share.download({ url: base64data, filename: fileName });
                } else if (median.download && typeof median.download.downloadFile === 'function') {
                  median.download.downloadFile({ url: base64data, filename: fileName });
                } else if (median.fileDownload && typeof median.fileDownload.download === 'function') {
                  median.fileDownload.download({ url: base64data, filename: fileName });
                } else {
                  // Fallback if Median exists but common download methods don't
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = fileName;
                  document.body.appendChild(link);
                  link.click();
                  setTimeout(() => {
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                  }, 100);
                }
              } finally {
                setIsGenerating(false);
              }
            };
            reader.onerror = () => {
              alert('Gagal membaca blob gambar.');
              setIsGenerating(false);
            };
            reader.readAsDataURL(blob);
          } else {
            // Standard Browser Download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            }, 100);
            
            setIsGenerating(false);
          }
        } catch (e: any) {
          console.error(e);
          alert('Gagal memproses gambar: ' + e.message);
          setIsGenerating(false);
        }
      }, type, 1.0);

    } catch (error: any) {
      console.error('Image Generation Error:', error);
      alert('Gagal mengunduh gambar: ' + (error.message || 'Terjadi kesalahan teknis'));
      setIsGenerating(false);
    }
  };

  const generatePDF = async () => {
    if (!selectedStudent || !examData || isGenerating) return;

    const element = document.getElementById('report-card-preview');
    if (!element) {
      alert('Elemen rapor tidak ditemukan.');
      return;
    }

    setIsGenerating(true);

    try {
      // Ensure images and fonts are loaded
      const images = element.getElementsByTagName('img');
      const fontPromise = (document as any).fonts ? (document as any).fonts.ready : Promise.resolve();

      await Promise.all([
        fontPromise,
        ...Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      ]);

      // Small delay to ensure rendering is stable
      await new Promise(resolve => setTimeout(resolve, 500));

      // Set high pixel ratio (4) consistently to get ultra-high-resolution images for WhatsApp sharing and printing without blurriness
      const pixelRatio = 4; 

      const dataUrl = await htmlToImage.toPng(element, {
        width: element.scrollWidth,
        height: element.scrollHeight,
        pixelRatio: pixelRatio, 
        backgroundColor: '#ffffff',
        style: {
          transform: 'none',
          boxShadow: 'none',
          width: `${element.scrollWidth}px`,
          height: `${element.scrollHeight}px`
        }
      });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: false // Disable compression to preserve the lossless ultra-high-resolution image perfectly
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Use full page dimensions since element is already A4 size (210x297mm)
      // Use 'NONE' compression to keep the high-resolution PNG image perfectly crisp and lossless
      const imgProps = pdf.getImageProperties(dataUrl);
      const imgRatio = imgProps.width / imgProps.height;
      const pdfRatio = pdfWidth / pdfHeight;
      
      let finalWidth = pdfWidth;
      let finalHeight = pdfHeight;
      
      if (imgRatio < pdfRatio) {
        // Image is proportionally taller than A4 page -> scale strictly by width so text doesn't shrink
        finalWidth = pdfWidth;
        finalHeight = pdfWidth / imgRatio;
      } else {
        // Image is proportionally wider than A4 page -> scale strictly by width
        finalWidth = pdfWidth;
        finalHeight = pdfWidth / imgRatio;
      }
      
      // Center image horizontally and align top
      const xOffset = (pdfWidth - finalWidth) / 2;
      const yOffset = 0;
      
      // If height is larger than 1 page, jsPDF addImage will draw off-page.
      // We can add a new page if it exceeds A4 height significantly.
      pdf.addImage(dataUrl, 'PNG', xOffset, yOffset, finalWidth, finalHeight, undefined, 'NONE');
      
      // If the content spilled over to a second page mathematically, add one and draw the rest
      let heightLeft = finalHeight - pdfHeight;
      let position = yOffset - pdfHeight;
      
      while (heightLeft >= 0) {
        pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', xOffset, position, finalWidth, finalHeight, undefined, 'NONE');
        heightLeft -= pdfHeight;
        position -= pdfHeight;
      }

      const safeName = (selectedStudent.name || 'Siswa').replace(/[^a-z0-9]/gi, '_');
      const fileName = `Rapor_${safeName}_Semester_${semester}.pdf`;
      
      // Median/GoNative bridge support
      const median = (window as any).median || (window as any).gonative;
      if (median) {
        const base64PDF = pdf.output('datauristring');
        
        // Try share.download first as requested by user
        if (median.share && typeof median.share.download === 'function') {
          median.share.download({ url: base64PDF, filename: fileName });
        } else if (median.download && typeof median.download.downloadFile === 'function') {
          median.download.downloadFile({ url: base64PDF, filename: fileName });
        } else if (median.fileDownload && typeof median.fileDownload.download === 'function') {
          median.fileDownload.download({ url: base64PDF, filename: fileName });
        } else {
          // Fallback to standard PDF save if median exists but bridge methods missing
          pdf.save(fileName);
        }
      } else {
        // Standard Browser Download
        pdf.save(fileName);
      }
      
      setIsGenerating(false);
    } catch (error: any) {
      console.error('PDF Generation Error:', error);
      alert('Gagal mengunduh rapor: ' + (error.message || 'Terjadi kesalahan teknis'));
      setIsGenerating(false);
    }
  };

  const renderUmmiTable = () => {
    const filteredUmmi = examData.ummi.filter((e: any) => e.semester === semester);
    let highestLevelExam = filteredUmmi[0];
    filteredUmmi.forEach((e: any) => {
        if (Number(e.level) > Number(highestLevelExam?.level || 0)) highestLevelExam = e;
    });
    
    let target = highestLevelExam?.target;
    if (!target) {
       const sameLevel = filteredUmmi.find(e => Number(e.level) === Number(highestLevelExam?.level) && e.target);
       if (sameLevel) target = sameLevel.target;
    }
    
    let targetUmmi = target || `Ummi jilid ${highestLevelExam?.level || '-'}`;
    if (Number(highestLevelExam?.level) === 7) {
       targetUmmi = target || "Al-Qur'an (Tilawah)";
    }
    
    return (
      <div className="mt-4 w-full">
        <div className="flex items-center justify-center mb-2">
          <p className="text-[10px] font-bold uppercase tracking-wide">TARGET TAJWID: {targetUmmi}</p>
        </div>
        <table className="w-full border-collapse border-2 border-black text-[10px]" style={{ borderColor: '#000000' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <th className="border border-black py-1 px-2 w-12 text-center align-middle font-bold" style={{ borderColor: '#000000' }}>Jilid</th>
              <th className="border border-black py-1 px-2 text-center align-middle font-bold" style={{ borderColor: '#000000' }}>Materi Tajwid</th>
              <th className="border border-black py-1 px-2 w-12 text-center align-middle font-bold" style={{ borderColor: '#000000' }}>Nilai</th>
            </tr>
          </thead>
          <tbody>
            {filteredUmmi.length > 0 ? filteredUmmi.map((exam: any) => {
              const scores = typeof exam.scores === 'string' ? JSON.parse(exam.scores) : exam.scores;
              return Object.entries(scores || {}).filter(([_, v]) => v).map(([k, v], i) => (
                <tr key={`${exam.id}-${i}`}>
                  <td className="border border-black py-0 px-2 text-center align-middle" style={{ borderColor: '#000000', color: '#000000' }}>{exam.level === 7 ? 'Tilawah' : exam.level}</td>
                  <td className="border border-black py-0 px-2 text-left pl-3 align-middle" style={{ borderColor: '#000000', color: '#000000' }}>{k}</td>
                  <td className="border border-black py-0 px-2 text-center font-bold align-middle" style={{ borderColor: '#000000', color: '#000000' }}>{v as string}</td>
                </tr>
              ));
            }) : (
              <tr><td colSpan={3} className="border border-black p-6 text-center italic" style={{ borderColor: '#000000', color: '#a8a29e' }}>Belum ada data semester ini</td></tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const renderHafalanTable = () => {
    const filteredHafalan = examData.hafalan.filter((e: any) => e.semester === semester);
    let target = filteredHafalan[0]?.target;
    filteredHafalan.forEach((e: any) => {
        if (!target && e.target) target = e.target;
    });
    const targetHafalan = target || 'Juz 30';
    
    let counter = 1;
    return (
      <div className="mt-4 w-full">
        <p className="text-[10px] font-bold mb-2 uppercase tracking-wide text-center">TARGET HAFALAN: {targetHafalan}</p>
        <table className="w-full border-collapse border-2 border-black text-[10px]" style={{ borderColor: '#000000' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <th className="border border-black py-1 px-2 w-10 text-center align-middle font-bold" style={{ borderColor: '#000000' }}>No</th>
              <th className="border border-black py-1 px-2 text-center align-middle font-bold" style={{ borderColor: '#000000' }}>Surat / Ayat</th>
              <th className="border border-black py-1 px-2 w-12 text-center align-middle font-bold" style={{ borderColor: '#000000' }}>Nilai</th>
              <th className="border border-black py-1 px-2 w-[95px] whitespace-nowrap text-center align-middle font-bold" style={{ borderColor: '#000000' }}>Predikat</th>
            </tr>
          </thead>
          <tbody>
            {filteredHafalan.length > 0 ? filteredHafalan.flatMap((exam: any) => {
              const surahs = typeof exam.surahs === 'string' ? JSON.parse(exam.surahs) : exam.surahs;
              return (surahs || []).map((s: any, i: number) => (
                <tr key={`${exam.id}-${i}`}>
                  <td className="border border-black py-0 px-2 text-center align-middle" style={{ borderColor: '#000000', color: '#000000' }}>{counter++}</td>
                  <td className="border border-black py-0 px-2 text-left pl-3 align-middle" dir="auto" style={{ borderColor: '#000000', color: '#000000', fontFamily: "'Amiri', serif", letterSpacing: '0', fontVariantLigatures: 'common-ligatures' }}>{s.name}</td>
                  <td className="border border-black py-0 px-2 text-center font-bold align-middle" style={{ borderColor: '#000000', color: '#000000' }}>{s.grade}</td>
                  <td className="border border-black py-0 px-2 text-center align-middle whitespace-nowrap" style={{ borderColor: '#000000', color: '#000000' }}>{s.predicate}</td>
                </tr>
              ));
            }) : (
              <tr><td colSpan={4} className="border border-black p-6 text-center italic" style={{ borderColor: '#000000', color: '#a8a29e' }}>Belum ada data semester ini</td></tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const theme = {
    text: themeColor === 'emerald' ? 'text-emerald-600' :
          themeColor === 'blue' ? 'text-blue-600' :
          themeColor === 'amber' ? 'text-amber-600' :
          themeColor === 'indigo' ? 'text-indigo-600' :
          themeColor === 'purple' ? 'text-purple-600' :
          themeColor === 'rose' ? 'text-rose-600' :
          'text-slate-600',
    bg: themeColor === 'emerald' ? 'bg-emerald-600' :
        themeColor === 'blue' ? 'bg-blue-600' :
        themeColor === 'amber' ? 'bg-amber-600' :
        themeColor === 'indigo' ? 'bg-indigo-600' :
        themeColor === 'purple' ? 'bg-purple-600' :
        themeColor === 'rose' ? 'bg-rose-600' :
        'bg-slate-600',
    lightBg: themeColor === 'emerald' ? 'bg-emerald-50' :
             themeColor === 'blue' ? 'bg-blue-50' :
             themeColor === 'amber' ? 'bg-amber-50' :
             themeColor === 'indigo' ? 'bg-indigo-50' :
             themeColor === 'purple' ? 'bg-purple-50' :
             themeColor === 'rose' ? 'bg-rose-50' :
             'bg-slate-50',
    lightText: themeColor === 'emerald' ? 'text-emerald-700' :
               themeColor === 'blue' ? 'text-blue-700' :
               themeColor === 'amber' ? 'text-amber-700' :
               themeColor === 'indigo' ? 'text-indigo-700' :
               themeColor === 'purple' ? 'text-purple-700' :
               themeColor === 'rose' ? 'text-rose-700' :
               'text-slate-700',
    border: themeColor === 'emerald' ? 'border-emerald-200' :
            themeColor === 'blue' ? 'border-blue-200' :
            themeColor === 'amber' ? 'border-amber-200' :
            themeColor === 'indigo' ? 'border-indigo-200' :
            themeColor === 'purple' ? 'border-purple-200' :
            themeColor === 'rose' ? 'border-rose-200' :
            'border-slate-200',
    ring: themeColor === 'emerald' ? 'focus:ring-emerald-500/50' :
          themeColor === 'blue' ? 'focus:ring-blue-500/50' :
          themeColor === 'amber' ? 'focus:ring-amber-500/50' :
          themeColor === 'indigo' ? 'focus:ring-indigo-500/50' :
          themeColor === 'purple' ? 'focus:ring-purple-500/50' :
          themeColor === 'rose' ? 'focus:ring-rose-500/50' :
          'focus:ring-slate-500/50',
    shadow: themeColor === 'emerald' ? 'shadow-emerald-500/10' :
            themeColor === 'blue' ? 'shadow-blue-500/10' :
            themeColor === 'amber' ? 'shadow-amber-500/10' :
            themeColor === 'indigo' ? 'shadow-indigo-500/10' :
            themeColor === 'purple' ? 'shadow-purple-500/10' :
            themeColor === 'rose' ? 'shadow-rose-500/10' :
            'shadow-slate-500/10',
    hoverBorder: themeColor === 'emerald' ? 'hover:border-emerald-200' :
                 themeColor === 'blue' ? 'hover:border-blue-200' :
                 themeColor === 'amber' ? 'hover:border-amber-200' :
                 themeColor === 'indigo' ? 'hover:border-indigo-200' :
                 themeColor === 'purple' ? 'hover:border-purple-200' :
                 themeColor === 'rose' ? 'hover:border-rose-200' :
                 'hover:border-slate-200',
    pillShadow: themeColor === 'emerald' ? 'shadow-emerald-100' :
                themeColor === 'blue' ? 'shadow-blue-100' :
                themeColor === 'amber' ? 'shadow-amber-100' :
                themeColor === 'indigo' ? 'shadow-indigo-100' :
                themeColor === 'purple' ? 'shadow-purple-100' :
                themeColor === 'rose' ? 'shadow-rose-100' :
                'shadow-slate-100',
    accent: themeColor === 'emerald' ? 'accent-emerald-600' :
            themeColor === 'blue' ? 'accent-blue-600' :
            themeColor === 'amber' ? 'accent-amber-600' :
            themeColor === 'indigo' ? 'accent-indigo-600' :
            themeColor === 'purple' ? 'accent-purple-600' :
            themeColor === 'rose' ? 'accent-rose-600' :
            'accent-slate-600',
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 font-sans">
      <div className={cn(
        "lg:col-span-4 bg-white p-8 rounded-[2.5rem] border border-stone-200/60 shadow-2xl shadow-stone-900/5 h-fit lg:sticky lg:top-8 z-10",
        !showListOnMobile && "hidden lg:block"
      )}>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-display font-black text-stone-950 tracking-tight mb-2 flex items-center gap-2">
              Daftar Siswa
            </h3>
            <p className="text-xs text-stone-500 font-medium tracking-wide">Pilih siswa untuk melihat pratinjau rapor.</p>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-stone-900 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Cari nama siswa..."
              className={cn("w-full bg-stone-50 border border-stone-200/60 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-4 transition-all font-bold text-stone-900", theme.ring)}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="space-y-8 max-h-[calc(100vh-400px)] overflow-y-auto custom-scrollbar pr-2 pt-2">
            {Object.entries(groupedStudents).map(([halaqohName, halaqohStudents]: [string, any[]]) => (
              <div key={halaqohName} className="space-y-4">
                <div className="flex items-center gap-4 px-2">
                  <h4 className="text-[10px] font-display font-black text-stone-400 uppercase tracking-[0.3em]">
                    {halaqohName}
                  </h4>
                  <div className="h-px bg-stone-100 flex-1" />
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  {halaqohStudents.map((s: any, idx) => (
                    <button
                      key={`${s.id}-${idx}`}
                      onClick={() => fetchExamData(s)}
                      className={cn(
                        "w-full text-left p-4 rounded-2xl transition-all border group relative overflow-hidden",
                        selectedStudent?.id === s.id 
                          ? `${theme.lightBg} ${theme.border} ${theme.lightText} font-bold shadow-sm` 
                          : "bg-white border-stone-100 hover:border-stone-300 hover:bg-stone-50 text-stone-600"
                      )}
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <p className="text-sm tracking-tight truncate group-hover:translate-x-1 transition-transform font-bold uppercase">{s.name}</p>
                        <ChevronLeft size={16} className={cn("rotate-180 opacity-0 group-hover:opacity-100 transition-all", theme.text)} />
                      </div>
                      {selectedStudent?.id === s.id && (
                        <motion.div 
                          layoutId="active-student-bg"
                          className={cn("absolute inset-0 opacity-10", theme.bg)}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {Object.keys(groupedStudents).length === 0 && (
              <div className="text-center py-12">
                <X size={32} className="mx-auto text-stone-200 mb-4" />
                <p className="text-sm font-display font-black text-stone-400 uppercase tracking-widest">Siswa tidak ditemukan</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={cn(
        "lg:col-span-8 space-y-8",
        showListOnMobile && "hidden lg:block"
      )}>
        {selectedStudent && examData ? (
          <div className="bg-white p-10 rounded-[3rem] border border-stone-200/50 shadow-2xl shadow-stone-900/5">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-12">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setShowListOnMobile(true)}
                  className="lg:hidden flex items-center justify-center w-12 h-12 bg-stone-100 hover:bg-stone-200 rounded-2xl text-stone-600 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                     <span className={cn("text-[10px] font-display font-black uppercase tracking-widest px-2 py-0.5 rounded-md shadow-sm", theme.bg, "text-white")}>REPORT CARD</span>
                     <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-md ml-2">
                        <button 
                          onClick={handlePrevStudent} 
                          disabled={!currentHalaqohStudents.length || currentHalaqohStudents.findIndex(s => s.id === selectedStudent.id) <= 0}
                          className="p-0.5 text-stone-500 hover:text-stone-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          title="Siswa Sebelumnya"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <span className="text-[10px] font-bold text-stone-500 px-1">
                          {currentHalaqohStudents.findIndex(s => s.id === selectedStudent.id) + 1} / {currentHalaqohStudents.length}
                        </span>
                        <button 
                          onClick={handleNextStudent}
                          disabled={!currentHalaqohStudents.length || currentHalaqohStudents.findIndex(s => s.id === selectedStudent.id) >= currentHalaqohStudents.length - 1}
                          className="p-0.5 text-stone-500 hover:text-stone-900 disabled:opacity-30 disabled:pointer-events-none transition-colors rotate-180"
                          title="Siswa Selanjutnya"
                        >
                          <ChevronLeft size={14} />
                        </button>
                     </div>
                  </div>
                  <h2 className="text-4xl font-display font-black text-stone-950 tracking-tight leading-none uppercase">{selectedStudent.name}</h2>
                  <p className="text-stone-500 font-medium">Laporan Pencapaian Tahfidz & Akademik</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex items-center bg-stone-100 p-1.5 rounded-[1.25rem] shadow-inner">
                  <button
                    onClick={() => setSemester('Ganjil')}
                    className={cn(
                      "px-6 py-2.5 rounded-xl text-xs font-display font-black uppercase tracking-widest transition-all",
                      semester === 'Ganjil' ? "bg-white text-stone-950 shadow-md scale-105" : "text-stone-400 hover:text-stone-600"
                    )}
                  >
                    GANJIL
                  </button>
                  <button
                    onClick={() => setSemester('Genap')}
                    className={cn(
                      "px-6 py-2.5 rounded-xl text-xs font-display font-black uppercase tracking-widest transition-all",
                      semester === 'Genap' ? "bg-white text-stone-950 shadow-md scale-105" : "text-stone-400 hover:text-stone-600"
                    )}
                  >
                    GENAP
                  </button>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={generatePDF}
                    disabled={isGenerating}
                    className={cn(
                      "text-white px-6 py-3.5 rounded-2xl font-display font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-2xl hover:translate-y-[-2px] active:translate-y-[1px] disabled:opacity-50",
                      theme.bg, theme.shadow
                    )}
                  >
                    <Download size={16} />
                    {isGenerating ? 'Wait...' : 'EXPOR PDF'}
                  </button>
                  <button 
                    onClick={() => generateImage('jpg')}
                    disabled={isGenerating}
                    className="bg-stone-950 text-white px-6 py-3.5 rounded-2xl font-display font-black text-[10px] uppercase tracking-[0.2em] hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-2xl hover:translate-y-[-2px] active:translate-y-[1px] disabled:opacity-50"
                  >
                    <FileText size={16} />
                    {isGenerating ? 'Wait...' : 'EXPOR JPG'}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-stone-50/50 p-8 rounded-[2rem] border border-stone-200/60 shadow-sm space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                       <FileText size={16} className="text-stone-900" />
                    </div>
                    <h4 className="text-[10px] font-display font-black text-stone-400 uppercase tracking-[0.25em]">METODE UMMI</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {examData.ummi.filter((e: any) => e.semester === semester).map((e: any, idx) => (
                      <div key={`${e.id}-${idx}`} className="flex items-center justify-between bg-white px-5 py-4 rounded-2xl border border-stone-200/60 group">
                        <div className="flex items-center gap-3">
                           <span className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-[10px] font-display font-black">{e.level}</span>
                           <span className="text-xs font-bold text-stone-600">{e.date}</span>
                        </div>
                        <div className="flex gap-2 transition-all">
                          <button onClick={() => setEditingExam({ type: 'ummi', data: { ...e } })} className="p-2 hover:bg-stone-50 rounded-lg text-emerald-600 transition-colors">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => resetExam('ummi', e.id)} className="p-2 hover:bg-stone-50 rounded-lg text-red-500 transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {examData.ummi.filter((e: any) => e.semester === semester).length === 0 && (
                       <p className="text-xs italic text-stone-400 text-center py-4 bg-white/50 rounded-2xl border border-dashed border-stone-200">Tidak ada data ujian</p>
                    )}
                  </div>
                </div>

                <div className="bg-stone-50/50 p-8 rounded-[2rem] border border-stone-200/60 shadow-sm space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                       <GraduationCap size={16} className="text-stone-900" />
                    </div>
                    <h4 className="text-[10px] font-display font-black text-stone-400 uppercase tracking-[0.25em]">HAFALAN AL-QUR'AN</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {examData.hafalan.filter((e: any) => e.semester === semester).map((e: any, idx) => (
                      <div key={`${e.id}-${idx}`} className="flex items-center justify-between bg-white px-5 py-4 rounded-2xl border border-stone-200/60 group">
                        <div className="flex items-center gap-3">
                           <span className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-[10px] font-display font-black">H</span>
                           <span className="text-xs font-bold text-stone-600">{e.date}</span>
                        </div>
                        <div className="flex gap-2 transition-all">
                          <button onClick={() => setEditingExam({ type: 'hafalan', data: { ...e } })} className="p-2 hover:bg-stone-50 rounded-lg text-emerald-600 transition-colors">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => resetExam('hafalan', e.id)} className="p-2 hover:bg-stone-50 rounded-lg text-red-500 transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {examData.hafalan.filter((e: any) => e.semester === semester).length === 0 && (
                       <p className="text-xs italic text-stone-400 text-center py-4 bg-white/50 rounded-2xl border border-dashed border-stone-200">Tidak ada data ujian</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Report Note Editor */}
              <div className="bg-stone-50 p-8 rounded-[2.5rem] border border-stone-200/60 shadow-sm space-y-6 no-print print:hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-xl shadow-sm", theme.lightBg)}>
                       <FileText size={16} className={theme.text} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-display font-black text-stone-500 uppercase tracking-[0.25em]">CATATAN RAPOR</h4>
                      <p className="text-xs font-semibold text-stone-400 mt-0.5">Dihasilkan otomatis, dapat diubah sesuai kebutuhan guru.</p>
                    </div>
                  </div>
                  {!isEditingNote ? (
                    <button 
                      onClick={() => { setTempNote(reportNote); setIsEditingNote(true); }}
                      className={cn("px-4 py-2 border rounded-xl text-xs font-bold transition-colors flex items-center gap-2", theme.text, theme.border, theme.hoverBorder, theme.lightBg)}
                    >
                      <Edit2 size={14} /> EDIT CATATAN
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                       <button 
                        onClick={handleResetNote}
                        className="px-4 py-2 border border-stone-200 text-stone-500 hover:bg-stone-100 rounded-xl text-xs font-bold transition-colors"
                      >
                        RESET OTOMATIS
                      </button>
                      <button 
                        onClick={() => setIsEditingNote(false)}
                        className="p-2 border border-stone-200 text-stone-500 hover:bg-stone-100 rounded-xl transition-colors"
                      >
                        <X size={16} />
                      </button>
                      <button 
                        onClick={handleSaveNote}
                        className={cn("px-4 py-2 text-white shadow-md rounded-xl text-xs font-bold transition-colors flex items-center gap-2", theme.bg)}
                      >
                        <Save size={14} /> SIMPAN CATATAN
                      </button>
                    </div>
                  )}
                </div>
                
                {isEditingNote ? (
                  <textarea 
                    value={tempNote}
                    onChange={(e) => setTempNote(e.target.value)}
                    className={cn("w-full p-4 rounded-xl border border-stone-200 text-sm leading-relaxed focus:outline-none focus:ring-2", theme.ring)}
                    rows={4}
                    placeholder="Tuliskan catatan dan motivasi dari guru di sini..."
                  />
                ) : (
                  <div className="p-4 bg-white border border-stone-100 rounded-xl shadow-inner min-h-[4rem]">
                    <p className="text-sm italic text-stone-700 leading-relaxed">{reportNote}</p>
                  </div>
                )}
              </div>

              {/* Tweak controls */}
              <div className="bg-stone-950 p-8 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center gap-8 no-print print:hidden">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                    <Settings size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-display font-black text-white tracking-tight">Render Tuning</h4>
                    <p className="text-[10px] text-white/50 font-medium tracking-wide">Adjust signature scale for preview.</p>
                  </div>
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-display font-black text-white/40 tracking-widest uppercase">
                      <span>KEPALA SEKOLAH</span>
                      <span className="text-white font-bold">{principalSigSize}PX</span>
                    </div>
                    <input 
                      type="range" 
                      min="40" 
                      max="300" 
                      value={principalSigSize} 
                      onChange={e => handlePrincipalSigSizeChange(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-display font-black text-white/40 tracking-widest uppercase">
                      <span>KOORDINATOR</span>
                      <span className="text-white font-bold">{coordinatorSigSize}PX</span>
                    </div>
                    <input 
                      type="range" 
                      min="40" 
                      max="300" 
                      value={coordinatorSigSize} 
                      onChange={e => handleCoordinatorSigSizeChange(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                  </div>
                </div>
              </div>

              {/* Report Card Preview (HTML) */}
              <div className="space-y-6">
                <div className="flex items-center gap-6 justify-center">
                   <div className="h-px bg-stone-200 flex-1" />
                   <h3 className="text-[10px] font-display font-black text-stone-400 uppercase tracking-[0.4em]">EXPORT PREVIEW</h3>
                   <div className="h-px bg-stone-200 flex-1" />
                </div>
                
                <div className="border border-stone-200/40 rounded-[3.5rem] overflow-x-auto shadow-2xl bg-white p-6 lg:p-16">
                  <style dangerouslySetInnerHTML={{ __html: `
                    @media print {
                      @page { size: A4 portrait; margin: 0; }
                      body { margin: 0; padding: 0; }
                      #report-card-preview { margin: 0 auto !important; box-shadow: none !important; border: none !important; width: 210mm !important; }
                    }
                  ` }} />
                  <div id="report-card-preview" className="mx-auto p-[15mm] pt-[20mm] pb-[15mm] relative bg-white flex flex-col items-center justify-start" style={{ width: '210mm', minHeight: '297mm', fontFamily: "'Outfit', 'Inter', sans-serif", color: '#000000', margin: '0 auto', boxSizing: 'border-box' }}>
                  {/* Watermark */}
                  {institution?.watermark && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0.1, backgroundColor: 'transparent', zIndex: 0 }}>
                      <img 
                        src={institution.watermark} 
                        alt="" 
                        crossOrigin="anonymous"
                        className="w-[120mm] h-[120mm] object-contain" 
                        style={{ backgroundColor: 'transparent' }} 
                      />
                    </div>
                  )}

                  {/* Header */}
                  <div className="w-full relative z-10 mb-4">
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: 'none' }} className="pt-2">
                      <tbody>
                        <tr>
                          <td style={{ width: '100px', verticalAlign: 'top', border: 'none', padding: 0 }}>
                            {institution?.logo && (
                              <img 
                                src={institution.logo} 
                                alt="Logo" 
                                crossOrigin="anonymous" 
                                style={{ width: '96px', height: '96px', objectFit: 'contain', backgroundColor: 'transparent', maxWidth: 'none' }}
                              />
                            )}
                          </td>
                          <td style={{ verticalAlign: 'middle', textAlign: 'center', border: 'none', padding: '0 16px' }}>
                            <p className="text-[28px] mb-1 text-center" dir="rtl" style={{ fontFamily: "'Amiri', serif", fontWeight: 400, letterSpacing: '0', fontVariantLigatures: 'common-ligatures', textRendering: 'optimizeLegibility' }}>
                              شهادة حفظ القرآن الكريم
                            </p>
                            <div style={{ margin: '0 auto', maxWidth: '160mm' }}>
                              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-none text-stone-950 pb-1">{institution?.name || 'SEKOLAH ISLAM MIFTAHUSSALAM'}</h1>
                              <p className="text-[10px] sm:text-[11px] leading-snug font-medium text-stone-600 italic">{institution?.address}</p>
                            </div>
                          </td>
                          <td style={{ width: '100px', border: 'none', padding: 0 }}></td>
                        </tr>
                      </tbody>
                    </table>
                    
                    {/* Thick Horizontal Line */}
                    <div className="w-full h-1 bg-black mt-4 mb-3" style={{ height: '3px' }}></div>
                    
                    <div className="w-full text-center">
                      <div className="text-[11px] sm:text-[13px] font-bold uppercase tracking-[0.1em] space-y-0.5 text-stone-950">
                        <p>UJIAN TAHFIDZUL QUR'AN SEMESTER {semester.toUpperCase()}</p>
                        <p>TAHUN AJARAN {institution?.academic_year || '2025/2026'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Student Info */}
                  <div className="w-full flex justify-between items-start text-[13px] mb-4 font-bold relative z-10">
                    <div className="space-y-1.5 pt-2">
                      <div className="flex">
                        <span className="w-28 text-stone-950">Nama Siswa</span>
                        <span>: <span className="uppercase">{selectedStudent.name}</span></span>
                      </div>
                      <div className="flex">
                        <span className="w-28 text-stone-950">Halaqoh / Kelas</span>
                        <span>: <span>{selectedStudent.halaqoh_name}</span></span>
                      </div>
                      <div className="flex">
                        <span className="w-28 text-stone-950">Guru Pengampu</span>
                        <span>: <span>{institution?.halaqoh_teacher_name || '-'}</span></span>
                      </div>
                    </div>
                    <div className="text-right pt-6">
                      <p className="font-black text-[18px] uppercase tracking-tighter text-stone-950">SEMESTER: {semester === 'Ganjil' ? '1 (GANJIL)' : '2 (GENAP)'}</p>
                    </div>
                  </div>

                  {/* Title Box */}
                  <div className="w-full border-2 border-black py-2 flex flex-shrink-0 items-center justify-center font-bold text-base sm:text-lg mb-4 uppercase tracking-[0.25em] relative z-10" style={{ borderColor: '#000000', backgroundColor: '#fafaf9', color: '#000000', minHeight: '2.5rem' }}>
                    LAPORAN PENCAPAIAN TAHFIDZ
                  </div>

                  {/* Tables Container */}
                  <div className="w-full grid grid-cols-[1.3fr_1fr] gap-6 mb-4 relative z-10 flex-shrink-0">
                    {renderHafalanTable()}
                    {renderUmmiTable()}
                  </div>

                  {/* Footer Box - Catatan Guru */}
                  <div className="w-full border-2 border-black flex-shrink-0 relative z-10" style={{ borderColor: '#000000', color: '#000000' }}>
                    <div className="border-b-2 border-black px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-center" style={{ backgroundColor: '#f8fafc', borderBottomColor: '#000000', color: '#000000' }}>Catatan & Motivasi Guru</div>
                    <div className="p-4 min-h-[25mm] text-[11px] sm:text-xs italic leading-relaxed text-stone-900" style={{ color: '#000000' }}>
                      {reportNote || 'Alhamdulillah, terus tingkatkan hafalannya dan jaga murajaahnya. Semoga Allah memberkahi setiap langkahmu dalam menghafal Al-Qur\'an.'}
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="w-full grid grid-cols-3 text-[11px] sm:text-[12px] text-center mt-auto relative z-10 flex-shrink-0">
                    <div className="flex flex-col items-center">
                      <p className="mb-10">Orang Tua/Wali,</p>
                      <p className="font-bold underline decoration-1 underline-offset-4">( .............................. )</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="mb-0.5">Mengetahui,</p>
                      <p className="mb-4">Kepala Sekolah</p>
                      <div className="relative flex items-center justify-center h-[50px] w-full mb-2">
                        {institution?.principal_signature && (
                          <img 
                            src={institution.principal_signature} 
                            alt="Principal Signature" 
                            crossOrigin="anonymous"
                            className="object-contain" 
                            style={{ height: `${principalSigSize}px`, width: 'auto' }} 
                          />
                        )}
                      </div>
                      <p className="font-bold underline decoration-1 underline-offset-4 mt-auto">{institution?.principal_name || 'Cikun, S.Pd'}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="mb-0.5 text-[11px]">
                        {institution?.report_date || `Cikunir, ${format(new Date(), 'dd MMMM yyyy', { locale: id })}`}
                      </p>
                      <p className="mb-4">Koordinator Tahfidz,</p>
                      <div className="relative flex items-center justify-center h-[50px] w-full mb-2">
                        {institution?.coordinator_signature && (
                          <img 
                            src={institution.coordinator_signature} 
                            alt="Coordinator Signature" 
                            crossOrigin="anonymous" 
                            className="object-contain" 
                            style={{ height: `${coordinatorSigSize}px`, width: 'auto' }} 
                          />
                        )}
                      </div>
                      <p className="font-bold underline decoration-1 underline-offset-4 mt-auto">{institution?.coordinator_name || 'Abdul Rohman'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
          <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-stone-200 border-dashed text-stone-400">
            <GraduationCap size={48} className="mb-4 opacity-20" />
            <p className="font-medium">Pilih siswa untuk melihat pratinjau rapor.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingExam && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                  <Edit2 size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900">Edit Nilai Ujian</h3>
                  <p className="text-xs text-stone-500">{editingExam.type === 'ummi' ? 'Ujian Ummi / Tilawah' : 'Ujian Hafalan'}</p>
                </div>
              </div>
              <button onClick={() => setEditingExam(null)} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
                <X size={20} className="text-stone-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <form id="edit-exam-form" onSubmit={handleUpdateExam} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Tanggal</label>
                    <input 
                      type="date"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-sm"
                      value={editingExam.data.date}
                      onChange={e => setEditingExam({ ...editingExam, data: { ...editingExam.data, date: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Target / Jilid</label>
                    <input 
                      type="text"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-sm"
                      value={editingExam.data.target || ''}
                      onChange={e => setEditingExam({ ...editingExam, data: { ...editingExam.data, target: e.target.value } })}
                    />
                  </div>
                </div>

                {editingExam.type === 'ummi' ? (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-stone-900 border-b border-stone-100 pb-2">Detail Nilai Jilid {editingExam.data.level}</h4>
                    <div className="grid gap-3">
                      {Object.entries(editingExam.data.scores).map(([indicator, score]: [string, any]) => (
                        <div key={indicator} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-100">
                          <span className="text-sm font-medium text-stone-700">{indicator}</span>
                          <div className="flex gap-1">
                            {['A', 'B', 'C'].map(grade => (
                              <button
                                key={grade}
                                type="button"
                                onClick={() => {
                                  const newScores = { ...editingExam.data.scores, [indicator]: grade };
                                  setEditingExam({ ...editingExam, data: { ...editingExam.data, scores: newScores } });
                                }}
                                className={cn(
                                  "w-8 h-8 rounded-lg font-bold text-xs transition-all",
                                  score === grade 
                                    ? "bg-emerald-600 text-white shadow-md" 
                                    : "bg-white text-stone-400 border border-stone-200"
                                )}
                              >
                                {grade}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-stone-900 border-b border-stone-100 pb-2">Daftar Surat</h4>
                      <div className="space-y-3">
                        {editingExam.data.surahs.map((surah: any, idx: number) => (
                          <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-stone-50 p-3 rounded-xl border border-stone-100">
                            <div className="col-span-7">
                              <input 
                                type="text"
                                className="w-full bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs"
                                value={surah.name}
                                onChange={e => {
                                  const newSurahs = [...editingExam.data.surahs];
                                  newSurahs[idx].name = e.target.value;
                                  setEditingExam({ ...editingExam, data: { ...editingExam.data, surahs: newSurahs } });
                                }}
                              />
                            </div>
                            <div className="col-span-5">
                              <select 
                                className="w-full bg-white border border-stone-200 rounded-lg px-2 py-1.5 text-xs font-bold text-emerald-700"
                                value={surah.grade}
                                onChange={e => {
                                  const newSurahs = [...editingExam.data.surahs];
                                  newSurahs[idx].grade = e.target.value;
                                  const predicates: any = { 'A+': 'MUMTAAZ', 'A': 'JAYYID JIDDAN', 'B+': 'JAYYID', 'B': 'MAQBUL', 'C': 'DHOIF' };
                                  newSurahs[idx].predicate = predicates[e.target.value] || '';
                                  setEditingExam({ ...editingExam, data: { ...editingExam.data, surahs: newSurahs } });
                                }}
                              >
                                {['A+', 'A', 'B+', 'B', 'C'].map(g => <option key={g} value={g}>{g}</option>)}
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Catatan Guru</label>
                      <textarea 
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-sm min-h-[80px]"
                        value={editingExam.data.note || ''}
                        onChange={e => setEditingExam({ ...editingExam, data: { ...editingExam.data, note: e.target.value } })}
                      />
                    </div>
                  </div>
                )}
              </form>
            </div>

            <div className="p-6 border-t border-stone-100 bg-stone-50 flex gap-3">
              <button 
                onClick={() => setEditingExam(null)}
                className="flex-1 py-3 border border-stone-200 text-stone-600 font-bold rounded-xl hover:bg-stone-100 transition-colors"
              >
                Batal
              </button>
              <button 
                form="edit-exam-form"
                type="submit"
                className="flex-[2] py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Simpan Perubahan
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmResetExam}
        title={`Hapus Data Ujian ${examToDelete?.type === 'ummi' ? 'Ummi' : 'Hafalan'}`}
        message={`Apakah Anda yakin ingin menghapus data ujian ${examToDelete?.type === 'ummi' ? 'Ummi' : 'Hafalan'} ini? Data yang sudah dihapus tidak dapat dikembalikan.`}
        confirmText="Hapus Data"
        themeColor={themeColor}
        variant="danger"
      />
    </div>
  );
}
