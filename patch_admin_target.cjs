const fs = require('fs');
const file = 'src/components/AdminProgressReport.tsx';
let code = fs.readFileSync(file, 'utf8');

const targetHeaderRegex = /<h3 className="font-bold text-stone-800 text-sm">Persentase Pencapaian Target Per Kelas \/ Halaqoh<\/h3>\s*<\/div>/;

const barChartCode = `
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
                       <Tooltip cursor={{ fill: '#f5f5f4' }} formatter={(value: any, name: any) => [\`\${value}%\`, name === 'percentageHafalan' ? 'Target Hafalan' : 'Target Ummi']} labelStyle={{color: '#1c1917', fontWeight: 'bold'}} />
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
`;

code = code.replace(targetHeaderRegex, barChartCode.trim());

fs.writeFileSync(file, code);
console.log('Patched AdminProgressReport.tsx');
