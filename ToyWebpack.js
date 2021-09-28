const fs = require('fs')
const parse = require('@babel/parser')
const { default: traverse } = require('@babel/traverse')
const { transformFromAst } = require('@babel/core')

class ToyWebpack {
  constructor(options) {
    console.log('new ToyWebpack');
    const {entry, output} = options
    this.entry = entry
    this.output = output
  }

  /**
   * @description 入口方法
   */
  run() {
    console.log('run ToyWebpack')
    const {dep, code} = this._parseModule(this.entry)
  }

  /**
   * @description 解析模块，做两件事情，一是获取依赖，二是获取模块源码
   */
  _parseModule(modulePath) {
    // 读取module文件，并输出为utf-8编码格式的字符串
    const moduleStr = fs.readFileSync(modulePath, 'utf-8')

    // 利用babel/parse将源码转换为ast
    const ast = parse.parse(moduleStr, {
      sourceType: "module",
    })

    // 利用traverse遍历ast节点，而不用去类似`ast.program.body`这样去遍历
    const dep = []
    traverse(ast, {
      ImportDeclaration({node}) {
        const depPath = node?.source?.value
        dep.push(depPath)
      },
      // TODO 添加 cjs、amd 模块的打包的方式
      // VariableDeclaration({node}) {
      //   console.log(node);
      // }
    })

    // ast转换为源码，并将原先的es6+语法转换为es5语法
    const { code } = transformFromAst(ast, null, {
      presets: ['@babel/preset-env']
    })

    return {
      dep,
      code,
    }
  }
}

module.exports = ToyWebpack