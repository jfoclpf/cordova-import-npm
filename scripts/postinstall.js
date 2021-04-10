#!/usr/bin/env node

const fs = require('fs')
// const fse = require('fs-extra')
const path = require('path')
const colors = require('colors/safe')

const xml2js = require('xml2js')
const parser = new xml2js.Parser()

const isTest = process.argv[2] === '--test'
console.log('Postinstall script running on ' + colors.cyan(process.env.INIT_CWD))
process.exitCode = 0

const configXmlFileName = isTest
  ? path.join(__dirname, '..', 'test', 'config.xml')
  : path.join(process.env.INIT_CWD, 'config.xml')

console.log(`Reading file ${colors.cyan(configXmlFileName)}`)

const rawdata = fs.readFileSync(configXmlFileName, 'utf8')
parser.parseString(rawdata, function (err, result) {
  if (err) {
    throwInvalidConfigXml(err)
  }

  const main = result.widget
  if (!main) {
    throwInvalidConfigXml('no widget')
  }

  if (main.hook) {
    const hookDir = main.hook[0].$.src
    console.log('Hook already detected and using directory ' + colors.cyan(hookDir))
  }
  console.log(result)
})

function throwInvalidConfigXml (msg) {
  console.log(colors.red('Invalid config.xml file'))
  if (msg) {
    console.log(msg)
  }
  process.exit(1)
}
