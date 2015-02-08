module.exports = function(grunt){
  var phpMiddleware = require('connect-php');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect:{
      dev: {
        options: {
          port: 1024,
          hostname: '*',
          middleware: function(connect,options){
            var middlewares = [];
            var directory = options.directory || options.base[options.base.length - 1];
            if (!Array.isArray(options.base)) {
                options.base = [options.base];
            }

            // Magic happens here
            middlewars.push(phpMiddleware(directory));

            options.base.forEach(function(base) {
                // Serve static files.
                middlewares.push(connect.static(base));
            });

            // Make directory browse-able.
            middlewares.push(connect.directory(directory));
            return middlewares;
          }
        }
      }
    }
  });
};

