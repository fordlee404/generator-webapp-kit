"use strict";
var chalk, yeoman, yosay;

yeoman = require("yeoman-generator");

chalk = require("chalk");

yosay = require("yosay");

module.exports = yeoman.generators.Base.extend({
  initializing: function() {
    this.pkg = require("../package.json");
  },
  prompting: {
    welcome: function() {
      this.log(yosay("Welcome to the fantastic " + chalk.red("Fordlee404") + " generator!"));
    },
    name: function() {
      var done, prompts, root;
      done = this.async();
      root = this.destinationRoot();
      prompts = [
        {
          type: "input",
          name: "appName",
          message: "What is your app name",
          "default": function() {
            var len, rootArr;
            rootArr = root.split("/");
            len = rootArr.length;
            return rootArr[len - 1];
          }
        }
      ];
      this.prompt(prompts, (function(props) {
        this.config.set(props);
        done();
      }).bind(this));
    },
    authors: function() {
      var done, prompt;
      done = this.async();
      prompt = [
        {
          type: "input",
          name: "authors",
          message: "Author: "
        }
      ];
      this.prompt(prompt, (function(props) {
        this.config.set(props);
        done();
      }).bind(this));
    },
    description: function() {
      var done, prompt;
      done = this.async();
      prompt = [
        {
          type: "input",
          name: "description",
          message: "Description: "
        }
      ];
      this.prompt(prompt, (function(props) {
        this.config.set(props);
        done();
      }).bind(this));
    },
    license: function() {
      var done, prompt;
      done = this.async();
      prompt = [
        {
          type: "input",
          name: "license",
          message: "License: ",
          "default": "MIT"
        }
      ];
      this.prompt(prompt, (function(props) {
        this.config.set(props);
        done();
      }).bind(this));
    },
    plugins: function() {
      var done, prompt;
      done = this.async();
      prompt = [
        {
          type: "checkbox",
          name: "plugins",
          message: "Select plugins: ",
          choices: [
            {
              name: "Bootstrap",
              value: "bootstrap"
            }, {
              name: "Pure.css",
              value: "pure"
            }, {
              name: "Foundation",
              value: "foundation"
            }, {
              name: "Normalize.css",
              value: "normalize.css"
            }, {
              name: "jQuery",
              value: "jquery"
            }, {
              name: "Zepto",
              value: "zeptojs"
            }, {
              name: "RequireJS",
              value: "requirejs"
            }, {
              name: "Modernizr",
              value: "modernizr"
            }, {
              name: "AngularJS",
              value: "angular"
            }, {
              name: "Polymer",
              value: "polymer"
            }
          ]
        }
      ];
      this.prompt(prompt, (function(props) {
        this.config.set(props);
        done();
      }).bind(this));
    }
  },
  configuring: {
    packageJSON: function() {
      this.fs.copyTpl(this.templatePath("_package.json"), this.destinationPath("package.json"), {
        appName: this.config.get("appName"),
        authors: this.config.get("authors"),
        description: this.config.get("description"),
        license: this.config.get("license")
      });
    },
    bowerFiles: function() {
      this.fs.copyTpl(this.templatePath("_bower.json"), this.destinationPath("bower.json"), {
        appName: this.config.get("appName")
      });
      this.fs.copy(this.templatePath("bowerrc"), this.destinationPath(".bowerrc"));
    },
    editorconfigFile: function() {
      this.fs.copy(this.templatePath("editorconfig"), this.destinationPath(".editorconfig"));
    },
    jshintrcFile: function() {
      this.fs.copy(this.templatePath("jshintrc"), this.destinationPath(".jshintrc"));
    },
    gitFile: function() {
      this.fs.copy(this.templatePath("gitignore"), this.destinationPath(".gitignore"));
    }
  },
  writing: {
    readme: function() {
      this.fs.copyTpl(this.templatePath("_Readme.md"), this.destinationPath("Readme.md"), {
        appName: this.config.get("appName"),
        description: this.config.get("description")
      });
    },
    gruntfile: function() {
      var connectConfig, watchConfig;
      connectConfig = "{ dev: { options: { port: 1024, hostname: '*', livereload: true } } }";
      this.gruntfile.insertConfig("connect", connectConfig);
      this.gruntfile.loadNpmTasks("grunt-contrib-connect");
      this.gruntfile.registerTask("server", "connect");
      watchConfig = "{ reload: { files: ['javascripts/**/*.css','stylesheets/**/*.js','HTML/**/*.html'], options: { livereload: true } } }";
      this.gruntfile.insertConfig("watch", watchConfig);
      this.gruntfile.loadNpmTasks("grunt-contrib-watch");
      this.gruntfile.registerTask("server", ["connect", "watch"]);
    },
    folders: function() {
      this.fs.write(this.destinationPath("/srcHTML/Readme.md"), "#HTML开发目录");
      this.fs.write(this.destinationPath("/HTML/Readme.md"), "#编译后HTML目录");
      this.fs.write(this.destinationPath("/coffeescript/Readme.md"), "#Coffeescript开发目录");
      this.fs.write(this.destinationPath("/fake-response/Readme.md"), "#模拟响应目录");
      this.fs.write(this.destinationPath("/images/Readme.md"), "#图片目录");
      this.fs.write(this.destinationPath("/javascripts/Readme.md"), "#Javascript目录");
      this.fs.write(this.destinationPath("/plugins/Readme.md"), "#插件目录");
      this.fs.write(this.destinationPath("/psd/Readme.md"), "#设计PSD目录");
      this.fs.write(this.destinationPath("/sass/Readme.md"), "#Sass开发目录");
      this.fs.write(this.destinationPath("/less/Readme.md"), "#Less开发目录");
      this.fs.write(this.destinationPath("/stylesheets/Readme.md"), "#CSS开发目录");
    }
  },
  install: {
    tools: function() {
      var list;
      list = ["grunt", "grunt-contrib-connect", "grunt-contrib-watch"];
      this.npmInstall(list, {
        saveDev: true
      });
    },
    plugins: function() {
      var pluginsList;
      pluginsList = this.config.get("plugins");
      this.bowerInstall(pluginsList, {
        save: true
      });
    }
  }
});
