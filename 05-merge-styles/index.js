const fs = require('fs');
const path = require('path');
const { stdout } = require('process');
const { readdir } = require('fs/promises');

async function createBundleFile() {
  const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'), 'utf-8');
  stdout.write('bundle.css file has been created \r\n');
  return writeStream;
}

async function createTestBundleFile() {
  const writeStreamTest = fs.createWriteStream(path.join(__dirname, 'test-files', 'bundle.css'), 'utf-8');
  stdout.write('test file bundle.css has been created \r\n');
  return writeStreamTest;
}

async function mergeStylesInBundleFile() {
  try {
    const files = await readdir(path.join(__dirname, 'styles'), { withFileTypes: true });
    const writeStream = await createBundleFile();
    const filesTest = await readdir(path.join(__dirname, 'test-files', 'styles'), { withFileTypes: true });
    const writeStreamTest = await createTestBundleFile();
    for (const file of files) {
      const readStream = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8');
      const format = path.extname(path.join(__dirname, 'styles', file.name)).replace(/\.*/, '');
      if (format.includes('css')) {
        let data = '';
        readStream.on('data', (chunk) => data += chunk);
        readStream.on('end', () => writeStream.write(data));
      }
    }
    for (const file of filesTest) {
      const readStreamTest = fs.createReadStream(path.join(__dirname, 'test-files', 'styles', file.name), 'utf-8');
      const formatTest = path.extname(path.join(__dirname, 'test-files', 'styles', file.name)).replace(/\.*/, '');
      if (formatTest.includes('css')) {
        let dataTest = '';
        readStreamTest.on('data', (chunk) => dataTest += chunk);
        readStreamTest.on('end', () => writeStreamTest.write(dataTest));
      }
    }
    stdout.write('styles has been merged into bundle.css file \r\n');
  } catch (err) {
    throw err;
  }
}

mergeStylesInBundleFile();