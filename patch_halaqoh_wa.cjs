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
        const isGoodGrade = ['L', 'CL'].includes(d.grade);
        let homework = '';
        if (isGoodGrade) {
          const nextVerse = d.verse_end ? parseInt(d.verse_end) + 1 : (parseInt(d.verse_start) + 1 || '');
          homework = \`Lanjut ayat \${nextVerse}\`;
        } else {
          homework = \`Mengulang ayat \${d.verse_start}\${d.verse_end ? '-' + d.verse_end : ''}\`;
        }
        depositNotes.push(\`- Hafalan: \${d.surah} (\${d.verse_start}\${d.verse_end ? '-' + d.verse_end : ''}) | Nilai: \${d.grade} | PR: \${homework}\`);
      }
      
      if (ummiData && ummiData.details && ummiData.details.grade) {
        hasData = true;
        const d = ummiData.details;
        const isGoodGrade = ['A', 'B'].includes(d.grade);
        let homework = '';
        if (isGoodGrade) {
          const nextPage = d.page_end ? parseInt(d.page_end) + 1 : (parseInt(d.page_start) + 1 || '');
          homework = \`Lanjut hlm \${nextPage}\`;
        } else {
          homework = \`Mengulang hlm \${d.page_start}\${d.page_end ? '-' + d.page_end : ''}\`;
        }
        depositNotes.push(\`- Ummi: Jilid \${d.level} Hlm \${d.page_start}\${d.page_end ? '-' + d.page_end : ''} | Nilai: \${d.grade} | PR: \${homework}\`);
      }
      
      if (tilawahData && tilawahData.details && tilawahData.details.grade) {
        hasData = true;
        const d = tilawahData.details;
        const isGoodGrade = ['A', 'B'].includes(d.grade);
        let homework = '';
        if (isGoodGrade) {
          const nextVerse = d.verse_end ? parseInt(d.verse_end) + 1 : (parseInt(d.verse_start) + 1 || '');
          homework = \`Lanjut ayat \${nextVerse}\`;
        } else {
          homework = \`Mengulang ayat \${d.verse_start}\${d.verse_end ? '-' + d.verse_end : ''}\`;
        }
        depositNotes.push(\`- Tilawah: Juz \${d.juz} \${d.surah} (\${d.verse_start}\${d.verse_end ? '-' + d.verse_end : ''}) | Nilai: \${d.grade} | PR: \${homework}\`);
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

const oldFuncRegex = /const handleShareHalaqohToWhatsApp = \(halaqohName: string, studentsList: any\[\]\) => \{[\s\S]*?window\.open\(whatsappUrl, '_blank'\);\s*\};/m;

code = code.replace(oldFuncRegex, shareHalaqohFunc.trim());

fs.writeFileSync(file, code);
console.log('Patched DailyInput.tsx');
