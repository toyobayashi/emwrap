# emwrap

Node.js CLI tool for wrapping emscripten glue code to module.

Support module type:

* `umd` (default, support browser `<script>`, Node.js and bundler)
* `cjs` (support Node.js and CommonJS bundler)
* `esm` (support browser `<script type="module">` and ES module bundler, if using pthread, bundle umd instead)
* `mjs` (support Node.js runtime only, all js emitted by emscripten need to rename .mjs suffix via `--output`)

```bash
npm install -g @tybys/emwrap
```

```
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
```

`--weixin`: Support `WXWebAssembly` in WeChat miniprogram environment

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

Make sure to set `node.__dirname: false` or `node: false` in your webpack configuration.

```js
module.exports = {
  node: {
    __dirname: false,
    __filename: false
  }
  // or
  // node: false
}
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

### Override Emscripten [`Module`](https://emscripten.org/docs/api_reference/module.html) options

Pass options to the default exported `init` function:

```js
init({
  locateFile (path, dir) {
    if (/\.worker\.m?js$/.test(path)) {
      return 'your custom worker js path'
    } else {
      return 'your custom wasm path'
    }
  }
}).then(({ Module }) => {
  // ...
})
```

### CMake

```bash
npm install -D @tybys/emwrap
```

```cmake
add_custom_command(TARGET yourtarget POST_BUILD
  COMMAND npx emwrap "--name=umdname" "$<TARGET_FILE:yourtarget>"
  # COMMAND node "./other-script.js"
)
```
