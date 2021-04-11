const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const colors = require('colors/safe')

const twoSpaces = '  ' // for log indentation

let projectRoot

module.exports = function (context) {
  console.log(`${context.hook} : ${path.relative(context.opts.projectRoot, context.scriptLocation)}`)

  projectRoot = context.opts.projectRoot
  console.log(twoSpaces + 'Project root directory: ' + projectRoot)

  const npmFilesToImportFileName = path.join(projectRoot, 'npmFilesToImport.json')
  console.log(twoSpaces + 'Importing npm files to copy from ' + colors.cyan(npmFilesToImportFileName) + '\n')

  const rawdata = fs.readFileSync(npmFilesToImportFileName, 'utf8')
  let npmFilesToImport
  try {
    npmFilesToImport = JSON.parse(rawdata)
  } catch (err) {
    console.log(err)
    console.log(colors.red(`\nERROR: Your JSON file "${npmFilesToImportFileName}" has syntax errors:\n`))
    console.log(rawdata)
    process.exit(1)
  }

  const throwJsonError = function (msg) {
    if (msg) {
      console.log(colors.red(msg), '\n')
    }
    console.log(colors.red(`JSON file "${npmFilesToImportFileName}" has good syntax but fails template, see readme on https://www.npmjs.com/package/cordova-import-npm`))
    process.exit(1)
  }

  for (const npmPackage in npmFilesToImport) {
    const npmFiles = npmFilesToImport[npmPackage]

    if (!Array.isArray(npmFiles) && typeof npmFiles === 'object') {
      // in case just one file is copied for the npm package
      if (!(Array.isArray(npmFiles.from) || typeof npmFiles.from === 'string')) {
        throwJsonError(`Path "${npmFiles.from}" related to package ${npmPackage} must be string or array`)
      }
      if (!(Array.isArray(npmFiles.to) || typeof npmFiles.to === 'string')) {
        throwJsonError(`Path "${npmFiles.to}" related to package ${npmPackage} must be string or array`)
      }

      copyFile(npmPackage,
        Array.isArray(npmFiles.from) ? path.join.apply(this, npmFiles.from) : npmFiles.from,
        Array.isArray(npmFiles.to) ? path.join.apply(this, npmFiles.to) : npmFiles.to
      )
    } else if (Array.isArray(npmFiles)) {
      // in case several files are copied for the npm package
      for (let i = 0; i < npmFiles.length; i++) {
        const npmFilesI = npmFiles[i]

        if (!(Array.isArray(npmFilesI.from) || typeof npmFilesI.from === 'string')) {
          throwJsonError(`Path "${npmFilesI.from}" related to package ${npmPackage} must be string or array`)
        }
        if (!(Array.isArray(npmFilesI.to) || typeof npmFilesI.to === 'string')) {
          throwJsonError(`Path "${npmFilesI.to}" related to package ${npmPackage} must be string or array`)
        }

        copyFile(npmPackage,
          Array.isArray(npmFilesI.from) ? path.join.apply(this, npmFilesI.from) : npmFilesI.from,
          Array.isArray(npmFilesI.to) ? path.join.apply(this, npmFilesI.to) : npmFilesI.to
        )
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
