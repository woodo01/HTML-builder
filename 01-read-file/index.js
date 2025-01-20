const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(filePath, 'utf8');

readableStream.on('data', (chunk) => {
  process.stdout.write(chunk);
});
// readableStream.on('error', (err) => {
//   console.error('Error reading the file:', err.message);
// });
