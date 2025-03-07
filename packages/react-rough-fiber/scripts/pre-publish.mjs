import fs from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { addFieldsIntoPackageJSON } from './utils.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const packagePath = path.join(__dirname, '../package.json')
const packageJSON = JSON.parse(fs.readFileSync(packagePath, 'utf8').toString())

addFieldsIntoPackageJSON(packageJSON)

fs.writeFileSync(packagePath, JSON.stringify(packageJSON, null, 2))
