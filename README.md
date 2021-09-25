# ToyWebpack
手写实现一个迷你的webpack

### 思路
* 定义ToyWebpack类：定义一个ToyWebpack类，定义打包参数
* 生成chunk：根据入口文件参数，利用打包流水线，生成module集合，即chunk
* 生成bundle：利用chunk，做进一步的提取和改造，生成浏览器能够运行的产物，即bundle
* 测试：定义几个测试文件（module），进行打包测试
