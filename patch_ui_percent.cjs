const fs = require('fs');
let code = fs.readFileSync('src/components/AdminProgressReport.tsx', 'utf-8');

// Update Data Rinci Seluruh Siswa table headers
let searchHead = `<th className="px-4 py-3 font-bold border-b text-stone-900 text-center">Status Ummi</th>
                     <th className="px-4 py-3 font-bold border-b text-stone-900 text-center">Status Hafalan</th>`;
let replaceHead = `<th className="px-4 py-3 font-bold border-b text-stone-900 text-center">% Ummi</th>
                     <th className="px-4 py-3 font-bold border-b text-stone-900 text-center">Status Ummi</th>
                     <th className="px-4 py-3 font-bold border-b text-stone-900 text-center">% Hafalan</th>
                     <th className="px-4 py-3 font-bold border-b text-stone-900 text-center">Status Hafalan</th>`;
code = code.replace(searchHead, replaceHead);

// Update Data Rinci Seluruh Siswa table rows
let searchRow = `<td className="px-4 py-2 text-center">
                           <span className={\`px-2 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider \${s.ummiStatus === 'Tercapai' ? 'bg-emerald-100 text-emerald-700' : s.ummiStatus === 'Belum Tercapai' ? 'bg-rose-100 text-rose-700' : 'bg-stone-100 text-stone-500'}\`}>
                             {s.ummiStatus}
                           </span>
                        </td>
                        <td className="px-4 py-2 text-center">
                           <span className={\`px-2 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider \${s.hafalanStatus === 'Tercapai' ? 'bg-emerald-100 text-emerald-700' : s.hafalanStatus === 'Belum Tercapai' ? 'bg-rose-100 text-rose-700' : 'bg-stone-100 text-stone-500'}\`}>
                             {s.hafalanStatus}
                           </span>
                        </td>`;
let replaceRow = `<td className="px-4 py-2 text-center font-bold text-stone-700">
                           {s.ummiPercentage}%
                        </td>
                        <td className="px-4 py-2 text-center">
                           <span className={\`px-2 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider \${s.ummiStatus === 'Tercapai' ? 'bg-emerald-100 text-emerald-700' : s.ummiStatus === 'Belum Tercapai' ? 'bg-rose-100 text-rose-700' : 'bg-stone-100 text-stone-500'}\`}>
                             {s.ummiStatus}
                           </span>
                        </td>
                        <td className="px-4 py-2 text-center font-bold text-stone-700">
                           {s.hafalanPercentage}%
                        </td>
                        <td className="px-4 py-2 text-center">
                           <span className={\`px-2 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider \${s.hafalanStatus === 'Tercapai' ? 'bg-emerald-100 text-emerald-700' : s.hafalanStatus === 'Belum Tercapai' ? 'bg-rose-100 text-rose-700' : 'bg-stone-100 text-stone-500'}\`}>
                             {s.hafalanStatus}
                           </span>
                        </td>`;
code = code.replace(searchRow, replaceRow);

fs.writeFileSync('src/components/AdminProgressReport.tsx', code);
