const path = require('path');
const base = require('./webpack.base.config.js');
const merge = require('webpack-merge');
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');

base.module.rules[0].loaders.push('react-hot-loader/webpack');
base.devServer = {
  inline: true,
  hot: true,
  historyApiFallback: true,
  host: '0.0.0.0',
  port: 3000,
  headers: { 'Access-Control-Allow-Origin': '*' }
};

module.exports = merge(base, {
  mode: 'development',
  devtool: 'eval',
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://0.0.0.0:3000',
    'webpack/hot/only-dev-server',
    path.resolve('./modules/dashboard/static/js/index.jsx')
  ],
  output: {
    path: path.resolve('./staticfiles/assets/bundles'),
    filename: '[name]-[hash].js',
    publicPath: 'http://localhost:3000/assets/bundles/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new BundleTracker({filename: './webpack-stats.json'}),
    new webpack.DefinePlugin({
      'process.env': {BASE_URL: JSON.stringify('http://0.0.0.0:8000/')}
    })
  ]
});
