const fs = require('node:fs');
const path = require('node:path');

const filePath = path.join(__dirname, 'text.txt');

const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });

readStream.on('data', (chunk) => console.log(chunk));
