const path = require('path');

module.exports = {
  module: {
    rules: [
      {test: /\.(js|jsx)$/, exclude: /node_modules/, loaders: ['babel-loader']},
      {test: /\.css$/, loaders: ['style-loader', 'css-loader']}
    ]
  },
  resolve: {
    modules: [
      path.resolve('./modules/static/js'),
      'node_modules'
    ],
    extensions: ['.js', '.jsx']
  }
};