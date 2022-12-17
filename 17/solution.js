const range = require('../utils/range');

const shapes = [
   [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3]
   ], [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 1]
   ], [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 2],
      [2, 2]
   ], [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0]
   ], [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1]
   ]
];

const applyTransform = (coords, t) => coords.map(c => [c[0] + t[0], c[1] + t[1]]);

const parseInput = input => input.split('').map(j => j === '<' ? [0, -1] : [0, 1]);

// eslint-disable-next-line no-unused-vars
const printMap = map => {
   console.log('-');
   console.log([...map].reverse().map(row => row.map(e => e ? '#' : '.').join(' ')).join('\r\n'));
};

const addShape = (map, shape, transform) => {
   applyTransform(shape, transform).forEach(s => {
      map[s[0]][s[1]] = true;
   });
};

const removeShape = (map, shape, transform) => {
   applyTransform(shape, transform).forEach(s => {
      map[s[0]][s[1]] = false;
   });
};

const mapWidth = 7;
const tryMoveShape = (map, shape, oldTransform, newTransform) => {
   const newShape = applyTransform(shape, newTransform);
   removeShape(map, shape, oldTransform);
   if (newShape.some(c => c[0] < 0 || c[1] < 0 || c[1] >= mapWidth || map[c[0]][c[1]])) {
      addShape(map, shape, oldTransform);
      return false;
   }

   addShape(map, shape, newTransform);
   return true;
};

const composeTransforms = (t1, t2) => [t1[0] + t2[0], t1[1] + t2[1]];

const findRowWithHighestRock = map => map.filter(row => row.some(e => e)).length;

const ensureMapHasAtLeastRows = (map, rows) => {
   while (map.length < rows) {
      map.push(range(mapWidth).map(() => false));
   }
};

const runPart1 = input => {
   const map = range(4).map(() => range(mapWidth).map(() => false));
   let rocksFallen = 0;
   let jets = 0;
   while (rocksFallen < 2022) {
      const shape = shapes[rocksFallen % 5];
      const row = findRowWithHighestRock(map) + 3;
      let transform = [row, 2];
      ensureMapHasAtLeastRows(map, row + 4);

      addShape(map, shape, transform);
      // eslint-disable-next-line no-constant-condition
      while (true) {
         let newTransform = composeTransforms(input[jets], transform);
         jets = (jets + 1) % input.length;
         if (tryMoveShape(map, shape, transform, newTransform)) {
            transform = newTransform;
         }

         newTransform = composeTransforms([-1, 0], transform);
         if (tryMoveShape(map, shape, transform, newTransform)) {
            transform = newTransform;
         } else {
            break;
         }
      }

      rocksFallen++;
   }

   return findRowWithHighestRock(map);
};

const hashGameState = (map, jets, rocksFallen) => `${rocksFallen % 5},${jets},${map.slice(map.length - 10, map.length).map(row => row.map(e => e ? '#' : '.').join('')).join('')}`;

const runPart2 = input => {
   const map = range(4).map(() => range(mapWidth).map(() => false));
   let rocksFallen = 0;
   let jets = 0;
   const gameStates = new Map();
   let warpedThroughTime = false;
   const target = 1000000000000;
   let warpedRows = 0;
   while (rocksFallen < target) {
      const shape = shapes[rocksFallen % 5];
      const row = findRowWithHighestRock(map) + 3;
      let transform = [row, 2];
      ensureMapHasAtLeastRows(map, row + 4);

      addShape(map, shape, transform);
      // eslint-disable-next-line no-constant-condition
      while (true) {
         let newTransform = composeTransforms(input[jets], transform);
         jets = (jets + 1) % input.length;
         if (tryMoveShape(map, shape, transform, newTransform)) {
            transform = newTransform;
         }

         newTransform = composeTransforms([-1, 0], transform);
         if (tryMoveShape(map, shape, transform, newTransform)) {
            transform = newTransform;
         } else {
            break;
         }
      }

      rocksFallen++;
      if (!warpedThroughTime) {
         const gameState = hashGameState(map, jets, rocksFallen);
         if (gameStates.has(gameState)) {
            const {rocks, highestRow} = gameStates.get(gameState);
            const rocksPerIteration = rocksFallen - rocks;
            const rowsPerIteration = findRowWithHighestRock(map) - highestRow;
            warpedThroughTime = true;
            const warpsToPerform = Math.floor((target - rocksFallen) / rocksPerIteration);
            rocksFallen += rocksPerIteration * warpsToPerform;
            warpedRows += rowsPerIteration * warpsToPerform;
         } else {
            gameStates.set(gameState, {rocks: rocksFallen, highestRow: findRowWithHighestRock(map)});
         }
      }
   }

   return findRowWithHighestRock(map) + warpedRows;
};

module.exports = {parseInput, runPart1, runPart2};