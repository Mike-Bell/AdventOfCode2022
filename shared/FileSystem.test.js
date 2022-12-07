const FileSystem = require('./FileSystem');

describe('FileSystem', () => {
   describe('cd', () => {
      it('works', () => {
         const fileSystem = new FileSystem();
         fileSystem.cd('somepath');
         expect(fileSystem.currentPathAsString).toBe('/somepath');

         fileSystem.cd('path2');
         expect(fileSystem.currentPathAsString).toBe('/somepath/path2');

         fileSystem.cd('..');
         expect(fileSystem.currentPathAsString).toBe('/somepath');

         fileSystem.cd('/');
         expect(fileSystem.currentPathAsString).toBe('/');
      });
   });
});