#!/usr/bin/env node

if (process.argv.length <= 2) {
  printHelp()
  process.exit(0)
}

const fs = require('fs')
const minimist = require('minimist')

const args = minimist(process.argv.slice(2), {
  string: ['name', 'script', 'output', 'exports', 'module', 'initscript'],
  boolean: ['minify', 'weixin', 'worker'],
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
    worker: Boolean(args.worker),
    module: args.module || '',
    output: args.output || '',
    name: args.name || '',
    script: args.script || '',
    onInitScript: args.initscript || '',
    minify: Boolean(args.minify),
    weixin: Boolean(args.weixin),
    exports: exports ? exports.split(',') : []
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

emwrap [--name=myWasmLib]
       [--module=<umd | esm | cjs | mjs>]
       [--minify]
       [--weixin]
       [--worker]
       [--output=/path/to/output.js]
       [--script=/path/to/script.js]
       [--initscript=/path/to/script.js]
       [--exports=UTF8ToString,stringToUTF8]
       /path/to/emscripten/glue.js

v${require('../package.json').version}`)
}

async function emwrap (filePath, options) {
  if (!filePath || typeof filePath !== 'string') {
    throw new TypeError('missing input file')
  }
  const { wrap, wrapAndMinify, wrapWorker } = require('..')
  options = options || {}
  options.output = options.output || filePath
  const minify = typeof options.minify === 'boolean' ? options.minify : false
  if (options.worker) {
    const code = minify
      ? (await wrapAndMinify(fs.readFileSync(filePath, 'utf8'), options, wrapWorker))
      : wrapWorker(fs.readFileSync(filePath, 'utf8'), options)
  
    await fs.promises.writeFile(options.output, code, 'utf8')
  } else {
    const code = minify
      ? (await wrapAndMinify(fs.readFileSync(filePath, 'utf8'), options))
      : wrap(fs.readFileSync(filePath, 'utf8'), options)
  
    await fs.promises.writeFile(options.output, code, 'utf8')
  }
}
