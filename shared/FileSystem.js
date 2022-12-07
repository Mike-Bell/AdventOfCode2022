const sum = require('../utils/sum');

module.exports = class FileSystem {
   constructor() {
      this.knownDirs = {children: {}, files: {}};
      this.currentPath = [];
      this.currentDir = this.knownDirs;
   }

   get currentPathAsString() {
      return `/${this.currentPath.join('/')}`;
   }

   setCurrentDir() {
      let dir = this.knownDirs;
      this.currentPath.forEach(p => {
         dir = dir.children[p];
      });

      this.currentDir = dir;
   }

   cd(arg) {
      switch (arg) {
         case ('/'): {
            this.currentPath = [];
            break;
         } case ('..'): {
            this.currentPath = this.currentPath.slice(0, this.currentPath.length - 1);
            break;
         } default: {
            this.currentPath = [...this.currentPath, arg];
         }
      }
      this.setCurrentDir();
   }

   addFileInfo(size, name) {
      this.currentDir.files[name] = size;
   }

   addDirInfo(name) {
      this.currentDir.children[name] = this.currentDir.children[name] || {children: {}, files: {}};
   }

   getDirSize(dir) {
      return sum(Object.values(dir.files))
         + sum(Object.values(dir.children).map(d => this.getDirSize(d)));
   }

   walkDirs(dir, path, cb) {
      cb(dir, path);
      Object.entries(dir.children).forEach(([childPathFragment, childDir]) => {
         this.walkDirs(childDir, `${path}/${childPathFragment}`, cb);
      });
   }

   getDirSizes() {
      const sizes = {};
      this.walkDirs(this.knownDirs, '', (d, p) => {
         sizes[p] = this.getDirSize(d);
      });
      return sizes;
   }

   processProblem7InputLines(input) {
      let i = 0;
      while (i < input.length) {
         const command = input[i];
         switch (command[1]) {
            case 'cd': {
               this.cd(command[2]);
               i++;
               break;
            }
            case 'ls': {
               i++;
               while (i < input.length) {
                  const nextCommand = input[i];
                  if (nextCommand[0] === '$') {
                     break;
                  } else if (nextCommand[0] === 'dir') {
                     this.addDirInfo(nextCommand[1]);
                  } else {
                     this.addFileInfo(+nextCommand[0], nextCommand[1]);
                  }
                  i++;
               }
            }
         }
      }
   }
};