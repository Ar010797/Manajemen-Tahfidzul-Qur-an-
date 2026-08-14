const fs = require('fs');
let code = fs.readFileSync('src/components/DailyInput.tsx', 'utf-8');

const checkboxRegex = /<div className="flex items-center gap-3 mt-4 bg-white p-3 rounded-xl border border-stone-200">[\s\S]*?<\/div>/;

const statusDropdown = `<div className="space-y-2.5 mt-4">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Status Hafalan</label>
                        <select 
                          className="w-full bg-white border border-stone-200/60 rounded-xl px-5 py-4 text-base font-semibold focus:outline-none focus:ring-4 ring-stone-900/5 transition-all appearance-none cursor-pointer"
                          value={details.status || (details.is_ujian ? 'Ujian' : 'Progressing')}
                          onChange={e => {
                            const val = e.target.value;
                            setDetails({...details, status: val, is_ujian: val === 'Ujian'});
                          }}
                        >
                          <option value="Progressing">Progressing (Ziyadah)</option>
                          <option value="Hafalan">Hafalan (Muroja'ah)</option>
                          <option value="Ujian">Ujian Surah</option>
                        </select>
                      </div>`;

code = code.replace(checkboxRegex, statusDropdown);
fs.writeFileSync('src/components/DailyInput.tsx', code);
console.log('Patched UI');
