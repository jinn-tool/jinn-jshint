'use strict';

var exec = require('exec')
  , fs   = require('fs')

module.exports = function (jinn, cb) {

  jinn.log('installing jshint')

  //update package.json script
  function addPackageJsonScript() {
    var packagejson = process.cwd() + '/' + jinn.appname + '/package.json'
    fs.readFile(packagejson, 'utf8', function (err, content) {
      if (err) throw err
      var pjson = JSON.parse(content)
      pjson.scripts.jshint = 'jshint .'
      fs.writeFile(packagejson, JSON.stringify(pjson, null, 2), cb)
    })
  }

  //install jshint
  function installJsHint() {
    var cd = 'cd ' + process.cwd() + '/' + jinn.appname
    var install = 'npm install --save-dev jshint'
    exec(cd + ' && ' + install, addPackageJsonScript)
  }

  function copyJshintignore() {
    var source = fs.createReadStream(__dirname + '/templates/.jshintignore')
    var dest   = fs.createWriteStream(process.cwd() + '/' + jinn.appname + '/.jshintignore')
    source.pipe(dest)

    source.on('end', installJsHint)
  }

  //copy jsjintrc
  function copyJshintrc() {
    var jshintrcSrc = __dirname + '/templates/jshintrc.json'
    var jshintrcDest = process.cwd() + '/' + jinn.appname + '/.jshintrc'

    fs.readFile(jshintrcSrc, 'utf8', function (err, content) {
      if (err) throw err
      var jshint = JSON.parse(content)
      if (jinn.options.esnext) jshint.esnext = true
      fs.writeFile(jshintrcDest, JSON.stringify(jshint, null, 2), copyJshintignore)
    })
  }

  copyJshintrc()

}
