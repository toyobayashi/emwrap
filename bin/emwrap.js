#!/usr/bin/env node

if (process.argv.length <= 2) {
  printHelp()
  process.exit(0)
}

const minimist = require('minimist')

const args = minimist(process.argv.slice(2), {
  string: ['name', 'script', 'output', 'exports', 'module'],
  boolean: ['minify'],
  alias: {
    version: ['v', 'V'],
    help: ['h'],
    output: ['o']
  }
})

// console.log(args)

if (args.version) {
  console.log(require('../package.json').version)
  process.exit(0)
}

if (args.help) {
  printHelp()
  process.exit(0)
}

if (args._.length > 0) {
  const filePath = args._[0]
  if (!filePath) {
    console.error('Error: missing input file')
    process.exit(1)
  }
  const exports = (args.exports || '')
  require('..').emwrap({
    filePath,
    module: args.module || '',
    outputPath: args.output || '',
    libName: args.name || '',
    wrapScript: args.script || '',
    minify: Boolean(args.minify),
    exportsOnInit: exports ? exports.split(',') : []
  })
} else {
  console.error('Error: missing input file')
  process.exit(1)
}

function printHelp () {
  console.log(
`${require('../package.json').description}

usage: emwrap [--name=myWasmLib] [--script=/path/to/export.js]
              [--minify] [--exports=UTF8ToString,stringToUTF8]
              [--module=<umd | esm>]
              [--output=/path/to/output.js] /path/to/emscripten/glue.js

v${require('../package.json').version}`)
}
