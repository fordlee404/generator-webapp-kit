'use strict';
var chalk, fs, inArray, sortPrompts, yeoman, yosay;

yeoman = require('yeoman-generator');

chalk = require('chalk');

yosay = require('yosay');

fs = require('fs');

inArray = function(value, array) {
  var val, _i, _len;
  for (_i = 0, _len = array.length; _i < _len; _i++) {
    val = array[_i];
    if (val === value) {
      return true;
    }
  }
  return false;
};

sortPrompts = function(a, b) {
  if (a.name > b.name) {
    return 1;
  }
  if (b.name > a.name) {
    return -1;
  }
  return 0;
};

module.exports = yeoman.generators.Base.extend({
  initializing: function() {
    this.pkg = require('../package.json');
  },
  prompting: {
    welcome: function() {
      this.log(yosay('Welcome to the fantastic ' + chalk.red('WebappKit') + ' generator!'));
    },
    name: function() {
      var done, prompts, _appname;
      _appname = this.appname;
      done = this.async();
      prompts = [
        {
          type: 'input',
          name: 'appName',
          message: 'What is your app name',
          "default": function() {
            return _appname.replace(/\s/g, '-');
          }
        }
      ];
      this.prompt(prompts, (function(props) {
        this.config.set(props);
        done();
      }).bind(this));
    },
    authors: function() {
      var done, prompt;
      done = this.async();
      prompt = [
        {
          type: 'input',
          name: 'authors',
          message: 'Author: ',
          store: true
        }
      ];
      this.prompt(prompt, (function(props) {
        this.config.set(props);
        done();
      }).bind(this));
    },
    description: function() {
      var done, prompt;
      done = this.async();
      prompt = [
        {
          type: 'input',
          name: 'description',
          message: 'Description: '
        }
      ];
      this.prompt(prompt, (function(props) {
        this.config.set(props);
        done();
      }).bind(this));
    },
    license: function() {
      var done, prompt;
      done = this.async();
      prompt = [
        {
          type: 'input',
          name: 'license',
          message: 'License: ',
          "default": 'MIT'
        }
      ];
      this.prompt(prompt, (function(props) {
        this.config.set(props);
        done();
      }).bind(this));
    },
    plugins: function() {
      var done, prompt;
      done = this.async();
      prompt = [
        {
          type: 'checkbox',
          name: 'plugins',
          message: 'Select plugins: ',
          choices: [
            {
              name: 'Bootstrap',
              value: {
                name: 'bootstrap',
                installer: 'npm'
              }
            }, {
              name: 'Pure.css',
              value: {
                name: 'pure',
                installer: 'bower'
              }
            }, {
              name: 'Normalize.css',
              value: {
                name: 'normalize.css',
                installer: 'npm'
              }
            }, {
              name: 'jQuery',
              value: {
                name: 'jquery',
                installer: 'npm'
              }
            }, {
              name: 'Modernizr',
              value: {
                name: 'modernizr',
                installer: 'npm'
              }
            }
          ].sort(sortPrompts)
        }
      ];
      this.prompt(prompt, (function(props) {
        this.config.set(props);
        done();
      }).bind(this));
    }
  },
  configuring: {
    packageJSON: function() {
      this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath('package.json'), {
        appName: this.config.get('appName'),
        authors: this.config.get('authors'),
        description: this.config.get('description'),
        license: this.config.get('license')
      });
    },
    bowerFiles: function() {
      this.fs.copyTpl(this.templatePath('_bower.json'), this.destinationPath('bower.json'), {
        appName: this.config.get('appName')
      });
      this.fs.copy(this.templatePath('bowerrc'), this.destinationPath('.bowerrc'));
    },
    editorconfigFile: function() {
      this.fs.copy(this.templatePath('editorconfig'), this.destinationPath('.editorconfig'));
    },
    jshintrcFile: function() {
      this.fs.copy(this.templatePath('jshintrc'), this.destinationPath('.jshintrc'));
    },
    gitFile: function() {
      this.fs.copy(this.templatePath('gitignore'), this.destinationPath('.gitignore'));
      this.fs.copy(this.templatePath('gitattributes'), this.destinationPath('.gitattributes'));
    }
  },
  writing: {
    readme: function() {
      this.fs.copyTpl(this.templatePath('_Readme.md'), this.destinationPath('Readme.md'), {
        appName: this.config.get('appName'),
        description: this.config.get('description')
      });
    },
    gruntfile: function() {
      this.fs.copy(this.templatePath('_Gruntfile.coffee'), this.destinationPath('Gruntfile.coffee'));
    },
    webpack: function() {},
    folders: function() {
      this.fs.write(this.destinationPath('/srcHTML/Readme.md'), '#HTML开发目录');
      this.fs.write(this.destinationPath('/HTML/Readme.md'), '#编译后HTML目录');
      this.fs.write(this.destinationPath('/javascripts/Readme.md'), '#脚本开发目录');
      this.fs.write(this.destinationPath('/fake-response/Readme.md'), '#模拟响应目录');
      this.fs.write(this.destinationPath('/images/Readme.md'), '#图片目录');
      this.fs.write(this.destinationPath('/packed-scripts/Readme.md'), '#Webpack 打包');
      this.fs.write(this.destinationPath('/plugins/Readme.md'), '#插件目录');
      this.fs.write(this.destinationPath('/psd/Readme.md'), '#设计PSD目录');
      this.fs.write(this.destinationPath('/sass/Readme.md'), '#Sass开发目录');
      this.fs.write(this.destinationPath('/stylesheets/Readme.md'), '#CSS开发目录');
    },
    commonHTML: function() {
      this.fs.copy(this.templatePath('__page-head.html'), this.destinationPath('/srcHTML/common/_page-head.html'));
      this.fs.copy(this.templatePath('__page-foot.html'), this.destinationPath('/srcHTML/common/_page-foot.html'));
    },
    commonStyle: function() {
      this.fs.copy(this.templatePath('_util.css'), this.destinationPath('/stylesheets/common/util.css'));
      return this.fs.write(this.destinationPath('/stylesheets/common/common.css'), '/* common style */');
    },
    indexTemplate: function() {
      var entry, entryJSON, error;
      this.fs.copy(this.templatePath('_index.html'), this.destinationPath('/srcHTML/index.html'));
      this.fs.write(this.destinationPath('/stylesheets/pages/website-index.css'), 'body.website-index { /* Stuff your style */ }');
      this.fs.write(this.destinationPath('/javascripts/pages/website-index.js'), '(function(){ /* Stuff your codes */ })();');
      try {
        entryJSON = this.fs.read(this.destinationPath('.webpack_entry.json'));
        entry = JSON.parse(entryJSON);
      } catch (_error) {
        error = _error;
        entry = {};
      }
      entry['website-index'] = './pages/website-index.js';
      return this.fs.write(this.destinationPath('.webpack_entry.json'), JSON.stringify(entry, null, '    '));
    }
  },
  install: {
    grunt: function() {
      var list, _me;
      _me = this;
      list = ['matchdep', 'grunt', 'grunt-contrib-watch', 'grunt-contrib-imagemin', 'grunt-include-replace', 'grunt-usemin', 'grunt-filerev', 'grunt-filerev-assets'];
      this.npmInstall(list, {
        saveDev: true
      }, function() {
        return _me.spawnCommand('grunt', ['includereplace']);
      });
    },
    plugins: function() {
      var bowerList, npmList, plugin, pluginsList, _i, _len;
      pluginsList = this.config.get('plugins');
      bowerList = [];
      npmList = [];
      for (_i = 0, _len = pluginsList.length; _i < _len; _i++) {
        plugin = pluginsList[_i];
        switch (plugin.installer) {
          case 'npm':
            npmList.push(plugin.name);
            break;
          case 'bower':
            bowerList.push(plugin.name);
        }
      }
      this.npmInstall(npmList, {
        save: true
      });
      this.bowerInstall(bowerList, {
        save: true
      });
    }
  }
});
