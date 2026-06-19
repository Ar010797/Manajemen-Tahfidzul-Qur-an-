const LZString = require('lz-string');
console.log('Base64:', LZString.compressToBase64('{"test":"value"}'));
console.log('UTF16:', LZString.compressToUTF16('{"test":"value"}'));
console.log('EncodedURI:', LZString.compressToEncodedURIComponent('{"test":"value"}'));
