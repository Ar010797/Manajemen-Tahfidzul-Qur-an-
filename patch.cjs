const fs = require('fs');
const file = 'src/components/DailyInput.tsx';
let code = fs.readFileSync(file, 'utf8');

const shareHalaqohFunc = `
  const handleShareHalaqohToWhatsApp = (halaqohName: string, studentsList: any[]) => {
    const institution = storage.getInstitution();
    
    let segments = [];
    let hasAnyData = false;

    studentsList.forEach((student, index) => {
      const hafalanData = storage.getDeposit(student.id, 'hafalan', date);
      const ummiData = storage.getDeposit(student.id, 'ummi', date);
      const tilawahData = storage.getDeposit(student.id, 'tilawah', date);
      
      let studentText = \`\${index + 1}. *Ananda \${student.name}*\`;
      let hasData = false;
      let depositNotes = [];

      if (hafalanData && hafalanData.details && hafalanData.details.grade) {
        hasData = true;
        const d = hafalanData.details;
        depositNotes.push(\`- Hafalan: \${d.surah} (\${d.verse_start}\${d.verse_end ? '-' + d.verse_end : ''}) - Nilai: \${d.grade}\`);
      }
      
      if (ummiData && ummiData.details && ummiData.details.grade) {
        hasData = true;
        const d = ummiData.details;
        depositNotes.push(\`- Ummi: Jilid \${d.level} Hlm \${d.page_start}\${d.page_end ? '-' + d.page_end : ''} - Nilai: \${d.grade}\`);
      }
      
      if (tilawahData && tilawahData.details && tilawahData.details.grade) {
        hasData = true;
        const d = tilawahData.details;
        depositNotes.push(\`- Tilawah: Juz \${d.juz} Surah \${d.surah} (\${d.verse_start}\${d.verse_end ? '-' + d.verse_end : ''}) - Nilai: \${d.grade}\`);
      }
      
      if (hasData) {
        hasAnyData = true;
        segments.push(studentText + '\\n' + depositNotes.join('\\n'));
      }
    });

    if (!hasAnyData) {
      alert('Belum ada data setoran yang disimpan untuk halaqoh ini pada tanggal ini.');
      return;
    }

    const message = \`*LAPORAN SETORAN HARIAN HALAQOH*
*\${institution.name}*

Assalamu'alaikum Warahmatullahi Wabarakatuh,

Ayah/Bunda yang dirahmati Allah, berikut adalah laporan perkembangan setoran ananda di Halaqoh *\${halaqohName}* pada hari ini:

📅 Tanggal: \${format(new Date(date), 'dd MMMM yyyy')}

\${segments.join('\\n\\n')}

Mohon bimbingan dan motivasinya di rumah agar ananda semakin semangat dalam menghafal dan belajar Al-Qur'an.
Semoga Allah memudahkan langkah kita dalam mendidik generasi Qur'ani.

Wassalamu'alaikum Warahmatullahi Wabarakatuh,
Syukron, Jazakumullahu Khairan.

Ust/Ustzh: \${institution.halaqoh_teacher_name || '-'}\`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = \`https://wa.me/?text=\${encodedMessage}\`;
    window.open(whatsappUrl, '_blank');
  };
`;

code = code.replace(
  "    window.open(whatsappUrl, '_blank');\n  };\n\n  const [isSaving", 
  "    window.open(whatsappUrl, '_blank');\n  };\n" + shareHalaqohFunc + "\n  const [isSaving"
);

const newHeader = `
              <div className="flex items-center justify-between px-1">
                <h4 className="text-[11px] font-display font-black text-stone-400 uppercase tracking-widest">
                  {halaqohName}
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShareHalaqohToWhatsApp(halaqohName, halaqohStudents as any[])}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 rounded-lg text-[10px] font-bold border border-green-200 transition-colors shadow-sm"
                    title="Kirim ke Grup WA"
                  >
                    <MessageCircle size={12} /> WA Grup
                  </button>
                  <span className="text-[10px] font-black bg-stone-50 text-stone-400 px-2.5 py-0.5 rounded-lg border border-stone-100">
                    {(halaqohStudents as any[]).length}
                  </span>
                </div>
              </div>
`;

const oldHeaderRegex = /<div className="flex items-center justify-between px-1">\s*<h4 className="text-\[11px\] font-display font-black text-stone-400 uppercase tracking-widest">\s*\{halaqohName\}\s*<\/h4>\s*<span className="text-\[10px\] font-black bg-stone-50 text-stone-400 px-2\.5 py-0\.5 rounded-lg border border-stone-100">\s*\{\(halaqohStudents as any\[\]\)\.length\}\s*<\/span>\s*<\/div>/g;

code = code.replace(oldHeaderRegex, newHeader.trim());

fs.writeFileSync(file, code);
console.log('Patched DailyInput.tsx');
