const sum = require('../utils/sum');

const parseInput = input => input.split('\r\n').map(r => r.split(' '));

const runPart1 = input => sum(input.map(r => ((r[1].charCodeAt(0) - r[0].charCodeAt(0) + 300 - 1) % 3) * 3 + r[1].charCodeAt(0) - 'X'.charCodeAt(0) + 1));

const runPart2 = input => runPart1(input.map(r => [r[0], String.fromCharCode((r[0].charCodeAt(0) + r[1].charCodeAt(0) + 300 + 2) % 3 + 'X'.charCodeAt(0))]));

module.exports = {parseInput, runPart1, runPart2};