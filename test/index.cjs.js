(() => {
  const { default: init, add } = require('./out/lib.umd.js')
  
  init().then(({ Module }) => {
    console.log(Module._add(1, 2))
    console.log(add(3, 4))
  })
})();

(() => {
  const { default: init, add } = require('./out/lib.webpack.js')
  
  init().then(({ Module }) => {
    console.log(Module._add(1, 2))
    console.log(add(3, 4))
  })
})()
