/* eslint-disable new-cap */
/* eslint-disable dot-notation */
const range = require('../utils/range');
const parseInput = input => input.split('\r\n').map(r => r.split(' ')).map(r => [r[0], +r[1]]);

const runPart1 = input => {
   const visited = new Set();
   const addVisited = (r, c) => visited.add(`${r},${c}`);

   const head = [4, 0];
   let tail = [4, 0];
   addVisited(tail[0], tail[1]);
   const getDistance = () => [Math.abs(head[0] - tail[0]), Math.abs(head[1] - tail[1])];
   const moveHead = {
      R: () => head[1]++,
      L: () => head[1]--,
      U: () => head[0]--,
      D: () => head[0]++
   };

   const moveTail = {
      R: () => {
         tail = [head[0], head[1] - 1];
      },
      L: () => {
         tail = [head[0], head[1] + 1];
      },
      U: () => {
         tail = [head[0] + 1, head[1]];
      },
      D: () => {
         tail = [head[0] - 1, head[1]];
      }
   };

   input.forEach(line => {
      for (let i = 0; i < line[1]; i++) {
         moveHead[line[0]]();
         const distance = getDistance();
         if (distance[0] > 1 || distance[1] > 1) {
            moveTail[line[0]]();
         }
         addVisited(tail[0], tail[1]);
      }
   });

   return visited.size;
};

const runPart2 = input => {
   const visited = new Set();

   const knots = range(10).map(() => [4, 0]);
   const addVisited = () => visited.add(`${knots[9][0]},${knots[9][1]}`);
   const getDistance = (h, t) => [knots[h][0] - knots[t][0], knots[h][1] - knots[t][1]];
   const moveHead = h => ({
      R: () => knots[h][1]++,
      L: () => knots[h][1]--,
      U: () => knots[h][0]--,
      D: () => knots[h][0]++
   });

   const moveTail = (t, distance) => {
      if (distance[0] > 0) {
         knots[t][0]++;
      } else if (distance[0] < 0) {
         knots[t][0]--;
      }

      if (distance[1] > 0) {
         knots[t][1]++;
      } else if (distance[1] < 0) {
         knots[t][1]--;
      }
   };

   input.forEach(line => {
      for (let i = 0; i < line[1]; i++) {
         moveHead(0)[line[0]]();
         for (let k = 0; k < 9; k++) {
            const distance = getDistance(k, k + 1);
            if (Math.abs(distance[0]) > 1 || Math.abs(distance[1]) > 1) {
               moveTail(k + 1, distance);
            } else {
               break;
            }
         }
         addVisited();
      }
   });

   return visited.size;
};

module.exports = {parseInput, runPart1, runPart2};