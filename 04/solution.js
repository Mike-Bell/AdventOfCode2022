const parseInput = input => input.split('\r\n').map(r => r.split(',').map(e => e.split('-').map(n => +n)));

const runPart1 = input => input.map(pair => pair.sort((e1, e2) => e1[0] - e2[0])).filter(pair => pair[0][1] >= pair[1][1] || pair[0][0] === pair[1][0]).length;

const runPart2 = input => input.map(pair => pair.sort((e1, e2) => e1[0] - e2[0])).filter(pair => pair[0][1] >= pair[1][0]).length;

module.exports = {parseInput, runPart1, runPart2};