const fs = require('fs');
let code = fs.readFileSync('src/components/AdminProgressReport.tsx', 'utf-8');

const search = `TARGET_KURIKULUM.forEach((t) => {
           if (t.full_text) {
              kurikulumBody.push([{ content: t.full_text, colSpan: 3, styles: { fontStyle: 'italic', halign: 'center' } }]);
           } else {
              kurikulumBody.push([
                 t.grade,
                 t.hafalan,
                 t.ummi
              ]);
           }
        });`;

const replacement = `TARGET_KURIKULUM.forEach((t) => {
           if (t.full_text) {
              kurikulumBody.push([t.grade, { content: t.full_text, colSpan: 2, styles: { fontStyle: 'italic', halign: 'center' } }]);
           } else {
              kurikulumBody.push([
                 t.grade,
                 t.hafalan,
                 t.ummi
              ]);
           }
        });`;

code = code.replace(search, replacement);
fs.writeFileSync('src/components/AdminProgressReport.tsx', code);
