const range = require('../utils/range');

const parseInput = input => input.split('\r\n').map(r => r.split(',').map(n => +n));

const runPart1 = drops => {
   drops = drops.map(([x, y, z]) => [x + 1, y + 1, z + 1]);
   const maxX = Math.max(...drops.map(d => d[0])) + 1;
   const maxY = Math.max(...drops.map(d => d[1])) + 1;
   const maxZ = Math.max(...drops.map(d => d[2])) + 1;
   const map = range(maxX + 1).map(() => range(maxY + 1).map(() => range(maxZ + 1).map(() => false)));
   drops.forEach(([x, y, z]) => {
      map[x][y][z] = true;
   });

   let sides = 0;
   const transforms = [[-1, 0, 0], [1, 0, 0], [0, -1, 0], [0, 1, 0], [0, 0, -1], [0, 0, 1]];
   drops.forEach(([x, y, z]) => {
      transforms.forEach(([dx, dy, dz]) => {
         if (!map[x + dx][y + dy][z + dz]) {
            sides++;
         }
      });
   });

   return sides;
};

const runPart2 = drops => {
   drops = drops.map(([x, y, z]) => [x + 1, y + 1, z + 1]);
   const maxX = Math.max(...drops.map(d => d[0])) + 1;
   const maxY = Math.max(...drops.map(d => d[1])) + 1;
   const maxZ = Math.max(...drops.map(d => d[2])) + 1;
   const map = range(maxX + 1).map(() => range(maxY + 1).map(() => range(maxZ + 1).map(() => false)));
   drops.forEach(([x, y, z]) => {
      map[x][y][z] = true;
   });

   let sides = 0;
   const transforms = [[-1, 0, 0], [1, 0, 0], [0, -1, 0], [0, 1, 0], [0, 0, -1], [0, 0, 1]];
   const seen = map.map(slice => slice.map(row => row.map(() => false)));

   const toExpore = [[0, 0, 0]];
   while (toExpore.length > 0) {
      const [x, y, z] = toExpore.pop();
      if (seen[x][y][z]) {
         continue;
      }

      seen[x][y][z] = true;
      for (const [dx, dy, dz] of transforms) {
         const xp = x + dx;
         const yp = y + dy;
         const zp = z + dz;
         if (xp < 0 || yp < 0 || zp < 0 || xp > maxX || yp > maxY || zp > maxZ) {
            continue;
         }

         if (map[xp][yp][zp]) {
            sides++;
            continue;
         }

         toExpore.push([xp, yp, zp]);
      }
   }

   return sides;
};

module.exports = {parseInput, runPart1, runPart2};