// const fs = require('fs')
// const fse = require('fs-extra')
// const path = require('path')
const colors = require('colors/safe')

// const xml2js = require('xml2js')
// const parser = new xml2js.Parser()

// const isTest = process.argv[2] === '--test'
console.log('Postinstall script running on ' + colors.cyan(process.env.INIT_CWD))
process.exitCode = 0

/*
var configXmlFileName = isTest ? path.join(__dirname, '..', 'test', 'config.xml') : 'config.xml'

console.log(`Reading file ${colors.cyan(configXmlFileName)}`)

var rawdata = fs.readFileSync(configXmlFileName, 'utf8')
parser.parseString(rawdata, function (err, result) {
  if (err) {
    console.log(colors.red('Invalid config.xml file'))
    console.log(err)
    return
  }

  if (result.hook) {
    console.log('Hook already detected and using directory ' + colors.cyan(result.hook))
    console.log(result.hook)
  }
  console.log(result)
})
*/
