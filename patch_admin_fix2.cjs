const fs = require('fs');
const file = 'src/components/AdminProgressReport.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "} else {\n       } else {",
  "} else {"
);

fs.writeFileSync(file, code);
