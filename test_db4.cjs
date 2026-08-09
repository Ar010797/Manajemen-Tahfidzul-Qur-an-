const https = require('https');

https.get('https://firestore.googleapis.com/v1/projects/laughing-azimuth-807pf/databases/ai-studio-0f5b8c0c-d117-47a7-abad-d37d1ffb8ba5/documents/syncs', (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
     const json = JSON.parse(data);
     const docs = json.documents || [];
     console.log("Found", docs.length, "documents");
     
     let allStudents = [];
     let allDaily = [];
     
     docs.forEach(doc => {
       const fields = doc.fields;
       const dataStr = fields.data ? fields.data.stringValue : '';
       if (dataStr) {
         try {
           const parsed = JSON.parse(dataStr);
           if (parsed.students) allStudents.push(...parsed.students);
           if (parsed.daily_deposits) allDaily.push(...parsed.daily_deposits);
         } catch(e) {}
       }
     });
     
     console.log("Total students parsed:", allStudents.length);
     
     const k2 = allStudents.filter(s => (s.halaqoh_name || '').toLowerCase().includes('ikhwan 2 b'));
     console.log("Halaqoh ikhwan 2 B students:", k2.length);
     
     k2.forEach(s => {
       const h = allDaily.filter(d => d.student_id === s.id && d.type === 'hafalan');
       console.log("Student", s.name, "Hafalans:", h.map(x => x.details.surah).join(', '));
       const max = Math.max(...h.map(x => {
          // simple mimic of getHighestSurahIndex
          let txt = x.details.surah.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (txt.includes('annaba')) return 1;
          if (txt.includes('alburuj')) return 8;
          if (txt.includes('alfajr')) return 12;
          return 0;
       }));
       console.log("  Max mimic:", max);
     });
  });
});
