import fs from 'node:fs'
import path from 'node:path'
import { Repository } from '@napi-rs/simple-git'
import { addFieldsIntoPackageJSON } from './utils.mjs'

const repo = new Repository(path.resolve(__dirname, '../../../'))
const headReference = repo.head()
const shortSHA = headReference.target().slice(0, 7)
const packagePath = path.join(__dirname, '../package.json')
const packageJSON = JSON.parse(fs.readFileSync(packagePath, 'utf8').toString())

addFieldsIntoPackageJSON(packageJSON)

const version = packageJSON.version
packageJSON.version = `${version}-experimental-${shortSHA}`

fs.writeFileSync(packagePath, JSON.stringify(packageJSON, null, 2))
