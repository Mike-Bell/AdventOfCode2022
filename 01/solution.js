const sum = require('../utils/sum');

const parseInput = input => input.split('\r\n\r\n').map(r => r.split('\r\n').map(n => +n));

const runPart1 = input => Math.max(...input.map(r => sum(r)));

const runPart2 = input => sum(input.map(r => sum(r)).sort((a, b) => b - a).slice(0, 3));

module.exports = {parseInput, runPart1, runPart2};