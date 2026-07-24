const fs = require('fs');
const file = 'src/services/storage.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "    coordinator_signature_size?: number;\n  };",
  "    coordinator_signature_size?: number;\n    name_mts?: string;\n    address_mts?: string;\n    logo_mts?: string;\n    principal_name_mts?: string;\n    principal_signature_mts?: string;\n    coordinator_signature_mts?: string;\n    principal_signature_size_mts?: number;\n    coordinator_signature_size_mts?: number;\n  };"
);

fs.writeFileSync(file, code);
console.log('Patched storage.ts');
