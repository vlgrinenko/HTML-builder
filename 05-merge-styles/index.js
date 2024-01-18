const fs = require('node:fs');
const path = require('node:path');

const stylesPath = path.join(__dirname, 'styles');
const bundleFolderPath = path.join(__dirname, 'project-dist');
const bundleFilePath = path.join(bundleFolderPath, 'bundle.css');

fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    return console.error('Ошибка при чтении папки');
  }

  const writeStream = fs.createWriteStream(bundleFilePath);

  files.forEach((file, index) => {
    if (path.extname(file.name) === '.css' && file.isFile()) {
      const filePath = path.join(stylesPath, file.name);
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
