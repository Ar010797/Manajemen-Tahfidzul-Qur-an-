const fs = require('fs');
let code = fs.readFileSync('src/lib/quranUtils.ts', 'utf-8');

const regex = /const normalize = \(s: string\) => s\.toLowerCase\(\)[\s\S]*?\.replace\(\/aw\/g, 'au'\);/;
const replace = `const normalize = (s: string) => s.toLowerCase()
    .replace(/qolam/g, 'qalam')
    .replace(/takatsur/g, 'takaathur')
    .replace(/muthoffifin/g, 'mutaffifin')
    .replace(/muthaffifin/g, 'mutaffifin')
    .replace(/ghosiyah/g, 'ghaashiya')
    .replace(/ghoshiyah/g, 'ghaashiya')
    .replace(/waqiah/g, 'waaqia')
    .replace(/imron/g, 'imraan')
    .replace(/maidah/g, 'maaida')
    .replace(/baqoroh/g, 'baqara')
    .replace(/syuro/g, 'shura')
    .replace(/duha/g, 'dhuhaa')
    .replace(/thoha/g, 'taahaa')
    .replace(/jin/g, 'jinn')
    .replace(/ashr/g, 'asr')
    .replace(/kautsar/g, 'kawthar')
    .replace(/lahab/g, 'masad')
    .replace(/haqqoh/g, 'haaqqa')
    .replace(/[^a-z]/g, '')
    .replace(/ee/g, 'i')
    .replace(/oo/g, 'u')
    .replace(/o/g, 'a')
    .replace(/ah$/g, 'a')
    .replace(/thth/g, 'ts')
    .replace(/sh/g, 'sy')
    .replace(/dh/g, 'dz')
    .replace(/th/g, 't')
    .replace(/kh/g, 'k')
    .replace(/gh/g, 'g')
    .replace(/q/g, 'k')
    .replace(/c/g, 'k')
    .replace(/([a-z])\\1+/g, '$1') // remove double letters
    .replace(/aw/g, 'au');`;

code = code.replace(regex, replace);
fs.writeFileSync('src/lib/quranUtils.ts', code);
console.log('Patched normalizer with all mappings');
