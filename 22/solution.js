const range = require('../utils/range');

const parseInput = input => {
   const [mapInput, instructionsInput] = input.split('\r\n\r\n');
   const mapRows = mapInput.split('\r\n').map(row => row.split('')).map(row => {
      const start = row.findIndex(e => e !== ' ');
      const end = row.length - 1;
      return {
         start: start,
         end: end,
         elements: row.map(e => e === '#')
      };
   });

   const instructions = [];
   let num = '';
   for (let i = 0; i < instructionsInput.length; i++) {
      const chr = instructionsInput[i];
      if (chr === 'R' || chr === 'L') {
         instructions.push({type: 'move', amount: +num});
         instructions.push({type: 'turn', dir: chr === 'R' ? 1 : -1});
         num = '';
      } else {
         num += instructionsInput[i];
      }
   }

   if (num) {
      instructions.push({type: 'move', amount: +num});
   }

   return {
      map: mapRows,
      instructions: instructions
   };
};

const dirToTransform = [[0, 1], [1, 0], [0, -1], [-1, 0]];

const runPart1 = ({map, instructions}) => {
   const reverseMap = [...map].reverse();
   let dir = 0;
   let r = 0;
   let c = map[0].start;
   for (const inst of instructions) {
      if (inst.type === 'turn') {
         dir = (dir + inst.dir + 4) % 4;
         continue;
      }

      const [dr, dc] = dirToTransform[dir];
      for (let d = 0; d < inst.amount; d++) {
         let nextR = r + dr;
         let nextC = c + dc;
         if (dir === 0) { // right
            const row = map[r];
            if (nextC > row.end) {
               nextC = row.start;
            }
         } else if (dir === 1) { // down
            const nextRow = map[nextR];
            if (nextR >= map.length || nextC > nextRow.end || nextC < nextRow.start) {
               nextR = map.findIndex(row => nextC >= row.start && nextC <= row.end);
            }
         } else if (dir === 2) { // left
            const row = map[r];
            if (nextC < row.start) {
               nextC = row.end;
            }
         } else { // up
            const nextRow = map[nextR];
            if (nextR < 0 || nextC > nextRow.end || nextC < nextRow.start) {
               nextR = map.length - 1 - reverseMap.findIndex(row => nextC >= row.start && nextC <= row.end);
            }
         }

         if (map[nextR].elements[nextC]) {
            break;
         }
         r = nextR;
         c = nextC;
      }
   }
   return 1000 * (r + 1) + 4 * (c + 1) + dir;
};

const runPart2 = ({map, instructions}) => {
   const cubeFaceGeometry = [
      [-1, 0, 5],
      [-1, 1, -1],
      [4, 2, -1],
      [3, -1, -1]
   ];

   const [maxR, maxC] = [map.length - 1, Math.max(...map.map(row => row.end))];
   const cubeHeight = (maxR + 1) / cubeFaceGeometry.length;
   const cubeWidth = (maxC + 1) / cubeFaceGeometry[0].length;

   const coordToFace = range(maxR + 1).map(r => range(maxC + 1).map(c => cubeFaceGeometry[Math.floor(r / (maxR + 1) * cubeFaceGeometry.length)][Math.floor(c / (maxC + 1) * cubeFaceGeometry[0].length)]));

   const faceTransitions = {
      0: {
         0: (r, c) => [r, c, 0],
         1: (r, c) => [r, c, 1],
         2: (r, c) => [cubeHeight * 2 - (r - cubeWidth) - 1, 0, 0],
         3: (r, c) => [c + cubeHeight * 2, 0, 0]
      },
      1: {
         0: (r, c) => [cubeHeight - 1, cubeWidth * 2 + r - cubeHeight, 3],
         1: (r, c) => [r, c, 1],
         2: (r, c) => [cubeHeight * 2, (r - cubeHeight), 1],
         3: (r, c) => [r, c, 3]
      },
      2: {
         0: (r, c) => [cubeHeight - (r - cubeHeight * 2) - 1, cubeWidth * 3 - 1, 2],
         1: (r, c) => [cubeHeight * 2 + c, cubeWidth - 1, 2],
         2: (r, c) => [r, c, 2],
         3: (r, c) => [r, c, 3]
      },
      3: {
         0: (r, c) => [cubeHeight * 3 - 1, cubeWidth + (r - cubeHeight * 3), 3],
         1: (r, c) => [0, c + cubeHeight * 2, 1],
         2: (r, c) => [0, cubeWidth + (r - cubeHeight * 3), 1],
         3: (r, c) => [r, c, 3]
      },
      4: {
         0: (r, c) => [r, c, 0],
         1: (r, c) => [r, c, 1],
         2: (r, c) => [cubeHeight - (r - cubeHeight * 2) - 1, cubeWidth, 0],
         3: (r, c) => [cubeHeight + c, cubeWidth, 0]
      },
      5: {
         0: (r, c) => [cubeHeight * 2 + (cubeHeight - r - 1), cubeWidth * 2 - 1, 2],
         1: (r, c) => [(c - cubeWidth), cubeWidth * 2 - 1, 2],
         2: (r, c) => [r, c, 2],
         3: (r, c) => [cubeHeight * 4 - 1, c - cubeHeight * 2, 3]
      }
   };

   let dir = 0;
   let r = 0;
   let c = map[0].start;

   for (const inst of instructions) {
      if (inst.type === 'turn') {
         dir = (dir + inst.dir + 4) % 4;
         continue;
      }

      let [dr, dc] = dirToTransform[dir];
      for (let d = 0; d < inst.amount; d++) {
         let [nextR, nextC] = [r + dr, c + dc];
         const thisFace = coordToFace[r][c];
         const nextFace = (coordToFace[nextR] || [])[nextC];
         let nextDir = dir;
         let nextDc = dc;
         let nextDr = dr;
         if (thisFace !== nextFace) {
            [nextR, nextC, nextDir] = faceTransitions[thisFace][dir](nextR, nextC);
            [nextDr, nextDc] = dirToTransform[nextDir];
         }

         if (map[nextR].elements[nextC]) {
            break;
         }
         r = nextR;
         c = nextC;
         dc = nextDc;
         dr = nextDr;
         dir = nextDir;
      }
   }

   return 1000 * (r + 1) + 4 * (c + 1) + dir;
};

module.exports = {parseInput, runPart1, runPart2};