const fs = require('fs');
const file = 'src/components/AdminProgressReport.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace("import jsPDF from 'jspdf';", "import jsPDF from 'jspdf';\nimport autoTable from 'jspdf-autotable';");

const oldGeneratePdf = `  const generatePDF = async () => {
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
        
        const fileName = \`Laporan_Progress_Global_Tahfidz.pdf\`;
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
  };`;

const newGeneratePdf = `  const generatePDF = async () => {
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
        pdf.text(\`Total Siswa Terdata: \${studentsProgress.length} Siswa\`, pdf.internal.pageSize.getWidth() / 2, startY, { align: 'center' });
        
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
        
        const fileName = \`Laporan_Progress_Global_Tahfidz.pdf\`;
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
  };`;

// Also we should add Target Kurikulum to the PDF just to be complete.
const fullNewGeneratePdf = newGeneratePdf.replace(
  "const fileName =",
  `
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
                 t.semester1.hafalan,
                 t.semester1.ummi,
                 t.semester2.hafalan,
                 t.semester2.ummi
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
        
        const fileName =`
);

code = code.replace(oldGeneratePdf, fullNewGeneratePdf);

fs.writeFileSync(file, code);
console.log('Patch complete.');
