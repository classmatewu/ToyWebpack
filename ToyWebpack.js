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
    const bundle = this._getBundle(this.entry, chunk)
    this._fileOutput(this.output, bundle)
    console.log('success!');
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

  /**
   * @description 由chunk生成浏览器可以直接执行的代码，即bundle
   */
  _getBundle(entry, chunk) {
    /**
     * @description 解释一下几个重要的逻辑点
     * 1. 每个module外面都需要包裹一层自执行函数，原因是避免变量的污染，做到隔离效果
     * 2. entry、chunk这两个变量都进行序列化的原因不同:
     *    - entry是由于它的值是入口文件的路径，如果不再转为字符串，那就变成了这个路径是变量名，从而导致错误（也可以写成'${entry}'，即将JSON.stringify()替换为''）
     *    - chunk除了有上面一点原因外，它是个对象，由于包裹在es6的模版字符串中，而对象转为字符串会变成[object, Object]（不可以将JSON.stringify()替换为''）
     * 3. 在浏览器/node中，可以利用eval / new Function这两种方法来将字符串转换为js代码并执行
     * 4. 直接执行eval不行么，为什么需要定义一个require，在require里执行eval，然后再执行require，这不是多此一举么？
     *    - 因为es6的import导入语句转为es5就会变成require，而浏览器并没有require方法，所以就需要我们自己来实现一个，参数是import时的originPath，也就是chunk的key
     * 5. 为什么需要在require函数里定义一个export对象，执行完了eval后再导出出去呢？
     *    - 因为es6的export导出语句，转为es5实际上就是定义了一个exports，把要导出的变量放进去，最后renturn出去。
     *    - 所以，在导入的时候，执行es5的require，就会拿到这个exports变量，从里面拿到引用模块导出的变量
     */
    return `
      ;(function(entry, chunk) {
        function require(moduleOriginPath) {
          var exports = {}
          ;(function() {
            eval(chunk[moduleOriginPath])
          })()
          return exports
        }
        require(entry)
      })(${JSON.stringify(entry)}, ${JSON.stringify(chunk)})
    `
  }

  /**
   * @description 生成打包产物文件
   */
  _fileOutput(output, bundle) {
    const { path, filename } = output
    // 若文件夹不存在，则先创建文件夹
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path)
    }
    fs.writeFileSync(`${path}/${filename}`, bundle, 'utf-8')
  }
}

module.exports = ToyWebpack