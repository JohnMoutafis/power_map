const path = require('path');
const base = require('./webpack.base.config.js');
const merge = require('webpack-merge');
const BundleTracker = require('webpack-bundle-tracker');

module.exports = merge(base, {
  mode: 'production',
  entry: {
    main: path.resolve('./modules/dashboard/static/js/index.js')
  },
  output: {
    path: path.resolve('./staticfiles/assets/dist/'),
    filename: '[name]-[hash].js',
    publicPath: 'assets/dist'
  },
  plugins: [
    new BundleTracker({filename: './webpack-stats-prod.json'}),
  ]
});
