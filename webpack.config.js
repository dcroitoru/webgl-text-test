const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  entry: {
    index: './src/index.js'
  },
  module: {
    rules: [ { test: /\.png$/, loader: 'url-loader?mimetype=image/png' } ]
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html'
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],

  output: {
    filename: 'build.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'TWGL',
    globalObject: 'this'
  },

  devServer: {
    contentBase: './public/',
    publicPath: '/dist/'
  },

  devtool: 'inline-source-map',
  mode: 'development'
}
