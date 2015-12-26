var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var fs = require('fs');
var path = require('path');
module.exports = {
  context: __dirname+'/scripts/pages',
  entry: require('./app-entry'),
  output: {
    path: __dirname + '/build',
    publicPath: '/build',
    filename: '[name].js',
    sourceMapFilename: '[file].map'
  },
  devServer: {
    contentBase: '.',
    colors: true,
    port: 1024,
    host: '0.0.0.0',
    includeReplace: {
      includesDir: './HTML',
      globals: {
        ASSETS: ''
      }
    }
  },
  watchOptions: {
    poll: true
  },
  debug: true,
  devtool: 'eval',
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'scripts'),
        loader: "jshint-loader"
      },
      {
        test: /\.coffee$/,
        include: path.resolve(__dirname, 'scripts'),
        loader: "coffeelint-loader"
      }
    ],
    loaders: [
      { test: /\.vue$/, loader: 'vue' },
      { test: /\.coffee$/, loader: "coffee-loader" },
      { test: /\.(coffee\.md|litcoffee)$/, loader: "coffee-loader?literate" },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader','css-loader'),
        exclude: path.resolve(__dirname, 'stylesheets')
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader','css-loader!postcss-loader'),
        include: path.resolve(__dirname, 'stylesheets')
      },
      { test: /\.less$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader!less-loader") },
      { test: /(\.scss)|(\.sass)$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader!sass-loader?sourceMap") },
      { test: /\.(woff|ttf|eot|svg|png|jpg|jpeg|gif|webp)/, loader: "file-loader"},
    ]
  },
  jshint: {
    devel: true
  },
  coffeelint: (function(){
    var options = JSON.parse(fs.readFileSync(__dirname+'/coffeelint.json'));

    options.no_debugger.level = 'ignore';

    return options;
  })(),
  postcss: function () {
    return [
      require('autoprefixer'),
      require("postcss-color-rgba-fallback"),
      require('postcss-opacity'),
      require('postcss-pseudoelements'),
      require('postcss-sprites')({
        stylesheetPath: './stylesheets/pages',
        spritePath: './images/sprites.png',
        retina: true,
        filterBy: function(image) {
          return /(sprites\/).*\/?(\.jpg|\.png)$/gi.test(image.url);
        }
      }),
      require('webpcss').default({
        noWebpClass: '.no-webp'
      })
    ];
  },
  resolve:{
    root: [__dirname],
    modulesDirectories: ['node_modules','bower_components'],
    alias: {
      stylesheets: __dirname+'/stylesheets',
      images: __dirname+'/images',
      plugins: __dirname+'/plugins',
      bower: __dirname+'/bower_components',
      components: __dirname+'/components',
      scripts: __dirname+'/scripts',
      amazeuicss: __dirname+'/bower_components/amazeui/dist/css/amazeui.min.css',
      amazeuijs: __dirname+'/bower_components/amazeui/dist/js/amazeui.min.js'
    }
  },
  plugins: [
    new ExtractTextPlugin("[name].css"),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'bundle',
      filename: 'bundle.js',
      minChunks: 3
    }),
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
    ),
    new webpack.DefinePlugin({
      PRODUCTION: false
    })
  ]
}
