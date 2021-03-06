const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const cssModules = 'modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]'
const path = require('path')

module.exports = {
  devtool: 'inline-source-map',

  resolve: {
    extensions: ['.js', '.jsx']
  },

  entry: ['./src/index.jsx'],
  output: {
	 path: path.join(__dirname, '/build'),
	filename: 'app.js',
    publicPath: '/'
  },

  module: {
    loaders: [
      { test: /(\.js|jsx)$/, exclude: /node_modules/, loaders: ['babel-loader'] },
      { test: /\.css$/, exclude: '/src/components/LocationForm/', loader: `style-loader!css-loader` }, //?${cssModules}
      { test: /\.(png|jpg|gif)$/, use: [{ loader: 'file-loader', options: {} }]}
    ]
  },

  devServer: {
    host: '0.0.0.0',
    port: 8080,
    inline: true
  },

  plugins: [
    new HtmlWebpackPlugin({ template: './src/assets/index.html' }),
    new ExtractTextPlugin('style.css', { allChunks: true })
  ]
}
