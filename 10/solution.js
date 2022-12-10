const parseInput = input => input.split('\r\n').map(r => r.split(' ')).map(r => [r[0], +r[1]]);

const runPart1 = input => {
   let i = 1;
   let li = 0;
   let register = 1;
   let sum = 0;
   const instructionsWithTimes = input.map(r => {
      if (r[0] === 'noop') {
         return {
            delay: 0,
            action: () => null
         };
      }

      return {
         delay: 1,
         action: () => {
            register += r[1];
         }
      };
   });
   while (i < 221 && li < instructionsWithTimes.length) {
      const line = instructionsWithTimes[li];
      if (i % 40 === 20) {
         sum += register * i;
      }

      if (line.delay) {
         line.delay--;
      } else {
         li++;
         line.action();
      }
      i++;
   }
   return sum;
};

const runPart2 = input => {
   let i = 0;
   let li = 0;
   let register = 1;
   const image = [[]];
   const instructionsWithTimes = input.map(r => {
      if (r[0] === 'noop') {
         return {
            delay: 0,
            action: () => null
         };
      }

      return {
         delay: 1,
         action: () => {
            register += r[1];
         }
      };
   });
   while (li < instructionsWithTimes.length) {
      const line = instructionsWithTimes[li];
      const c = i % 40;
      const r = Math.floor(i / 40);
      if (c === 0) {
         image.push([]);
      }

      image[r][c] = Math.abs(register - c) <= 1 ? '#' : '.';

      if (line.delay) {
         line.delay--;
      } else {
         li++;
         line.action();
      }
      i++;
   }
   return image.map(r => r.join('')).join('\n').trim();
};

module.exports = {parseInput, runPart1, runPart2};