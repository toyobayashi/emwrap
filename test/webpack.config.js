const path = require('path')

module.exports = {
  entry: path.join(__dirname, './out/lib.cjs.js'),
  output: {
    path: path.join(__dirname, './out'),
    filename: 'lib.webpack.js',
    library: 'lib',
    libraryTarget: 'umd',
    globalObject: 'typeof globalThis !== "undefined" ? globalThis : (typeof window !== "undefined" ? window : (typeof self !== "undefined" ? self : this))'
  },
  node: false,
  devtool: false,
  mode: 'development'
}
