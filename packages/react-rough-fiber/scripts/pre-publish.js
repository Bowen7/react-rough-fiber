const fs = require('fs');
const path = require('path');

const packagePath = path.join(__dirname, '../package.json');
const package = JSON.parse(fs.readFileSync(packagePath, 'utf8').toString());

package.main = './dist/index.js';
package.types = './dist/index.d.ts';
package.module = './dist/index.mjs';
package.exports = {
  ".": {
    "require": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "default": {
      "types": "./dist/index.d.mts",
      "default": "./dist/index.mjs"
    }
  }
};

fs.writeFileSync(packagePath, JSON.stringify(package, null, 2));
