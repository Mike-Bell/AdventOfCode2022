/* eslint-disable no-loop-func */
const range = require('../utils/range');

const parseInput = input => {
   const elves = [];
   const chars = input.split('\r\n').map(line => line.split(''));
   for (let i = 0; i < chars.length; i++) {
      for (let j = 0; j < chars[0].length; j++) {
         if (chars[i][j] === '#') {
            elves.push([i, j]);
         }
      }
   }
   return elves;
};

const searches = [{
   dir: [-1, 0],
   a1: [-1, -1],
   a2: [-1, 1]
}, {
   dir: [1, 0],
   a1: [1, -1],
   a2: [1, 1]
}, {
   dir: [0, -1],
   a1: [-1, -1],
   a2: [1, -1]
}, {
   dir: [0, 1],
   a1: [-1, 1],
   a2: [1, 1]
}];

const allAdjacent = range(3).flatMap(r => range(3).map(c => [r - 1, c - 1])).filter(a => a[0] !== 0 || a[1] !== 0);

const runPart1 = elves => {
   let searchIndex = 0;

   range(10).forEach(() => {
      const elfLookup = [];
      elves.forEach(([r, c]) => {
         elfLookup[r] = elfLookup[r] || [];
         elfLookup[r][c] = true;
      });
      const hasElf = (r, c) => (elfLookup[r] || [])[c];
      const proposals = elves.map(([r, c]) => {
         if (allAdjacent.every(([ar, ac]) => !hasElf(r + ar, c + ac))) {
            return null;
         }

         for (let s = 0; s < 4; s++) {
            const {dir, a1, a2} = searches[(searchIndex + s) % 4];
            if (!hasElf(r + dir[0], c + dir[1]) && !hasElf(r + a1[0], c + a1[1]) && !hasElf(r + a2[0], c + a2[1])) {
               return [r + dir[0], c + dir[1]];
            }
         }

         return null;
      });
      const proposalsLookup = [];
      proposals.forEach(p => {
         if (!p) {
            return;
         }
         const [r, c] = p;
         proposalsLookup[r] = proposalsLookup[r] || [];
         proposalsLookup[r][c] = proposalsLookup[r][c] || 0;
         proposalsLookup[r][c]++;
      });

      elves = proposals.map((p, i) => {
         if (!p) {
            return elves[i];
         }

         if (proposalsLookup[p[0]][p[1]] > 1) {
            return elves[i];
         }

         return p;
      });
      searchIndex = (searchIndex + 1) % 4;
   });

   const minR = Math.min(...elves.map(c => c[0]));
   const maxR = Math.max(...elves.map(c => c[0]));
   const minC = Math.min(...elves.map(c => c[1]));
   const maxC = Math.max(...elves.map(c => c[1]));
   return (maxR - minR + 1) * (maxC - minC + 1) - elves.length;
};

const runPart2 = elves => {
   let searchIndex = 0;

   let iter = 0;
   // eslint-disable-next-line no-constant-condition
   while (true) {
      iter++;
      const elfLookup = [];
      elves.forEach(([r, c]) => {
         elfLookup[r] = elfLookup[r] || [];
         elfLookup[r][c] = true;
      });
      const hasElf = (r, c) => (elfLookup[r] || [])[c];
      const proposals = elves.map(([r, c]) => {
         if (allAdjacent.every(([ar, ac]) => !hasElf(r + ar, c + ac))) {
            return null;
         }

         for (let s = 0; s < 4; s++) {
            const {dir, a1, a2} = searches[(searchIndex + s) % 4];
            if (!hasElf(r + dir[0], c + dir[1]) && !hasElf(r + a1[0], c + a1[1]) && !hasElf(r + a2[0], c + a2[1])) {
               return [r + dir[0], c + dir[1]];
            }
         }

         return null;
      });
      const proposalsLookup = [];
      proposals.forEach(p => {
         if (!p) {
            return;
         }
         const [r, c] = p;
         proposalsLookup[r] = proposalsLookup[r] || [];
         proposalsLookup[r][c] = proposalsLookup[r][c] || 0;
         proposalsLookup[r][c]++;
      });

      let moved = false;
      elves = proposals.map((p, i) => {
         if (!p) {
            return elves[i];
         }

         if (proposalsLookup[p[0]][p[1]] > 1) {
            return elves[i];
         }

         moved = true;
         return p;
      });

      if (!moved) {
         return iter;
      }
      searchIndex = (searchIndex + 1) % 4;
   }
};

module.exports = {parseInput, runPart1, runPart2};