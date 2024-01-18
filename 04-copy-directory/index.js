const fs = require('node:fs');
const path = require('node:path');

const initialDir = path.join(__dirname, 'files');
const endDir = path.join(__dirname, 'files-copy');

const copyDir = () => {
  fs.mkdir(endDir, { recursive: true }, (err) => {
    if (err) {
      return console.error('Ошибка в создании папки');
    }

    fs.readdir(initialDir, { withFileTypes: true }, (err, initialFiles) => {
      if (err) {
        return console.error('Ошибка при чтении папки');
      }

      fs.readdir(endDir, { withFileTypes: true }, (errEnd, endFiles) => {
        if (errEnd) {
          return console.error('Ошибка при чтении финальной папки');
        }

        endFiles.forEach((endFile) => {
          if (!initialFiles.some((file) => file.name === endFile.name)) {
            fs.rm(path.join(endDir, endFile.name), (err) => {
              if (err) {
                return console.error('Ошибка при удалении файла');
              }
            });
          }
        });
      });

      initialFiles.forEach((file) => {
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
