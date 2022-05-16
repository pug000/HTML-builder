const fs = require('fs');
const path = require('path');
const process = require('process');
const readline = require('readline');
const { stdin: input, stdout: output } = process;
const rl = readline.createInterface({ input, output });
const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

output.write('Write text to file:');

rl.on('line', (input) => {
  input === 'exit' ? process.exit() : writeStream.write(input + '\r\n');
})

process.on('exit', () => {
  output.write('Completed text in text.txt file');
  rl.close();
})