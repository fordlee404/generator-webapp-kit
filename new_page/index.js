'use strict';
var chalk, fs, path, yeoman, yosay;

yeoman = require('yeoman-generator');

chalk = require('chalk');

yosay = require('yosay');

fs = require('fs');

path = require('path');

module.exports = yeoman.generators.Base.extend({
  prompting: {
    name: function() {
      var done, prompts, root;
      done = this.async();
      root = this.destinationRoot();
      prompts = [
        {
          type: 'input',
          name: 'pageName',
          message: 'What is the name of this new page'
        }
      ];
      this.prompt(prompts, (function(props) {
        if (!props.pageName) {
          this.log('Page name cannot be empty.');
          process.exit();
        }
        this.config.set(props);
        done();
      }).bind(this));
    },
    path: function() {
      var done, prompts, root;
      done = this.async();
      root = this.destinationRoot();
      prompts = [
        {
          type: 'input',
          name: 'pagePath',
          message: 'Save path',
          "default": '/'
        }
      ];
      this.prompt(prompts, (function(props) {
        var pagePath;
        if (!(pagePath = props.pagePath)) {
          this.log('Page path cannot be empty.');
          process.exit();
        }
        this.config.set(props);
        done();
      }).bind(this));
    }
  },
  parts: function() {
    var done, prompt;
    done = this.async();
    prompt = [
      {
        type: 'checkbox',
        name: 'parts',
        message: 'Select parts: ',
        choices: [
          {
            name: 'Stylesheet',
            value: 'stylesheet',
            checked: true
          }, {
            name: 'HTML Page',
            value: 'html',
            checked: true
          }, {
            name: 'Javascript',
            value: 'js',
            checked: true
          }
        ]
      }
    ];
    this.prompt(prompt, (function(props) {
      this.config.set(props);
      done();
    }).bind(this));
  },
  writing: {
    newPage: function() {
      var entry, entryJSON, error, jsFilePath, pageName, parts;
      parts = this.config.get('parts');
      pageName = this.config.get('pageName');
      if (-1 < parts.indexOf('js')) {
        jsFilePath = this.destinationPath('/javascripts/', this.config.get('pagePath'), "" + pageName + ".js");
        try {
          entryJSON = this.fs.read(this.destinationPath('.webpack_entry.json'));
          entry = JSON.parse(entryJSON);
        } catch (_error) {
          error = _error;
          entry = {};
        }
        entry[pageName] = './' + path.relative(this.destinationPath('./javascripts'), jsFilePath);
        fs.writeFileSync(this.destinationPath('.webpack_entry.json'), JSON.stringify(entry, null, '    '));
        this.fs.copy(this.templatePath('newPage.js'), jsFilePath);
      }
      if (-1 < parts.indexOf('html')) {
        this.fs.copy(this.templatePath('newPage.html'), this.destinationPath('/srcHTML/', this.config.get('pagePath'), "" + pageName + ".html"));
      }
      if (-1 < parts.indexOf('stylesheet')) {
        return this.fs.copy(this.templatePath('newPage.scss'), this.destinationPath('/sass/', this.config.get('pagePath'), "" + pageName + ".scss"));
      }
    }
  }
});
