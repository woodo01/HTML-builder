const fs = require('fs');
const path = require('path');

function mergeStyles(stylesDir, outputFile) {
  const writableStream = fs.createWriteStream(outputFile);

  fs.readdir(stylesDir, { withFileTypes: true }, (err, items) => {
    if (err) {
      return console.error('Error reading styles directory:', err.message);
    }

    items.forEach((item) => {
      if (item.isFile() && path.extname(item.name) === '.css') {
        const filePath = path.join(stylesDir, item.name);

        const readableStream = fs.createReadStream(filePath, 'utf8');
        readableStream.on('data', (chunk) =>
          writableStream.write(chunk + '\n'),
        );
        readableStream.on('error', (err) =>
          console.error(`Error reading file ${item.name}:`, err.message),
        );
      }
    });
  });

  writableStream.on('finish', () => {
    console.log('Styles have been successfully merged into bundle.css');
  });

  writableStream.on('error', (err) => {
    console.error('Error writing to the bundle file:', err.message);
  });
}

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bundle.css');

fs.mkdir(outputDir, { recursive: true }, (err) => {
  if (err) {
    return console.error('Error creating project-dist directory:', err.message);
  }

  mergeStyles(stylesDir, outputFile);
});
