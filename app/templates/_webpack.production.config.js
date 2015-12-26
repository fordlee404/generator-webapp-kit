var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var AssetsPlugin = require('assets-webpack-plugin');

webpackConfig.output.path = __dirname+'/build/assets'
webpackConfig.output.filename = '[name].[chunkhash].js';
webpackConfig.output.publicPath = './';

webpackConfig.devtool = 'source-map';

webpackConfig.debug = false;

webpackConfig.plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'bundle',
    filename: 'bundle.[chunkhash].js',
    minChunks: 3
  }),
  new ExtractTextPlugin("[name].[chunkhash].css"),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.UglifyJsPlugin({
    mangle: false,
    compress: {
      warnings: false
    }
  }),
  new AssetsPlugin(),
  new webpack.DefinePlugin({
    PRODUCTION: true,
    'process.env': {
      NODE_ENV: '"production"'
    }
  })
]

module.exports = webpackConfig;
