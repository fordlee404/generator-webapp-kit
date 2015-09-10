# generator-webapp-kit [![Build Status](https://secure.travis-ci.org/fordlee404/generator-webapp-kit.png?branch=master)](https://travis-ci.org/fordlee404/generator-webapp-kit)

> [Yeoman](http://yeoman.io) generator

## Getting Started

This yeoman generator helps you to write front-end code (HTML, CSS, Javascript etc) fast, orignize your project files and compile your code to production.

It generator a basic front-end develop environment. Includes a basic directory structure, a develop server and static file tools for production environment (compile language and compress files and images). It's all based on [Webpack](http://webpack.github.io) and [Grunt](http://gruntjs.com).

### Directory structure

```
project
  |-- fake-response
    |-- // Put your ajax fake response files, like json
  |-- HTML
    |-- // The generated HTML file, you don't need to edit the files in this folder, it's generated from srcHTML folder
  |-- images
    |-- // Put your images
  |-- node_modules
    |-- // npm install folder
  |-- plugins
    |-- // Bower install folder
  |-- scripts // Put your scripts, like .js files, .coffee files and others
    |-- common
      |-- // common script files
    |-- pages
      |-- // pages script files
  |-- srcHTML
    |-- // Put your .html files
  |-- stylesheets // Put your style files, .css/.less/.scss etc
    |-- common
      |-- // common style
    |-- pages
      |-- // pages style
  |-- .bowerrc
  |-- .editorconfig
  |-- .gitattributes
  |-- .gitignore
  |-- .jshintrc
  |-- .yo-rc.json
  |-- app-entry.js // webpack entry
  |-- bower.json
  |-- Gruntfile.coffee
  |-- package.json
  |-- Readme.md
  |-- webpack.config.js // webpack config for dev
  |-- webpack.production.config.js // webpack config for production
```

## Yeoman

### What is Yeoman?

Trick question. It's not a thing. It's this guy:

![](http://i.imgur.com/JHaAlBJ.png)

Basically, he wears a top hat, lives in your computer, and waits for you to tell him what kind of application you wish to create.

Not every new computer comes with a Yeoman pre-installed. He lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. *Make sure you clean up, he likes new and shiny things.*

```bash
npm install -g yo
```

### Yeoman Generators

Yeoman travels light. He didn't pack any generators when he moved in. You can think of a generator like a plug-in. You get to choose what type of application you wish to create, such as a Backbone application or even a Chrome extension.

To install generator-webapp-kit from npm, run:

```bash
npm install -g generator-webapp-kit
```

Finally, initiate the generator:

```bash
yo webapp-kit
```

### Getting To Know Yeoman

Yeoman has a heart of gold. He's a person with feelings and opinions, but he's very easy to work with. If you think he's too opinionated, he can be easily convinced.

If you'd like to get to know Yeoman better and meet some of his friends, [Grunt](http://gruntjs.com) and [Bower](http://bower.io), check out the complete [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).


## License

MIT
