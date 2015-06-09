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
          "default": this.appname
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
              name: 'Modernizr',
              value: 'modernizr'
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
    },
    compassConfig: function() {
      return this.fs.copy(this.templatePath('_config.rb'), this.destinationPath('config.rb'));
    },
    pluginsConfig: function() {
      var cssminCore, plugins, webpackAlias;
      plugins = (function(_this) {
        return function() {
          var pluginName, ret, _i, _len, _ref;
          ret = {};
          _ref = _this.config.get('plugins');
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            pluginName = _ref[_i];
            ret[pluginName] = pluginName;
          }
          return ret;
        };
      })(this)();
      webpackAlias = {};
      cssminCore = [];
      if (plugins.jquery) {
        webpackAlias.jquery = 'plugins/jquery/jquery.min.js';
      }
      if (plugins.zeptojs) {
        webpackAlias.zepto = 'plugins/zepto/zepto.min.js';
      }
      if (plugins.bootstrap) {
        cssminCore.push('plugins/bootstrap/dist/css/bootstrap.css');
        webpackAlias.bootstrap = 'plugins/bootstrap/dist/js/bootstrap.min.js';
      }
      if (plugins.pure) {
        cssminCore.push('plugins/pure/pure.css');
      }
      if (plugins['normalize.css']) {
        cssminCore.push('plugins/normalize.css/normalize.css');
      }
      if (plugins.foundation) {
        cssminCore.push('plugins/foundation/css/foundation.css');
        webpackAlias.foundation = 'plugins/foundation/js/foundation/foundation.js';
      }
      if (plugins.modernizr) {
        webpackAlias.modernizr = 'plugins/modernizr/modernizr.js';
      }
      this.config.set('webpackAlias', webpackAlias);
      return this.config.set('cssminCore', cssminCore);
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
      var GruntfileEditor, gruntfile, _clean, _compass, _connect, _copy, _cssmin, _imagemin, _includereplace, _usemin, _watch, _webpack;
      GruntfileEditor = require('gruntfile-editor');
      gruntfile = new GruntfileEditor();
      gruntfile.insertConfig('pkg', "grunt.file.readJSON('package.json')");
      _watch = "{ reload: { files: ['stylesheets/**/*.css', 'packed-scripts/**/*.js', 'HTML/**/*.html'], options: { livereload: true } }, HTML: { files: ['srcHTML/**/*.html'], tasks: ['includereplace:dev'] }, sasscompile: { files: ['sass/**/*.scss', 'sass/**/*.sass'], tasks: ['compass:compile'] }, coffeecompile: { files: ['coffeescript/**/*.coffee'], tasks: ['coffee:compile'] } }";
      gruntfile.insertConfig("watch", _watch);
      gruntfile.loadNpmTasks('grunt-contrib-watch');
      gruntfile.insertVariable('phpMiddleware', "require('connect-php')");
      _connect = '{ dev: { options: { port: 1024, hostname: "*", livereload: true, middleware: function(connect, options) { var directory, middlewares; middlewares = []; directory = options.directory || options.base[options.base.length - 1]; if (!Array.isArray(options.base)) { options.base = [options.base]; } middlewares.push(phpMiddleware(directory)); options.base.forEach(function(base) { return middlewares.push(connect["static"](base)); }); middlewares.push(connect.directory(directory)); return middlewares; } } } }';
      gruntfile.insertConfig('connect', _connect);
      gruntfile.loadNpmTasks('grunt-contrib-connect');
      _clean = "['dist/', 'packed-scripts/']";
      gruntfile.insertConfig('clean', _clean);
      gruntfile.loadNpmTasks('grunt-contrib-clean');
      _compass = '{ compile: { options: { config: "config.rb" } } }';
      gruntfile.insertConfig('compass', _compass);
      gruntfile.loadNpmTasks('grunt-contrib-compass');
      _cssmin = "{ options: { keepSpecialComments: 0 }, dev: { files: { 'dist/plugins/css/core.min.css': ['" + (this.config.get('cssminCore').join(',')) + "'], 'dist/stylesheets/common/app.min.css': ['stylesheets/common/**/*.css'], 'dist/stylesheets/pages/pages.min.css': ['stylesheets/pages/**/*.css'] } }, production: { files: { 'dist/<%= pkg.version %>/plugins/css/core.min.css': [], 'dist/<%= pkg.version %>/stylesheets/common/app.min.css': ['stylesheets/common/**/*.css'], 'dist/<%= pkg.version %>/stylesheets/pages/pages.min.css': ['stylesheets/pages/**/*.css'] } } }";
      gruntfile.insertConfig('cssmin', _cssmin);
      gruntfile.loadNpmTasks('grunt-contrib-cssmin');
      _webpack = "{ options: { context: resolve('./scripts'), entry: require('./.webpack_entry.json'), resolve: { root: [ resolve('./scripts'), resolve('./plugins') ], alias: { zeptoCore:resolve('./plugins/zeptojs/src/zepto.js'), zeptoTouch:resolve('./plugins/zeptojs/src/touch.js'), zeptoEvent:resolve('./plugins/zeptojs/src/event.js'), zeptoAjax:resolve('./plugins/zeptojs/src/ajax.js') } }, module:{ loaders: [ { test: /\.coffee$/, loader: 'coffee-loader' //需要使用 coffee-react 的loader }, { test: /\.js?$/, exclude: /(node_modules|bower_components)/, loader: 'babel' }, { test: /\.jsx?$/, exclude: /(node_modules|bower_components)/, loader: 'babel' }, { test: /\.(coffee\.md|litcoffee)$/, loader: 'coffee-loader?literate' } ] } } }";
      gruntfile.insertConfig('webpack', _copy);
      gruntfile.loadNpmTasks('grunt-webpack');
      _imagemin = "{ options: { optimizationLevel: 0 }, dev: { files: [ { expand: true, cwd: 'images/', src: '**/*.{png,jpg,gif,svg}', dest: 'dist/images/' } ] }, production: { files: [ { expand: true, cwd: 'images/', src: '**/*.{png,jpg,gif,svg}', dest: 'dist/<%= pkg.version %>/images/' } ] } }";
      gruntfile.insertConfig('imagemin', _imagemin);
      gruntfile.loadNpmTasks('grunt-contrib-imagemin');
      _copy = "{ dev: { files: [ { src: ['images/favicons/browserconfig.xml'], dest: 'dist/images/favicons/browserconfig.xml' }, { src: ['images/favicons/favicon.ico'], dest: 'dist/images/favicons/favicon.ico' } ] }, production: { files: [ { src: ['images/favicons/browserconfig.xml'], dest: 'dist/<%= pkg.version %>/images/favicons/browserconfig.xml' }, { src: ['images/favicons/favicon.ico'], dest: 'dist/<%= pkg.version %>/images/favicons/favicon.ico' } ] } }";
      gruntfile.insertConfig('copy', _copy);
      gruntfile.loadNpmTasks('grunt-contrib-copy');
      _includereplace = "{ dev: { options: { includesDir: 'srcHTML', globals: { ASSETS: '../..' } }, files: [ { expand: true, dest: 'HTML/', cwd: 'srcHTML/', src: ['**/*'] } ] } }";
      gruntfile.insertConfig('includereplace', _includereplace);
      gruntfile.loadNpmTasks('grunt-include-replace');
      _usemin = "{ html: [] }";
      gruntfile.insertConfig('usemin', _usemin);
      gruntfile.loadNpmTasks('grunt-usemin');
      gruntfile.registerTask('release', ['clean', 'compass', 'cssmin:dev', 'coffee', 'jshint', 'imagemin:dev', 'copy:dev']);
      gruntfile.registerTask('production', ['clean', 'compass', 'cssmin:production', 'coffee', 'jshint', 'imagemin:production', 'copy:production', 'usemin']);
      fs.writeFileSync('Gruntfile.js', gruntfile.toString());
      console.log('   ' + chalk.green('create') + ' Gruntfile.js');
    },
    webpackAlias: function() {
      var webpackAlias;
      webpackAlias = this.config.get('webpackAlias');
      return this.fs.write(this.destinationPath('.webpack_entry.json'), JSON.stringify(webpackAlias));
    },
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
    htmlTemplate: function() {
      this.fs.copy(this.templatePath('_template.html'), this.destinationPath('/HTML/template.html'));
    }
  },
  install: {
    grunt: function() {
      var list;
      list = ['grunt', 'grunt-contrib-connect', 'grunt-contrib-watch', 'connect-php', 'grunt-contrib-clean', 'grunt-contrib-compass', 'grunt-contrib-cssmin', 'grunt-contrib-imagemin', 'grunt-contrib-copy', 'grunt-include-replace', 'grunt-webpack', 'babel-loader', 'coffee-loader', 'script-loader', 'grunt-usemin'];
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
