const fs = require('fs');
const file = 'src/components/InstitutionProfile.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/batch\.set\(chunkDoc, \{\n               chunkData: compressedData\.substring\(i \* CHUNK_SIZE, \(i \+ 1\) \* CHUNK_SIZE\),\n               chunkIndex: i\n           \}\)\);/g, "batch.set(chunkDoc, {\n               chunkData: compressedData.substring(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE),\n               chunkIndex: i\n           });");

code = code.replace(/batch\.set\(doc\(db, 'syncs', usernameId\), \{\n           username,\n           isCompressed: true,\n           isChunked: true,\n           numChunks,\n           updatedAt: new Date\(\)\.toISOString\(\)\n        \}\)\);/g, "batch.set(doc(db, 'syncs', usernameId), {\n           username,\n           isCompressed: true,\n           isChunked: true,\n           numChunks,\n           updatedAt: new Date().toISOString()\n        });");

fs.writeFileSync(file, code);
console.log('Fixed InstitutionProfile 6');
