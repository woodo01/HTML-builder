const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    return console.error('Error reading the folder:', err.message);
  }

  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(folderPath, file.name);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          return console.error('Error getting file stats:', err.message);
        }

        const fileName = path.parse(file.name).name;
        const fileExt = path.parse(file.name).ext.slice(1);
        const fileSize = stats.size;

        console.log(`${fileName} - ${fileExt} - ${fileSize} bytes`);
      });
    }
  });
});
