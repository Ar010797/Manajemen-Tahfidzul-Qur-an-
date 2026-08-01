const fs = require('fs');
const file = 'src/components/AdminProgressReport.tsx';
let code = fs.readFileSync(file, 'utf8');

const oldTotalRow = `
                    {halaqohAchievement.length > 0 && (
                      <tr className="bg-stone-100/80 font-bold border-t-2 border-stone-200 text-stone-900">
                        <td className="px-4 py-3 text-right">Total Keseluruhan</td>
                        <td className="px-4 py-3 text-center border-l border-stone-200">{grandTotal.totalStudents}</td>
                        <td className="px-4 py-3 text-center text-emerald-700 border-l border-stone-200">{grandTotal.achievedHafalan}</td>
                        <td className="px-4 py-3 text-center text-rose-700 border-l border-stone-100">{grandTotal.unachievedHafalan}</td>
                        <td className="px-4 py-3 text-center text-stone-900 border-l border-stone-100">{grandTotal.percentageHafalan}%</td>
                        <td className="px-4 py-3 text-center text-emerald-700 border-l border-stone-200">{grandTotal.achievedUmmi}</td>
                        <td className="px-4 py-3 text-center text-rose-700 border-l border-stone-100">{grandTotal.unachievedUmmi}</td>
                        <td className="px-4 py-3 text-center text-stone-900 border-l border-stone-100">{grandTotal.percentageUmmi}%</td>
                      </tr>
                    )}
`;

code = code.replace(oldTotalRow, "");

const insertTarget = `
                    {halaqohAchievement.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-stone-400">Belum ada data pencapaian.</td>
                      </tr>
                    )}
`;

code = code.replace(insertTarget, insertTarget + oldTotalRow);

fs.writeFileSync(file, code);
