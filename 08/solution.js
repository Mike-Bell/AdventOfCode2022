const sum = require('../utils/sum');

const parseInput = input => input.split('\r\n').map(r => r.split('').map(n => +n));

const runPart1 = input => {
   const rows = input.length;
   const columns = input[0].length;
   const areVisible = input.map((row, r) => row.map((col, c) => r === 0 || c === 0 || r === rows - 1 || c === columns - 1));
   let max = -1;
   const evaluate = (r, c) => {
      if (input[r][c] > max) {
         max = input[r][c];
         areVisible[r][c] = true;
      }
   };
   for (let r = 1; r < rows - 1; r++) {
      max = input[r][0];
      for (let c = 1; c < columns - 1; c++) {
         evaluate(r, c);
      }

      max = input[r][columns - 1];
      for (let c = columns - 2; c > 0; c--) {
         evaluate(r, c);
      }
   }

   for (let c = 1; c < columns - 1; c++) {
      max = input[0][c];
      for (let r = 1; r < rows - 1; r++) {
         evaluate(r, c);
      }

      max = input[rows - 1][c];
      for (let r = rows - 2; r > 0; r--) {
         evaluate(r, c);
      }
   }

   return sum(areVisible.map(r => r.filter(c => c).length));
};

const runPart2 = input => {
   const rows = input.length;
   const columns = input[0].length;
   const scores = input.map(row => row.map(() => 0));
   let dirScore = 0;
   for (let r = 1; r < rows - 1; r++) {
      for (let c = 1; c < columns - 1; c++) {
         let score = 1;
         dirScore = 0;
         for (let c2 = c - 1; c2 >= 0; c2--) {
            dirScore++;
            if (input[r][c2] >= input[r][c]) {
               break;
            }
         }
         score *= dirScore;

         dirScore = 0;
         for (let c2 = c + 1; c2 < columns; c2++) {
            dirScore++;
            if (input[r][c2] >= input[r][c]) {
               break;
            }
         }
         score *= dirScore;

         dirScore = 0;
         for (let r2 = r - 1; r2 >= 0; r2--) {
            dirScore++;
            if (input[r2][c] >= input[r][c]) {
               break;
            }
         }
         score *= dirScore;

         dirScore = 0;
         for (let r2 = r + 1; r2 < rows; r2++) {
            dirScore++;
            if (input[r2][c] >= input[r][c]) {
               break;
            }
         }
         score *= dirScore;

         scores[r][c] = score;
      }
   }

   return Math.max(...scores.map(r => Math.max(...r)));
};

module.exports = {parseInput, runPart1, runPart2};