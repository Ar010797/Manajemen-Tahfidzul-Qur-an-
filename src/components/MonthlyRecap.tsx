import React, { useState, useEffect } from 'react';
import { Download, Search, Calendar, FileText, Save } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { cn } from '../lib/utils';
import socket from '../lib/socket';

export default function MonthlyRecap() {
  const [halaqohs, setHalaqohs] = useState<any[]>([]);
  const [selectedHalaqoh, setSelectedHalaqoh] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [recapData, setRecapData] = useState<any[]>([]);
  const [recapSettings, setRecapSettings] = useState<Record<string, any>>({});
  const [institution, setInstitution] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [hRes, iRes] = await Promise.all([
        fetch('/api/halaqoh', { headers }),
        fetch('/api/institution')
      ]);
      const hData = await hRes.json();
      if (Array.isArray(hData)) {
        setHalaqohs(hData);
      } else {
        console.error('Halaqoh error:', hData);
        setHalaqohs([]);
      }
      setInstitution(await iRes.json());
    };
    fetchData();

    socket.on('deposit-added', () => {
      if (selectedHalaqoh) fetchRecap();
    });

    socket.on('recap-updated', () => {
      if (selectedHalaqoh) fetchRecap();
    });

    return () => {
      socket.off('deposit-added');
      socket.off('recap-updated');
    };
  }, [selectedHalaqoh, selectedMonth]);

  const fetchRecap = async () => {
    if (!selectedHalaqoh) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/deposits/recap?month=${selectedMonth}&halaqoh_id=${selectedHalaqoh}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!Array.isArray(data)) {
      console.error('Recap data error:', data);
      setRecapData([]);
      setLoading(false);
      return;
    }
    
    // Group by student
    const grouped = data.reduce((acc: any, curr: any) => {
      if (!acc[curr.student_id]) {
        acc[curr.student_id] = {
          id: curr.student_id,
          name: curr.student_name,
          hafalan: { awl: '-', akh: '-', jml: 0 },
          ummi: { awl: '-', akh: '-', jml: 0 },
          tilawah: { awl: '-', akh: '-', jml: 0 }
        };
      }
      const details = JSON.parse(curr.details);
      const target = acc[curr.student_id][curr.type];
      
      if (curr.type === 'hafalan') {
        const label = `${details.surah} ${details.verse_start}-${details.verse_end}`;
        if (target.awl === '-') target.awl = label;
        target.akh = label;
        const verses = (parseInt(details.verse_end) || 0) - (parseInt(details.verse_start) || 0) + 1;
        target.jml += Math.max(0, verses);
      } else if (curr.type === 'ummi') {
        const label = details.page_start ? `J${details.level} H${details.page_start}-${details.page_end}` : `J${details.level} H${details.page}`;
        if (target.awl === '-') target.awl = label;
        target.akh = label;
        if (details.page_start && details.page_end) {
          const pages = (parseInt(details.page_end) || 0) - (parseInt(details.page_start) || 0) + 1;
          target.jml += Math.max(0, pages);
        } else {
          target.jml += 1;
        }
      } else if (curr.type === 'tilawah') {
        const label = details.verse_start ? `${details.surah} ${details.verse_start}-${details.verse_end}` : details.surah;
        if (target.awl === '-') target.awl = label;
        target.akh = label;
        if (details.verse_start && details.verse_end) {
          const verses = (parseInt(details.verse_end) || 0) - (parseInt(details.verse_start) || 0) + 1;
          target.jml += Math.max(0, verses);
        } else {
          target.jml += 1;
        }
      }
      
      return acc;
    }, {});

    const studentList = Object.values(grouped);
    setRecapData(studentList);

    // Fetch settings for each student
    const settings: Record<string, any> = {};
    for (const student of studentList as any[]) {
      const sRes = await fetch(`/api/monthly-recap/settings?student_id=${student.id}&month=${selectedMonth}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      settings[student.id] = await sRes.json();
    }
    setRecapSettings(settings);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecap();
  }, [selectedHalaqoh, selectedMonth]);

  const updateSettings = async (studentId: string, field: string, value: string) => {
    const token = localStorage.getItem('token');
    const current = recapSettings[studentId] || { total_hafalan: '', notes: '' };
    const newSettings = { ...current, [field]: value };
    setRecapSettings({ ...recapSettings, [studentId]: newSettings });

    await fetch('/api/monthly-recap/settings', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        student_id: studentId,
        month: selectedMonth,
        total_hafalan: newSettings.total_hafalan,
        notes: newSettings.notes
      })
    });
  };

  const generateImage = async (format: 'jpg' | 'png') => {
    if (!selectedHalaqoh || recapData.length === 0) return;

    const element = document.getElementById('recap-capture');
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
      link.download = `Rekap_${selectedMonth}_${selectedHalaqoh}.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Image Generation Error:', error);
      alert('Gagal mengunduh gambar.');
      element.style.display = 'none';
      element.style.position = 'absolute';
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Add Watermark
    if (institution?.watermark) {
      doc.saveGraphicsState();
      doc.setGState(new (doc as any).GState({ opacity: 0.05 }));
      doc.addImage(institution.watermark, 'PNG', pageWidth / 2 - 50, pageHeight / 2 - 50, 100, 100);
      doc.restoreGraphicsState();
    }

    // Logo
    if (institution?.logo) {
      doc.addImage(institution.logo, 'PNG', 20, 10, 20, 20);
    }

    doc.setFont('times', 'bold');
    doc.setFontSize(16);
    doc.text('REKAPITULASI BULANAN TAHFIDZUL QUR\'AN', pageWidth / 2, 18, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(institution?.name?.toUpperCase() || 'SEKOLAH ISLAM MIFTAHUSSALAM', pageWidth / 2, 25, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setFont('times', 'normal');
    doc.text(institution?.address || '', pageWidth / 2, 30, { align: 'center' });
    doc.setLineWidth(0.5);
    doc.line(20, 33, pageWidth - 20, 33);

    doc.setFontSize(10);
    doc.text(`Bulan: ${format(new Date(selectedMonth), 'MMMM yyyy', { locale: id })}`, 20, 40);
    doc.text(`Halaqoh: ${halaqohs.find(h => h.id == selectedHalaqoh)?.name || '-'}`, 20, 45);
    doc.text(`Pengampu: ${institution?.halaqoh_teacher_name || '-'}`, pageWidth - 60, 45);

    const rows = recapData.map((s, i) => {
      const settings = recapSettings[s.id] || {};
      return [
        i + 1,
        s.name,
        s.hafalan.awl, s.hafalan.akh, s.hafalan.jml,
        s.tilawah.awl, s.tilawah.akh, s.tilawah.jml,
        s.ummi.awl, s.ummi.akh, s.ummi.jml,
        settings.total_hafalan || '-',
        settings.notes || '-'
      ];
    });

    autoTable(doc, {
      startY: 50,
      head: [
        [
          { content: 'NO', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
          { content: 'NAMA', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
          { content: 'HAFALAN AL-QUR\'AN', colSpan: 3, styles: { halign: 'center' } },
          { content: 'TILAWAH AL-QUR\'AN', colSpan: 3, styles: { halign: 'center' } },
          { content: 'TILAWAH UMMI', colSpan: 3, styles: { halign: 'center' } },
          { content: 'TOTAL', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
          { content: 'CATATAN', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } }
        ],
        ['AWL', 'AKH', 'JML', 'AWL', 'AKH', 'JML', 'AWL', 'AKH', 'JML']
      ],
      body: rows,
      theme: 'grid',
      styles: { font: 'times', fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1, lineColor: [0, 0, 0] }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;
    
    doc.setFontSize(10);
    doc.text('Mengetahui,', 40, finalY);
    doc.text('Kepala Sekolah', 40, finalY + 5);
    if (institution?.principal_signature) {
      doc.addImage(institution.principal_signature, 'PNG', 35, finalY + 7, 25, 12);
    }
    doc.setFont('times', 'bold');
    doc.text(institution?.principal_name || '( .............................. )', 40, finalY + 25);

    doc.setFont('times', 'normal');
    doc.text('Koordinator Tahfidz,', pageWidth - 70, finalY + 5);
    if (institution?.coordinator_signature) {
      doc.addImage(institution.coordinator_signature, 'PNG', pageWidth - 75, finalY + 7, 25, 12);
    }
    doc.setFont('times', 'bold');
    doc.text(institution?.coordinator_name || '( .............................. )', pageWidth - 70, finalY + 25);

    doc.save(`Rekap_${selectedMonth}_${selectedHalaqoh}.pdf`);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-4 sm:p-8 rounded-3xl border border-stone-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">Rekapitulasi Bulanan</h2>
            <p className="text-stone-500 text-sm">Akumulasi otomatis dengan kolom catatan kustom</p>
          </div>
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <button 
              onClick={generatePDF}
              disabled={!selectedHalaqoh || recapData.length === 0}
              className="flex-1 lg:flex-none bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              <Download size={20} />
              PDF
            </button>
            <button 
              onClick={() => generateImage('jpg')}
              disabled={!selectedHalaqoh || recapData.length === 0}
              className="flex-1 lg:flex-none bg-amber-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              <FileText size={20} />
              JPG
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Pilih Halaqoh</label>
            <select 
              className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              value={selectedHalaqoh}
              onChange={(e) => setSelectedHalaqoh(e.target.value)}
            >
              <option value="">-- Pilih Halaqoh --</option>
              {halaqohs.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Pilih Bulan</label>
            <input 
              type="month"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-stone-400">Memuat data...</div>
        ) : recapData.length > 0 ? (
          <div className="overflow-x-auto border border-stone-200 rounded-2xl">
            <table className="w-full text-[11px] text-left border-collapse">
              <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider">
                <tr className="border-b border-stone-200">
                  <th rowSpan={2} className="px-4 py-3 border-r border-stone-200 text-center">No</th>
                  <th rowSpan={2} className="px-4 py-3 border-r border-stone-200">Nama</th>
                  <th colSpan={3} className="px-4 py-2 border-r border-stone-200 text-center">Hafalan</th>
                  <th colSpan={3} className="px-4 py-2 border-r border-stone-200 text-center">Tilawah Al-Qur'an</th>
                  <th colSpan={3} className="px-4 py-2 border-r border-stone-200 text-center">Ummi</th>
                  <th rowSpan={2} className="px-4 py-3 border-r border-stone-200 text-center">Total Hafalan</th>
                  <th rowSpan={2} className="px-4 py-3 text-center">Catatan Bulanan</th>
                </tr>
                <tr className="border-b border-stone-200">
                  <th className="px-2 py-2 border-r border-stone-200 text-center">Awl</th>
                  <th className="px-2 py-2 border-r border-stone-200 text-center">Akh</th>
                  <th className="px-2 py-2 border-r border-stone-200 text-center">Jml</th>
                  <th className="px-2 py-2 border-r border-stone-200 text-center">Awl</th>
                  <th className="px-2 py-2 border-r border-stone-200 text-center">Akh</th>
                  <th className="px-2 py-2 border-r border-stone-200 text-center">Jml</th>
                  <th className="px-2 py-2 border-r border-stone-200 text-center">Awl</th>
                  <th className="px-2 py-2 border-r border-stone-200 text-center">Akh</th>
                  <th className="px-2 py-2 border-r border-stone-200 text-center">Jml</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recapData.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3 border-r border-stone-100 text-center">{idx + 1}</td>
                    <td className="px-4 py-3 border-r border-stone-100 font-bold text-stone-800">{s.name}</td>
                    <td className="px-2 py-3 border-r border-stone-100 text-center">{s.hafalan.awl}</td>
                    <td className="px-2 py-3 border-r border-stone-100 text-center">{s.hafalan.akh}</td>
                    <td className="px-2 py-3 border-r border-stone-100 text-center font-bold">{s.hafalan.jml}</td>
                    <td className="px-2 py-3 border-r border-stone-100 text-center">{s.tilawah.awl}</td>
                    <td className="px-2 py-3 border-r border-stone-100 text-center">{s.tilawah.akh}</td>
                    <td className="px-2 py-3 border-r border-stone-100 text-center font-bold">{s.tilawah.jml}</td>
                    <td className="px-2 py-3 border-r border-stone-100 text-center">{s.ummi.awl}</td>
                    <td className="px-2 py-3 border-r border-stone-100 text-center">{s.ummi.akh}</td>
                    <td className="px-2 py-3 border-r border-stone-100 text-center font-bold">{s.ummi.jml}</td>
                    <td className="px-4 py-3 border-r border-stone-100">
                      <input 
                        type="text"
                        className="w-full bg-white border border-stone-200 rounded px-2 py-1 text-[10px]"
                        value={recapSettings[s.id]?.total_hafalan || ''}
                        onChange={(e) => updateSettings(s.id, 'total_hafalan', e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="text"
                        className="w-full bg-white border border-stone-200 rounded px-2 py-1 text-[10px]"
                        value={recapSettings[s.id]?.notes || ''}
                        onChange={(e) => updateSettings(s.id, 'notes', e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center text-stone-400">
            <FileText size={48} className="mx-auto mb-4 opacity-20" />
            <p>Tidak ada data setoran untuk bulan dan halaqoh ini.</p>
          </div>
        )}
      </div>
      {/* Hidden capture element for image export */}
      <div id="recap-capture" style={{ display: 'none', position: 'absolute', left: '-9999px' }}>
        <div className="bg-white p-[15mm] relative" style={{ width: '297mm', minHeight: '210mm', fontFamily: 'serif', color: '#1c1917' }}>
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
              <h1 className="text-xl font-bold uppercase">REKAPITULASI BULANAN TAHFIDZUL QUR'AN</h1>
              <h2 className="text-lg font-bold uppercase">{institution?.name || 'SEKOLAH ISLAM MIFTAHUSSALAM'}</h2>
              <p className="text-[10px] leading-tight">{institution?.address}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 text-xs mb-6">
            <div className="space-y-1">
              <p>Bulan: {format(new Date(selectedMonth), 'MMMM yyyy', { locale: id })}</p>
              <p>Halaqoh: {halaqohs.find(h => h.id == selectedHalaqoh)?.name || '-'}</p>
            </div>
            <div className="text-right">
              <p>Pengampu: {institution?.halaqoh_teacher_name || '-'}</p>
            </div>
          </div>

          <table className="w-full border-collapse border border-black text-[9px]" style={{ borderColor: '#000000' }}>
            <thead>
              <tr style={{ backgroundColor: '#fafaf9' }}>
                <th rowSpan={2} className="border border-black p-1 text-center">NO</th>
                <th rowSpan={2} className="border border-black p-1 text-left">NAMA</th>
                <th colSpan={3} className="border border-black p-1 text-center">HAFALAN AL-QUR'AN</th>
                <th colSpan={3} className="border border-black p-1 text-center">TILAWAH AL-QUR'AN</th>
                <th colSpan={3} className="border border-black p-1 text-center">TILAWAH UMMI</th>
                <th rowSpan={2} className="border border-black p-1 text-center">TOTAL</th>
                <th rowSpan={2} className="border border-black p-1 text-center">CATATAN</th>
              </tr>
              <tr style={{ backgroundColor: '#fafaf9' }}>
                <th className="border border-black p-1 text-center">AWL</th>
                <th className="border border-black p-1 text-center">AKH</th>
                <th className="border border-black p-1 text-center">JML</th>
                <th className="border border-black p-1 text-center">AWL</th>
                <th className="border border-black p-1 text-center">AKH</th>
                <th className="border border-black p-1 text-center">JML</th>
                <th className="border border-black p-1 text-center">AWL</th>
                <th className="border border-black p-1 text-center">AKH</th>
                <th className="border border-black p-1 text-center">JML</th>
              </tr>
            </thead>
            <tbody>
              {recapData.map((s, i) => (
                <tr key={s.id}>
                  <td className="border border-black p-1 text-center">{i + 1}</td>
                  <td className="border border-black p-1 font-bold">{s.name}</td>
                  <td className="border border-black p-1 text-center">{s.hafalan.awl}</td>
                  <td className="border border-black p-1 text-center">{s.hafalan.akh}</td>
                  <td className="border border-black p-1 text-center">{s.hafalan.jml}</td>
                  <td className="border border-black p-1 text-center">{s.tilawah.awl}</td>
                  <td className="border border-black p-1 text-center">{s.tilawah.akh}</td>
                  <td className="border border-black p-1 text-center">{s.tilawah.jml}</td>
                  <td className="border border-black p-1 text-center">{s.ummi.awl}</td>
                  <td className="border border-black p-1 text-center">{s.ummi.akh}</td>
                  <td className="border border-black p-1 text-center">{s.ummi.jml}</td>
                  <td className="border border-black p-1 text-center">{recapSettings[s.id]?.total_hafalan || '-'}</td>
                  <td className="border border-black p-1">{recapSettings[s.id]?.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="grid grid-cols-2 text-xs text-center mt-12">
            <div>
              <p>Mengetahui,</p>
              <p className="mb-12">Kepala Sekolah</p>
              <div className="relative h-12 flex items-center justify-center">
                {institution?.principal_signature && (
                  <img src={institution.principal_signature} alt="" className="h-full object-contain absolute" />
                )}
              </div>
              <p className="font-bold underline">{institution?.principal_name || '( .............................. )'}</p>
            </div>
            <div>
              <p className="invisible">.</p>
              <p className="mb-12">Koordinator Tahfidz,</p>
              <div className="relative h-12 flex items-center justify-center">
                {institution?.coordinator_signature && (
                  <img src={institution.coordinator_signature} alt="" className="h-full object-contain absolute" />
                )}
              </div>
              <p className="font-bold underline">{institution?.coordinator_name || '( .............................. )'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
