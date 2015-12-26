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
          "default": _appname
        }
      ];
      this.prompt(prompts, (function(props) {
        props.appName = props.appName.replace(/\s/g, '-');
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
                name: 'purecss',
                installer: 'npm'
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
              name: 'AngularJS',
              value: {
                name: 'angular',
                installer: 'npm'
              }
            }, {
              name: 'Vue.js',
              value: {
                name: 'vue',
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
    },
    editorconfigFile: function() {
      this.fs.copy(this.templatePath('editorconfig'), this.destinationPath('.editorconfig'));
    },
    jshintrcFile: function() {
      this.fs.copy(this.templatePath('jshintrc'), this.destinationPath('.jshintrc'));
    },
    jscsrcFile: function() {
      this.fs.copy(this.templatePath('jscsrc'), this.destinationPath('.jscsrc'));
    },
    gitFile: function() {
      this.fs.copy(this.templatePath('gitignore'), this.destinationPath('.gitignore'));
      this.fs.copy(this.templatePath('gitattributes'), this.destinationPath('.gitattributes'));
    },
    coffeelint: function() {
      this.fs.copy(this.templatePath('_coffeelint.json'), this.destinationPath('coffeelint.json'));
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
    webpack: function() {
      this.fs.copy(this.templatePath('_webpack.config.js'), this.destinationPath('webpack.config.js'));
      this.fs.copy(this.templatePath('_webpack.production.config.js'), this.destinationPath('webpack.production.config.js'));
    },
    folders: function() {
      this.fs.write(this.destinationPath('HTML/Readme.md'), '#HTML开发目录');
      this.fs.write(this.destinationPath('scripts/Readme.md'), '#脚本开发目录');
      this.fs.write(this.destinationPath('fake-response/Readme.md'), '#模拟响应目录');
      this.fs.write(this.destinationPath('images/Readme.md'), '#图片目录');
      this.fs.write(this.destinationPath('plugins/Readme.md'), '#插件目录');
      this.fs.write(this.destinationPath('psd/Readme.md'), '#设计PSD目录');
      this.fs.write(this.destinationPath('stylesheets/Readme.md'), '#CSS开发目录');
    },
    commonHTML: function() {
      this.fs.copy(this.templatePath('__page-head.html'), this.destinationPath('HTML/common/_page-head.html'));
      this.fs.copy(this.templatePath('__page-foot.html'), this.destinationPath('HTML/common/_page-foot.html'));
    },
    commonStyle: function() {
      this.fs.copy(this.templatePath('_util.css'), this.destinationPath('stylesheets/common/util.css'));
      return this.fs.write(this.destinationPath('stylesheets/common/common.css'), '/* common style */');
    },
    indexTemplate: function() {
      this.fs.copy(this.templatePath('_index.html'), this.destinationPath('HTML/index.html'));
      this.fs.write(this.destinationPath('stylesheets/pages/website-index.css'), '/* Stuff your style */');
      this.fs.write(this.destinationPath('scripts/pages/website-index.js'), '(function(){ \'use strict\';require(\'styles/pages/website-index.css\'); })();');
      return this.fs.write(this.destinationPath('app-entry.js'), 'module.exports = { "website-index": "./website-index" }');
    }
  },
  install: {
    grunt: function() {
      var list, _me;
      _me = this;
      list = ['matchdep', 'grunt', 'grunt-contrib-watch', 'grunt-contrib-imagemin', 'grunt-include-replace', 'grunt-usemin', 'grunt-filerev', 'grunt-filerev-assets', 'grunt-cwebp', 'grunt-contrib-jshint', 'grunt-coffeelint'];
      this.npmInstall(list, {
        saveDev: true
      });
    },
    webpack: function() {
      var list;
      list = ['webpack', 'dev-server-fe', 'coffee-loader', 'script-loader', 'babel-loader', 'extract-text-webpack-plugin', 'style-loader', 'css-loader', 'file-loader', 'url-loader', 'less-loader', 'sass-loader', 'assets-webpack-plugin', 'postcss-loader', 'autoprefixer', 'postcss-color-rgba-fallback', 'postcss-opacity', 'postcss-pseudoelements', 'postcss-sprites', 'webpcss', 'jshint-loader', 'jscs-loader', 'coffeelint-loader'];
      this.npmInstall(list, {
        saveDev: true
      });
    },
    plugins: function() {
      var bowerList, npmList, plugin, pluginsList, _i, _len;
      pluginsList = this.config.get('plugins');
      bowerList = [];
      npmList = [];
      if ((pluginsList != null) && pluginsList.length > 0) {
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
  }
});
