#!/usr/bin/env node

const fs = require('fs')
// const fse = require('fs-extra')
const path = require('path')
const colors = require('colors/safe')

const xml2js = require('xml2js')
const parser = new xml2js.Parser()
const builder = new xml2js.Builder()

const importNpmPackagesFilePath = 'node_modules/cordova-import-npm/scripts/importNpmPackages.js'

// the directory from which the command npx is being called/run
// which according to setup instructions is the root directory of the main module which depends on this module
const projectRootDirectory = process.env.INIT_CWD || process.cwd()

const isTest = process.argv[2] === '--test'
if (!isTest) {
  console.log('Setup script called from ' + colors.cyan(projectRootDirectory))
}

process.exitCode = 0 // no error

const configXmlFileName = isTest
  ? path.join(__dirname, '..', 'test', 'config.xml')
  : path.join(projectRootDirectory, 'config.xml')

console.log(`Editing config.xml:${colors.cyan(configXmlFileName)}`)

const rawdata = fs.readFileSync(configXmlFileName, 'utf8')

parser.parseString(rawdata, function (err, result) {
  if (err) {
    throwInvalidConfigXml(err)
  }

  const xmlObj = result

  const widget = xmlObj.widget
  if (!widget) {
    throwInvalidConfigXml('No widget in config.xml')
  }

  const newHook = {
    $: { src: importNpmPackagesFilePath, type: 'before_prepare' }
  }

  if (widget.hook) {
    if (!Array.isArray(widget.hook)) {
      throwInvalidConfigXml()
    }
    console.log('Some hooks already exist in config.xml')

    for (const hook of widget.hook) {
      if (hook.$.src === importNpmPackagesFilePath) {
        console.log(`Hook ${colors.cyan(importNpmPackagesFilePath)} already exists in config.xml, doing nothing`)
        createnJsonFile()
        return
      }
    }

    console.log('Adding new hook into config.xml:')
    console.log(`  <hook src="${importNpmPackagesFilePath}" type="before_prepare"/>`)
    widget.hook.push(newHook)
  } else {
    console.log('No hooks in root widget of config.xml, adding new one:')
    console.log(`  <hook src="${importNpmPackagesFilePath}" type="before_prepare"/>`)
    widget.hook = []
    widget.hook.push(newHook)
  }

  const xml = builder.buildObject(xmlObj)
  fs.writeFileSync(configXmlFileName, xml, 'utf8')
  console.log(colors.green('config.xml edited with success'))

  createnJsonFile()
})

function createnJsonFile () {
  if (isTest) { return }

  const jsonFile = path.join(projectRootDirectory, 'npmFilesToImport.json')

  try {
    if (fs.existsSync(jsonFile)) {
      console.log(`File ${jsonFile} already exists, doing nothing`)
    } else {
      const fileContent = JSON.stringify({})
      fs.writeFileSync(jsonFile, fileContent, 'utf8')

      console.log(`Empty file ${colors.cyan(jsonFile)} created`)
      console.log('For syntax on this file check: ' + colors.cyan('https://github.com/jfoclpf/cordova-import-npm'))
    }
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  }
}

function throwInvalidConfigXml (msg) {
  console.log(colors.red('Invalid config.xml file'))
  if (msg) {
    console.log(msg)
  }
  process.exitCode = 1
}
