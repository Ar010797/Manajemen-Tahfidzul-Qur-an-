const https = require('https');
https.get('https://firestore.googleapis.com/v1/projects/laughing-azimuth-807pf/databases/ai-studio-0f5b8c0c-d117-47a7-abad-d37d1ffb8ba5/documents/syncs', (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
     const json = JSON.parse(data);
     const docs = json.documents || [];
     console.log("Found", docs.length, "documents");
     
     docs.forEach(doc => {
       const fields = doc.fields;
       const username = fields.username ? fields.username.stringValue : 'unknown';
       const dataStr = fields.data ? fields.data.stringValue : '';
       
       if (dataStr) {
         try {
           const parsed = JSON.parse(dataStr);
           console.log("Guru:", username);
           // Let's print the students and their last deposits for class 2 and 4
           const students = parsed.students || [];
           const daily = parsed.daily_deposits || [];
           
           students.forEach(s => {
             const h = (s.halaqoh_name || '').toLowerCase();
             if (h.includes('kelas 2') || h.includes('kelas 4')) {
               const hafalan = daily.filter(d => d.student_id === s.id && d.type === 'hafalan').sort((a,b) => b.date.localeCompare(a.date));
               if (hafalan.length > 0) {
                 console.log("  Student:", s.name, "| Class:", s.halaqoh_name, "| Last Hafalan:", hafalan[0].details.surah);
               } else {
                 console.log("  Student:", s.name, "| Class:", s.halaqoh_name, "| No Hafalan");
               }
             }
           });
         } catch(e) {}
       }
     });
  });
});
