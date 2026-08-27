const normalize = (s: string) => s.toLowerCase()
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
    .replace(/([a-z])\1+/g, '$1') // remove double letters
    .replace(/aw/g, 'au'); 

console.log('At-Takaathur ->', normalize('At-Takaathur'));
console.log('At Takatsur ->', normalize('At Takatsur'));
console.log('Al-Asr ->', normalize('Al-Asr'));
console.log('Al Ashr ->', normalize('Al Ashr'));
console.log('Al-Kawthar ->', normalize('Al-Kawthar'));
console.log('Al Kautsar ->', normalize('Al Kautsar'));
console.log('Al-Masad ->', normalize('Al-Masad'));
console.log('Al Lahab ->', normalize('Al Lahab'));

