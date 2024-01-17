const fs = require('node:fs');
const path = require('node:path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  files.forEach((file) => {
    if (file.isFile()) {
      const fileExt = path.extname(file.name);
      const fileName = path.basename(file.name, fileExt);

      const filePath = path.join(folderPath, file.name);
      fs.stat(filePath, (err, stats) => {
        console.log(
          `${fileName} - ${fileExt.slice(1)} - ${(stats.size / 1024).toFixed(
            3,
          )}kb`,
        );
      });
    }
  });
});
