const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const PROD = process.argv.indexOf('-p') !== -1;

module.exports = {
  node: {
    fs: 'empty'
  },
  entry: PROD
    ? [
      'webpack-dev-server/client?http://localhost:8000',
      // 'webpack/hot/only-dev-server',
      './src/app.js',
    ]
    : [
      './src/app.js'
    ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: './dist',
    // hot: true,
    historyApiFallback: true,
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'assets/img', to: 'img' },
      { from: 'src/index.html', to: 'index.html' },
      { from: 'node_modules/gitter/assets/css', to: 'css' },
      { from: 'node_modules/gitter/assets/bpmn-font', to: 'bpmn-font' },
      { from: 'node_modules/gitter/assets/audio', to: 'audio' }
    ])
  ]
};
