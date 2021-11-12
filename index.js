'use strict'
Object.defineProperty(exports, '__esModule', { value: true })

const fs = require('fs')

async function wrap (code, options) {
  if (!code || typeof code !== 'string') {
    throw new TypeError('invalid code')
  }

  options = options || {}
  const module = options.module || 'umd'
  if (module !== 'umd' && module !== 'esm') {
    throw new TypeError(`unsupport module type: ${module}`)
  }
  const libName = options.libName || ''
  const wrapScript = options.wrapScript || ''
  const minify = typeof options.minify === 'boolean' ? options.minify : false
  let exportsOnInit = Array.isArray(options.exportsOnInit) ? options.exportsOnInit : []
  exportsOnInit = Array.from(new Set(exportsOnInit))

  const moduleIndex = exportsOnInit.indexOf('Module')
  if (moduleIndex !== -1) {
    exportsOnInit.splice(moduleIndex, 1)
  }

  code = code.replace(/\s*if\s*\(typeof document\s*!==\s*['"]undefined['"]\s*&&\s*document\.currentScript\)/g, '')
  code = code.replace(/document\.currentScript\.src/g, '__cgen_dcs__')
  code = code.replace(/process\["on"\]\("unhandledRejection",\s*abort\);/, '')

  const pre = `${module === 'esm' ? 'var Module;\nvar __exports =' : ''}
(function (root, factory) {
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
${module === 'umd' ? `
  var name = '${libName}';
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
    __cgen_dcs__ = ${module === 'esm' ? '(typeof __webpack_public_path__ !== "undefined" ? document.currentScript.src : import.meta.url)' : 'document.currentScript.src'};
  } catch (_) {}
  function __cgen_emwrapper__ (Module) {

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
${exportsOnInit.map(v => `      ,${v}: typeof ${v} !== 'undefined' ? ${v} : undefined`).join('\n')}
    };
  }

  return (function () {
    var initResult = {
      Module: null
${exportsOnInit.map(v => `      ,${v}: undefined`).join('\n')}
    };
    var exports = {};
    try {
      Object.defineProperty(exports, '__esModule', { value: true });
    } catch (_) {
      exports.__esModule = true;
    }
${module === 'umd' ? '    var Module;' : ''}
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
${exportsOnInit.map(v => `          initResult['${v}'] = emctx['${v}'];`).join('\n')}
          promise = null;
          resolve(initResult);
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

    ${(module === 'umd' && wrapScript) ? `
    (function (exports) {

${fs.readFileSync(wrapScript, 'utf8')}

    })(exports);
` : ''}
    return exports;
  })();
})
${module === 'esm' ? 'export default __exports["default"];' : ';'}

${(module === 'esm' && wrapScript) ? fs.readFileSync(wrapScript, 'utf8') : ''}
`
  code = pre + code + post
  if (minify) {
    const terser = require('terser')
    return (await terser.minify(code, { compress: true, mangle: true })).code
  } else {
    return code
  }
}

exports.wrap = wrap
