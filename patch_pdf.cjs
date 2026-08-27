const fs = require('fs');
let code = fs.readFileSync('src/components/MonthlyRecap.tsx', 'utf-8');

// 1. Center vertically in PDF
code = code.replace(
  /const xOffset = \(pdfWidth - finalWidth\) \/ 2;\s*const yOffset = 0;/,
  "const xOffset = (pdfWidth - finalWidth) / 2;\n      const yOffset = (pdfHeight - finalHeight) / 2;"
);

// 2. Modify Table styling and remove colgroup completely
const oldTableStart = `<table className="w-full border-collapse border border-black text-[9px] leading-tight relative z-10 mb-auto" style={{ borderColor: '#000000', tableLayout: 'fixed' }}>`;
const newTableStart = `<table className="w-full border-collapse border border-black text-[11px] leading-snug relative z-10 mb-auto" style={{ borderColor: '#000000' }}>`;

const colgroupRegex = /<colgroup>[\s\S]*?<\/colgroup>/;

code = code.replace(oldTableStart, newTableStart);
code = code.replace(colgroupRegex, '');

// 3. Remove truncate from NAMA td and increase other td font sizes slightly
code = code.replace(
  /<td className="border border-black p-1 font-bold pl-3 truncate" style={{ borderColor: '#000000' }}>{s\.name}<\/td>/g,
  `<td className="border border-black p-2 font-bold pl-3 break-words text-[11px]" style={{ borderColor: '#000000' }}>{s.name}</td>`
);

// For the rest of the text-[8px] in the print table, upgrade them to text-[10px]
code = code.replace(/text-\[8px\]/g, 'text-[10px]');
code = code.replace(/text-\[9px\]/g, 'text-[11px]');

// 4. Also update th sizes to add minimal width limits to keep columns neat
const noThOld = `<th rowSpan={2} className="border border-black p-2 text-center font-bold" style={{ borderColor: '#000000' }}>NO</th>`;
const noThNew = `<th rowSpan={2} className="border border-black p-2 text-center font-bold w-[3%]" style={{ borderColor: '#000000' }}>NO</th>`;
code = code.replace(noThOld, noThNew);

const namaThOld = `<th rowSpan={2} className="border border-black p-2 text-center font-bold" style={{ borderColor: '#000000' }}>NAMA SISWA</th>`;
const namaThNew = `<th rowSpan={2} className="border border-black p-2 text-center font-bold w-[18%]" style={{ borderColor: '#000000' }}>NAMA SISWA</th>`;
code = code.replace(namaThOld, namaThNew);

const catatanThOld = `<th rowSpan={2} className="border border-black p-1 text-center font-bold" style={{ borderColor: '#000000' }}>CATATAN</th>`;
const catatanThNew = `<th rowSpan={2} className="border border-black p-1 text-center font-bold w-[25%]" style={{ borderColor: '#000000' }}>CATATAN</th>`;
code = code.replace(catatanThOld, catatanThNew);

// Hari aktif
const aktifThOld = `<th rowSpan={2} className="border border-black p-1 text-center font-bold" style={{ borderColor: '#000000' }}>HARI AKTIF SISWA / BULAN</th>`;
const aktifThNew = `<th rowSpan={2} className="border border-black p-1 text-center font-bold w-[8%]" style={{ borderColor: '#000000' }}>HARI AKTIF SISWA / BULAN</th>`;
code = code.replace(aktifThOld, aktifThNew);

fs.writeFileSync('src/components/MonthlyRecap.tsx', code);
console.log('Patched print layout for PDF/Image!');
