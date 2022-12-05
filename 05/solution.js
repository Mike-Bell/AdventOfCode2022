const range = require('../utils/range');

const parseInput = input => {
   const stacks = [];
   const lines = input.split('\r\n');
   let lineN = 0;
   let line = lines[0];

   while (line[1] !== '1') {
      let stack = 0;
      for (let i = 1; i < line.length; i += 4) {
         stacks[stack] = stacks[stack] || [];
         if (line[i] !== ' ') {
            stacks[stack].unshift(line[i]);
         }
         stack++;
      }
      lineN++;
      line = lines[lineN];
   }

   lineN += 2;

   const instructions = [];
   while (lines[lineN]) {
      const splitLine = lines[lineN].split(' ');
      instructions.push([+splitLine[1], +splitLine[3], +splitLine[5]]);
      lineN++;
   }
   return {instructions, stacks};
};

const runPart1 = ({instructions, stacks}) => {
   instructions.forEach(instruction => {
      range(instruction[0]).forEach(() => {
         stacks[instruction[2] - 1].push(stacks[instruction[1] - 1].pop());
      });
   });

   return stacks.map(s => s[s.length - 1]).join('');
};

const runPart2 = ({instructions, stacks}) => {
   instructions.forEach(instruction => {
      const origin = stacks[instruction[1] - 1];
      const target = stacks[instruction[2] - 1];
      target.push(...origin.splice(origin.length - instruction[0]));
   });

   return stacks.map(s => s[s.length - 1]).join('');
};

module.exports = {parseInput, runPart1, runPart2};