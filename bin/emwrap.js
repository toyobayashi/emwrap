#!/usr/bin/env node

if (process.argv.length <= 2) {
  printHelp()
  process.exit(0)
}

const path = require('path')
const fs = require('fs')
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
  emwrap(filePath, {
    module: args.module || '',
    outputPath: args.output || '',
    libName: args.name || '',
    wrapScript: args.script || '',
    minify: Boolean(args.minify),
    exportsOnInit: exports ? exports.split(',') : []
  }).catch(err => {
    console.error(err)
    process.exit(1)
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

async function emwrap (filePath, options) {
  if (!filePath || typeof filePath !== 'string') {
    throw new TypeError('missing input file')
  }
  options = options || {}
  const module = options.module || 'umd'
  if (module !== 'umd' && module !== 'esm') {
    throw new Error(`unsupport module type: ${module}`)
  }
  options.outputPath = options.outputPath || path.join(path.dirname(filePath), path.basename(filePath, '.js') + '.' + module + '.js')
  const code = await require('..').wrap(fs.readFileSync(filePath, 'utf8'), options)

  await fs.promises.writeFile(options.outputPath, code, 'utf8')
}
