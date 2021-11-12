'use strict'
Object.defineProperty(exports, '__esModule', { value: true })

const fs = require('fs')
const path = require('path')

async function emwrap (options) {
  options = options || {}
  const filePath = options.filePath
  const module = options.module || 'umd'
  if (module !== 'umd' && module !== 'esm') {
    throw new Error(`unsupport module type: ${module}`)
  }
  const libName = options.libName || ''
  const outputPath = options.outputPath || path.join(path.dirname(filePath), path.basename(filePath, '.js') + '.' + module + '.js')
  const wrapScript = options.wrapScript || ''
  const minify = typeof options.minify === 'boolean' ? options.minify : false
  let exportsOnInit = Array.isArray(options.exportsOnInit) ? options.exportsOnInit : []
  exportsOnInit = Array.from(new Set(exportsOnInit))

  const moduleIndex = exportsOnInit.indexOf('Module')
  if (moduleIndex !== -1) {
    exportsOnInit.splice(moduleIndex, 1)
  }

  let code = fs.readFileSync(filePath, 'utf8')

  code = code.replace(/\s*if\s*\(typeof document\s*!==\s*['"]undefined['"]\s*&&\s*document\.currentScript\)/g, '')
  code = code.replace(/document\.currentScript\.src/g, '__cgen_dcs__')
  code = code.replace(/process\["on"\]\("unhandledRejection",\s*abort\);/, '')

  const pre = `
${module === 'umd' ? '' : `var exports =`}
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
    __cgen_dcs__ = ${module === 'esm' ? 'import.meta.url' : 'document.currentScript.src'};
  } catch (_) {}
  function __cgen_emwrapper__ (Module) {
`

  const post = `
    return {
      Module: Module
${exportsOnInit.map(v => `      ,${v}: typeof ${v} !== 'undefined' ? ${v} : undefined`).join('\n')}
    };
  }

  return (function (onExports) {
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
    var promise = null;

    function init (mod) {
      if (initResult.Module) {
        return Promise.resolve(initResult);
      }
      if (promise) return promise;
      var p = promise = new Promise(function (resolve, reject) {
        mod = mod || {};

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
          onExports(exports, mod, emctx);
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

    return exports;
  })(function (exports, Module, emctx) {
${(module === 'umd' && wrapScript) ? fs.readFileSync(wrapScript, 'utf8') : ''}
  });
});
${module === 'umd' ? '' : `export default exports['default'];`}
`
  code = pre + code + post
  if (minify) {
    const terser = require('terser')
    const minifiedCode = (await terser.minify(code, { compress: true, mangle: true })).code
    fs.writeFileSync(outputPath, minifiedCode, 'utf8')
  } else {
    fs.writeFileSync(outputPath, code, 'utf8')
  }
}

exports.emwrap = emwrap
