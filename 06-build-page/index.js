const fs = require('fs');
const path = require('path');
const { readdir, mkdir, copyFile, rm, readFile } = require('fs/promises');

class BuildPage {
  constructor() {
    this.dist = path.join(__dirname, 'project-dist');
    this.assets = path.join(__dirname, 'assets');
    this.assetsCopy = path.join(this.dist, 'assets');
    this.stylesFolder = path.join(__dirname, 'styles');
    this.style = path.join(this.dist, 'style.css');
    this.componentsFolder = path.join(__dirname, 'components');
    this.index = path.join(this.dist, 'index.html');
    this.template = path.join(__dirname, 'template.html');
    this.templateData = '';
    this.stylesData = '';
  }

  async build() {
    try {
      await this.createDistFolder();
      await this.copyAssetsFolder(this.assets, this.assetsCopy);
      await this.createStyleFile();
      await this.mergeComponentsFile();
    } catch (err) {
      throw err;
    }
  }

  async createDistFolder() {
    await this.removeDistFolder();
    await mkdir(this.dist, { recursive: true });
  }

  async removeDistFolder() {
    await rm(this.dist, { recursive: true, force: true });
  }

  async copyAssetsFolder(assets, assetsCopy) {
    await mkdir(assetsCopy, { recursive: true });
    this.copyAssetsFiles(assets, assetsCopy);
  }

  async copyAssetsFiles(assets, assetsCopy) {
    const files = await readdir(assets, { withFileTypes: true });

    for (const file of files) {
      const assetsNew = path.join(assets, file.name);
      const assetsCopyNew = path.join(assetsCopy, file.name);

      if (!file.isFile()) {
        this.copyAssetsFolder(assetsNew, assetsCopyNew);
      } else {
        await copyFile(assetsNew, assetsCopyNew);
      }
    }
  }

  async createStyleFile() {
    const writeStream = fs.createWriteStream(this.style);
    await this.mergeStylesInStyleFile(writeStream)
  }

  async mergeStylesInStyleFile(writeStream) {
    const files = await readdir(this.stylesFolder, { withFileTypes: true });

    for (const file of files) {
      const stylesFile = path.join(this.stylesFolder, file.name);
      const readStream = fs.createReadStream(stylesFile, 'utf-8');
      const format = path.extname(stylesFile).replace(/\.*/, '');

      if (format.includes('css')) {
        readStream.on('data', (chunk) => this.stylesData += chunk);
        readStream.on('end', () => writeStream.write(this.stylesData));
      }
    }
  }

  async mergeComponentsFile() {
    const files = await readdir(this.componentsFolder, { withFileTypes: true });
    this.templateData = await readFile(this.template, 'utf-8');

    for (const file of files) {
      const componentFile = path.join(this.componentsFolder, file.name);
      const componentsData = await readFile(componentFile, 'utf-8');
      const fileName = file.name.replace(/\..*/, '');
      const format = path.extname(path.join(this.componentsFolder, file.name)).replace(/\.*/, '');

      if (file.isFile()) {
        if (format.includes('html')) {
          this.templateData = this.templateData.replace(`{{${fileName}}}`, componentsData);
          const writeStream = fs.createWriteStream(this.index);
          writeStream.write(this.templateData);
        }
      }
    }
  }
}

new BuildPage().build();

