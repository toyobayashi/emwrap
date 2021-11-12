import init, { add } from './out/lib.esm.js'

init().then(({ Module }) => {
  console.log(Module._add(1, 2))
  console.log(add(3, 4))
})
