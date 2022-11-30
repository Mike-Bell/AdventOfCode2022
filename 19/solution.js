const parseInput = input => input.split('\r\n').map(row => row.split(' ')).map(split => [
   // ore, clay, obsidian, geode
   [+split[6], 0, 0],
   [+split[12], 0, 0],
   [+split[18], +split[21], 0],
   [+split[27], 0, +split[30]]
]);

const runPart1 = input => input.map(bp => {
   const states = [{
      resources: [0, 0, 0, 0],
      robots: [1, 0, 0, 0],
      time: 0
   }];
   let maxGeodes = 0;
   const maxTime = 24;
   const maxBots = [Math.max(...bp.map(cost => cost[0])), Math.max(...bp.map(cost => cost[1])), Math.max(...bp.map(cost => cost[2])), Infinity];
   while (states.length > 0) {
      const state = states.pop();
      let {time} = state;
      const {robots, resources} = state;
      const geodes = resources[3] + robots[3] * (maxTime - time);
      time++;

      if (geodes > maxGeodes) {
         maxGeodes = geodes;
      }

      if (time > maxTime) {
         continue;
      }

      for (let i = 0; i < 4; i++) {
         if (resources[i] >= maxBots[i]) {
            continue;
         }
         const bpi = bp[i];
         let timeToBuild = 0;
         for (let j = 0; j < 3; j++) {
            const timeForResource = Math.ceil((bpi[j] - resources[j]) / robots[j]);
            if (timeForResource > timeToBuild) {
               timeToBuild = timeForResource;
            }
         }

         if (timeToBuild > maxTime - time) {
            continue;
         }

         const nextResources = [];
         const nextRobots = [...robots];

         for (let j = 0; j < 4; j++) {
            nextResources[j] = resources[j] + robots[j] * (timeToBuild + 1) - (bpi[j] || 0);
         }

         nextRobots[i] += 1;

         states.push({
            resources: nextResources,
            robots: nextRobots,
            time: time + timeToBuild
         });
      }
   }
   return maxGeodes;
}).map((m, i) => m * (i + 1)).reduce((acc, curr) => acc + curr, 0);

const runPart2 = input => input.slice(0, 3).map(bp => {
   const states = [{
      resources: [0, 0, 0, 0],
      robots: [1, 0, 0, 0],
      time: 0
   }];
   let maxGeodes = 0;
   const maxTime = 32;
   const maxBots = [Math.max(...bp.map(cost => cost[0])), Math.max(...bp.map(cost => cost[1])), Math.max(...bp.map(cost => cost[2])), Infinity];
   while (states.length > 0) {
      const state = states.pop();
      let {time} = state;
      const {robots, resources} = state;
      const geodes = resources[3] + robots[3] * (maxTime - time);
      time++;

      if (geodes > maxGeodes) {
         maxGeodes = geodes;
      }

      if (time > maxTime) {
         continue;
      }

      for (let i = 0; i < 4; i++) {
         if (resources[i] >= maxBots[i]) {
            continue;
         }
         const bpi = bp[i];
         let timeToBuild = 0;
         for (let j = 0; j < 3; j++) {
            const timeForResource = Math.ceil((bpi[j] - resources[j]) / robots[j]);
            if (timeForResource > timeToBuild) {
               timeToBuild = timeForResource;
            }
         }

         if (timeToBuild > maxTime - time) {
            continue;
         }

         const nextResources = [];
         const nextRobots = [...robots];

         for (let j = 0; j < 4; j++) {
            nextResources[j] = resources[j] + robots[j] * (timeToBuild + 1) - (bpi[j] || 0);
         }

         nextRobots[i] += 1;

         states.push({
            resources: nextResources,
            robots: nextRobots,
            time: time + timeToBuild
         });
      }
   }
   return maxGeodes;
}).reduce((acc, curr) => acc * curr, 1);

module.exports = {parseInput, runPart1, runPart2};