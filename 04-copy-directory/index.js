const fs = require('node:fs');
const path = require('node:path');

const initialDir = path.join(__dirname, 'files');
const endDir = path.join(__dirname, 'files-copy');

const copyDir = () => {
  fs.mkdir(endDir, { recursive: true }, (err) => {
    if (err) {
      return console.error('Ошибка в создании папки');
    }

    fs.readdir(initialDir, { withFileTypes: true }, (err, files) => {
      if (err) {
        return console.error('Ошибка при чтении папки');
      }

      files.forEach((file) => {
        const initialFliePath = path.join(initialDir, file.name);
        const endFliePath = path.join(endDir, file.name);

        fs.copyFile(initialFliePath, endFliePath, (err) => {
          if (err) {
            return console.error('Ошибка при копировании файла');
          }
        });
      });
    });
  });
};

copyDir();
