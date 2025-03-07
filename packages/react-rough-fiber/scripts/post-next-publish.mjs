import fs from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const packagePath = path.join(__dirname, '../package.json')
const packageJSON = JSON.parse(fs.readFileSync(packagePath, 'utf8').toString())

packageJSON.main = './src/index.tsx'
delete packageJSON.types
delete packageJSON.module
delete packageJSON.exports
packageJSON.version = packageJSON.version.split('-')[0]

fs.writeFileSync(packagePath, `${JSON.stringify(packageJSON, null, 2)}\n`)
