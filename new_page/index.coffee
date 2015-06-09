'use strict'
yeoman = require 'yeoman-generator'
chalk = require 'chalk'
yosay = require 'yosay'
fs = require 'fs'
path=require 'path'
module.exports = yeoman.generators.Base.extend {
  prompting:
    name: ->
      done = @async()
      root = @destinationRoot()
      prompts = [
        type: 'input'
        name: 'pageName'
        message: 'What is the name of this new page'
      ]
      @prompt prompts, ((props) ->
        unless props.pageName
          @log 'Page name cannot be empty.'
          process.exit()
        @config.set props
        done()
        return
      ).bind(this)
      return
    path: ->
      done = @async()
      root = @destinationRoot()
      prompts = [
        type: 'input'
        name: 'pagePath'
        message: 'Save path'
        default:'/'
      ]
      @prompt prompts, ((props) ->
        unless pagePath=props.pagePath
          @log 'Page path cannot be empty.'
          process.exit()


        @config.set props
        done()
        return
      ).bind(this)
      return
  parts: ->
    done = @async()
    prompt = [
      type: 'checkbox'
      name: 'parts'
      message: 'Select parts: '
      choices: [
        {name:'Stylesheet',value:'stylesheet',checked:true}
        {name:'HTML Page',value:'html',checked:true}
        {name:'Javascript',value:'js',checked:true}
      ]
    ]
    @prompt prompt, ((props) ->
      @config.set props
      done()
      return
    ).bind(this)
    return

  writing:
    newPage:()->
      parts=@config.get 'parts'

      pageName=@config.get('pageName')

      if -1<parts.indexOf('js')
        jsFilePath=@destinationPath('/javascripts/',@config.get('pagePath'),"#{pageName}.js")

        try
          entryJSON=@fs.read(@destinationPath('.webpack_entry.json'))
          entry=JSON.parse entryJSON
        catch error
          entry={}

        entry[pageName]='./'+path.relative @destinationPath('./javascripts'),jsFilePath

        fs.writeFileSync @destinationPath('.webpack_entry.json'),JSON.stringify(entry,null,'    ')
        @fs.copy @templatePath('newPage.js'),jsFilePath

      if -1<parts.indexOf('html')
        @fs.copy @templatePath('newPage.html'),@destinationPath('/srcHTML/',@config.get('pagePath'),"#{pageName}.html")
      if -1<parts.indexOf('stylesheet')
        @fs.copy @templatePath('newPage.scss'),@destinationPath('/sass/',@config.get('pagePath'),"#{pageName}.scss")


}
