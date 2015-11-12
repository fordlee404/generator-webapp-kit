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
      _appname = @appname
      done = @async()
      prompts = [
        type: 'input'
        name: 'appName'
        message: 'What is your app name'
        default: _appname
      ]
      @prompt prompts, ((props) ->
        props.appName = props.appName.replace /\s/g,'-'
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
            value: {
              name: 'bootstrap'
              installer: 'npm'
            }
          }
          {
            name: 'Pure.css'
            value: {
              name: 'purecss'
              installer: 'npm'
            }
          }
          {
            name: 'Normalize.css'
            value: {
              name: 'normalize.css'
              installer: 'npm'
            }
          }
          {
            name: 'jQuery'
            value: {
              name: 'jquery'
              installer: 'npm'
            }
          }
          {
            name: 'AngularJS'
            value: {
              name: 'angular'
              installer: 'npm'
            }
          }
          {
            name: 'Vue.js'
            value: {
              name: 'vue'
              installer: 'npm'
            }
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

      return

    editorconfigFile: ->
      @fs.copy @templatePath('editorconfig'), @destinationPath('.editorconfig')
      return

    jshintrcFile: ->
      @fs.copy @templatePath('jshintrc'), @destinationPath('.jshintrc')
      return

    jscsrcFile: ->
      @fs.copy @templatePath('jscsrc'), @destinationPath('.jscsrc')
      return

    gitFile: ->
      @fs.copy @templatePath('gitignore'), @destinationPath('.gitignore')
      @fs.copy @templatePath('gitattributes'), @destinationPath('.gitattributes')
      return

    coffeelint: ->
      @fs.copy @templatePath('_coffeelint.json'), @destinationPath('coffeelint.json')
      return

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
      @fs.copy @templatePath('_Gruntfile.coffee'),@destinationPath('Gruntfile.coffee')
      return

    webpack:->
      @fs.copy @templatePath('_webpack.config.js'),@destinationPath('webpack.config.js')
      @fs.copy @templatePath('_webpack.production.config.js'),@destinationPath('webpack.production.config.js')
      return

    folders: ->
      @fs.write @destinationPath('HTML/Readme.md'), '#HTML开发目录'
      @fs.write @destinationPath('scripts/Readme.md'), '#脚本开发目录'
      @fs.write @destinationPath('fake-response/Readme.md'), '#模拟响应目录'
      @fs.write @destinationPath('images/Readme.md'), '#图片目录'
      @fs.write @destinationPath('plugins/Readme.md'), '#插件目录'
      @fs.write @destinationPath('psd/Readme.md'), '#设计PSD目录'
      @fs.write @destinationPath('stylesheets/Readme.md'), '#CSS开发目录'
      return

    commonHTML: ->
      @fs.copy @templatePath('__page-head.html'),@destinationPath('HTML/common/_page-head.html')
      @fs.copy @templatePath('__page-foot.html'),@destinationPath('HTML/common/_page-foot.html')

      return

    commonStyle: ->
      @fs.copy @templatePath('_util.css'),@destinationPath('stylesheets/common/util.css')
      @fs.write @destinationPath('stylesheets/common/common.css'), '/* common style */'

    indexTemplate: ->
      @fs.copy @templatePath('_index.html'),@destinationPath('HTML/index.html')
      @fs.write @destinationPath('stylesheets/pages/website-index.css'),'/* Stuff your style */'

      @fs.write @destinationPath('scripts/pages/website-index.js'),'(function(){ \'use strict\';require(\'styles/pages/website-index.css\'); })();'

      @fs.write @destinationPath('app-entry.js'),'module.exports = { "website-index": "./website-index" }'


  # Where conflicts are handled (used internally)
  # conflicts: function(){},

  # Where installation are run (npm, bower)
  install:
    grunt: ->
      _me = @
      list = [
        'matchdep'
        'grunt'
        'grunt-contrib-watch'
        'grunt-contrib-imagemin'
        'grunt-include-replace'
        'grunt-usemin'
        'grunt-filerev'
        'grunt-filerev-assets'
        'grunt-cwebp'
        'grunt-contrib-jshint'
        'grunt-coffeelint'
      ]

      @npmInstall list,
        saveDev: true

      return

    webpack: ->
      list = [
        'webpack'
        'dev-server-fe'
        'coffee-loader'
        'script-loader'
        'babel-loader'
        'extract-text-webpack-plugin'
        'style-loader'
        'css-loader'
        'file-loader'
        'url-loader'
        'less-loader'
        'sass-loader'
        'assets-webpack-plugin'
        'postcss-loader'
        'autoprefixer'
        'postcss-color-rgba-fallback'
        'postcss-opacity'
        'postcss-pseudoelements'
        'postcss-sprites'
        'webpcss'
        'jshint-loader'
        'jscs-loader'
        'coffeelint-loader'
      ]

      @npmInstall list,
        saveDev: true

      return

    plugins: ->
      pluginsList = @config.get('plugins')
      bowerList = []
      npmList = []

      if pluginsList? and pluginsList.length>0
        for plugin in pluginsList
          switch plugin.installer
            when 'npm' then npmList.push plugin.name
            when 'bower' then bowerList.push plugin.name

        @npmInstall npmList,
          save: true

        @bowerInstall bowerList,
          save: true

        return


  # Called last, cleanup, say good bye, etc
  # end: function(){}
}
