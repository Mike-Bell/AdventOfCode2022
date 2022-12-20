const range = require('../utils/range');

const parseInput = input => input.split('\r\n').map(n => +n);

const runPart1 = input => {
   const nums = input.map((n, i) => ({val: n, pos: i}));
   const numsLength = nums.length;
   for (let i = 0; i < numsLength; i++) {
      const p = nums.findIndex(n => n.pos === i);
      const n = nums[p];
      nums.splice(p, 1);
      nums.splice((p + n.val) % (numsLength - 1), 0, n);
   }
   const zeroIndex = nums.findIndex(n => n.val === 0);
   return [1000, 2000, 3000].map(n => nums[(zeroIndex + n) % nums.length].val).reduce((acc, curr) => acc + curr, 0);
};

const runPart2 = input => {
   const nums = input.map((n, i) => ({val: n * 811589153, pos: i}));
   const numsLength = nums.length;
   range(10).forEach(() => {
      for (let i = 0; i < numsLength; i++) {
         const p = nums.findIndex(n => n.pos === i);
         const n = nums[p];
         nums.splice(p, 1);
         nums.splice((p + n.val) % (numsLength - 1), 0, n);
      }
   });

   const zeroIndex = nums.findIndex(n => n.val === 0);
   return [1000, 2000, 3000].map(n => nums[(zeroIndex + n) % numsLength].val).reduce((acc, curr) => acc + curr, 0);
};

module.exports = {parseInput, runPart1, runPart2};