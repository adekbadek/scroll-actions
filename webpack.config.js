var path = require('path')

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    main: './index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js' // Template based on keys in entry above
  },
  babel: {
    presets: ['es2015'],
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ]
  },
  resolve: {
    // you can now require('file') instead of require('file.es6')
    extensions: ['', '.js', '.json']
  },
}
