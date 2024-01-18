const fs = require('node:fs');
const path = require('node:path');

const bundleFolderPath = path.join(__dirname, 'project-dist');
const templateFilePath = path.join(__dirname, 'template.html');
const stylesFolderPath = path.join(__dirname, 'styles');
const assetsFolderPath = path.join(__dirname, 'assets');
const componentsFolderPath = path.join(__dirname, 'components');

const indexFilePath = path.join(bundleFolderPath, 'index.html');
const styleFilePath = path.join(bundleFolderPath, 'style.css');
const assetsCopyPath = path.join(bundleFolderPath, 'assets');

const buildHtml = () => {
  fs.readFile(templateFilePath, 'utf-8', (err, templateData) => {
    if (err) {
      return console.error('Ошибка при чтении template.html');
    }

    fs.readdir(componentsFolderPath, { withFileTypes: true }, (err, files) => {
      if (err) {
        return console.error('Ошибка при чтении компонентов');
      }
      let compCount = 0;

      files.forEach((file) => {
        if (file.isFile() && path.extname(file.name) === '.html') {
          const compName = path.basename(file.name, '.html');
          const compTag = `{{${compName}}}`;
          const compPath = path.join(componentsFolderPath, file.name);

          fs.readFile(compPath, 'utf-8', (err, compData) => {
            if (err) {
              return console.error('Ошибка при чтении файла компонента');
            }
            templateData = templateData.replace(compTag, compData);
            compCount += 1;

            if (compCount === files.length) {
              fs.writeFile(indexFilePath, templateData, (err) => {
                if (err) {
                  return console.error('Ошибка записи в index.html');
                }
              });
            }
          });
        } else {
          compCount += 1;
        }
      });
    });
  });
};

const buildCss = () => {
  fs.readdir(stylesFolderPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      return console.error('Ошибка при чтении папки style');
    }

    const writeStream = fs.createWriteStream(styleFilePath);

    files.forEach((file, index) => {
      if (path.extname(file.name) === '.css' && file.isFile()) {
        const filePath = path.join(stylesFolderPath, file.name);
        const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });

        readStream.on('data', (chunk) => {
          writeStream.write(chunk);
        });

        readStream.on('end', () => {
          if (index === files.length - 1) {
            writeStream.end();
          }
        });
      }
    });
  });
};

const copyAssets = (initial, final) => {
  fs.mkdir(final, { recursive: true }, (err) => {
    if (err) {
      return console.error('Ошибка создания папки assets');
    }

    fs.readdir(initial, { withFileTypes: true }, (err, files) => {
      if (err) {
        return console.error('Ошибка в чтении папки initial assets');
      }

      files.forEach((file) => {
        const initialPath = path.join(initial, file.name);
        const finalPath = path.join(final, file.name);

        if (file.isDirectory()) {
          copyAssets(initialPath, finalPath);
        } else {
          fs.copyFile(initialPath, finalPath, (err) => {
            if (err) {
              return console.error('Ошибка при копировании файла в assets');
            }
          });
        }
      });
    });
  });
};

fs.mkdir(bundleFolderPath, { recursive: true }, (err) => {
  if (err) {
    return console.error('Ошибка при создании папки project-dist');
  }

  buildHtml();
  buildCss();
});

copyAssets(assetsFolderPath, assetsCopyPath);
