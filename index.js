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
    code = code.replace(/(var ENVIRONMENT_IS_WEB\s*=\s*typeof window\s*===\s*['"]object['"]);/, '$1||typeof wx==="object";')
    code = code.replace(/WebAssembly/g, '_WebAssembly')
    code = code.replace(/return getBinaryPromise\(\)/g, 'return (typeof WXWebAssembly!=="undefined"?Promise.resolve(wasmBinaryFile):getBinaryPromise())')
  }

  code = code.replace(/\s*if\s*\(typeof document\s*!==?\s*['"]undefined['"]\s*&&\s*document\.currentScript\)/g, ' ')
  code = code.replace(/document\.currentScript\.src/g, '__cgen_dcs__')
  code = code.replace(/process\["on"\]\("unhandledRejection",\s*abort\);/, '')

  const pre = `${module === 'esm' || module === 'mjs'
  ? `${module === 'mjs' ? 'import { createRequire } from "module";' : ''}var Module;\nvar __exports =`
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
    module.exports = factory(nativeRequire, _process);
  } else if(typeof define === 'function' && define.amd) {
    define([], function () {
      return factory(nativeRequire, _process);
    });
  } else if(typeof exports === 'object') {
    if (name) exports[name] = factory(nativeRequire, _process);
  } else {
    if (name) root[name] = factory(nativeRequire, _process);
  }
` :
`
  return factory(nativeRequire, _process);
`}
})((function (defaultValue) {
  var g;
  g = (function () { return this; })();

  try {
    g = g || new Function('return this')();
  } catch (_) {
    if (typeof globalThis !== 'undefined') return globalThis;
    if (typeof __webpack_public_path__ === 'undefined') {
      if (typeof global !== 'undefined') return global;
    }
    if (typeof window !== 'undefined') return window;
    if (typeof self !== 'undefined') return self;
  }

  return g || defaultValue;
})(this), function (require, process, module) {
  var __cgen_dcs__ = '';
  try {
    __cgen_dcs__ = ${module === 'mjs' ? 'import.meta.url.substring(8)' : module === 'esm'
      ? '(typeof __webpack_public_path__ !== "undefined" ? (typeof __filename !== "undefined" ? __filename : document.currentScript.src) : import.meta.url)'
      : '(typeof __filename !== "undefined" ? __filename : document.currentScript.src)'};
  } catch (_) {}
  ${module === 'mjs' ? 'var __dirname = require("path").dirname(import.meta.url.substring(8));' : ''}
  function __cgen_emwrapper__ (Module) {

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
      var p = promise = new Promise(function (resolve, reject) {
        mod = mod || {};
        Module = mod;

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

        if (typeof process !== 'undefined') {
          process.once('uncaughtException', reject)
        }
        emctx = __cgen_emwrapper__(mod);
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

async function wrapAndMinify (code, options) {
  const terser = require('terser')
  const terserOptions = {
    compress: true,
    mangle: true,
    ...(options.terser || {})
  }
  return (await terser.minify(wrap(code, options), terserOptions)).code
}

exports.wrap = wrap
exports.wrapAndMinify = wrapAndMinify
