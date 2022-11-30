const sum = require('../utils/sum');

const parseInput = input => input.split('\r\n').map(r => [...r.matchAll(/-?[0-9]+/g)].map(m => +m[0]));

const runPart1 = input => {
   const rowOfInterest = 2000000;
   let segments = [];
   input.forEach(([sx, sy, bx, by]) => {
      const distance = Math.abs(bx - sx) + Math.abs(by - sy);
      const distanceToRow = Math.abs(rowOfInterest - sy);
      const hDistance = distance - distanceToRow;
      if (hDistance > 0) {
         const x0 = sx - hDistance;
         const x1 = sx + hDistance;
         segments.push([x0, x1]);
      }
   });

   const mergeSegments = () => {
      for (let i = 0; i < segments.length; i++) {
         for (let j = i + 1; j < segments.length; j++) {
            if (segments[i][0] <= segments[j][0] || segments[i][1] >= segments[j][0] || segments[j][0] <= segments[i][0] || segments[j][1] >= segments[i][0]) {
               segments = [[Math.min(segments[i][0], segments[j][0]), Math.max(segments[i][1], segments[j][1])]].concat(segments.filter((_, k) => i !== k && j !== k));
               return true;
            }
         }
      }
      return false;
   };

   let shouldMerge = true;
   while (shouldMerge) {
      shouldMerge = mergeSegments();
   }

   return sum(segments.map(([x0, x1]) => x1 - x0));
};

const runPart2 = input => {
   const isExample = false;
   const maxN = isExample ? 20 : 4000000;

   const coordsWithDistances = input.map(([sx, sy, bx, by]) => [sx, sy, Math.abs(bx - sx) + Math.abs(by - sy)]);
   for (let i = 0; i < coordsWithDistances.length; i++) {
      const [sx, sy, distance] = coordsWithDistances[i];
      const test = (x, y) => {
         for (let j = 0; j < coordsWithDistances.length; j++) {
            if (i === j) {
               continue;
            }
            const [s2x, s2y, s2d] = coordsWithDistances[j];
            if (Math.abs(s2x - x) + Math.abs(s2y - y) <= s2d) {
               return false;
            }
         }
         return true;
      };
      const y0 = Math.max(sy - distance - 1, 0);
      const y1 = Math.min(sy + distance + 1, maxN);
      for (let y = y0; y <= y1; y++) {
         const hDistance = distance - Math.abs(y - sy);
         const x0 = sx - hDistance - 1;
         const x1 = sx + hDistance + 1;
         if (x0 >= 0 && x0 <= maxN) {
            if (test(x0, y)) {
               return x0 * 4000000 + y;
            }
         }
         if (x1 >= 0 && x1 <= maxN && x0 !== x1) {
            if (test(x1, y)) {
               return x1 * 4000000 + y;
            }
         }
      }
   }

   return -1;
};

module.exports = {parseInput, runPart1, runPart2};