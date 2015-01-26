module.exports=(grunt)->
  grunt.initConfig {
    coffee:
      compile:
        options:
          bare: true
          join: false
        files:
          'app/index.js': 'app/index.coffee'
  }

  grunt.loadNpmTasks 'grunt-contrib-coffee'

  grunt.registerTask 'default',['coffee']
