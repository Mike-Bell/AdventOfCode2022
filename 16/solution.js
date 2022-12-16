const parseInput = input => input.split('\r\n').reduce((acc, line) => {
   const splitLine = line.split(';');
   const label = line.slice(6, 8);
   const flow = +splitLine[0].split('=')[1];
   const rhs = splitLine[1].replace('valve ', 'valves ').replace('tunnel ', 'tunnels ').replace('leads ', 'lead ');
   const children = rhs.slice(24).split(', ');
   acc[label] = {
      label,
      flow,
      children
   };
   return acc;
}, {});

const getDistances = (label, steps, distances, nodes) => {
   const d = distances[label];
   if (typeof d !== 'undefined' && d <= steps) {
      return;
   }
   distances[label] = steps;
   nodes[label].children.forEach(child => {
      getDistances(child, steps + 1, distances, nodes);
   });
};

const getLabelsWithFlow = nodes => Object.values(nodes).filter(n => n.flow > 0).map(n => n.label);

const getCondensedNodes = (nodes, labelsWithFlow) => {
   const condensedNodes = {};

   [...labelsWithFlow, 'AA'].forEach(label => {
      const node = nodes[label];
      const condensedNode = {
         label: node.label,
         flow: node.flow
      };

      const distances = {};
      getDistances(label, 0, distances, nodes);
      condensedNode.distances = distances;

      condensedNodes[label] = condensedNode;
   });

   return condensedNodes;
};

const runPart1 = nodes => {
   const labelsWithFlow = getLabelsWithFlow(nodes);
   const condensedNodes = getCondensedNodes(nodes, labelsWithFlow);

   let maxScore = 0;
   const traverse = (node, steps, score, targets) => {
      if (score > maxScore) {
         maxScore = score;
      }

      let potential = score;
      for (const target of targets) {
         potential += target.flow * Math.max(steps - node.distances[target.label] - 1, 0);
      }

      if (potential <= maxScore) {
         return;
      }

      for (const target of targets) {
         const nextSteps = steps - node.distances[target.label] - 1;
         if (nextSteps > 0) {
            traverse(target, nextSteps, score + target.flow * nextSteps, targets.filter(t => t.label !== target.label));
         }
      }
   };

   traverse(condensedNodes.AA, 30, 0, labelsWithFlow.map(l => condensedNodes[l]));

   return maxScore;
};

const runPart2 = nodes => {
   const labelsWithFlow = getLabelsWithFlow(nodes);
   const condensedNodes = getCondensedNodes(nodes, labelsWithFlow);

   let maxScore = 0;
   const traverse = (node1, node2, steps1, steps2, score, targets) => {
      if (score > maxScore) {
         maxScore = score;
      }

      let potential = score;
      for (const target of targets) {
         potential += target.flow * Math.max(steps1 - 1 - node1.distances[target.label], steps2 - 1 - node2.distances[target.label], 0);
      }

      if (potential <= maxScore) {
         return;
      }

      for (const target of targets) {
         const nextSteps1 = steps1 - node1.distances[target.label] - 1;
         if (nextSteps1 > 0) {
            if (nextSteps1 >= steps2) {
               traverse(target, node2, nextSteps1, steps2, score + target.flow * nextSteps1, targets.filter(t => t.label !== target.label));
            } else {
               traverse(node2, target, steps2, nextSteps1, score + target.flow * nextSteps1, targets.filter(t => t.label !== target.label));
            }
         }
      }
   };

   traverse(condensedNodes.AA, condensedNodes.AA, 26, 26, 0, labelsWithFlow.map(l => condensedNodes[l]));

   return maxScore;
};

module.exports = {parseInput, runPart1, runPart2};