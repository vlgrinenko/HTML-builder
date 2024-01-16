const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Enter text: \n',
});
const filePath = path.join(__dirname, '02-write-file.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'as' });

rl.prompt();
rl.on('line', (input) => {
  if (input === 'exit') {
    console.log('Good bye!!!');
    rl.close();
  } else {
    writeStream.write(input + '\n');
  }
});

rl.on('SIGINT', () => {
  console.log('Good bye!!!');
  rl.close();
});
