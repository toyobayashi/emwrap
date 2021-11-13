# emwrap

Node.js CLI tool for wrapping emscripten glue code to module.

Support module type:

* `umd` (default, support browser `<script>`, Node.js and bundler)
* `cjs` (support Node.js and CommonJS bundler)
* `esm` (support browser `<script type="module">` and ES module bundler)
* `mjs` (support Node.js runtime only)

```bash
npm install -g @tybys/emwrap
```

```
emwrap [--name=myWasmLib]
       [--module=<umd | esm | cjs | mjs>]
       [--minify]
       [--output=/path/to/output.js]
       [--script=/path/to/script.js]
       [--exports=UTF8ToString,stringToUTF8]
       /path/to/emscripten/glue.js
```

## Usage

Note: you should avoid passing `-sMODULARIZE=1` or `-o mjs` extension to `emcc` / `em++`.

### UMD

You can use [`--js-transform`](https://emscripten.org/docs/tools_reference/emcc.html#emcc-minify) option:

```bash
emcc -o glue.js -O3 --js-transform "emwrap --name=myWasmLib" main.c
```

Windows:

```bat
emcc -o glue.js -O3 --js-transform "emwrap.cmd --name=myWasmLib" main.c
```

or in two steps:

```bash
emcc -o glue.js -O3 main.c
emwrap --name=myWasmLib --minify glue.js
```

Browser `<script>`:

```html
<script src="glue.js"></script>
<script>
  myWasmLib.default().then(function (ctx) {
    var Module = ctx.Module;
    Module.myfunction();
  });
</script>
```

Webpack:

```js
import init from './glue.js'
// const init = require('./glue.js').default
init().then(({ Module }) => { Module.myfunction() })
```

### ES Module

```bash
emcc -o glue.js -O3 main.c
emwrap --module=esm --minify glue.js
```

```html
<script type="module">
  import init from './glue.js'
  init().then(({ Module }) => { Module.myfunction() })
</script>
```

Webpack is ok as well.

### Override Emscripten `Module` options

Pass options to the default exported `init` function:

```js
init({
  locateFile () {
    return '/custom/path/to/renamed.wasm'
  }
}).then(({ Module }) => {
  // ...
})
```
