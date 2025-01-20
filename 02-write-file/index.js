const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'output.txt');

const writableStream = fs.createWriteStream(filePath, { flags: 'a' });

console.log('Hello! Please enter text. Type "exit" or press Ctrl+C to quit.');

process.stdin.on('data', (chunk) => {
  const input = chunk.toString().trim();

  if (input.toLowerCase() === 'exit') {
    console.log('Goodbye!');
    process.stdin.pause();
    writableStream.end();
    return;
  }

  writableStream.write(input + '\n', (err) => {
    if (err) {
      console.error('Error writing to file:', err.message);
    } else {
      console.log(
        'Text written to file. Continue entering text or type "exit" to quit.',
      );
    }
  });
});

process.on('SIGINT', () => {
  console.log('\nGoodbye!');
  process.stdin.pause();
  writableStream.end();
});
