const fs = require('fs');
const file = 'src/components/AdminProgressReport.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Fix halaqoh name mapping
code = code.replace(
  "      const students = d.students || [];\n      const deposits = d.daily_deposits || [];\n\n      students.forEach((student: any) => {",
  "      const students = d.students || [];\n      const deposits = d.daily_deposits || [];\n      const halaqohs = d.halaqoh || [];\n\n      students.forEach((student: any) => {"
);

code = code.replace(
  "            halaqoh: student.halaqoh_name || 'Tanpa Halaqoh',",
  "            halaqoh: student.halaqoh_name || halaqohs.find((h: any) => h.id === student.halaqoh_id)?.name || 'Tanpa Halaqoh',"
);

// 2. Calculate grand total and add it to the table
code = code.replace(
  "    const halaqohAchievement = Object.keys(halaqohMap).map(k => ({",
  "    let totalAchievedHafalanAll = 0;\n    let totalAchievedUmmiAll = 0;\n    let totalUnachievedHafalanAll = 0;\n    let totalUnachievedUmmiAll = 0;\n    let grandTotalStudents = 0;\n\n    const halaqohAchievement = Object.keys(halaqohMap).map(k => {\n       grandTotalStudents += halaqohMap[k].total;\n       totalAchievedHafalanAll += halaqohMap[k].achievedHafalan;\n       totalAchievedUmmiAll += halaqohMap[k].achievedUmmi;\n       totalUnachievedHafalanAll += (halaqohMap[k].total - halaqohMap[k].achievedHafalan);\n       totalUnachievedUmmiAll += (halaqohMap[k].total - halaqohMap[k].achievedUmmi);\n\n       return {"
);

code = code.replace(
  "    })).sort((a,b) => b.percentageHafalan - a.percentageHafalan);",
  "    }).sort((a,b) => b.percentageHafalan - a.percentageHafalan);\n\n    const grandTotal = {\n       totalStudents: grandTotalStudents,\n       achievedHafalan: totalAchievedHafalanAll,\n       achievedUmmi: totalAchievedUmmiAll,\n       unachievedHafalan: totalUnachievedHafalanAll,\n       unachievedUmmi: totalUnachievedUmmiAll,\n       percentageHafalan: grandTotalStudents > 0 ? Math.round((totalAchievedHafalanAll / grandTotalStudents) * 100) : 0,\n       percentageUmmi: grandTotalStudents > 0 ? Math.round((totalAchievedUmmiAll / grandTotalStudents) * 100) : 0\n    };"
);

code = code.replace(
  "return { studentsProgress: studentsList, jilidStats: jilidStatsArr, hafalanStats: hafalanStatsArr, halaqohAchievement };",
  "return { studentsProgress: studentsList, jilidStats: jilidStatsArr, hafalanStats: hafalanStatsArr, halaqohAchievement, grandTotal };"
);

// Add grandTotal to destructuring
code = code.replace(
  "const { studentsProgress, jilidStats, hafalanStats, halaqohAchievement } = useMemo(() => {",
  "const { studentsProgress, jilidStats, hafalanStats, halaqohAchievement, grandTotal } = useMemo(() => {"
);

// Render grand total row
const grandTotalRow = `
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
                 </tbody>
               </table>
`;
code = code.replace(
  "                 </tbody>\n               </table>",
  grandTotalRow
);

fs.writeFileSync(file, code);
console.log('Patched AdminProgressReport.tsx');
