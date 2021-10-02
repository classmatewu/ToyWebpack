/**
 * @add es6 module notes
 * 写esm的import时猜了一下坑：
 * - 错误写法：import a from './a.js';
 * - 正确写法：import {a} from './a.js';
 * 看了一下./bundle.js文件打包产物源码，一下子恍然大悟，原来export会导出一个export对象，这个对象为 
 * {
 *    __esModule: true, // 表明这是个es6 module
 *    key: value, // 我们导出的键值对key-value
 * }
 * 所以这下明白了为什么是`{a}`而不是`a`了
 * 
 * 此外，顺便回顾下export的几种写法
 * 1. export const a = 'World'
 * 2. const a = 'World'; export { a }
 * 3. const a = 'World'; export { a as myA, a as hisA } // 只要导出变量名不重复，则可以多次导出
 */
import {a} from './a.js';
// const c = require('./c')
// import d from './d.js';
// const b = require('./b')

console.log(`Hello ${a}`);