#!/usr/bin/env node

const fs = require('fs')
// const fse = require('fs-extra')
const path = require('path')
const colors = require('colors/safe')

const xml2js = require('xml2js')
const parser = new xml2js.Parser()
const builder = new xml2js.Builder()

const importNpmPackagesFilePath = path.join('node_modules', 'cordova-import-npm', 'scripts', 'importNpmPackages.js')

const isTest = process.argv[2] === '--test'
if (!isTest) {
  console.log('Setup script running on ' + colors.cyan(process.env.INIT_CWD))
}

process.exitCode = 0 // no error

const configXmlFileName = isTest
  ? path.join(__dirname, '..', 'test', 'config.xml')
  : path.join(process.env.INIT_CWD, 'config.xml')

console.log(`Editing config.xml:${colors.cyan(configXmlFileName)}`)

const rawdata = fs.readFileSync(configXmlFileName, 'utf8')

parser.parseString(rawdata, function (err, result) {
  if (err) {
    throwInvalidConfigXml(err)
  }

  const xmlObj = result

  const widget = xmlObj.widget
  if (!widget) {
    throwInvalidConfigXml('no widget')
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

  if (!isTest) {
    createnJsonFile()
  }
})

function createnJsonFile () {
  if (isTest) { return }

  const jsonFile = path.join(process.env.INIT_CWD, 'npmFilesToImport.json')

  try {
    if (fs.existsSync(jsonFile)) {
      console.log(`File ${jsonFile} already exists, doing nothing`)
    }
    const fileContent = JSON.stringify({})
    fs.writeFileSync(configXmlFileName, fileContent, 'utf8')

    console.log(`Empty file ${colors.cyan(jsonFile)} created`)
    console.log('For syntax on this file check: ' + colors.cyan('https://github.com/jfoclpf/cordova-import-npm'))
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
