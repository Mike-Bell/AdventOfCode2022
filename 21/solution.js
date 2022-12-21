const parseInput = input => input.split('\r\n').map(line => line.split(': ')).reduce((acc, line) => {
   if (isNaN(line[1])) {
      const splitRhs = line[1].split(' ');
      acc[line[0]] = {
         isSolved: false,
         operand1: splitRhs[0],
         operand2: splitRhs[2],
         operator: splitRhs[1]
      };
   } else {
      acc[line[0]] = {
         isSolved: true,
         value: +line[1]
      };
   }
   return acc;
}, {});

const operations = {
   '+': (a, b) => a + b,
   '-': (a, b) => a - b,
   '/': (a, b) => a / b,
   '*': (a, b) => a * b
};

const runPart1 = nodes => {
   const toSolve = [nodes.root];
   while (toSolve.length > 0) {
      const node = toSolve[toSolve.length - 1];
      if (node.isSolved) {
         toSolve.pop();
      } else {
         const n1 = nodes[node.operand1];
         const n2 = nodes[node.operand2];
         if (n1.isSolved && n2.isSolved) {
            node.isSolved = true;
            node.value = operations[node.operator](n1.value, n2.value);
         } else {
            toSolve.push(n1);
            toSolve.push(n2);
         }
      }
   }
   return nodes.root.value;
};

const runPart2 = nodes => {
   let label = 'humn';
   const entries = Object.entries(nodes);
   while (label !== 'root') {
      // eslint-disable-next-line no-loop-func
      const entry = entries.find(e => e[1].operand1 === label || e[1].operand2 === label);
      label = entry[0];
      entry[1].containsHuman = true;
   }
   {
      // pre-solve whatever we can
      const toSolve = [nodes[nodes.root.operand1], nodes[nodes.root.operand2]];
      while (toSolve.length > 0) {
         const node = toSolve[toSolve.length - 1];
         if (node.isSolved || node.containsHuman) {
            toSolve.pop();
         } else {
            const n1 = nodes[node.operand1];
            const n2 = nodes[node.operand2];
            if (n1.isSolved && n2.isSolved) {
               node.isSolved = true;
               node.value = operations[node.operator](n1.value, n2.value);
            } else {
               toSolve.push(n1);
               toSolve.push(n2);
            }
         }
      }
   }

   const tryHumanValue = h => {
      const nodesClone = JSON.parse(JSON.stringify(nodes));
      nodesClone.humn.value = h;
      const toSolve = [nodesClone[nodesClone.root.operand1], nodesClone[nodesClone.root.operand2]];
      while (toSolve.length > 0) {
         const node = toSolve[toSolve.length - 1];
         if (node.isSolved) {
            toSolve.pop();
         } else {
            const n1 = nodesClone[node.operand1];
            const n2 = nodesClone[node.operand2];
            if (n1.isSolved && n2.isSolved) {
               node.isSolved = true;
               node.value = operations[node.operator](n1.value, n2.value);
            } else {
               toSolve.push(n1);
               toSolve.push(n2);
            }
         }
      }
      return nodesClone[nodesClone.root.operand2].value - nodesClone[nodesClone.root.operand1].value;
   };

   const sign = x => x < 0 ? -1 : 1;

   const g1 = [0, -1];
   const g2 = [2, -1];

   /*
      Expand g2 until [g1, g2] ecompasses the solution
   */
   // eslint-disable-next-line no-constant-condition
   while (true) {
      g1[1] = tryHumanValue(g1[0]);
      g2[1] = tryHumanValue(g2[0]);
      if (g1[1] === 0) {
         return g1[0];
      }

      if (g2[1] === 0) {
         return g2[0];
      }

      if (sign(g2[1]) === sign(g1[1])) {
         g1[0] = g2[0];
         g2[0] = g2[0] * 2;
         continue;
      }
      break;
   }

   /*
      Binary search [g1, g2] for the solution
   */
   // eslint-disable-next-line no-constant-condition
   while (true) {
      if (g1[1] === 0) {
         return g1[0];
      }

      if (g2[1] === 0) {
         return g2[0];
      }
      const mid = Math.floor((g1[0] + g2[0]) / 2);
      const t = tryHumanValue(mid);
      if (t === 0) {
         return mid;
      }

      if (sign(t) === sign(g1[1])) {
         g1[0] = mid;
         g1[1] = t;
      } else {
         g2[0] = mid;
         g2[1] = t;
      }
   }
};

module.exports = {parseInput, runPart1, runPart2};