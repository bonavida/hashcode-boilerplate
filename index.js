const fs = require('fs');
const es = require('event-stream');

let totalLines = 0;
let result = [];

const readData = filePath =>
  new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(es.split())
      .pipe(
        es
          .mapSync(line => {
            // Code
            if (line) {
              totalLines++;
              result.push(line);
            }
          })
          .on('error', err => {
            console.log('Error while reading file:', err);
            reject();
          })
          .on('end', () => {
            resolve();
          }),
      );
  });

const writeData = () => {
  const randomOutputFileName = `log${new Date().getTime()}.txt`;

  const out = fs.createWriteStream(randomOutputFileName, {
    flags: 'a', // 'a' means appending (old data will be preserved)
  });

  es.readArray(result)
    .pipe(es.join('\n'))
    .pipe(out);
};

const main = async () => {
  await readData(process.argv[2]);
  // More code
  console.log('Total lines:', totalLines);
  writeData();
  console.log('The end.');
};

main();
