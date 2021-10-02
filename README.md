# ToyWebpack
手写实现一个迷你的webpack

### 思路
* graph：options -> entryDeps -> graph：利用参数，生成入口文件依赖，递归这一步可得到依赖图谱
* chunk：graph -> chunk：利用依赖图谱，结合babel，生成module集合，即chunk
* bundle：chunk -> bundle：利用chunk，合并与加工module集合，最后生成浏览器能够运行的产物，即bundle

### 运行
`./modules/`文件夹下存放要打包的文件
`./config.js`文件进行打包配置
执行`npm run build`，生成打包产物
执行`npm run test`，验证打包结果

### 版本
v1.0.0: 完成简陋的第一版，支持仅支持esm的模块方式，且引用路径不能重复，即使在不同文件夹下（即所有文件名不能一样）

### 展望
v1.0.0: 完成简陋第一版
v1.0.1: 修复引用路径不能重复，即使在不同文件夹下
v1.0.2: 支持cjs、amd模块

### 联系我
如果疑问或建议，欢迎提issues或邮件联系我`171755422@qq.com`