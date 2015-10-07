module.exports = (grunt)->
  'use strict';
  require("matchdep").filterAll("grunt-*").forEach grunt.loadNpmTasks

  grunt.initConfig
    watch:
      HTML:
        files: ['srcHTML/**/*.html']
        tasks: ['includereplace:dev']
        options:
          spawn: false

    includereplace:
      dev:
        options:
          includesDir: 'srcHTML'
          globals:
            ASSETS: ''
        files:[{
          expand: true
          dest: 'HTML/'
          cwd: 'srcHTML/'
          src:[
            '**/*'
            '!**/_*'
          ]
        }]
    filerev:
      images:
        files:[
          {
            expand: true,
            cwd: 'images/',
            src: ['**/*.{png,jpg,gif,svg}'],
            dest: 'build/images/'
          }
        ]
      modernizr:
        src: 'plugins/modernizr/modernizr.js'
        dest: 'build/plugins/modernizr'
    filerev_assets:
      production:
        options:
          dest: './filerev.json'
          prettyPrint: true
    usemin:
      html: ['HTML/**/*.html']
      options:
        assetsDirs: './'
        revmap: './filerev.json'
        ###
        blockReplacements:
          css: (block)->
            return '<link rel="stylesheet" href="<?php echo STA_DOMAIN_URL;?>/'+block.dest+'" />'
          js: (block)->
            return '<script type="text/javascript" src="<?php echo STA_DOMAIN_URL;?>/'+block.dest+'"></script>'
        ###
    imagemin:
      production:
        files:[
          {
            expand: true,
            cwd: 'images/',
            src: ['**/*.{png,jpg,gif,svg}'],
            dest: 'images/'
          }
        ]
    cwebp:
      dynamic:
        options:
          q: 80
        files: [
          {
            expand: true,
            cwd: './',
            src: ['images/**/*.{png,jpg,jpeg}','plugins/**/*.{png,jpg,jpeg}'],
            dest: './'
          }
        ]
    jshint:
      options:
        jshintrc: true
      production: 'scripts/**/*.js'
    coffeelint:
      options:
        configFile: 'coffeelint.json'
      production: 'scripts/**/*.coffee'

  grunt.registerTask 'default',['watch']
  grunt.registerTask 'files',['filerev','filerev_assets']
  grunt.registerTask 'build',->
    webpackFilerev = grunt.file.readJSON 'webpack-assets.json'
    filerev = grunt.file.readJSON 'filerev.json'

    for own key,val of webpackFilerev
      filerev[key+'.js'] = val.js
      filerev[key+'.css'] = val.css

    ###
    for own key,val of filerev
      delete filerev[key]
      filerev['<?php echo STA_DOMAIN_URL;?>/'+key] = val
    ###

    grunt.file.write './filerev.json',JSON.stringify(filerev)
    grunt.task.run 'usemin'

  grunt.registerTask 'test',['jshint','coffeelint']
