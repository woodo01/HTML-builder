const fs = require('fs');
const path = require('path');

function copyDir(srcDir, destDir) {
  fs.rm(destDir, { recursive: true, force: true }, (err) => {
    if (err) {
      return console.error(
        'Error removing destination directory:',
        err.message,
      );
    }

    fs.mkdir(destDir, { recursive: true }, (err) => {
      if (err) {
        return console.error(
          'Error creating destination directory:',
          err.message,
        );
      }

      fs.readdir(srcDir, { withFileTypes: true }, (err, items) => {
        if (err) {
          return console.error('Error reading source directory:', err.message);
        }

        items.forEach((item) => {
          const srcPath = path.join(srcDir, item.name);
          const destPath = path.join(destDir, item.name);

          if (item.isFile()) {
            fs.copyFile(srcPath, destPath, (err) => {
              if (err) {
                console.error(`Error copying file ${item.name}:`, err.message);
              }
            });
          } else if (item.isDirectory()) {
            copyDir(srcPath, destPath);
          }
        });
      });
    });
  });
}

const srcFolder = path.join(__dirname, 'files');
const destFolder = path.join(__dirname, 'files-copy');

copyDir(srcFolder, destFolder);
