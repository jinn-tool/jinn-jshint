'use strict';

var exec = require('exec')
  , fs   = require('fs')

module.exports = function (jinn, cb) {

  jinn.log('installing jshint')

  //update package.json script
  function addPackageJsonScript() {
    var pjson = require(process.cwd() + '/package.json')
    pjson.scripts = pjson.scripts || {}
    pjson.scripts.jshint = 'jshint .'

    cb()
  }

  //install jshint
  function installJsHint() {
    var cd = 'cd ' + process.cwd()
    var install = 'npm install --save-dev jshint'
    exec(cd + ' && ' + install, addPackageJsonScript)
  }

  function copyJshintignore() {
    fs.createReadStream(__dirname + '/templates/.jshintignore')
      .pipe(fs.createWriteStream(process.cwd() + '/' + jinn.appname + '/.jshintignore'))
      .on('end', installJsHint)
  }

  //copy jsjintrc
  function copyJshintrc() {
    var jshintrc = require(__dirname + '/templates/jshintrc.json')
    if (jinn.options.esnext) jshintrc.esnext = true
    fs.writeFileSync(process.cwd() + '/' + jinn.appname + '/.jshintrc', JSON.stringify(jshintrc, null, 2))
    copyJshintignore()
  }

  copyJshintrc()

}
