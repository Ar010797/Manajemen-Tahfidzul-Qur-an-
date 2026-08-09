const https = require('https');

https.get('https://firestore.googleapis.com/v1/projects/laughing-azimuth-807pf/databases/(default)/documents/syncs', (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
     const json = JSON.parse(data);
     const docs = json.documents || [];
     console.log("Found default", docs.length, "documents");
  });
});
