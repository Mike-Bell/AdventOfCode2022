const parseInput = input => {
   const map = [];
   let pos = [];
   let goal = [];
   input.split('\r\n').forEach((row, r) => {
      map[r] = [];
      row.split('').forEach((val, v) => {
         if (val === 'S') {
            map[r][v] = 'a'.charCodeAt(0) - 97;
            pos = [r, v];
         } else if (val === 'E') {
            goal = [r, v];
            map[r][v] = 'z'.charCodeAt(0) - 97;
         } else {
            map[r][v] = val.charCodeAt(0) - 97;
         }
      });
   });

   return {map, pos, goal};
};

const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

const runPart1 = ({map, pos, goal}) => {
   const [goalR, goalC] = goal;
   let min = Infinity;
   const traveled = map.map(row => row.map(() => Infinity));
   const traverse = (r, c, steps) => {
      if (goalR === r && goalC === c && steps < min) {
         min = steps;
         return;
      }
      if (steps + 1 >= min) {
         return;
      }
      for (const transform of directions) {
         const nextR = r + transform[0];
         const nextC = c + transform[1];
         if (nextR >= 0 &&
            nextR < map.length &&
            nextC >= 0 &&
            nextC < map[0].length &&
            map[nextR][nextC] <= map[r][c] + 1) {
            if (traveled[nextR][nextC] > steps) {
               traveled[nextR][nextC] = steps;
               traverse(nextR, nextC, steps + 1, traveled);
            }
         }
      }
   };

   traverse(pos[0], pos[1], 0, new Map());
   return min;
};

const runPart2 = ({map, pos, goal}) => {
   const [goalR, goalC] = goal;
   let min = Infinity;
   const traveled = map.map(row => row.map(() => Infinity));
   const traverse = (r, c, steps) => {
      if (goalR === r && goalC === c && steps < min) {
         min = steps;
         return;
      }
      if (steps + 1 >= min) {
         return;
      }
      for (const transform of directions) {
         const nextR = r + transform[0];
         const nextC = c + transform[1];
         if (nextR >= 0 &&
            nextR < map.length &&
            nextC >= 0 &&
            nextC < map[0].length &&
            map[nextR][nextC] <= map[r][c] + 1) {
            if (traveled[nextR][nextC] > steps) {
               traveled[nextR][nextC] = steps;
               traverse(nextR, nextC, steps + 1, traveled);
            }
         }
      }
   };

   map.forEach((row, r) => {
      row.forEach((val, v) => {
         if (val === 0) {
            traverse(r, v, 0, traveled);
         }
      });
   });
   return min;
};

module.exports = {parseInput, runPart1, runPart2};