import React, { useState, useEffect, useMemo } from 'react';
import { Printer, Search, Download, Eye, GraduationCap, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { cn } from '../lib/utils';
import socket from '../lib/socket';

export default function ReportCard() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [semester, setSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');
  const [examData, setExamData] = useState<any>(null);
  const [institution, setInstitution] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [recapSettings, setRecapSettings] = useState<any>(null);
  const [showListOnMobile, setShowListOnMobile] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [sRes, iRes] = await Promise.all([
        fetch('/api/students', { headers }),
        fetch('/api/institution')
      ]);
      const sData = await sRes.json();
      if (Array.isArray(sData)) {
        setStudents(sData);
      } else {
        console.error('Students error:', sData);
        setStudents([]);
      }
      setInstitution(await iRes.json());
    };
    fetchData();

    socket.on('exam-hafalan-updated', () => {
      if (selectedStudent) fetchExamData(selectedStudent);
    });

    return () => {
      socket.off('exam-hafalan-updated');
    };
  }, [selectedStudent]);

  const groupedStudents = useMemo(() => {
    const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
    const groups: Record<string, any[]> = {};
    
    filtered.forEach(s => {
      const groupName = s.halaqoh_name || 'Tanpa Halaqoh';
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(s);
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

  const fetchExamData = async (student: any) => {
    const token = localStorage.getItem('token');
    const [eRes, sRes] = await Promise.all([
      fetch(`/api/exams/student/${student.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch(`/api/monthly-recap/settings?student_id=${student.id}&month=${format(new Date(), 'yyyy-MM')}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]);
    
    setExamData(await eRes.json());
    setRecapSettings(await sRes.json());
    setSelectedStudent(student);
    setShowListOnMobile(false);
  };

  const resetExam = async (type: 'ummi' | 'hafalan', id: number) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus data ujian ${type} ini? Data yang sudah dihapus tidak dapat dikembalikan.`)) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/exams/${type}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Data ujian berhasil dihapus.');
        if (selectedStudent) fetchExamData(selectedStudent);
      }
    } catch (error) {
      console.error(`Error resetting ${type} exam:`, error);
      alert('Gagal menghapus data.');
    }
  };

  const teacherNotes = useMemo(() => {
    if (!examData?.hafalan) return '';
    const notes = examData.hafalan
      .filter((e: any) => e.semester === semester && e.note)
      .map((e: any) => e.note);
    return notes.length > 0 ? notes.join('; ') : '-';
  }, [examData, semester]);

  const generateImage = async (format: 'jpg' | 'png') => {
    if (!selectedStudent || !examData) return;

    const element = document.getElementById('report-card-capture');
    if (!element) return;

    try {
      element.style.display = 'block';
      element.style.visibility = 'visible';
      element.style.position = 'static';
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      
      element.style.display = 'none';
      element.style.position = 'absolute';

      const dataUrl = canvas.toDataURL(`image/${format === 'jpg' ? 'jpeg' : 'png'}`, 0.9);
      const link = document.createElement('a');
      link.style.display = 'none';
      document.body.appendChild(link);
      link.download = `Rapor_${selectedStudent.name}.${format}`;
      link.href = dataUrl;
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Image Generation Error:', error);
      alert('Gagal mengunduh gambar.');
      element.style.display = 'none';
      element.style.position = 'absolute';
    }
  };

  const generatePDF = async () => {
    if (!selectedStudent || !examData) return;

    const element = document.getElementById('report-card-capture');
    if (!element) {
      alert('Elemen rapor tidak ditemukan.');
      return;
    }

    try {
      // Temporarily show the element for capture
      element.style.display = 'block';
      element.style.visibility = 'visible';
      element.style.position = 'static';
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794, // A4 width in pixels at 96dpi is ~794px
      });
      
      element.style.display = 'none';
      element.style.position = 'absolute';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Rapor_${selectedStudent.name}.pdf`);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('Gagal mengunduh rapor. Silakan coba lagi.');
      element.style.display = 'none';
      element.style.position = 'absolute';
    }
  };

  const renderUmmiTable = () => {
    const filteredUmmi = examData.ummi.filter((e: any) => e.semester === semester);
    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] font-bold">TARGET TAJWID: Ummi jilid {filteredUmmi[0]?.level || '-'}</p>
        </div>
        <table className="w-full border-collapse border border-black text-[10px]" style={{ borderColor: '#000000' }}>
          <thead>
            <tr style={{ backgroundColor: '#fafaf9' }}>
              <th className="border border-black p-1 w-10" style={{ borderColor: '#000000' }}>Jilid</th>
              <th className="border border-black p-1 text-left" style={{ borderColor: '#000000' }}>Materi Tajwid</th>
              <th className="border border-black p-1 w-10" style={{ borderColor: '#000000' }}>Nilai</th>
            </tr>
          </thead>
          <tbody>
            {filteredUmmi.length > 0 ? filteredUmmi.map((exam: any) => (
              Object.entries(JSON.parse(exam.scores)).filter(([_, v]) => v).map(([k, v], i) => (
                <tr key={`${exam.id}-${i}`}>
                  <td className="border border-black p-1 text-center" style={{ borderColor: '#000000' }}>{exam.level === 7 ? 'Tilawah' : exam.level}</td>
                  <td className="border border-black p-1" style={{ borderColor: '#000000' }}>{k}</td>
                  <td className="border border-black p-1 text-center font-bold" style={{ borderColor: '#000000' }}>{v as string}</td>
                </tr>
              ))
            )) : (
              <tr><td colSpan={3} className="border border-black p-4 text-center italic text-stone-400" style={{ borderColor: '#000000' }}>Belum ada data semester ini</td></tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const renderHafalanTable = () => {
    const filteredHafalan = examData.hafalan.filter((e: any) => e.semester === semester);
    let counter = 1;
    return (
      <div>
        <p className="text-[10px] font-bold mb-1">TARGET HAFALAN: Juz 30</p>
        <table className="w-full border-collapse border border-black text-[10px]" style={{ borderColor: '#000000' }}>
          <thead>
            <tr style={{ backgroundColor: '#fafaf9' }}>
              <th className="border border-black p-1 w-8" style={{ borderColor: '#000000' }}>No</th>
              <th className="border border-black p-1 text-left" style={{ borderColor: '#000000' }}>Surat</th>
              <th className="border border-black p-1 w-10" style={{ borderColor: '#000000' }}>Nilai</th>
              <th className="border border-black p-1 w-16" style={{ borderColor: '#000000' }}>Predikat</th>
            </tr>
          </thead>
          <tbody>
            {filteredHafalan.length > 0 ? filteredHafalan.flatMap((exam: any) => 
              JSON.parse(exam.surahs).map((s: any, i: number) => (
                <tr key={`${exam.id}-${i}`}>
                  <td className="border border-black p-1 text-center" style={{ borderColor: '#000000' }}>{counter++}</td>
                  <td className="border border-black p-1" style={{ borderColor: '#000000' }}>{s.name}</td>
                  <td className="border border-black p-1 text-center" style={{ borderColor: '#000000' }}>{s.grade}</td>
                  <td className="border border-black p-1 text-center" style={{ borderColor: '#000000' }}>{s.predicate}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="border border-black p-4 text-center italic text-stone-400" style={{ borderColor: '#000000' }}>Belum ada data semester ini</td></tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
      <div className={cn(
        "lg:col-span-1 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm h-fit lg:sticky lg:top-8 z-10",
        !showListOnMobile && "hidden lg:block"
      )}>
        <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
          <Search size={18} className="text-emerald-600" />
          Cari Siswa
        </h3>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text"
            placeholder="Nama siswa..."
            className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        
        <div className="space-y-6 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
          {Object.entries(groupedStudents).map(([halaqohName, halaqohStudents]: [string, any[]]) => (
            <div key={halaqohName} className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  {halaqohName}
                </h4>
                <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                  {halaqohStudents.length} Siswa
                </span>
              </div>
              
              <div className="space-y-2">
                {halaqohStudents.map((s: any) => (
                  <button
                    key={s.id}
                    onClick={() => fetchExamData(s)}
                    className={cn(
                      "w-full text-left p-3 rounded-xl transition-all border group",
                      selectedStudent?.id === s.id 
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-bold shadow-sm shadow-emerald-100" 
                        : "bg-white border-stone-100 hover:border-emerald-200 hover:bg-stone-50 text-stone-600"
                    )}
                  >
                    <p className="text-sm group-hover:translate-x-1 transition-transform">{s.name}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {Object.keys(groupedStudents).length === 0 && (
            <div className="text-center py-8 text-stone-400">
              <p className="text-sm italic">Siswa tidak ditemukan</p>
            </div>
          )}
        </div>
      </div>

      <div className={cn(
        "lg:col-span-2",
        showListOnMobile && "hidden lg:block"
      )}>
        {selectedStudent && examData ? (
          <div className="bg-white p-6 lg:p-8 rounded-3xl border border-stone-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowListOnMobile(true)}
                  className="lg:hidden flex items-center gap-1 px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-600 transition-colors text-xs font-bold"
                >
                  <ChevronLeft size={16} />
                  Daftar
                </button>
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-stone-900 leading-tight">{selectedStudent.name}</h2>
                  <p className="text-stone-500 text-sm">Pratinjau Rapor Hasil Ujian</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 bg-stone-100 p-1.5 rounded-xl">
                <button
                  onClick={() => setSemester('Ganjil')}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                    semester === 'Ganjil' ? "bg-white text-emerald-600 shadow-sm" : "text-stone-500 hover:text-stone-700"
                  )}
                >
                  Ganjil
                </button>
                <button
                  onClick={() => setSemester('Genap')}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                    semester === 'Genap' ? "bg-white text-emerald-600 shadow-sm" : "text-stone-500 hover:text-stone-700"
                  )}
                >
                  Genap
                </button>
              </div>

              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button 
                  onClick={generatePDF}
                  className="flex-1 sm:flex-none bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <Download size={18} />
                  PDF
                </button>
                <button 
                  onClick={() => generateImage('jpg')}
                  className="flex-1 sm:flex-none bg-amber-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-amber-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <Eye size={18} />
                  JPG
                </button>
              </div>
            </div>

            <div className="space-y-8">
              {/* Reset Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <h4 className="text-xs font-bold text-stone-500 uppercase mb-3">Reset Data Ujian Ummi</h4>
                  <div className="space-y-2">
                    {examData.ummi.filter((e: any) => e.semester === semester).map((e: any) => (
                      <div key={e.id} className="flex items-center justify-between bg-white p-2 rounded-lg border border-stone-100 text-xs">
                        <span>Jilid {e.level} ({e.date})</span>
                        <button onClick={() => resetExam('ummi', e.id)} className="text-red-500 hover:text-red-700 font-bold">Hapus</button>
                      </div>
                    ))}
                    {examData.ummi.filter((e: any) => e.semester === semester).length === 0 && <p className="text-xs italic text-stone-400">Tidak ada data</p>}
                  </div>
                </div>
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <h4 className="text-xs font-bold text-stone-500 uppercase mb-3">Reset Data Ujian Hafalan</h4>
                  <div className="space-y-2">
                    {examData.hafalan.filter((e: any) => e.semester === semester).map((e: any) => (
                      <div key={e.id} className="flex items-center justify-between bg-white p-2 rounded-lg border border-stone-100 text-xs">
                        <span>Hafalan ({e.date})</span>
                        <button onClick={() => resetExam('hafalan', e.id)} className="text-red-500 hover:text-red-700 font-bold">Hapus</button>
                      </div>
                    ))}
                    {examData.hafalan.filter((e: any) => e.semester === semester).length === 0 && <p className="text-xs italic text-stone-400">Tidak ada data</p>}
                  </div>
                </div>
              </div>

              {/* Report Card Preview (HTML) */}
              <div className="border border-stone-200 rounded-2xl overflow-x-auto shadow-inner bg-stone-100 p-4 lg:p-8">
                <div id="report-card-preview" className="bg-white shadow-2xl mx-auto p-[10mm] sm:p-[15mm] relative overflow-hidden" style={{ width: '210mm', minHeight: '297mm', fontFamily: 'serif', color: '#1c1917' }}>
                  {/* Watermark */}
                  {institution?.watermark && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.08]">
                      <img src={institution.watermark} alt="" className="w-[120mm] h-[120mm] object-contain" />
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-center border-b-2 border-black pb-4 mb-6 relative" style={{ borderBottomColor: '#000000' }}>
                    {institution?.logo && (
                      <img src={institution.logo} alt="Logo" className="absolute left-0 top-0 w-16 h-16 sm:w-20 sm:h-20 object-contain" />
                    )}
                    <div className="flex-1 text-center pl-16 sm:pl-20">
                      <p className="text-sm font-bold mb-1">شهادة حفظ القرآن الكريم</p>
                      <h1 className="text-lg sm:text-xl font-bold uppercase">{institution?.name || 'SEKOLAH ISLAM MIFTAHUSSALAM'}</h1>
                      <p className="text-[9px] sm:text-[10px] leading-tight">{institution?.address}</p>
                      <div className="mt-2 text-[10px] sm:text-xs font-bold">
                        <p>UJIAN TAHFIDZUL QUR'AN SEMESTER {semester.toUpperCase()}</p>
                        <p>TAHUN AJARAN {institution?.academic_year || '2025/2026'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Student Info */}
                  <div className="grid grid-cols-2 text-[10px] sm:text-xs mb-6">
                    <div className="space-y-1">
                      <div className="flex">
                        <span className="w-16 sm:w-20">Nama</span>
                        <span>: {selectedStudent.name}</span>
                      </div>
                      <div className="flex">
                        <span className="w-16 sm:w-20">Kelas</span>
                        <span>: {selectedStudent.halaqoh_name}</span>
                      </div>
                      <div className="flex">
                        <span className="w-16 sm:w-20">Pengampu</span>
                        <span>: {institution?.halaqoh_teacher_name || '-'}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">SEMESTER: {semester === 'Ganjil' ? '1 (Ganjil)' : '2 (Genap)'}</p>
                    </div>
                  </div>

                  {/* Title Box */}
                  <div className="border border-black py-1.5 text-center font-bold text-sm mb-6" style={{ borderColor: '#000000' }}>
                    LAPORAN PENCAPAIAN TAHFIDZ
                  </div>

                  {/* Tables Container */}
                  <div className="grid grid-cols-2 gap-8 mb-6">
                    {renderHafalanTable()}
                    {renderUmmiTable()}
                  </div>

                  {/* Footer Box - Catatan Guru */}
                  <div className="border border-black mb-12" style={{ borderColor: '#000000' }}>
                    <div className="border-b border-black px-2 py-1 text-[10px] font-bold uppercase" style={{ backgroundColor: '#fafaf9', borderBottomColor: '#000000' }}>Catatan Guru</div>
                    <div className="p-2 min-h-[15mm] text-[10px] italic">
                      {teacherNotes}
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="grid grid-cols-3 text-xs text-center">
                    <div>
                      <p className="mb-16">Orang Tua/Wali</p>
                      <p className="font-bold">( .............................. )</p>
                    </div>
                    <div>
                      <p className="mb-2">Mengetahui,</p>
                      <p className="mb-12">Kepala Sekolah</p>
                      <div className="relative h-16 flex items-center justify-center">
                        {institution?.principal_signature && (
                          <img src={institution.principal_signature} alt="" className="h-full object-contain absolute" />
                        )}
                      </div>
                      <p className="font-bold underline">{institution?.principal_name || 'Cikun, S.Pd'}</p>
                    </div>
                    <div>
                      <p className="mb-2">Pengampu Halaqoh,</p>
                      <p className="mb-12">{institution?.halaqoh_teacher_name || 'Al-Ustadz'}</p>
                      <div className="relative h-16 flex items-center justify-center">
                        {institution?.coordinator_signature && (
                          <img src={institution.coordinator_signature} alt="" className="h-full object-contain absolute" />
                        )}
                      </div>
                      <p className="font-bold underline">{institution?.coordinator_name || 'Abdul Rohman'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hidden capture element for PDF */}
              <div id="report-card-capture" style={{ display: 'none', position: 'absolute', left: '-9999px' }}>
                {/* Same content as preview but optimized for capture */}
                <div className="bg-white p-[15mm] relative" style={{ width: '210mm', minHeight: '297mm', fontFamily: 'serif', color: '#1c1917' }}>
                  {/* Watermark */}
                  {institution?.watermark && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.08]">
                      <img src={institution.watermark} alt="" className="w-[120mm] h-[120mm] object-contain" />
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-center border-b-2 border-black pb-4 mb-6 relative" style={{ borderBottomColor: '#000000' }}>
                    {institution?.logo && (
                      <img src={institution.logo} alt="Logo" className="absolute left-0 top-0 w-20 h-20 object-contain" />
                    )}
                    <div className="flex-1 text-center pl-20">
                      <p className="text-sm font-bold mb-1">شهادة حفظ القرآن الكريم</p>
                      <h1 className="text-xl font-bold uppercase">{institution?.name || 'SEKOLAH ISLAM MIFTAHUSSALAM'}</h1>
                      <p className="text-[10px] leading-tight">{institution?.address}</p>
                      <div className="mt-2 text-xs font-bold">
                        <p>UJIAN TAHFIDZUL QUR'AN SEMESTER {semester.toUpperCase()}</p>
                        <p>TAHUN AJARAN {institution?.academic_year || '2025/2026'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Student Info */}
                  <div className="grid grid-cols-2 text-xs mb-6">
                    <div className="space-y-1">
                      <div className="flex">
                        <span className="w-20">Nama</span>
                        <span>: {selectedStudent.name}</span>
                      </div>
                      <div className="flex">
                        <span className="w-20">Kelas</span>
                        <span>: {selectedStudent.halaqoh_name}</span>
                      </div>
                      <div className="flex">
                        <span className="w-20">Pengampu</span>
                        <span>: {institution?.halaqoh_teacher_name || '-'}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">SEMESTER: {semester === 'Ganjil' ? '1 (Ganjil)' : '2 (Genap)'}</p>
                    </div>
                  </div>

                  {/* Title Box */}
                  <div className="border border-black py-1.5 text-center font-bold text-sm mb-6" style={{ borderColor: '#000000' }}>
                    LAPORAN PENCAPAIAN TAHFIDZ
                  </div>

                  {/* Tables Container */}
                  <div className="grid grid-cols-2 gap-8 mb-6">
                    {renderHafalanTable()}
                    {renderUmmiTable()}
                  </div>

                  {/* Footer Box - Catatan Guru */}
                  <div className="border border-black mb-12" style={{ borderColor: '#000000' }}>
                    <div className="border-b border-black px-2 py-1 text-[10px] font-bold uppercase" style={{ backgroundColor: '#fafaf9', borderBottomColor: '#000000' }}>Catatan Guru</div>
                    <div className="p-2 min-h-[15mm] text-[10px] italic">
                      {teacherNotes}
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="grid grid-cols-3 text-xs text-center">
                    <div>
                      <p className="mb-16">Orang Tua/Wali</p>
                      <p className="font-bold">( .............................. )</p>
                    </div>
                    <div>
                      <p className="mb-2">Mengetahui,</p>
                      <p className="mb-12">Kepala Sekolah</p>
                      <div className="relative h-16 flex items-center justify-center">
                        {institution?.principal_signature && (
                          <img src={institution.principal_signature} alt="" className="h-full object-contain absolute" />
                        )}
                      </div>
                      <p className="font-bold underline">{institution?.principal_name || 'Cikun, S.Pd'}</p>
                    </div>
                    <div>
                      <p className="mb-2">Pengampu Halaqoh,</p>
                      <p className="mb-12">{institution?.halaqoh_teacher_name || 'Al-Ustadz'}</p>
                      <div className="relative h-16 flex items-center justify-center">
                        {institution?.coordinator_signature && (
                          <img src={institution.coordinator_signature} alt="" className="h-full object-contain absolute" />
                        )}
                      </div>
                      <p className="font-bold underline">{institution?.coordinator_name || 'Abdul Rohman'}</p>
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
    </div>
  );
}
