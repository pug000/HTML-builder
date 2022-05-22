const fs = require('fs');
const path = require('path');
const { stdout } = require('process');
const { readdir } = require('fs/promises');
const secretFolder = path.join(__dirname, 'secret-folder');


async function readDir() {
  try {
    const files = await readdir(secretFolder, { withFileTypes: true });

    for (const file of files) {
      const secretFile = path.join(secretFolder, file.name);
      fs.stat(secretFile, (err, stats) => {

        if (err) {
          throw err;
        } else if (stats.isFile()) {
          const fileName = file.name.replace(/\..*/, '');
          const format = path.extname(secretFile).replace(/\.*/, '');
          const kbSize = (stats.size / 1024).toFixed(3);
          stdout.write(`${fileName} - ${format} - ${kbSize}KB \n`);
        }
      });
    }
  } catch (err) {
    throw new err;
  }
}

readDir();