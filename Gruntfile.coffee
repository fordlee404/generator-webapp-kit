module.exports=(grunt)->
  grunt.initConfig {
    coffee:
      compile:
        options:
          bare: true
          join: false
        files:
          'app/index.js': 'app/index.coffee'
          'new_page/index.js': 'new_page/index.coffee'
    watch:
      coffee:
        files: ['**/*.coffee'],
        tasks: ['coffee']

  }

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'default',['coffee']
