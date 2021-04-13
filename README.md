# cordova-import-npm
Import files from npm packages into your cordova `www/` directory automatically, upon `cordova prepare`, `cordova build` or `cordova run`, and before anything else is processed.

Oftentimes we want to import the latest files available in npm packages into our `www/` directory in cordova projects. With this module you can do it automatically without building your own scripts.

## Install and setup

Just run in the root directory of your cordova project

```
npm install cordova-import-npm
npx setup-cordova-import-npm
```

It will add a [hook](https://cordova.apache.org/docs/en/10.x/guide/appdev/hooks/index.html) into `config.xml` with the type `before_prepare`, such that npm files that you setup will be imported automatically upon `cordova prepare`, `cordova build` or `cordova run`. It will also create an empty file `npmFilesToImport.json` at the root of your project for you to setup.

## Setting `npmFilesToImport.json`

You define the npm files you'd like to import by editing the file `npmFilesToImport.json` at the root of the project's directory. The syntax is the following:

```json
{
  "npmPackageName": {
    "from": "path/to/file/relative/to/npmModule/directory",
    "to": "path/to/file/relative/to/cordovaWWW/directory"
  }
}
```

The paths may be strings or arrays, though arrays are recommended as then it works in either unix or windows file systems.

Use an array of objects `{from:, to:}` to copy more than one file for each package.

## Example

Imagine you wanted the latest jquery and bootsrap files on your `www/js/res/` and `www/css/res/` directories. Just run:

```
npm install jquery bootstrap
npm install cordova-import-npm
npx setup-cordova-import-npm
```

And then edit your `npmFilesToImport.json` with this info:

```json
{
  "jquery": {
    "from": ["dist", "jquery.min.js"],
    "to": ["js", "res", "jquery.min.js"]
  },
  "bootstrap": [
    {
      "from": ["dist", "js", "bootstrap.min.js"],
      "to": ["js", "res", "bootstrap.min.js"]
    },
    {
      "from": ["dist", "css", "bootstrap.min.css"],
      "to": ["css", "res", "bootstrap.min.css"]
    }
  ]
}
```

Then every time you run `cordova prepare`, `cordova build` or `cordova run`, the npm files will be copied before anything else is processed, from the respective package modules to the `www/` directory.
