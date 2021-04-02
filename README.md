# On development, don't use this yet...
# cordova-import-npm
Import files from npm packages into your cordova `www/` directory automatically, upon `cordova prepare` or `cordova build`

Oftentimes we want to import files available in npm modules into our `www/` directory in cordova projects. With this module you can do it automatically.

## Install

Just run in the root directory of your cordova project

`npm i cordova-import-npm`

It will add a hook at your hooks directory (if you have none defined in `config.xml` it will use `hooks/`) and edit your `config.xml` accordingly, such that npm files that you set will be imported upon `cordova prepare` or `cordova build`

## Settings

You define the npm files you'd like to import by editing the file `npmFilesToImport.json`. The syntax is the following:

```json
{
  "npmPackageName": {
    "from": "path/to/file/relative/to/npmModule/directory",
    "to": "path/to/file/relative/to/cordovaWWW/directory"
  }
}
```

The paths may be strings or arrays, though arrays are recommended as then it works in either unix or windows file systems.
Use an array to copy more than one file for each package.

## Example

Imagine you wanted the latest jquery and bootsrap files on your `www/js/res/` and `www/css/res/` directories. Just run

```
npm i cordova-import-npm
npm i jquery bootstrap
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
    },
  ],
}
```

Then run `cordova prepare` or `cordova build` and the npm files will be copied before anything else is processed.
