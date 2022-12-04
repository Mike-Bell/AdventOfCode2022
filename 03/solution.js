const sum = require('../utils/sum');

const parseInput = input => input.split('\r\n').map(r => r.split(''));

const getValue = c => c.toLowerCase() === c ? c.charCodeAt(0) - 'a'.charCodeAt(0) + 1 : c.charCodeAt(0) - 'A'.charCodeAt(0) + 27;

const runPart1 = input => sum(input.map(r => {
   const [c1, c2] = [r.slice(0, r.length / 2), r.slice(r.length / 2)];
   return getValue(c1.find(item => c2.find(item2 => item2 === item)));
}));

const runPart2 = input => sum(input.reduce((acc, curr, i) => i % 3 === 0 ? [...acc, [curr, input[i + 1], input[i + 2]]] : acc, [])
   .map(g => getValue(g[0].find(item => g[1].find(i2 => item === i2) && g[2].find(i2 => item === i2)))));

module.exports = {parseInput, runPart1, runPart2};