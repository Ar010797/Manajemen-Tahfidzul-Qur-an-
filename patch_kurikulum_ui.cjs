const fs = require('fs');
let code = fs.readFileSync('src/components/AdminProgressReport.tsx', 'utf-8');

const regexJSX = /<thead className="bg-stone-100 text-stone-900 border-b border-stone-200">[\s\S]*?<\/thead>[\s\S]*?<tbody className="divide-y divide-stone-100 bg-white">[\s\S]*?\{TARGET_KURIKULUM\.map\(\(item, i\) => \([\s\S]*?<tr key=\{i\} className="hover:bg-stone-50 transition-colors">[\s\S]*?<td className="px-4 py-3 font-bold text-stone-800 border-r border-stone-100">\{item.grade\}<\/td>[\s\S]*?\{item.full_text \? \([\s\S]*?<td className="px-4 py-3 text-center italic text-stone-600 bg-stone-50\/50" colSpan=\{4\}>\{item.full_text\}<\/td>[\s\S]*?\) : \([\s\S]*?<>[\s\S]*?<td className="px-4 py-3 border-r border-stone-100 bg-emerald-50\/30 text-emerald-900 text-center">\{item.s1_hafalan\}<\/td>[\s\S]*?<td className="px-4 py-3 border-r border-stone-100 bg-blue-50\/30 text-blue-900 text-center">\{item.s1_ummi\}<\/td>[\s\S]*?<td className="px-4 py-3 border-r border-stone-100 bg-emerald-50\/30 text-emerald-900 text-center">\{item.s2_hafalan\}<\/td>[\s\S]*?<td className="px-4 py-3 bg-blue-50\/30 text-blue-900 text-center">\{item.s2_ummi\}<\/td>[\s\S]*?<\/>[\s\S]*?\)\}[\s\S]*?<\/tr>[\s\S]*?\)\}[\s\S]*?<\/tbody>/;

const replacementJSX = `<thead className="bg-stone-100 text-stone-900 border-b border-stone-200">
                   <tr>
                     <th className="px-4 py-3 font-bold border-r border-stone-200 w-[20%]">Kelas</th>
                     <th className="px-4 py-3 font-bold border-r border-stone-200 text-center">Target Hafalan Tahunan</th>
                     <th className="px-4 py-3 font-bold text-center">Target Ummi/Tilawah Tahunan</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-stone-100 bg-white">
                    {TARGET_KURIKULUM.map((item, i) => (
                      <tr key={i} className="hover:bg-stone-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-stone-800 border-r border-stone-100">{item.grade}</td>
                        {item.full_text ? (
                          <td className="px-4 py-3 text-center italic text-stone-600 bg-stone-50/50" colSpan={2}>{item.full_text}</td>
                        ) : (
                          <>
                            <td className="px-4 py-3 border-r border-stone-100 bg-emerald-50/30 text-emerald-900 text-center font-semibold">{item.hafalan}</td>
                            <td className="px-4 py-3 bg-blue-50/30 text-blue-900 text-center font-semibold">{item.ummi}</td>
                          </>
                        )}
                      </tr>
                    ))}
                 </tbody>`;

code = code.replace(regexJSX, replacementJSX);
fs.writeFileSync('src/components/AdminProgressReport.tsx', code);
