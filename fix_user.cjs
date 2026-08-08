const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/\{user\.username\[0\]\.toUpperCase\(\)\}/g, "{user.username ? user.username[0].toUpperCase() : 'U'}");
code = code.replace(/<p className="text-sm font-bold text-stone-900 truncate tracking-tight">\{user\.username\}<\/p>/g, "<p className=\"text-sm font-bold text-stone-900 truncate tracking-tight\">{user.username || 'User'}</p>");

fs.writeFileSync(file, code);
console.log('Fixed user username');
