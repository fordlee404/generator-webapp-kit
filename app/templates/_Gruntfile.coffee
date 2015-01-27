module.exports=(grunt)->
  phpMiddleware = require 'connect-php'

  # Project configuration
  grunt.initConfig {
    pkg: grunt.file.readJSON 'package.json'
    watch:
      reload:
        files: ['assets/**/*.css','assets/**/*.js','HTML/**/*.html']
        options:
          livereload: true
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
  }
  # Loading Grunt plugins and tasks
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  # Custom tasks
  grunt.registerTask 'server', ['connect','watch']
  grunt.registerTask 'default',['server']
