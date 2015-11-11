# generator-webapp-kit [![Build Status](https://secure.travis-ci.org/fordlee404/generator-webapp-kit.png?branch=master)](https://travis-ci.org/fordlee404/generator-webapp-kit)

> [Yeoman](http://yeoman.io) generator

## Introduction

This yeoman generator helps you to write front-end code (HTML, CSS, Javascript etc) fast, orignize your files and build your code to production. It defines a dev workflow and build process.

It generate a basic front-end develop environment. Includes a basic directory structure, a develop server and build tools for production environment (compile language and compress files and images). It's all based on [Webpack](http://webpack.github.io) and [Grunt](http://gruntjs.com). You can also use [Gulp](http://gulpjs.com) to instead of [Grunt](http://gruntjs.com).

You should follow some rules if you use this generator. But if you know much about these tools (Webpack, Grunt, Gulp, NPM etc), you will understand these rules easily, and you can change some rules to make you comfortable.

## Getting Started

This is a yeoman generator, so you must use [Yeoman](http://yeoman.io).

### Directory structure

In your project folder and run the generator, it will generate some folders and files. 

```
project
  |-- fake-response
    |-- // Put your ajax fake response files, like json
  |-- HTML
    |-- // Put your HTML files
  |-- images
    |-- // Put your images
  |-- node_modules
    |-- // NPM install folder
  |-- bower_components
    |-- // Bower install folder
  |-- plugins
    |-- // plugins who can not use bower and npm to install
  |-- scripts // Put your scripts, like .js files, .coffee files and others
    |-- common
      |-- // common script files
    |-- pages
      |-- // pages script files
  |-- stylesheets // Put your style files, .css/.less/.scss etc
    |-- common
      |-- // common style
    |-- pages
      |-- // pages style
  |-- .editorconfig
  |-- .gitattributes
  |-- .gitignore
  |-- .jshintrc
  |-- .yo-rc.json
  |-- app-entry.js // webpack entry
  |-- bower.json
  |-- Gruntfile.coffee // Grunt config
  |-- package.json
  |-- Readme.md
  |-- webpack.config.js // webpack config for dev
  |-- webpack.production.config.js // webpack config for production
```

Now you can write your codes!

### Develop

Before coding, start server to host files and compile something. Start a terminal window and run:

```
$ npm start
```

It will start a server which fork from [webpack-dev-server](http://webpack.github.io/docs/webpack-dev-server.html). It's a http server, host the html files and other static resources.

Start your browser and open `http://localhost:1024/HTML/`. Now you can start write codes, really!

#### How to write style

Put your style files in `stylesheets` folder. `.css` file, `.less` file, `.scss` file, whatever you want to write, webpack can handle that. Don't forget to `require` your style in your script.

#### How to write script

Put your script files in 'scripts' folder. Of course, you can write javascript or coffeescript. Then you need to add your script file in `app-entry.js`, so that the webpack will generate the file and it's dependencies.

### Production

Open a terminal window and run:

```
$ npm run build
```

That's all. All your scripts, styles, images and fonts will be put in the `build` folder. It use webpack and grunt to process all the static resources. See details in the `package.json`, `Gruntfile.coffee` and `webpack.config.json` and `webpack.production.config.json`.

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

## Release History

* 2.1.0 - add webp support, postcss and codelint
