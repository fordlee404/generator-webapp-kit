"use strict"
yeoman = require("yeoman-generator")
chalk = require("chalk")
yosay = require("yosay")
module.exports = yeoman.generators.Base.extend(

  # Your initialization methods (checking current project state, getting configs, etc)
  initializing: ->
    @pkg = require("../package.json")
    return


  # Where you prompt users for options (where you'd call this.prompt())
  prompting:
    welcome: ->

      # Have Yeoman greet the user.
      @log yosay("Welcome to the fantastic " + chalk.red("Fordlee404") + " generator!")
      return

    name: ->
      done = @async()
      root = @destinationRoot()
      prompts = [
        type: "input"
        name: "appName"
        message: "What is your app name"
        default: ->
          rootArr = root.split("/")
          len = rootArr.length
          rootArr[len - 1]
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
        type: "input"
        name: "authors"
        message: "Author: "
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
        type: "input"
        name: "description"
        message: "Description: "
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
        type: "input"
        name: "license"
        message: "License: "
        default: "MIT"
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
        type: "checkbox"
        name: "plugins"
        message: "Select plugins: "
        choices: [
          {
            name: "Bootstrap"
            value: "bootstrap"
          }
          {
            name: "Pure.css"
            value: "pure"
          }
          {
            name: "Foundation"
            value: "foundation"
          }
          {
            name: "Normalize.css"
            value: "normalize.css"
          }
          {
            name: "jQuery"
            value: "jquery"
          }
          {
            name: "Zepto"
            value: "zeptojs"
          }
          {
            name: "RequireJS"
            value: "requirejs"
          }
          {
            name: "Modernizr"
            value: "modernizr"
          }
          {
            name: "AngularJS"
            value: "angular"
          }
          {
            name: "Polymer"
            value: "polymer"
          }
        ]
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
      @fs.copyTpl @templatePath("_package.json"), @destinationPath("package.json"),
        appName: @config.get("appName")
        authors: @config.get("authors")
        description: @config.get("description")
        license: @config.get("license")

      return

    bowerFiles: ->
      @fs.copyTpl @templatePath("_bower.json"), @destinationPath("bower.json"),
        appName: @config.get("appName")

      @fs.copy @templatePath("bowerrc"), @destinationPath(".bowerrc")
      return

    editorconfigFile: ->
      @fs.copy @templatePath("editorconfig"), @destinationPath(".editorconfig")
      return

    jshintrcFile: ->
      @fs.copy @templatePath("jshintrc"), @destinationPath(".jshintrc")
      return

    gitFile: ->
      @fs.copy @templatePath("gitignore"), @destinationPath(".gitignore")
      return


  # If the method name doesn't match a priority, it is pushed in the default group
  # default

  # Where you write the generator specific files (routes, controllers, etc)
  writing:
    readme: ->
      @fs.copyTpl @templatePath("_Readme.md"), @destinationPath("Readme.md"),
        appName: @config.get("appName")
        description: @config.get("description")

      return

    gruntfile: ->
      # Web Server
      connectConfig = "{
        dev: {
          options: {
            port: 1024,
            hostname: '*',
            livereload: true
          }
        }
      }"
      @gruntfile.insertConfig "connect", connectConfig
      @gruntfile.loadNpmTasks "grunt-contrib-connect"
      @gruntfile.registerTask "server", "connect"

      # Watch
      watchConfig = "{
        reload: {
          files: ['javascripts/**/*.css','stylesheets/**/*.js','HTML/**/*.html'],
          options: {
            livereload: true
          }
        }
      }"
      @gruntfile.insertConfig "watch", watchConfig
      @gruntfile.loadNpmTasks "grunt-contrib-watch"
      @gruntfile.registerTask "server", ["connect","watch"]
      return

    folders: ->
      @fs.write @destinationPath("/srcHTML/Readme.md"), "#HTML开发目录"
      @fs.write @destinationPath("/HTML/Readme.md"), "#编译后HTML目录"
      @fs.write @destinationPath("/coffeescript/Readme.md"), "#Coffeescript开发目录"
      @fs.write @destinationPath("/fake-response/Readme.md"), "#模拟响应目录"
      @fs.write @destinationPath("/images/Readme.md"), "#图片目录"
      @fs.write @destinationPath("/javascripts/Readme.md"), "#Javascript目录"
      @fs.write @destinationPath("/plugins/Readme.md"), "#插件目录"
      @fs.write @destinationPath("/psd/Readme.md"), "#设计PSD目录"
      @fs.write @destinationPath("/sass/Readme.md"), "#Sass开发目录"
      @fs.write @destinationPath("/less/Readme.md"), "#Less开发目录"
      @fs.write @destinationPath("/stylesheets/Readme.md"), "#CSS开发目录"
      return


  # Where conflicts are handled (used internally)
  # conflicts: function(){},

  # Where installation are run (npm, bower)
  install:
    tools: ->
      list = [
        "grunt"
        "grunt-contrib-connect"
        "grunt-contrib-watch"
      ]
      @npmInstall list,
        saveDev: true

      return

    plugins: ->
      pluginsList = @config.get("plugins")
      @bowerInstall pluginsList,
        save: true

      return
)

# Called last, cleanup, say good bye, etc
# end: function(){}
