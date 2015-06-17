'use strict'
yeoman = require 'yeoman-generator'
chalk = require 'chalk'
yosay = require 'yosay'
fs = require 'fs'

inArray = (value,array)->
  for val in array
    return true if val is value
  return false

sortPrompts=(a,b)->
  return 1 if a.name>b.name
  return -1 if b.name>a.name
  return 0
module.exports = yeoman.generators.Base.extend {

  # Your initialization methods (checking current project state, getting configs, etc)
  initializing: ->
    @pkg = require '../package.json'
    return


  # Where you prompt users for options (where you'd call this.prompt())
  prompting:
    welcome: ->

      # Have Yeoman greet the user.
      @log yosay 'Welcome to the fantastic '+chalk.red('WebappKit')+' generator!'
      return

    name: ->
      done = @async()
      prompts = [
        type: 'input'
        name: 'appName'
        message: 'What is your app name'
        default: @appname
      ]
      @prompt prompts, ((props) ->
        @config.set props
        done()
        return
      ).bind(this)
      return

    authors: ->
      done = @async()
      prompt = [
        type: 'input'
        name: 'authors'
        message: 'Author: '
        store:true
      ]
      @prompt prompt, ((props) ->
        @config.set props
        done()
        return
      ).bind(this)
      return

    description: ->
      done = @async()
      prompt = [
        type: 'input'
        name: 'description'
        message: 'Description: '
      ]
      @prompt prompt, ((props) ->
        @config.set props
        done()
        return
      ).bind(this)
      return

    license: ->
      done = @async()
      prompt = [
        type: 'input'
        name: 'license'
        message: 'License: '
        default: 'MIT'
      ]
      @prompt prompt, ((props) ->
        @config.set props
        done()
        return
      ).bind(this)
      return

    plugins: ->
      done = @async()
      prompt = [
        type: 'checkbox'
        name: 'plugins'
        message: 'Select plugins: '
        choices: [
          {
            name: 'Bootstrap'
            value: 'bootstrap'
          }
          {
            name: 'Pure.css'
            value: 'pure'
          }
          {
            name: 'Foundation'
            value: 'foundation'
          }
          {
            name: 'Normalize.css'
            value: 'normalize.css'
          }
          {
            name: 'jQuery'
            value: 'jquery'
          }
          {
            name: 'Zepto'
            value: 'zeptojs'
          }
          {
            name: 'Modernizr'
            value: 'modernizr'
          }
        ].sort sortPrompts
      ]
      @prompt prompt, ((props) ->
        @config.set props
        done()
        return
      ).bind(this)
      return

  # Saving configurations and configure the project (creating .editorconfig files and other metadata files)
  configuring:
    packageJSON: ->
      @fs.copyTpl @templatePath('_package.json'), @destinationPath('package.json'),
        appName: @config.get('appName')
        authors: @config.get('authors')
        description: @config.get('description')
        license: @config.get('license')

      return

    bowerFiles: ->
      @fs.copyTpl @templatePath('_bower.json'), @destinationPath('bower.json'),
        appName: @config.get('appName')

      @fs.copy @templatePath('bowerrc'), @destinationPath('.bowerrc')
      return

    editorconfigFile: ->
      @fs.copy @templatePath('editorconfig'), @destinationPath('.editorconfig')
      return

    jshintrcFile: ->
      @fs.copy @templatePath('jshintrc'), @destinationPath('.jshintrc')
      return

    gitFile: ->
      @fs.copy @templatePath('gitignore'), @destinationPath('.gitignore')
      @fs.copy @templatePath('gitattributes'), @destinationPath('.gitattributes')
      return

    compassConfig: ->
      @fs.copy @templatePath('_config.rb'),@destinationPath('config.rb')

    pluginsConfig: ->
      plugins=do =>
        ret={}
        ret[pluginName]=pluginName for pluginName in @config.get('plugins')
        ret
      webpackAlias={}
      cssminCore=[]


      if plugins['normalize.css']
        cssminCore.push 'plugins/normalize.css/normalize.css'

      if plugins.jquery
        webpackAlias.jquery='plugins/jquery/jquery.min.js'

      if plugins.zeptojs
        webpackAlias.zepto='plugins/zepto/zepto.min.js'

      if plugins.bootstrap
        cssminCore.push 'plugins/bootstrap/dist/css/bootstrap.css'
        webpackAlias.bootstrap='plugins/bootstrap/dist/js/bootstrap.min.js'

      if plugins.pure
        cssminCore.push 'plugins/pure/pure.css'


      if plugins.foundation
        cssminCore.push 'plugins/foundation/css/foundation.css'
        webpackAlias.foundation='plugins/foundation/js/foundation/foundation.js'

      if plugins.modernizr
        webpackAlias.modernizr='plugins/modernizr/modernizr.js'

      @config.set 'webpackAlias',webpackAlias
      @config.set 'cssminCore',cssminCore





  # If the method name doesn't match a priority, it is pushed in the default group
  # default

  # Where you write the generator specific files (routes, controllers, etc)
  writing:
    readme: ->
      @fs.copyTpl @templatePath('_Readme.md'), @destinationPath('Readme.md'),
        appName: @config.get('appName')
        description: @config.get('description')

      return

    gruntfile: ->
      GruntfileEditor = require 'gruntfile-editor'
      gruntfile = new GruntfileEditor()

      gruntfile.insertVariable  'resolve', 'require(\'path\').resolve'
      gruntfile.insertVariable  'webpack', 'require(\'webpack\')'
      # package.json
      gruntfile.insertConfig 'pkg',"grunt.file.readJSON('package.json')"

      # watch
      _watch = "{
        reload: {
          files: ['stylesheets/**/*.css', 'javascripts/**/*.js','javascripts/**/*.coffee','javascripts/**/*.jsx','HTML/**/*.html'],
          options: {
            livereload: true
          }
        },
        HTML: {
          files: ['srcHTML/**/*.html'],
          tasks: ['includereplace:dev']
        },
        sasscompile: {
          files: ['sass/**/*.scss', 'sass/**/*.sass'],
          tasks: ['compass:compile']
        },
        javascript: {
          files: ['javascripts/**/*.js','javascripts/**/*.coffee','javascripts/**/*.jsx'],
          tasks: ['webpack:dev']
        }
      }"
      gruntfile.insertConfig "watch",_watch
      gruntfile.loadNpmTasks 'grunt-contrib-watch'

      # connect
      gruntfile.insertVariable 'phpMiddleware',"require('connect-php')"
      _connect = '{
        dev: {
          options: {
            port: 1024,
            hostname: "*",
            livereload: true,
            middleware: function(connect, options) {
              var directory, middlewares;
              middlewares = [];
              directory = options.directory || options.base[options.base.length - 1];
              if (!Array.isArray(options.base)) {
                options.base = [options.base];
              }
              middlewares.push(phpMiddleware(directory));
              options.base.forEach(function(base) {
                return middlewares.push(connect["static"](base));
              });
              middlewares.push(connect.directory(directory));
              return middlewares;
            }
          }
        }
      }'
      gruntfile.insertConfig 'connect',_connect
      gruntfile.loadNpmTasks 'grunt-contrib-connect'

      # clean
      _clean = "['dist/', 'packed-scripts/']"
      gruntfile.insertConfig 'clean',_clean
      gruntfile.loadNpmTasks 'grunt-contrib-clean'

      # compass
      _compass = '{
        compile: {
          options: {
            config: "config.rb"
          }
        }
      }'
      gruntfile.insertConfig 'compass',_compass
      gruntfile.loadNpmTasks 'grunt-contrib-compass'

      # cssmin
      _cssmin = "{
        options: {
          keepSpecialComments: 0
        },
        dev: {
          files: {
            'dist/stylesheets/core.min.css': ['#{@config.get('cssminCore').join(',')}'],
            'dist/stylesheets/common/app.min.css': ['stylesheets/common/**/*.css'],
            'dist/stylesheets/pages/pages.min.css': ['stylesheets/pages/**/*.css']
          }
        },
        production: {
          files: {
            'dist/<%= pkg.version %>/plugins/css/core.min.css': ['#{@config.get('cssminCore').join(',')}'],
            'dist/<%= pkg.version %>/stylesheets/common/app.min.css': ['stylesheets/common/**/*.css'],
            'dist/<%= pkg.version %>/stylesheets/pages/pages.min.css': ['stylesheets/pages/**/*.css']
          }
        }
      }"
      gruntfile.insertConfig 'cssmin',_cssmin
      gruntfile.loadNpmTasks 'grunt-contrib-cssmin'

      # Webpack
      _webpack = "{
        options: {
          context: resolve('./javascripts'),
          entry: grunt.file.readJSON('./.webpack_entry.json'),
          resolve: {
            root: [
              resolve('./scripts'),
              resolve('./plugins'),
              resolve('./'),
            ],
            alias: grunt.file.readJSON('./.webpack_alias.json')
          },
          module:{
            loaders: [
              {
                test: /\.coffee$/,
                loader: 'coffee-loader'
              },
              {
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel'
              },
              {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel'
              },
              {
                test: /\.(coffee\.md|litcoffee)$/,
                loader: 'coffee-loader?literate'
              }
            ]
          }
        },
        dev: {
          devtool: 'inline-source-map',
          watch:true,
          output: {
            path: resolve('./packed-scripts'),
            filename: '[name].js'
          },
          plugins: [
            new webpack.optimize.CommonsChunkPlugin('commons.js')
          ]
        },
        production:{
          output: {
            path: resolve('./packed-scripts'),
            filename: '[name].js'
          },
          plugins: [
            new webpack.optimize.UglifyJsPlugin(),
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.optimize.CommonsChunkPlugin('commons.js')
          ]
        }
      }"

      gruntfile.insertConfig 'webpack', _webpack
      gruntfile.loadNpmTasks 'grunt-webpack'

      # imagemin
      _imagemin = "{
        options: {
          optimizationLevel: 0
        },
        dev: {
          files: [
            {
              expand: true,
              cwd: 'images/',
              src: '**/*.{png,jpg,gif,svg}',
              dest: 'dist/images/'
            }
          ]
        },
        production: {
          files: [
            {
              expand: true,
              cwd: 'images/',
              src: '**/*.{png,jpg,gif,svg}',
              dest: 'dist/<%= pkg.version %>/images/'
            }
          ]
        }
      }"
      gruntfile.insertConfig 'imagemin',_imagemin
      gruntfile.loadNpmTasks 'grunt-contrib-imagemin'

      # copy
      _copy = "{
        dev: {
          files: [
            {
              src: ['images/favicons/browserconfig.xml'],
              dest: 'dist/images/favicons/browserconfig.xml'
            }, {
              src: ['images/favicons/favicon.ico'],
              dest: 'dist/images/favicons/favicon.ico'
            }
          ]
        },
        production: {
          files: [
            {
              src: ['images/favicons/browserconfig.xml'],
              dest: 'dist/<%= pkg.version %>/images/favicons/browserconfig.xml'
            }, {
              src: ['images/favicons/favicon.ico'],
              dest: 'dist/<%= pkg.version %>/images/favicons/favicon.ico'
            }
          ]
        }
      }"
      gruntfile.insertConfig 'copy',_copy
      gruntfile.loadNpmTasks 'grunt-contrib-copy'

      # include replace
      _includereplace = "{
        dev: {
          options: {
            includesDir: 'srcHTML',
            globals: {
              ASSETS: '../..'
            }
          },
          files: [
            {
              expand: true,
              dest: 'HTML/',
              cwd: 'srcHTML/',
              src: ['**/*','!**/_*']
            }
          ]
        }
      }"
      gruntfile.insertConfig 'includereplace',_includereplace
      gruntfile.loadNpmTasks 'grunt-include-replace'

      # usemin
      _usemin = "{
        html: []
      }"
      gruntfile.insertConfig 'usemin',_usemin
      gruntfile.loadNpmTasks 'grunt-usemin'

      gruntfile.registerTask 'production',['clean', 'compass', 'cssmin:production','imagemin:production', 'copy:production', 'usemin']

      fs.writeFileSync 'Gruntfile.js',gruntfile.toString()
      console.log '   '+chalk.green('create')+' Gruntfile.js'

      return
    webpack:->
      webpackAlias=@config.get 'webpackAlias'
      @fs.write @destinationPath('/.webpack_alias.json'), JSON.stringify(webpackAlias,null,'    ')
      @fs.write @destinationPath('/.webpack_entry.json'), '{}'

    folders: ->
      @fs.write @destinationPath('/srcHTML/Readme.md'), '#HTML开发目录'
      @fs.write @destinationPath('/HTML/Readme.md'), '#编译后HTML目录'
      @fs.write @destinationPath('/javascripts/Readme.md'), '#脚本开发目录'
      @fs.write @destinationPath('/fake-response/Readme.md'), '#模拟响应目录'
      @fs.write @destinationPath('/images/Readme.md'), '#图片目录'
      @fs.write @destinationPath('/packed-scripts/Readme.md'), '#Webpack 打包'
      @fs.write @destinationPath('/plugins/Readme.md'), '#插件目录'
      @fs.write @destinationPath('/psd/Readme.md'), '#设计PSD目录'
      @fs.write @destinationPath('/sass/Readme.md'), '#Sass开发目录'
      @fs.write @destinationPath('/stylesheets/Readme.md'), '#CSS开发目录'
      return

    htmlTemplate: ->
      @fs.copy @templatePath('_template.html'),@destinationPath('/HTML/template.html')
      @fs.copy @templatePath('__page-head.html'),@destinationPath('/srcHTML/common/_page-head.html')

      return


  # Where conflicts are handled (used internally)
  # conflicts: function(){},

  # Where installation are run (npm, bower)
  install:
    grunt: ->
      list = [
        'grunt'
        'grunt-contrib-connect'
        'grunt-contrib-watch'
        'connect-php'
        'grunt-contrib-clean'
        'grunt-contrib-compass'
        'grunt-contrib-cssmin'
        'grunt-contrib-imagemin'
        'grunt-contrib-copy'
        'grunt-include-replace'
        'grunt-webpack',
        'babel-loader',
        'coffee-loader',
        'script-loader',
        'grunt-usemin'
      ]

      if inArray 'requirejs',@config.get('plugins')
        list.push 'grunt-contrib-requirejs'

      @npmInstall list,
        saveDev: true

      return

    plugins: ->
      pluginsList = @config.get('plugins')
      @bowerInstall pluginsList,
        save: true

      return


  # Called last, cleanup, say good bye, etc
  # end: function(){}
}
