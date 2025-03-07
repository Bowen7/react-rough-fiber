import fs from 'node:fs'
import path from 'node:path'
import { addFieldsIntoPackageJSON } from './utils.mjs'

const packagePath = path.join(__dirname, '../package.json')
const packageJSON = JSON.parse(fs.readFileSync(packagePath, 'utf8').toString())

addFieldsIntoPackageJSON(packageJSON)

fs.writeFileSync(packagePath, JSON.stringify(packageJSON, null, 2))
