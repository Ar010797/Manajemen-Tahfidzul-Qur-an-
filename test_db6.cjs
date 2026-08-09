const https = require('https');

https.get('https://firestore.googleapis.com/v1/projects/laughing-azimuth-807pf/databases/ai-studio-0f5b8c0c-d117-47a7-abad-d37d1ffb8ba5/documents/guru_sync_data', (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
     const json = JSON.parse(data);
     const docs = json.documents || [];
     console.log("Found", docs.length, "documents");
     if (docs.length > 0) {
        let first = docs[0];
        console.log("Doc name:", first.name);
     }
  });
});
