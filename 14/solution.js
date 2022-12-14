const range = require('../utils/range');

const parseInput = input => input.split('\r\n').map(r => r.split(' -> ').map(p => p.split(',')).map(p => [+p[1], +p[0]])); // swap p[0] and p[1] so I can operate in r,c instead of x,y

const buildMap = input => {
   const maxR = Math.max(...input.map(rock => Math.max(...rock.map(node => node[0]))));
   const maxC = Math.max(...input.map(rock => Math.max(...rock.map(node => node[1])))) + 1;
   const map = range(maxR + 2).map(() => range((maxC + 1) * 2).map(() => 0));
   input.forEach(rock => {
      for (let n = 0; n < rock.length - 1; n++) {
         const node = rock[n];
         const node2 = rock[n + 1];
         const direction = [0, 1].map(i => Math.max(-1, Math.min(1, node2[i] - node[i])));
         const pos = [...node];

         while (pos[0] !== node2[0] || pos[1] !== node2[1]) {
            map[pos[0]][pos[1]] = 1;
            pos[0] += direction[0];
            pos[1] += direction[1];
         }
         map[node2[0]][node2[1]] = 1;
      }
   });
   return map;
};

const runPart1 = input => {
   const map = buildMap(input);

   let fellIntoVoid = false;
   let sand = 0;
   while (!fellIntoVoid) {
      let [r, c] = [0, 500];
      // eslint-disable-next-line no-constant-condition
      while (true) {
         if (r + 1 >= map.length) {
            fellIntoVoid = true;
            break;
         } else if (!map[r + 1][c]) {
            r++;
         } else if (!map[r + 1][c - 1]) {
            r++;
            c--;
         } else if (!map[r + 1][c + 1]) {
            r++;
            c++;
         } else {
            break;
         }
      }
      if (!fellIntoVoid) {
         sand++;
         map[r][c] = true;
      }
   }
   return sand;
};

const runPart2 = input => {
   const map = buildMap(input);

   let sand = 0;
   while (!map[0][500]) {
      let [r, c] = [0, 500];
      while (r + 1 < map.length) {
         if (!map[r + 1][c]) {
            r++;
         } else if (!map[r + 1][c - 1]) {
            r++;
            c--;
         } else if (!map[r + 1][c + 1]) {
            r++;
            c++;
         } else {
            break;
         }
      }
      sand++;
      map[r][c] = true;
   }
   return sand;
};

module.exports = {parseInput, runPart1, runPart2};