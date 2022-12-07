const FileSystem = require('../shared/FileSystem');
const sum = require('../utils/sum');

const parseInput = input => input.split('\r\n').map(r => r.split(' '));

const runPart1 = input => {
   const fileSystem = new FileSystem();
   fileSystem.processProblem7InputLines(input);
   return sum(Object.values(fileSystem.getDirSizes()).filter(s => s <= 100000));
};

const runPart2 = input => {
   const fileSystem = new FileSystem();
   fileSystem.processProblem7InputLines(input);
   const dirSizes = fileSystem.getDirSizes();
   const unusedSpace = 70000000 - dirSizes[''];
   const neededSpace = 30000000 - unusedSpace;
   return Math.min(...Object.values(dirSizes).filter(d => d >= neededSpace));
};

module.exports = {parseInput, runPart1, runPart2};