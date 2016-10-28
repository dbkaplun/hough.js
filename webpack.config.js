const path = require('path');

let config = {
  context: path.join(__dirname, 'src'),
  entry: './index.js',

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
    ],
    noParse: /canvas/,
  },
};
module.exports = config;
