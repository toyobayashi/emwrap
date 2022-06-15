async function test (mod) {
  const { default: init, add } = mod
  
  const { Module } = await init()
  console.log(Module._add(1, 2))
  console.log(add(3, 4))
  console.log(Module._spawn());
}

async function main () {
  console.log('./out/lib.umd.js')
  await test(require('./out/lib.umd.js'))
  console.log('./out/lib.cjs.js')
  await test(require('./out/lib.cjs.js'))
  console.log('./out/lib.webpack.js')
  await test(require('./out/lib.webpack.js'))

  setTimeout(() => {
    process.exit(0)
  }, 1500)
}

main()
