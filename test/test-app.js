'use strict';

var path = require('path');
var fs = require('fs');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('webapp-kit:app', function () {
  describe('when app name have whitespace', function(){
    before(function(done){
      helpers.run(path.join(__dirname, '../app'))
        .withOptions({ skipInstall: true })
        .withPrompts({
          appName: 'Test example'
        })
        .on('end',done);
    });

    it('change whitespace to middle line in app name', function(){
      var pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      console.log(pkg.name);
      assert.equal(pkg.name, 'Test-example');
    });

    it('creates files', function () {
      assert.file([
        'bower.json',
        'package.json',
        '.editorconfig',
        '.jshintrc'
      ]);
    });
  });
});
