export function addFieldsIntoPackageJSON(packageJson) {
  packageJson.main = './dist/index.js'
  packageJson.types = './dist/index.d.ts'
  packageJson.module = './dist/index.mjs'
  packageJson.exports = {
    '.': {
      require: {
        types: './dist/index.d.ts',
        default: './dist/index.js',
      },
      default: {
        types: './dist/index.d.mts',
        default: './dist/index.mjs',
      },
    },
  }
}
