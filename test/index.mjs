import init, { add } from './out/lib.mjs.mjs'

init().then(({ Module }) => {
  console.log(Module._add(1, 2))
  console.log(add(3, 4))
})
