const parseInput = input => input;

const runPart1 = input => {
   for (let i = 3; i < input.length; i++) {
      if (new Set(input.slice(i - 3, i + 1)).size === 4) {
         return i + 1;
      }
   }
   return -1;
};

const runPart2 = input => {
   for (let i = 13; i < input.length; i++) {
      if (new Set(input.slice(i - 13, i + 1)).size === 14) {
         return i + 1;
      }
   }
   return -1;
};

module.exports = {parseInput, runPart1, runPart2};