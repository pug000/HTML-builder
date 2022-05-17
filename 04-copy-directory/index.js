const path = require('path');
const { stdout } = require('process');
const { mkdir, readdir, copyFile, rm } = require('fs/promises');

async function createCopyFiles() {
  try {
    await removeCopyFiles();
    await mkdir(path.join(__dirname, 'files-copy'), { recursive: true });
    const files = await readdir(path.join(__dirname, 'files'), { withFileTypes: true });
    for (const file of files) {
      await copyFile(path.join(__dirname, 'files', file.name), path.join(__dirname, 'files-copy', file.name));
    }
    stdout.write('Copied in files-copy \r\n');
  } catch (err) {
    throw err;
  }
}

async function removeCopyFiles() {
  await rm(path.join(__dirname, 'files-copy'), { recursive: true, force: true });
}

createCopyFiles();
