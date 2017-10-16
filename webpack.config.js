const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const PROD = (process.env.NODE_ENV === 'production');

const CONFIG = {
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
      },
      {
        test: /\.svg$/,
        use: 'raw-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'assets/img', to: 'img' },
      { from: 'src/index.html', to: 'index.html' },
      { from: 'node_modules/gitter/dist/gitter.js', to: 'gitter.js' },
      { from: 'node_modules/gitter/assets/icons', to: 'icons' },
      { from: 'node_modules/gitter/assets/css', to: 'css' },
      { from: 'node_modules/gitter/assets/bpmn-font', to: 'bpmn-font' },
      { from: 'node_modules/gitter/assets/audio', to: 'audio' }
    ])
  ]
};

if (!PROD) {
  CONFIG.devtool = 'source-map';

  CONFIG.devServer ={
    contentBase: './dist',
    // hot: true,
    historyApiFallback: true,
  };
}

module.exports = CONFIG;