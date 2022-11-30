const sum = require('../utils/sum');

const parseInput = input => input.split('\r\n').reduce((acc, row, i, rows) => i % 3 !== 0 ? acc : [...acc, {
   left: JSON.parse(row),
   right: JSON.parse(rows[i + 1])
}], []);

const compareLists = (left, right) => {
   for (let i = 0; i < right.length; i++) {
      if (i >= left.length) {
         return 'correct';
      }

      const [l, r] = [left[i], right[i]];
      if (!Array.isArray(l) && !Array.isArray(r)) {
         if (l === r) {
            continue;
         }
         return l < r ? 'correct' : 'incorrect';
      }

      const subCompare = compareLists(Array.isArray(l) ? l : [l], Array.isArray(r) ? r : [r]);
      if (subCompare !== 'unknown') {
         return subCompare;
      }
   }

   if (left.length > right.length) {
      return 'incorrect';
   }

   return 'unknown';
};

const runPart1 = input => sum(input.map(({left, right}, i) => compareLists(left, right) === 'correct' ? i + 1 : 0));

const runPart2 = input => {
   const allRows = input.reduce((acc, pair) => [...acc, pair.left, pair.right], []);
   const findIndex = list => allRows.filter(r => compareLists(r, list) === 'correct').length;
   return (findIndex([[2]]) + 1) * (findIndex([[6]]) + 2);
};

module.exports = {parseInput, runPart1, runPart2};