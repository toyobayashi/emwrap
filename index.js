'use strict'
Object.defineProperty(exports, '__esModule', { value: true })

const fs = require('fs')

function wrap (code, options) {
  if (!code || typeof code !== 'string') {
    throw new TypeError('invalid code')
  }

  options = options || {}
  const module = options.module || 'umd'
  if (module !== 'umd' && module !== 'esm' && module !== 'cjs' && module !== 'mjs') {
    throw new TypeError(`unsupport module type: ${module}`)
  }
  const name = options.name || ''
  const weixin = Boolean(options.weixin)
  const script = options.script || ''
  const onInitScript = options.onInitScript || ''
  let exports = Array.isArray(options.exports) ? options.exports : []
  exports = Array.from(new Set(exports))

  const moduleIndex = exports.indexOf('Module')
  if (moduleIndex !== -1) {
    exports.splice(moduleIndex, 1)
  }

  if (weixin) {
    code = code.replace(/((var|const|let) ENVIRONMENT_IS_WEB\s*=\s*typeof window\s*===?\s*['"]object['"]);/, '$1||typeof wx==="object";')
    code = code.replace(/WebAssembly/g, '_WebAssembly')
    code = code.replace(/return getBinaryPromise\(\)/g, 'return (typeof WXWebAssembly!=="undefined"?Promise.resolve(wasmBinaryFile):getBinaryPromise())')
  }

  if (module === 'esm') {
    code = code.replace(/new Worker\(pthreadMainJs\)/g, 'new Worker(pthreadMainJs,{type:"module"})')
  } else if (module === 'mjs') {
    code = code.replace(/allocateUnusedWorker:\s*((function\s*\(\)\s*)|(\(\)\s*=>\s*))\{(\r?\n?.*?)*?\},/, (substring) => substring.replace(/\.worker\.js/g, '.worker.mjs'))
  }

  code = code.replace(/\s*if\s*\(typeof document\s*!==?\s*['"]undefined['"]\s*&&\s*document\.currentScript\)/g, ' ')
  code = code.replace(/\(?typeof document\s*!==?\s*['"]undefined['"]\s*&&\s*document\.currentScript\)?\s*\?\s*document\.currentScript\.src\s*:\s*((undefined)|(void 0))/g, '__emwrap_dcs__||undefined')
  code = code.replace(/document\.currentScript\.src/g, '__emwrap_dcs__')
  code = code.replace(/(_scriptDir\s*=\s*)__filename/g, '$1__emwrap_dcs__||(typeof __filename!=="undefined"?__filename:__emwrap_dcs__)')
  code = code.replace(/process\["on"\]\("unhandledRejection",\s*abort\);/, '')

  const pre = `${module === 'esm' || module === 'mjs'
  ? `${module === 'mjs' ? 'import { createRequire } from "module";\n' : ''}var Module;\nvar __exports =`
  : module === 'cjs' 
    ? 'exports = module.exports ='
    : ''}
(function (root, factory) {
${module === 'mjs' ?
`
  var nativeRequire = createRequire(process.cwd() + "/");
  var _process = root && root.process;
` :
`
  var nativeRequire;

  if (typeof __webpack_public_path__ !== 'undefined') {
    nativeRequire = (function () {
      return typeof __non_webpack_require__ !== 'undefined' ? __non_webpack_require__ : undefined;
    })();
  } else {
    nativeRequire = (function () {
      return typeof __webpack_public_path__ !== 'undefined' ? (typeof __non_webpack_require__ !== 'undefined' ? __non_webpack_require__ : undefined) : (typeof require !== 'undefined' ? require : undefined);
    })();
  }

  var _process = root && root.process;
`}
${module === 'umd' ? `
  var name = '${name}';
  if(typeof exports === 'object' && typeof module === 'object') {
    module.exports = factory(nativeRequire, _process, root);
  } else if(typeof define === 'function' && define.amd) {
    define([], function () {
      return factory(nativeRequire, _process, root);
    });
  } else if(typeof exports === 'object') {
    if (name) exports[name] = factory(nativeRequire, _process, root);
  } else {
    if (name) root[name] = factory(nativeRequire, _process, root);
  }
` :
`
  return factory(nativeRequire, _process, root);
`}
})((function (defaultValue) {
  if (typeof globalThis !== 'undefined') return globalThis;
  var g = (function () { return this })();
  if (
    !g &&
    (function () {
      var f;
      try {
        f = new Function();
      } catch (_) {
        return false;
      }
      return typeof f === 'function';
    })()
  ) {
    g = new Function('return this')();
  }

  if (!g) {
    if (typeof __webpack_public_path__ === 'undefined') {
      if (typeof global !== 'undefined') return global;
    }
    if (typeof window !== 'undefined') return window;
    if (typeof self !== 'undefined') return self;
  }

  return g || defaultValue;
})(this), function (require, process, global, module) {
  var __emwrap_dcs__ = '';
  try {
    __emwrap_dcs__ = ${module === 'mjs' ? 'require("url").fileURLToPath(import.meta.url)' : module === 'esm'
      ? '(typeof __webpack_public_path__ !== "undefined" ? document.currentScript.src : import.meta.url)'
      : 'document.currentScript.src'};
  } catch (_) {}
  ${module === 'mjs' ? 'var __dirname = require("path").dirname(require("url").fileURLToPath(import.meta.url));' : ''}
  function __emwrap_main__ (Module) {

  ${weixin ? `
    var _WebAssembly = typeof WXWebAssembly !== 'undefined'
      ? WXWebAssembly
      : (typeof WebAssembly !== 'undefined' ? WebAssembly : undefined);
    if (_WebAssembly) {
      _WebAssembly.RuntimeError = _WebAssembly.RuntimeError || (function () {
        var setPrototypeOf = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };

        var __extends = function (d, b) {
          if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
          setPrototypeOf(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };

        return (function (_super) {
          __extends(RuntimeError, _super);
          function RuntimeError (message) {
            if (!(this instanceof RuntimeError)) {
              throw new TypeError("Class constructor RuntimeError cannot be invoked without 'new'")
            }

            var _this = _super.call(this, message) || this;
            var ErrorConstructor = this.constructor;
            setPrototypeOf(_this, ErrorConstructor.prototype);

            if (typeof Error.captureStackTrace === 'function') {
              Error.captureStackTrace(_this, ErrorConstructor);
            }
            return _this;
          }
          Object.defineProperty(RuntimeError.prototype, 'name', {
            configurable: true,
            writable: true,
            value: 'RuntimeError'
          })
          return RuntimeError;
        })(Error);
      })();
    }
  ` : ''}

/****************************************
 ** Code generated by Emscripten begin **
 ****************************************/
`

  const post = `
/****************************************
 ** Code generated by Emscripten end   **
 ****************************************/

    return {
      Module: Module
${exports.map(v => `      ,${v}: typeof ${v} !== 'undefined' ? ${v} : undefined`).join('\n')}
    };
  }
  ${(module === 'esm' || module === 'mjs') ? '' : 'var Module;'}
  var exports = {};
  try {
    Object.defineProperty(exports, '__esModule', { value: true });
  } catch (_) {
    exports.__esModule = true;
  }

  return (function (exports, onExports, onInit) {
    var initResult = {
      Module: null
${exports.map(v => `      ,${v}: undefined`).join('\n')}
    };
    var promise = null;

    function init (mod) {
      if (initResult.Module) {
        return Promise.resolve(initResult);
      }
      if (promise) return promise;
      var p = promise = new Promise(function (res, rej) {
        mod = mod || {};
        Module = mod;

        var onUncaughtException = function (listener) {
          if (typeof process !== 'undefined') {
            process.on('uncaughtException', listener);
          }
        };

        var offUncaughtException = function (listener) {
          if (typeof process !== 'undefined') {
            process.off('uncaughtException', listener);
          }
        };

        var reject = function (reason) {
          rej(reason);
          offUncaughtException(reject);
        };

        var resolve = function (value) {
          res(value);
          offUncaughtException(reject);
        };

        var hasOnAbort = 'onAbort' in mod;
        var userOnAbort = mod.onAbort;
        var hasOnRuntimeInitialized = 'onRuntimeInitialized' in mod;
        var userOnRuntimeInitialized = mod.onRuntimeInitialized;
        var reset = function () {
          if (hasOnAbort) {
            mod.onAbort = userOnAbort;
          } else {
            delete mod.onAbort;
          }

          if (hasOnRuntimeInitialized) {
            mod.onRuntimeInitialized = userOnRuntimeInitialized;
          } else {
            delete mod.onRuntimeInitialized;
          }
        };

        mod.onAbort = function (m) {
          reject(new Error(m));
          reset();
          if (typeof mod.onAbort === 'function') {
            mod.onAbort(m);
          }
        };

        var emctx;
        mod.onRuntimeInitialized = function () {
          reset();
          if (typeof mod.onRuntimeInitialized === 'function') {
            try {
              mod.onRuntimeInitialized();
            } catch (err) {
              reject(err);
              return;
            }
          }
          initResult.Module = mod;
${exports.map(v => `          initResult['${v}'] = emctx['${v}'];`).join('\n')}
          promise = null;
${onInitScript ? `
          var m = {};
          var e = m.exports = {};
          try {
            onInit(e, m);
            var exported = m.exports.__esModule ? m.exports['default'] : m.exports;
            if (typeof exported === 'function') {
              var r = Promise.resolve(exported(initResult, Module, exports));
              r.then(function (_r) {
                if (_r !== undefined) { resolve(_r); }
                else { resolve(initResult); }
              }).catch(reject);
            } else {
              resolve(initResult);
            }
          } catch (err) {
            reject(err);
            return;
          }
` : `
          resolve(initResult);
`}
        };

        onUncaughtException(reject);
        emctx = __emwrap_main__(mod);
      }).catch(function (err) {
        Module = undefined;
        initResult.Module = null;
        promise = null;
        return Promise.reject(err);
      });

      return p;
    }

    try {
      Object.defineProperty(exports, 'default', {
        enumerable: true,
        value: init
      });
    } catch (_) {
      exports['default'] = init;
    }

    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      try {
        Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
      } catch (_) {}
    }
    ${((module === 'umd' || module === 'cjs') && script) ? 'onExports(exports);' : ''}
    return exports;
  })(exports, ${((module === 'umd' || module === 'cjs') && script) ? `function (exports) {
${fs.readFileSync(script, 'utf8')}
  }` : 'null'}, ${onInitScript ? `function (exports, module) {
${fs.readFileSync(onInitScript, 'utf8')}
  }` : 'null'});
})
${(module === 'esm' || module === 'mjs') ? 'export default __exports["default"];' : ';'}

${((module === 'esm' || module === 'mjs') && script) ? fs.readFileSync(script, 'utf8') : ''}
`
  return pre + code + post
}

async function wrapAndMinify (code, options, f = wrap) {
  const terser = require('terser')
  const terserOptions = {
    compress: true,
    mangle: true,
    ...(options.terser || {})
  }
  return (await terser.minify(f(code, options), terserOptions)).code
}

function wrapWorker (code, options) {
  if (!code || typeof code !== 'string') {
    throw new TypeError('invalid code')
  }

  options = options || {}
  const module = options.module || 'umd'
  if (module !== 'umd' && module !== 'esm' && module !== 'cjs' && module !== 'mjs') {
    throw new TypeError(`unsupport module type: ${module}`)
  }
  const name = options.name || ''

  const importScriptStringRegex = /if\s*\(typeof e\.data\.urlOrBlob\s*===?\s*['"]string['"]\)\s*\{?(\r?\n.*?)*?.*?else\s*\{(\r?\n?.*?)*?\}/
  if (module === 'umd') {
    code = code.replace(importScriptStringRegex, (substring) => `${substring}${name}.default(Module).then(function(c){Module=c.Module});`)
  } else if (module === 'cjs') {
    // code = code.replace(importScriptStringRegex, 'if(typeof e.data.urlOrBlob==="string")require(e.data.urlOrBlob).default(Module).then(function(c){Module=c.Module});else import(new URL(e.data.urlOrBlob,"file://"+__filename)).then(function(m){m.default(Module).then(function(c){Module=c.Module})})')
    code = code.replace(importScriptStringRegex, (substring) => `
      if (ENVIRONMENT_IS_NODE) {
        var r = typeof __webpack_public_path__ !== "undefined" ? __non_webpack_require__ : require;
        if(typeof e.data.urlOrBlob==="string")r(e.data.urlOrBlob).default(Module).then(function(c){Module=c.Module});
      } else {
        self.exports = {};
        self.module = { exports: self.exports };
      ${substring}
        var m = self.module.exports;
        delete self.module;
        m.default(Module).then(function(c){Module=c.Module});
      }\n`)
  } else {
    if (module === 'mjs') {
      code = 'import { createRequire } from "module";var require=createRequire(process.cwd() + "/");\n' + code
      code = code.replace(/__filename/g, 'import.meta.url')
      code = code.replace(importScriptStringRegex, '(typeof e.data.urlOrBlob==="string"?import(e.data.urlOrBlob.startsWith("file://")?e.data.urlOrBlob:("file://"+e.data.urlOrBlob)):import(new URL(e.data.urlOrBlob,import.meta.url))).then(function(m){m.default(Module).then(function(c){Module=c.Module})});')
    } else if (module === 'esm') {
      code = code.replace(importScriptStringRegex, `
      self.exports = {};
      self.module = { exports: self.exports };
      (typeof e.data.urlOrBlob==="string"?import(e.data.urlOrBlob):import(new URL(e.data.urlOrBlob,import.meta.url))).then(function(m){m=m.default?m:self.module.exports;delete self.module;m.default(Module).then(function(c){Module=c.Module})});
      `)
    }
  }
  return code
}

exports.wrap = wrap
exports.wrapWorker = wrapWorker
exports.wrapAndMinify = wrapAndMinify
