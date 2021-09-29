const fs = require('fs')
const path = require('path')
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
    const chunk = this._getChunk(this.entry)
    console.log('---chunk---', chunk);
  }

  /**
   * @description 解析模块，做两件事情，一是获取依赖，二是获取模块源码
   * @param {string} moduleAbsPath 要解析的模块的绝对路径，注意是绝对路径
   */
  _parseModule(moduleAbsPath) {
    // 读取module文件，并输出为utf-8编码格式的字符串
    const moduleStr = fs.readFileSync(moduleAbsPath, 'utf-8')

    // 利用babel/parse将源码转换为ast
    const ast = parse.parse(moduleStr, {
      sourceType: "module",
    })

    // 利用traverse遍历ast节点，而不用去类似`ast.program.body`这样去遍历
    const dep = {}
    traverse(ast, {
      ImportDeclaration({node}) {
        const depOriginPath = node?.source?.value // 可能是绝对路径，也可能是相对路径
        const depAbsPath = path.resolve(moduleAbsPath, `../${depOriginPath}`) // 将depOriginPath转为绝对路径
        console.log('---depAbsPath---', depOriginPath, depAbsPath);
        dep[depOriginPath] = depAbsPath
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

  /**
   * @description 根据entry的dep，进行dfs，生成module集合
   */
  _getChunk(entryOriginPath) {
    // 先解析入口模块
    const entryAbsPath = path.resolve(__dirname, entryOriginPath)
    console.log('---entryAbsPath---', entryOriginPath, entryAbsPath);
    const {dep: entryDep, code: entryCode} = this._parseModule(entryAbsPath)
    const depChain = [entryDep]
    
    // 按照入口模块的dep，进行dfs，生成module集合
    // chunk的key是depOriginPath，value是module code
    const chunk = {}
    chunk[entryOriginPath] = entryCode
    for (let i = 0; i < depChain.length; i++) {
      Object.keys(depChain[i]).forEach(curModuleOriginPath => {
        const curModuleAbsPath = depChain[i][curModuleOriginPath]
        const {dep: curModuleDep, code: curModuleCode} = this._parseModule(curModuleAbsPath)
        chunk[curModuleOriginPath] = curModuleCode
        depChain.push(curModuleDep)
      })
    }

    return chunk
  }
}

module.exports = ToyWebpack