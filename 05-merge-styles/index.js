const fs = require('fs');
const path = require('path');
const { stdout } = require('process');
const { readdir } = require('fs/promises');
const bundleFile = path.join(__dirname, 'project-dist', 'bundle.css');
const bundleFileTest = path.join(__dirname, 'test-files', 'bundle.css');
const stylesFolder = path.join(__dirname, 'styles');
const stylesFolderTest = path.join(__dirname, 'test-files', 'styles');

async function createBundleFile() {
  const writeStream = fs.createWriteStream(bundleFile, 'utf-8');
  stdout.write('bundle.css file has been created\n');
  return writeStream;
}

async function createTestBundleFile() {
  const writeStream = fs.createWriteStream(bundleFileTest, 'utf-8');
  stdout.write('bundle.css test file has been created\n');
  return writeStream;
}

async function mergeStylesInBundleFile() {
  try {
    const files = await readdir(stylesFolder, { withFileTypes: true });
    const writeStream = await createBundleFile();
    const filesTest = await readdir(stylesFolderTest, { withFileTypes: true });
    const writeStreamTest = await createTestBundleFile();

    for (const file of files) {
      const readStream = fs.createReadStream(path.join(stylesFolder, file.name), 'utf-8');
      const format = path.extname(path.join(stylesFolder, file.name)).replace(/\.*/, '');

      if (format.includes('css')) {
        let data = '';
        readStream.on('data', (chunk) => data += chunk);
        readStream.on('end', () => writeStream.write(data));
      }
    }

    for (const file of filesTest) {
      const readStreamTest = fs.createReadStream(path.join(stylesFolderTest, file.name), 'utf-8');
      const formatTest = path.extname(path.join(stylesFolderTest, file.name)).replace(/\.*/, '');

      if (formatTest.includes('css')) {
        let dataTest = '';
        readStreamTest.on('data', (chunk) => dataTest += chunk);
        readStreamTest.on('end', () => writeStreamTest.write(dataTest));
      }
    }
    stdout.write('styles has been merged into bundle.css file\n');
  } catch (err) {
    throw err;
  }
}

mergeStylesInBundleFile();