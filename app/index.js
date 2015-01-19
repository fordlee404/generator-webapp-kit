'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  // Your initialization methods (checking current project state, getting configs, etc)
  initializing: function () {
    this.pkg = require('../package.json');
  },

  // Where you prompt users for options (where you'd call this.prompt())
  prompting:{
    welcome: function(){
      // Have Yeoman greet the user.
      this.log(yosay(
        'Welcome to the fantastic ' + chalk.red('Fordlee404') + ' generator!'
      ));
    },

    name: function () {
      var done = this.async(),
        root = this.destinationRoot();

      var prompts = [{
        type: 'input',
        name: 'appName',
        message: 'What is your app name',
        default: function(){
          var rootArr = root.split('/'),
            len = rootArr.length;

          return rootArr[len-1];
        }
      }];

      this.prompt(prompts, function (props) {
        this.config.set(props);

        done();
      }.bind(this));
    },

    authors: function(){
      var done = this.async();

      var prompt = [{
        type: 'input',
        name: 'authors',
        message: 'Author: '
      }];

      this.prompt(prompt, function(props){
        this.config.set(props);

        done()
      }.bind(this));
    },

    description: function(){
      var done = this.async();

      var prompt = [{
        type: 'input',
        name: 'description',
        message: 'Description: '
      }];

      this.prompt(prompt, function(props){
        this.config.set(props);

        done()
      }.bind(this));
    },

    license: function(){
      var done = this.async();

      var prompt = [{
        type: 'input',
        name: 'license',
        message: 'License: ',
        default: 'MIT'
      }];

      this.prompt(prompt, function(props){
        this.config.set(props);

        done()
      }.bind(this));
    }
  },

  // Saving configurations and configure the project (creating .editorconfig files and other metadata files)
  configuring: {
    packageJSON: function(){
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {
          appName: this.config.get('appName'),
          authors: this.config.get('authors'),
          description: this.config.get('description'),
          license: this.config.get('license')
        }
      );
    },
    bowerFiles: function(){
      this.fs.copyTpl(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json'),
        {
          appName: this.config.get('appName')
        }
      );
      this.fs.copy(
        this.templatePath('bowerrc'),
        this.destinationPath('.bowerrc')
      );
    },
    editorconfigFile: function(){
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
    },
    jshintrcFile: function(){
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    },
    gitFile: function(){
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
    }
  },

  // If the method name doesn't match a priority, it is pushed in the default group
  // default

  // Where you write the generator specific files (routes, controllers, etc)
  writing: {
    readme: function () {
      this.fs.copyTpl(
        this.templatePath('_Readme.md'),
        this.destinationPath('Readme.md'),{
          appName: this.config.get('appName'),
          description: this.config.get('description')
        }
      );
    },
    folders: function(){
      this.fs.write(
        this.destinationPath('/srcHTML/Readme.md'),
        '#HTML开发目录'
      );
      this.fs.write(
        this.destinationPath('/HTML/Readme.md'),
        '#编译后HTML目录'
      );
      this.fs.write(
        this.destinationPath('/coffeescript/Readme.md'),
        '#Coffeescript开发目录'
      );
      this.fs.write(
        this.destinationPath('/fake-response/Readme.md'),
        '#模拟响应目录'
      );
      this.fs.write(
        this.destinationPath('/images/Readme.md'),
        '#图片目录'
      );
      this.fs.write(
        this.destinationPath('/javascripts/Readme.md'),
        '#Javascript目录'
      );
      this.fs.write(
        this.destinationPath('/plugins/Readme.md'),
        '#插件目录'
      );
      this.fs.write(
        this.destinationPath('/psd/Readme.md'),
        '#设计PSD目录'
      );
      this.fs.write(
        this.destinationPath('/sass/Readme.md'),
        '#Sass开发目录'
      );
      this.fs.write(
        this.destinationPath('/less/Readme.md'),
        '#Less开发目录'
      );
      this.fs.write(
        this.destinationPath('/stylesheets/Readme.md'),
        '#CSS开发目录'
      );
    }
  }

  // Where conflicts are handled (used internally)
  // conflicts: function(){},

  // Where installation are run (npm, bower)
  /*
  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }*/

  // Called last, cleanup, say good bye, etc
  // end: function(){}
});
