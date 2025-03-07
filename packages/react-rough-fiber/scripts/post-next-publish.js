const fs = require('fs');
const path = require('path');

const packagePath = path.join(__dirname, '../package.json');
const package = JSON.parse(fs.readFileSync(packagePath, 'utf8').toString());

package.main = './src/index.tsx';
delete package.types;
delete package.module;
delete package.exports;
package.version = package.version.split('-')[0];

fs.writeFileSync(packagePath, JSON.stringify(package, null, 2) + '\n');
