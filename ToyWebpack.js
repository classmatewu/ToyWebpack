const fs = require('fs')
const parse = require('@babel/parser')
const { default: traverse } = require('@babel/traverse')

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
    this._parseModule(this.entry)
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
    // 利用
    const dep = []
    traverse(ast, {
      ImportDeclaration({node}) {
        const depPath = node?.source?.value
        dep.push(depPath)
      },
      VariableDeclaration({node}) {
        console.log(node);
      }
    });
    // console.log(ast.program.body);
    console.log(dep);

    return {
      dep,
      // code,
    }
  }
}

module.exports = ToyWebpack