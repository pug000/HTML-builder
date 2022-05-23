const fs = require('fs');
const path = require('path');
const { stdout } = require('process');
const { readdir } = require('fs/promises');
const bundleFile = path.join(__dirname, 'project-dist', 'bundle.css');
const stylesFolder = path.join(__dirname, 'styles');

async function createBundleFile() {
  const writeStream = fs.createWriteStream(bundleFile, 'utf-8');
  stdout.write('bundle.css file has been created\n');
  return writeStream;
}

async function mergeStylesInBundleFile() {
  try {
    const files = await readdir(stylesFolder, { withFileTypes: true });
    const writeStream = await createBundleFile();

    for (const file of files) {
      const readStream = fs.createReadStream(path.join(stylesFolder, file.name), 'utf-8');
      const format = path.extname(path.join(stylesFolder, file.name)).replace(/\.*/, '');

      if (format.includes('css')) {
        let data = '';
        readStream.on('data', (chunk) => data += chunk);
        readStream.on('end', () => writeStream.write(data));
      }
    }
  } catch (err) {
    throw new err;
  }
}

mergeStylesInBundleFile();