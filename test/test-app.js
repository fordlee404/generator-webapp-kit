'use strict';

var path = require('path');
var fs = require('fs');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('webapp-kit:app', function () {
  describe('all default input', function(){
    before(function(done){
      helpers.run(path.join(__dirname, '../app'))
        .withOptions({ skipInstall: true })
        .on('end',done);
    });

    it('create files', function(){
      assert.file([
        'Readme.md',
        'Gruntfile.coffee',
        'webpack.config.js',
        'webpack.production.config.js',
        'HTML/Readme.md',
        'scripts/Readme.md',
        'fake-response/Readme.md',
        'images/Readme.md',
        'plugins/Readme.md',
        'psd/Readme.md',
        'stylesheets/Readme.md',
        'HTML/common/_page-head.html',
        'HTML/common/_page-foot.html',
        'stylesheets/common/util.css',
        'stylesheets/common/common.css',
        'HTML/index.html',
        'stylesheets/pages/website-index.css',
        'scripts/pages/website-index.js',
        'app-entry.js',
        '.jshintrc',
        '.jscsrc',
        'coffeelint.json'
      ]);
    });
  });

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
      assert.equal(pkg.name, 'Test-example');
    });
  });
});
