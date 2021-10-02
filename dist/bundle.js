
      ;(function(entry, chunk) {
        function require(moduleOriginPath) {
          var exports = {}
          ;(function() {
            eval(chunk[moduleOriginPath])
          })()
          return exports
        }
        require(entry)
      })("./modules/index.js", {"./modules/index.js":"\"use strict\";\n\nvar _a = require(\"./a.js\");\n\n// const c = require('./c')\n// import d from './d.js';\n// const b = require('./b')\nconsole.log(\"Hello \".concat(_a.a));","./a.js":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.a = void 0;\n\n/**\n * this is a es6 module\n */\nvar a = 'World';\nexports.a = a;"})
    