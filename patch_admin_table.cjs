const fs = require('fs');
let code = fs.readFileSync('src/components/AdminProgressReport.tsx', 'utf-8');

const theadOld = `<thead className="bg-white sticky top-0 shadow-sm z-10">
                   <tr>
                     <th className="px-4 py-3 font-bold border-b text-stone-900">Nama Siswa</th>
                     <th className="px-4 py-3 font-bold border-b text-stone-900">Guru</th>
                     <th className="px-4 py-3 font-bold border-b text-stone-900">Progress Ummi/Quran</th>
                     <th className="px-4 py-3 font-bold border-b text-stone-900">Hafalan Terakhir</th>
                   </tr>
                 </thead>`;

const theadNew = `<thead className="bg-white sticky top-0 shadow-sm z-10">
                   <tr>
                     <th className="px-4 py-3 font-bold border-b text-stone-900">Nama Siswa</th>
                     <th className="px-4 py-3 font-bold border-b text-stone-900">Guru</th>
                     <th className="px-4 py-3 font-bold border-b text-stone-900">Progress Ummi/Quran</th>
                     <th className="px-4 py-3 font-bold border-b text-stone-900">Hafalan Terakhir</th>
                     <th className="px-4 py-3 font-bold border-b text-stone-900 text-center">Status Ummi</th>
                     <th className="px-4 py-3 font-bold border-b text-stone-900 text-center">Status Hafalan</th>
                   </tr>
                 </thead>`;

const tbodyOld = `<td className="px-4 py-2 text-stone-600 font-medium">{s.hafalan}</td>
                      </tr>`;

const tbodyNew = `<td className="px-4 py-2 text-stone-600 font-medium">{s.hafalan}</td>
                        <td className="px-4 py-2 text-center">
                           <span className={\`px-2 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider \${s.ummiStatus === 'Tercapai' ? 'bg-emerald-100 text-emerald-700' : s.ummiStatus === 'Belum Tercapai' ? 'bg-rose-100 text-rose-700' : 'bg-stone-100 text-stone-500'}\`}>
                             {s.ummiStatus}
                           </span>
                        </td>
                        <td className="px-4 py-2 text-center">
                           <span className={\`px-2 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider \${s.hafalanStatus === 'Tercapai' ? 'bg-emerald-100 text-emerald-700' : s.hafalanStatus === 'Belum Tercapai' ? 'bg-rose-100 text-rose-700' : 'bg-stone-100 text-stone-500'}\`}>
                             {s.hafalanStatus}
                           </span>
                        </td>
                      </tr>`;

code = code.replace(theadOld, theadNew);
code = code.replace(new RegExp(tbodyOld.replace(/[.*+?^$\{}()|[\]\\]/g, '\\$&'), 'g'), tbodyNew);

// PDF Table
const pdfHeaderOld = `head: [['Nama Siswa', 'Guru', 'Progress Ummi/Quran', 'Hafalan Terakhir']],`;
const pdfHeaderNew = `head: [['Nama Siswa', 'Guru', 'Progress Ummi/Quran', 'Hafalan Terakhir', 'Status Ummi', 'Status Hafalan']],`;

const pdfBodyOld = `const studentsBody = studentsProgress.map((s) => [
           s.name, 
           s.guru, 
           s.level, 
           s.hafalan || '-'
        ]);`;
const pdfBodyNew = `const studentsBody = studentsProgress.map((s) => [
           s.name, 
           s.guru, 
           s.level, 
           s.hafalan || '-',
           s.ummiStatus,
           s.hafalanStatus
        ]);`;

code = code.replace(pdfHeaderOld, pdfHeaderNew);
code = code.replace(pdfBodyOld, pdfBodyNew);

// Adjust colSpan in PDF empty row
const pdfColSpanOld = `<td colSpan={4} className="px-4 py-8 text-center text-stone-400">Belum ada data siswa.</td>`;
const pdfColSpanNew = `<td colSpan={6} className="px-4 py-8 text-center text-stone-400">Belum ada data siswa.</td>`;
code = code.replace(pdfColSpanOld, pdfColSpanNew);

fs.writeFileSync('src/components/AdminProgressReport.tsx', code);
