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
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the fantastic' + chalk.red('Fordlee404') + ' generator!'
    ));

    var prompts = [{
      type: 'confirm',
      name: 'someOption',
      message: 'Would you like to enable this option?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.someOption = props.someOption;

      done();
    }.bind(this));
  },

  // Saving configurations and configure the project (creating .editorconfig files and other metadata files)
  // configuring: function(){},

  // If the method name doesn't match a priority, it is pushed in the default group
  // default: function(){},

  // Where you write the generator specific files (routes, controllers, etc)
  writing: {
    app: function () {
      this.fs.copy(
        this.templatePath('_package.json'),
        this.destinationPath('package.json')
      );
      this.fs.copy(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json')
      );
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    }
  },

  // Where conflicts are handled (used internally)
  // conflicts: function(){},

  // Where installation are run (npm, bower)
  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }

  // Called last, cleanup, say good bye, etc
  // end: function(){}
});
