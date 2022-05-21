const path = require('path');
const { stdout } = require('process');
const { mkdir, readdir, copyFile, rm } = require('fs/promises');
const filesFolder = path.join(__dirname, 'files');
const filesCopyFolder = path.join(__dirname, 'files-copy');

async function createCopyFiles() {
  try {
    await removeCopyFiles();
    await mkdir(filesCopyFolder, { recursive: true });
    const files = await readdir(filesFolder, { withFileTypes: true });

    for (const file of files) {
      const fileName = path.join(filesFolder, file.name);
      const fileCopyName = path.join(filesCopyFolder, file.name);
      await copyFile(fileName, fileCopyName);
    }

    stdout.write('Copied in files-copy\n');
  } catch (err) {
    throw err;
  }
}

async function removeCopyFiles() {
  await rm(filesCopyFolder, { recursive: true, force: true });
}

createCopyFiles();