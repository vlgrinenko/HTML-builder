const fs = require('node:fs');
const path = require('node:path');

const stylesPath = path.join(__dirname, 'styles');
const bundleFolderPath = path.join(__dirname, 'project-dist');
const bundleFilePath = path.join(bundleFolderPath, 'bundle.css');

fs.writeFileSync(bundleFilePath, '');

fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    return console.error('Ошибка при чтении папки');
  }

  const writeStream = fs.createWriteStream(bundleFilePath, { flags: 'as' });

  files.forEach((file) => {
    if (path.extname(file.name) === '.css' && file.isFile()) {
      const filePath = path.join(stylesPath, file.name);
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          return console.error('Ошибка при чтении файла');
        }

        writeStream.write(data + '\n');
      });
    }
  });
});
