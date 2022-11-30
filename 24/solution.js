const lcm = require('../utils/lcm');
const range = require('../utils/range');
const parseInput = input => input.split('\r\n').slice(1, -1).map(row => row.slice(1, -1).split('').map(e => ({'>': 0, v: 1, '<': 2, '^': 3, '.': -1})[e]));

const dirToTransform = [[0, 1], [1, 0], [0, -1], [-1, 0]];

const getSafeTimes = input => {
   const rows = input.length;
   const columns = input[0].length;
   const cycle = lcm(rows, columns);
   const blizzards = [];
   input.forEach((row, r) => {
      row.forEach((e, c) => {
         if (e !== -1) {
            blizzards.push({r: r, c: c, transform: dirToTransform[e]});
         }
      });
   });

   return range(cycle).map(() => {
      const map = range(rows).map(() => range(columns).map(() => 1));
      blizzards.forEach(b => {
         map[b.r][b.c] = 0;
         b.r += b.transform[0];
         b.c += b.transform[1];
         if (b.r === -1) {
            b.r = rows - 1;
         }
         if (b.r === rows) {
            b.r = 0;
         }
         if (b.c === -1) {
            b.c = columns - 1;
         }
         if (b.c === columns) {
            b.c = 0;
         }
      });
      return map;
   });
};

const runPart1 = input => {
   const rows = input.length;
   const columns = input[0].length;
   const cycle = lcm(rows, columns);
   const safeTimes = getSafeTimes(input);

   const movementTransforms = [...dirToTransform, [0, 0]];

   const startR = -1;
   const startC = 0;
   const goalR = rows;
   const goalC = columns - 1;
   let states = [[startR, startC]];
   let t = 0;
   while (states.length > 0) {
      const seen = {};
      for (let r = -2; r < rows + 2; r++) {
         seen[r] = [];
      }
      const nextStates = [];
      t++;
      const willBeSafe = safeTimes[(t + 1) % cycle];
      for (const [r, c] of states) {
         for (const transform of movementTransforms) {
            const nextR = r + transform[0];
            const nextC = c + transform[1];
            if (nextR === goalR && nextC === goalC) {
               return t + 1;
            }
            if (!seen[nextR][nextC] && ((nextR === startR && nextC === startC) || (nextR >= 0 && nextC >= 0 && nextR < rows && nextC < columns && willBeSafe[nextR][nextC]))) {
               seen[nextR][nextC] = true;
               nextStates.push([nextR, nextC]);
            }
         }
      }
      states = nextStates;
   }

   return t;
};

const runPart2 = input => {
   const rows = input.length;
   const columns = input[0].length;
   const cycle = lcm(rows, columns);
   const safeTimes = getSafeTimes(input);

   const movementTransforms = [...dirToTransform, [0, 0]];

   let t = 0;
   for (const dir of [0, 1, 0]) {
      const startR = dir === 0 ? -1 : rows;
      const startC = dir === 0 ? 0 : columns - 1;
      const goalR = dir === 0 ? rows : -1;
      const goalC = dir === 0 ? columns - 1 : 0;
      let states = [[startR, startC]];
      let found = false;
      while (states.length > 0 && !found) {
         const seen = {};
         for (let r = -2; r < rows + 2; r++) {
            seen[r] = [];
         }
         const nextStates = [];
         t++;
         const willBeSafe = safeTimes[(t + 1) % cycle];
         for (const [r, c] of states) {
            for (const transform of movementTransforms) {
               const nextR = r + transform[0];
               const nextC = c + transform[1];
               if (nextR === goalR && nextC === goalC) {
                  found = true;
                  t++;
               }
               if (!seen[nextR][nextC] && ((nextR === startR && nextC === startC) || (nextR >= 0 && nextC >= 0 && nextR < rows && nextC < columns && willBeSafe[nextR][nextC]))) {
                  seen[nextR][nextC] = true;
                  nextStates.push([nextR, nextC]);
               }
            }
         }
         states = nextStates;
      }
   }

   return t;
};

module.exports = {parseInput, runPart1, runPart2};