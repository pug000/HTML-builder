const fs = require('fs');
const path = require('path');
const { stdout } = require('process');
const { readdir } = require('fs/promises');


async function readDir() {
  try {
    const files = await readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true });
    for (const file of files) {
      fs.stat(path.join(__dirname, 'secret-folder', file.name), (err, stats) => {
        if (err) {
          throw err;
        } else if (stats.isFile()) {
          const fileName = file.name.replace(/\..*/, '');
          const format = path.extname(path.join(__dirname, 'secret-folder', file.name)).replace(/\.*/, '');
          const kbSize = (stats.size / 1024).toFixed(3);
          stdout.write(`${fileName} - ${format} - ${kbSize}KB \r\n`);
        }
      })
    };
  } catch (err) {
    throw err;
  }
}

readDir();