const sum = require('../utils/sum');

const parseInput = input => input.split('\r\n');

const snafuToNumberMap = {
   '=': -2,
   '-': -1,
   0: 0,
   1: 1,
   2: 2
};

const numberToSnafuMap = Object.fromEntries(Object.entries(snafuToNumberMap).map(([a, b]) => [b, a]));

const runPart1 = input => {
   const snafuToNumber = s => {
      let n = 0;
      for (let i = 0; i < s.length; i++) {
         n += snafuToNumberMap[s[s.length - 1 - i]] * Math.pow(5, i);
      }
      return n;
   };
   const numberToSnafu = n => {
      let nums = n.toString(5).split('').map(num => +num);
      let ind = nums.findIndex(num => num > 2);
      while (ind !== -1) {
         nums[ind] -= 5;
         if (ind > 0) {
            nums[ind - 1]++;
         } else {
            nums = [1, ...nums];
         }
         ind = nums.findIndex(num => num > 2);
      }
      return nums.map(num => numberToSnafuMap[num]).join('');
   };

   return numberToSnafu(sum(input.map(snafuToNumber)));
};

const runPart2 = () => 'ALL DONE!';

module.exports = {parseInput, runPart1, runPart2};