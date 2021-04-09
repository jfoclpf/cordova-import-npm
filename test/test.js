const cordovaImportNpm = require('../scripts/importNpmPackages.js')
const context = {
  hook: 'before_prepare',
  scriptLocation: __dirname,
  opts: {
    projectRoot: __dirname
  }
}
cordovaImportNpm(context)
