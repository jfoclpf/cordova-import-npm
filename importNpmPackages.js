const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const colors = require('colors/safe')

const twoSpaces = '  ' // for log indentation

var projectRoot

module.exports = function (context) {
  console.log(`${context.hook} : ${path.relative(context.opts.projectRoot, context.scriptLocation)}`)

  projectRoot = context.opts.projectRoot
  console.log(twoSpaces + 'Project root directory: ' + projectRoot)

  var npmFilesToImportFileName = context.isThisATest ? 'npmFilesToImport_Example.json' : 'npmFilesToImport.json'
  console.log(twoSpaces + 'Importing npm files to copy from ' + colors.cyan(npmFilesToImportFileName) + '\n')

  var rawdata = fs.readFileSync(npmFilesToImportFileName, 'utf8')
  try {
    var npmFilesToImport = JSON.parse(rawdata);
  } catch(e) {
    console.log(colors.red(`\nERROR: Your JSON file "${npmFilesToImportFileName}" has syntax errors:\n`))
    console.log(rawdata)
    process.exit(1)
  }

  for (let npmPackage in npmFilesToImport) {
    let npmFiles = npmFilesToImport[npmPackage]
    if (!Array.isArray(npmFiles) && typeof npmFiles === 'object') {
      copyFile(npmPackage, path.join.apply(this, npmFiles.from), path.join.apply(this, npmFiles.to))
    } else if (Array.isArray(npmFiles)){
      for (let i = 0; i < npmFiles.length; i++) {
        npmFilesI = npmFiles[i]
        copyFile(npmPackage, path.join.apply(this, npmFilesI.from), path.join.apply(this, npmFilesI.to))
      }
    } else {
      console.log(colors.red(`JSON file "${npmFilesToImportFileName}" has good syntax but fails template, see readme on https://www.npmjs.com/package/cordova-import-npm`))
      process.exit(1)
    }
  }
}

function copyFile (npmPackage, // oficial name of the npm package from which the file is to be copied from
  fileRelativePath, // file path with respect to the main directory of the npm package (node_modules/<package>/)
  destFilePath) { // file's path to where it is copied, relative to the project www/ directory
  // trick to get the npm module main directory
  // https://stackoverflow.com/a/49455609/1243247
  const packageDirFullpath = path.dirname(require.resolve(path.join(npmPackage, 'package.json')))
  const fileOriginFullPath = path.join(packageDirFullpath, fileRelativePath)
  const fileDestFullPath = path.join(projectRoot, 'www', destFilePath)

  fse.copySync(fileOriginFullPath, fileDestFullPath)

  const consoleMsg = colors.cyan(npmPackage) + ': ' +
    path.relative(projectRoot, fileOriginFullPath) + ' -> ' +
    path.relative(projectRoot, fileDestFullPath)

  console.log(twoSpaces + consoleMsg)
}
