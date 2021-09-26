# ToyWebpack
手写实现一个迷你的webpack

### 思路
* graph：options -> entryDeps -> graph：利用参数，生成入口文件依赖，递归这一步可得到依赖图谱
* chunk：graph -> chunk：利用依赖图谱，结合babel，生成module集合，即chunk
* bundle：chunk -> bundle：利用chunk，合并与加工module集合，最后生成浏览器能够运行的产物，即bundle
