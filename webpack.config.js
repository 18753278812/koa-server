const path = require('path')
// const webpack = require('webpack')
const _externals = require('externals-dependencies')

module.exports = {
  mode: 'production',
  entry: {
    app: ['./index.js']
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, './dist')
  },
  resolve: {
    extensions: [".js"]
  },
  target: 'node',
  externals: _externals(),
  context: __dirname,
  node: {
    console: true,
    global: true,
    process: true,
    Buffer: true,
    __filename: true,
    __dirname: true,
    setImmediate: true,
    path: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader'
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  }
}