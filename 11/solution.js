const range = require('../utils/range');

const parseInput = input => input.split('\r\n').reduce((acc, curr, i, lines) => i % 7 !== 0 ? acc : [...acc, {
   items: lines[i + 1].slice(18).split(', ').map(n => +n),
   operation: (() => {
      const operator = lines[i + 2][23];
      const operandStr = lines[i + 2].slice(25);
      if (operandStr === 'old') {
         return old => old * old;
      }
      const operand = +operandStr;
      return operator === '+' ? (old => old + operand) : (old => old * operand);
   })(),
   test: (() => {
      const divisor = +lines[i + 3].split(' ')[5];
      return worry => worry % divisor === 0;
   })(),
   divisor: +lines[i + 3].split(' ')[5],
   targets: [
      +lines[i + 4].split(' ')[9],
      +lines[i + 5].split(' ')[9]
   ]
}], []);

const runPart1 = monkeys => {
   const inspections = monkeys.map(() => 0);
   range(20).forEach(() => {
      monkeys.forEach((monkey, m) => {
         monkey.items.forEach(item => {
            const newWorry = Math.floor(monkey.operation(item) / 3);
            const target = monkey.targets[monkey.test(newWorry) ? 0 : 1];
            monkeys[target].items.push(newWorry);
         });
         inspections[m] += monkey.items.length;
         monkey.items = [];
      });
   });

   const sortedInspections = inspections.sort((a, b) => b - a);

   return sortedInspections[0] * sortedInspections[1];
};

const runPart2 = monkeys => {
   const mod = monkeys.reduce((acc, curr) => acc * curr.divisor, 1);
   const inspections = monkeys.map(() => 0);
   range(10000).forEach(() => {
      monkeys.forEach((monkey, m) => {
         monkey.items.forEach(item => {
            const newWorry = monkey.operation(item) % mod;
            const target = monkey.targets[monkey.test(newWorry) ? 0 : 1];
            monkeys[target].items.push(newWorry);
         });
         inspections[m] += monkey.items.length;
         monkey.items = [];
      });
   });
   const sortedInspections = inspections.sort((a, b) => b - a);

   return sortedInspections[0] * sortedInspections[1];
};

module.exports = {parseInput, runPart1, runPart2};