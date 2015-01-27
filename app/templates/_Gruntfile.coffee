module.exports=(grunt)->
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
  }
  # Loading Grunt plugins and tasks
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  # Custom tasks
  grunt.registerTask 'server', ['connect','watch']
  grunt.registerTask 'default',['server']
