const fs = require('fs/promises');
const { processOperations } = require('./processor');

const inputFilePath = process.argv[2];

fs.readFile(inputFilePath, "utf8")
  .then(async (data) => {
    const results = await processOperations(JSON.parse(data));

    results.forEach(result => console.log(result));
  })
  .catch((error) => {
    console.log("Couldn't read file:", error);
  });
