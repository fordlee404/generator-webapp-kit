'use strict';
var chalk, inArray, yeoman, yosay;

yeoman = require('yeoman-generator');

chalk = require('chalk');

yosay = require('yosay');

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

module.exports = yeoman.generators.Base.extend({
  initializing: function() {
    this.pkg = require('../package.json');
  },
  prompting: {
    welcome: function() {
      this.log(yosay('Welcome to the fantastic ' + chalk.red('Fordlee404') + ' generator!'));
    },
    name: function() {
      var done, prompts, root;
      done = this.async();
      root = this.destinationRoot();
      prompts = [
        {
          type: 'input',
          name: 'appName',
          message: 'What is your app name',
          "default": function() {
            var len, rootArr;
            rootArr = root.split('/');
            len = rootArr.length;
            return rootArr[len - 1];
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
          message: 'Author: '
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
              value: 'bootstrap'
            }, {
              name: 'Pure.css',
              value: 'pure'
            }, {
              name: 'Foundation',
              value: 'foundation'
            }, {
              name: 'Normalize.css',
              value: 'normalize.css'
            }, {
              name: 'jQuery',
              value: 'jquery'
            }, {
              name: 'Zepto',
              value: 'zeptojs'
            }, {
              name: 'RequireJS',
              value: 'requirejs'
            }, {
              name: 'Vue.js',
              value: 'vue'
            }, {
              name: 'Modernizr',
              value: 'modernizr'
            }, {
              name: 'AngularJS',
              value: 'angular'
            }, {
              name: 'Polymer',
              value: 'polymer'
            }
          ]
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
    },
    compassConfig: function() {
      return this.fs.copy(this.templatePath('_config.rb'), this.destinationPath('config.rb'));
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
      var hasRequirejs, _clean, _coffee, _compass, _connect, _copy, _cssmin, _imagemin, _includereplace, _jshint, _requirejs, _usemin, _watch;
      this.gruntfile.insertConfig('pkg', "grunt.file.readJSON('package.json')");
      _watch = "{ reload: { files: ['stylesheets/**/*.css', 'javascripts/**/*.js', 'HTML/**/*.html'], options: { livereload: true } }, HTML: { files: ['srcHTML/**/*.html'], tasks: ['includereplace:dev'] }, sasscompile: { files: ['sass/**/*.scss', 'sass/**/*.sass'], tasks: ['compass:compile'] }, coffeecompile: { files: ['coffeescript/**/*.coffee'], tasks: ['coffee:compile'] }, javascript: { files: ['javascripts/**/*.js'], tasks: ['jshint:all'] } }";
      this.gruntfile.insertConfig("watch", _watch);
      this.gruntfile.loadNpmTasks('grunt-contrib-watch');
      this.gruntfile.insertVariable('phpMiddleware', "require('connect-php')");
      _connect = '{ dev: { options: { port: 1024, hostname: "*", livereload: true, middleware: function(connect, options) { var directory, middlewares; middlewares = []; directory = options.directory || options.base[options.base.length - 1]; if (!Array.isArray(options.base)) { options.base = [options.base]; } middlewares.push(phpMiddleware(directory)); options.base.forEach(function(base) { return middlewares.push(connect["static"](base)); }); middlewares.push(connect.directory(directory)); return middlewares; } } } }';
      this.gruntfile.insertConfig('connect', _connect);
      this.gruntfile.loadNpmTasks('grunt-contrib-connect');
      _clean = "['dist/', 'build/']";
      this.gruntfile.insertConfig('clean', _clean);
      this.gruntfile.loadNpmTasks('grunt-contrib-clean');
      _compass = '{ compile: { options: { config: "config.rb" } } }';
      this.gruntfile.insertConfig('compass', _compass);
      this.gruntfile.loadNpmTasks('grunt-contrib-compass');
      _cssmin = "{ options: { keepSpecialComments: 0 }, dev: { files: { 'dist/plugins/css/core.min.css': [], 'dist/stylesheets/common/app.min.css': ['stylesheets/common/**/*.css'], 'dist/stylesheets/pages/pages.min.css': ['stylesheets/pages/**/*.css'] } }, production: { files: { 'dist/<%= pkg.version %>/plugins/css/core.min.css': [], 'dist/<%= pkg.version %>/stylesheets/common/app.min.css': ['stylesheets/common/**/*.css'], 'dist/<%= pkg.version %>/stylesheets/pages/pages.min.css': ['stylesheets/pages/**/*.css'] } } }";
      this.gruntfile.insertConfig('cssmin', _cssmin);
      this.gruntfile.loadNpmTasks('grunt-contrib-cssmin');
      _coffee = "{ compile: { options: { bare: true, join: false }, files: [ { expand: true, cwd: 'coffeescript/', src: '**/*.coffee', dest: 'javascripts/', ext: '.js' } ] } }";
      this.gruntfile.insertConfig('coffee', _coffee);
      this.gruntfile.loadNpmTasks('grunt-contrib-coffee');
      _jshint = "{ all: { options: { jshintrc: true }, files: { src: ['javascripts/**/*.js'] } } }";
      this.gruntfile.insertConfig('jshint', _jshint);
      this.gruntfile.loadNpmTasks('grunt-contrib-jshint');
      _imagemin = "{ options: { optimizationLevel: 0 }, dev: { files: [ { expand: true, cwd: 'images/', src: '**/*.{png,jpg,gif,svg}', dest: 'dist/images/' } ] }, production: { files: [ { expand: true, cwd: 'images/', src: '**/*.{png,jpg,gif,svg}', dest: 'dist/<%= pkg.version %>/images/' } ] } }";
      this.gruntfile.insertConfig('imagemin', _imagemin);
      this.gruntfile.loadNpmTasks('grunt-contrib-imagemin');
      _copy = "{ dev: { files: [ { src: ['images/favicons/browserconfig.xml'], dest: 'dist/images/favicons/browserconfig.xml' }, { src: ['images/favicons/favicon.ico'], dest: 'dist/images/favicons/favicon.ico' } ] }, production: { files: [ { src: ['images/favicons/browserconfig.xml'], dest: 'dist/<%= pkg.version %>/images/favicons/browserconfig.xml' }, { src: ['images/favicons/favicon.ico'], dest: 'dist/<%= pkg.version %>/images/favicons/favicon.ico' } ] } }";
      this.gruntfile.insertConfig('copy', _copy);
      this.gruntfile.loadNpmTasks('grunt-contrib-copy');
      _includereplace = "{ dev: { options: { includesDir: 'srcHTML', globals: { ASSETS: '../..' } }, files: [ { expand: true, dest: 'HTML/', cwd: 'srcHTML/', src: ['**/*'] } ] } }";
      this.gruntfile.insertConfig('includereplace', _includereplace);
      this.gruntfile.loadNpmTasks('grunt-include-replace');
      _usemin = "{ html: [] }";
      this.gruntfile.insertConfig('usemin', _usemin);
      this.gruntfile.loadNpmTasks('grunt-usemin');
      hasRequirejs = inArray('requirejs', this.config.get('plugins'));
      if (hasRequirejs) {
        _requirejs = "{ options: { baseUrl: 'javascripts/pages/', mainConfigFile: 'javascripts/pages/app.js', keepBuildDir: true, modules: [ { name: 'app' } ] }, dev: { options: { dir: 'dist/javascripts/pages/' } }, production: { options: { dir: 'dist/<%= pkg.version %>/javascripts/pages/' } } }";
        this.gruntfile.insertConfig('requirejs', _requirejs);
        this.gruntfile.loadNpmTasks('grunt-contrib-requirejs');
      }
      this.gruntfile.registerTask('server', ['connect', 'watch']);
      this.gruntfile.registerTask('default', ['server']);
      if (hasRequirejs) {
        this.gruntfile.registerTask('release', ['clean', 'compass', 'cssmin:dev', 'coffee', 'jshint', 'requirejs:dev', 'imagemin:dev', 'copy:dev']);
        this.gruntfile.registerTask('production', ['clean', 'compass', 'cssmin:production', 'coffee', 'jshint', 'requirejs:production', 'imagemin:production', 'copy:production', 'usemin']);
      } else {
        this.gruntfile.registerTask('release', ['clean', 'compass', 'cssmin:dev', 'coffee', 'jshint', 'imagemin:dev', 'copy:dev']);
        this.gruntfile.registerTask('production', ['clean', 'compass', 'cssmin:production', 'coffee', 'jshint', 'imagemin:production', 'copy:production', 'usemin']);
      }
    },
    folders: function() {
      this.fs.write(this.destinationPath('/srcHTML/Readme.md'), '#HTML开发目录');
      this.fs.write(this.destinationPath('/HTML/Readme.md'), '#编译后HTML目录');
      this.fs.write(this.destinationPath('/coffeescript/Readme.md'), '#Coffeescript开发目录');
      this.fs.write(this.destinationPath('/fake-response/Readme.md'), '#模拟响应目录');
      this.fs.write(this.destinationPath('/images/Readme.md'), '#图片目录');
      this.fs.write(this.destinationPath('/javascripts/Readme.md'), '#Javascript目录');
      this.fs.write(this.destinationPath('/plugins/Readme.md'), '#插件目录');
      this.fs.write(this.destinationPath('/psd/Readme.md'), '#设计PSD目录');
      this.fs.write(this.destinationPath('/sass/Readme.md'), '#Sass开发目录');
      this.fs.write(this.destinationPath('/less/Readme.md'), '#Less开发目录');
      this.fs.write(this.destinationPath('/stylesheets/Readme.md'), '#CSS开发目录');
    },
    htmlTemplate: function() {
      this.fs.copy(this.templatePath('_template.html'), this.destinationPath('/HTML/template.html'));
    }
  },
  install: {
    grunt: function() {
      var list;
      list = ['grunt', 'grunt-contrib-connect', 'grunt-contrib-watch', 'connect-php', 'grunt-contrib-clean', 'grunt-contrib-compass', 'grunt-contrib-cssmin', 'grunt-contrib-coffee', 'grunt-contrib-jshint', 'grunt-contrib-imagemin', 'grunt-contrib-copy', 'grunt-include-replace', 'grunt-usemin'];
      if (inArray('requirejs', this.config.get('plugins'))) {
        list.push('grunt-contrib-requirejs');
      }
      this.npmInstall(list, {
        saveDev: true
      });
    },
    plugins: function() {
      var pluginsList;
      pluginsList = this.config.get('plugins');
      this.bowerInstall(pluginsList, {
        save: true
      });
    }
  }
});
