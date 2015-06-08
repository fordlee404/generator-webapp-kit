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
      @log yosay 'Welcome to the fantastic '+chalk.red('Fordlee404')+' generator!'
      return

    name: ->
      done = @async()
      root = @destinationRoot()
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
      # package.json
      gruntfile.insertConfig 'pkg',"grunt.file.readJSON('package.json')"

      # watch
      _watch = "{
        reload: {
          files: ['stylesheets/**/*.css', 'javascripts/**/*.js', 'HTML/**/*.html'],
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
        coffeecompile: {
          files: ['coffeescript/**/*.coffee'],
          tasks: ['coffee:compile']
        },
        javascript: {
          files: ['javascripts/**/*.js'],
          tasks: ['jshint:all']
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
      _clean = "['dist/', 'build/']"
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
            'dist/plugins/css/core.min.css': [],
            'dist/stylesheets/common/app.min.css': ['stylesheets/common/**/*.css'],
            'dist/stylesheets/pages/pages.min.css': ['stylesheets/pages/**/*.css']
          }
        },
        production: {
          files: {
            'dist/<%= pkg.version %>/plugins/css/core.min.css': [],
            'dist/<%= pkg.version %>/stylesheets/common/app.min.css': ['stylesheets/common/**/*.css'],
            'dist/<%= pkg.version %>/stylesheets/pages/pages.min.css': ['stylesheets/pages/**/*.css']
          }
        }
      }"
      gruntfile.insertConfig 'cssmin',_cssmin
      gruntfile.loadNpmTasks 'grunt-contrib-cssmin'

      # Coffeescript
      _coffee = "{
        compile: {
          options: {
            bare: true,
            join: false
          },
          files: [
            {
              expand: true,
              cwd: 'coffeescript/',
              src: '**/*.coffee',
              dest: 'javascripts/',
              ext: '.js'
            }
          ]
        }
      }"
      gruntfile.insertConfig 'coffee',_coffee
      gruntfile.loadNpmTasks 'grunt-contrib-coffee'

      #jshint
      _jshint = "{
        all: {
          options: {
            jshintrc: true
          },
          files: {
            src: ['javascripts/**/*.js']
          }
        }
      }"
      gruntfile.insertConfig 'jshint',_jshint
      gruntfile.loadNpmTasks 'grunt-contrib-jshint'

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
              src: ['**/*']
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

      hasRequirejs = inArray 'requirejs',@config.get('plugins')

      if hasRequirejs
        # requirejs
        _requirejs = "{
          options: {
            baseUrl: 'javascripts/pages/',
            mainConfigFile: 'javascripts/pages/app.js',
            keepBuildDir: true,
            modules: [
              {
                name: 'app'
              }
            ]
          },
          dev: {
            options: {
              dir: 'dist/javascripts/pages/'
            }
          },
          production: {
            options: {
              dir: 'dist/<%= pkg.version %>/javascripts/pages/'
            }
          }
        }"
        gruntfile.insertConfig 'requirejs',_requirejs
        gruntfile.loadNpmTasks 'grunt-contrib-requirejs'

      gruntfile.registerTask 'server',['connect', 'watch']
      gruntfile.registerTask 'default',['server']

      if hasRequirejs
        gruntfile.registerTask 'release',['clean', 'compass', 'cssmin:dev', 'coffee', 'jshint', 'requirejs:dev', 'imagemin:dev', 'copy:dev']
        gruntfile.registerTask 'production',['clean', 'compass', 'cssmin:production', 'coffee', 'jshint', 'requirejs:production', 'imagemin:production', 'copy:production', 'usemin']
      else
        gruntfile.registerTask 'release',['clean', 'compass', 'cssmin:dev', 'coffee', 'jshint', 'imagemin:dev', 'copy:dev']
        gruntfile.registerTask 'production',['clean', 'compass', 'cssmin:production', 'coffee', 'jshint', 'imagemin:production', 'copy:production', 'usemin']

      fs.writeFileSync 'Gruntfile.js',gruntfile.toString()
      console.log '   '+chalk.green('create')+' Gruntfile.js'

      return

    folders: ->
      @fs.write @destinationPath('/srcHTML/Readme.md'), '#HTML开发目录'
      @fs.write @destinationPath('/HTML/Readme.md'), '#编译后HTML目录'
      @fs.write @destinationPath('/coffeescript/Readme.md'), '#Coffeescript开发目录'
      @fs.write @destinationPath('/fake-response/Readme.md'), '#模拟响应目录'
      @fs.write @destinationPath('/images/Readme.md'), '#图片目录'
      @fs.write @destinationPath('/javascripts/Readme.md'), '#Javascript目录'
      @fs.write @destinationPath('/plugins/Readme.md'), '#插件目录'
      @fs.write @destinationPath('/psd/Readme.md'), '#设计PSD目录'
      @fs.write @destinationPath('/sass/Readme.md'), '#Sass开发目录'
      @fs.write @destinationPath('/less/Readme.md'), '#Less开发目录'
      @fs.write @destinationPath('/stylesheets/Readme.md'), '#CSS开发目录'
      return

    htmlTemplate: ->
      @fs.copy @templatePath('_template.html'),@destinationPath('/HTML/template.html')

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
        'grunt-contrib-coffee'
        'grunt-contrib-jshint'
        'grunt-contrib-imagemin'
        'grunt-contrib-copy'
        'grunt-include-replace'
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
