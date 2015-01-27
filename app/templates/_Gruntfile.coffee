module.exports=(grunt)->
  phpMiddleware = require 'connect-php'

  # Project configuration
  grunt.initConfig {
    pkg: grunt.file.readJSON 'package.json'
    watch:
      reload:
        files: ['stylesheets/**/*.css','javascripts/**/*.js','HTML/**/*.html']
        options:
          livereload: true
      HTML:
        files: ['srcHTML/**/*.html']
        tasks: ['includereplace:dev']
      sasscompile:
        files: ['sass/**/*.scss','sass/**/*.sass']
        tasks: ['compass:compile']
      coffeecompile:
        files: ['coffeescript/**/*.coffee']
        tasks: ['coffee:compile']
      javascript:
        files: ['javascripts/**/*.js']
        tasks: ['jshint:all']
    connect:
      dev:
        options:
          port: 1024
          hostname: '*'
          livereload: true
          middleware: (connect,options)->
            # Same as in grunt-contrib-connect
            middlewares = []
            directory = options.directory || options.base[options.base.length - 1]
            if not Array.isArray(options.base)
              options.base = [options.base]

            # Here comes the PHP middleware
            middlewares.push(phpMiddleware(directory))

            # Same as in grunt-contrib-connect
            options.base.forEach (base)->
              middlewares.push(connect.static(base))

            middlewares.push(connect.directory(directory))
            return middlewares
    clean: ['dist/','build/']
    compass:
      compile:
        options:
          config: 'config.rb'
    cssmin:
      options:
        keepSpecialComments: 0
      dev:
        files:
          'dist/plugins/css/core.min.css': []
          'dist/stylesheets/common/app.min.css': ['stylesheets/common/**/*.css']
          'dist/stylesheets/pages/pages.min.css': ['stylesheets/pages/**/*.css']
      production:
        files:
          'dist/<%= pkg.version %>/plugins/css/core.min.css': []
          'dist/<%= pkg.version %>/stylesheets/common/app.min.css': ['stylesheets/common/**/*.css']
          'dist/<%= pkg.version %>/stylesheets/pages/pages.min.css': ['stylesheets/pages/**/*.css']
    coffee:
      compile:
        options:
          bare: true
          join: false
        files: [
          {
            expand: true
            cwd: 'coffeescript/'
            src: '**/*.coffee'
            dest: 'javascripts/'
            ext: '.js'
          }
        ]
    jshint:
      all:
        options:
          jshintrc: true
        files: {
          src: ['javascripts/**/*.js']
        }
    requirejs:
      options:
        baseUrl: 'javascripts/pages/'
        mainConfigFile: 'javascripts/pages/app.js'
        keepBuildDir: true
        modules: [
          {
            name: 'app'
          }
        ]
      dev:
        options:
          dir: 'dist/javascripts/pages/'
      production:
        options:
          dir: 'dist/<%= pkg.version %>/javascripts/pages/'
    imagemin:
      options:
        optimizationLevel: 0
      dev:
        files: [
          {
            expand: true
            cwd: 'images/'
            src: '**/*.{png,jpg,gif,svg}'
            dest: 'dist/images/'
          }
        ]
      production:
        files: [
          {
            expand: true
            cwd: 'images/'
            src: '**/*.{png,jpg,gif,svg}'
            dest: 'dist/<%= pkg.version %>/images/'
          }
        ]
    copy:
      dev:
        files: [
          # favicons
          {
            src: ['images/favicons/browserconfig.xml']
            dest: 'dist/images/favicons/browserconfig.xml'
          }
          {
            src: ['images/favicons/favicon.ico']
            dest: 'dist/images/favicons/favicon.ico'
          }
        ]
      production:
        files: [
          # favicons
          {
            src: ['images/favicons/browserconfig.xml']
            dest: 'dist/<%= pkg.version %>/images/favicons/browserconfig.xml'
          }
          {
            src: ['images/favicons/favicon.ico']
            dest: 'dist/<%= pkg.version %>/images/favicons/favicon.ico'
          }
        ]
    includereplace:
      dev:
        options:
          includesDir: 'srcHTML'
          globals:
            ASSETS: '../..'
        files:[
          {
            expand: true
            dest: 'HTML/'
            cwd: 'srcHTML/'
            src: ['**/*']
          }
        ]
  }
  # Loading Grunt plugins and tasks
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-compass'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-requirejs'
  grunt.loadNpmTasks 'grunt-contrib-imagemin'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-include-replace'
  # Custom tasks
  grunt.registerTask 'server', ['connect','watch']
  grunt.registerTask 'default',['server']
  grunt.registerTask 'release',['clean','compass','cssmin:dev','coffee','jshint','requirejs:dev','imagemin:dev','copy:dev']
  grunt.registerTask 'production',['clean','compass','cssmin:production','coffee','jshint','requirejs:production','imagemin:production','copy:production']
