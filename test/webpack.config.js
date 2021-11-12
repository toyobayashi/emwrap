const path = require('path')

module.exports = {
  entry: path.join(__dirname, './out/lib.esm.js'),
  output: {
    path: path.join(__dirname, './out'),
    filename: 'lib.webpack.js',
    library: 'lib',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  node: false,
  devtool: false,
  mode: 'development'
}
