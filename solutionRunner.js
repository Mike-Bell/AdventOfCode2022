const fs = require('fs');
const solutionArg = process.argv[2];
const isForce = process.argv[3] === 'force';

if (!solutionArg) {
   console.log('Provide a number or number-number arg.\n For example: "npm run solution 1" or "npm run solution 7-2"');
   process.exit();
}

const args = solutionArg.split('-');
let day = args[0];
if (day.length === 1) {
   day = `0${day}`;
}

console.time('solution');

let input = fs.readFileSync(`./${day}/input.txt`, 'utf8');
const solutionRunner = require(`./${day}/solution.js`);
if (solutionRunner.parseInput) {
   input = solutionRunner.parseInput(input);
}

if (args.length === 1) {
   console.log(solutionRunner.runPart1(input));
   console.log(solutionRunner.runPart2(input));
} else {
   const oneOrTwo = args[1];
   if (oneOrTwo !== '1' && oneOrTwo !== '2' && !isForce) {
      console.log('Number after dash must be 1 or 2. Make next arg `force` to override this.');
      process.exit();
   }
   console.log(solutionRunner[`runPart${oneOrTwo}`](input));
}

console.timeEnd('solution');