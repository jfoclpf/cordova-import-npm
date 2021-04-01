var cordovaImportNpm = require('./importNpmPackages.js')
var context = {
  hook: "before_prepare",
  scriptLocation: __dirname,
  opts: {
    projectRoot: __dirname
  },
  isThisATest: true
}
cordovaImportNpm(context)
