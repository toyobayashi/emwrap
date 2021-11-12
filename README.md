# emwrap

Node.js CLI tool for wrapping emscripten glue code to module.

## Usage

Quick start:

```bash
npm install -g @tybys/emwrap

# emcc -o glue.js -O3 main.c

# print help
emwrap -h

emwrap --name=myWasmLib --output=myWasmLib.js glue.js
```

no bundler:

```html
<script src="myWasmLib.js"></script>
<script>
  myWasmLib.default().then(function (ctx) {
    const Module = ctx.Module
    Module.myfunction()
  })
</script>
```

in Webpack:

```js
import init from './myWasmLib.js'
// const init = require('./myWasmLib.js').default
init().then((emctx) => { emctx.Module.myfunction() })
```

emscripten module option override:

```html
<script src="myWasmLib.js"></script>
<script>
  myWasmLib.default({
    locateFile () {
      return '/custom/path/to/renamed.wasm'
    }
  }).then(function (ctx) {
    // ...
  })
</script>
```
