var cordovaImportNpm = require('../scripts/importNpmPackages.js')
var context = {
  hook: "before_prepare",
  scriptLocation: __dirname,
  opts: {
    projectRoot: __dirname
  }
}
cordovaImportNpm(context)
