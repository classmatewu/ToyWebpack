const path = require('path')

module.exports = {
    /**
     * 入口文件
     */
    entry : './modules/index.js',

    /**
     * 打包出口
     */
    output : {
        filename : 'bundle.js',
        path : path.join(__dirname, '../dist')
    },

    /**
     * loader配置，plugin的配置是一个数组，每一个plugin是一个对象
     * 注意：
     * loader的加载顺序是从上到下，**从右往左**的。
     * 从上到下好理解，符合正常的顺序逻辑，但为什么是从左到右呢？
     * 其实要从链式操作说起，链式操作有两种，
     * 一种是pipe（例如：gulp、ps aux | grep node 等），即管道，是连接起来的，上一个输出作为下一个输入，eg A -> B -> C
     * 另一种是compose，这种是函数式编程的组合概念，loader就是采用这种，eg：A(B(C()))，就想函数的调用顺序一样从里到外执行
     */
    module: {
        rules: []
    },

    /**
     * plugins配置，plugin的配置是一个数组，每一个plugin是一个对象
     */
    plugins: [],

    /**
     * 起一个devServer本地服务器，一方面方便用于前端发起网络请求。另一方面方便做一些热更新
     */
    //配置开发服务器
    devServer: {
        //设置端口号
        port: 8080,
        //开启热更新
        hot: true,
        //告诉服务器内容来源
        contentBase: path.join(__dirname, 'dist')
    },

    /**
     * 配置模块如何进行解析
     */
     resolve: {
        // 创建别名
        alias:{
            'vue$':'vue/dist/vue.runtime.esm.js',
            // 设置@引用的地址为根目录下的src
            '@':path.resolve(__dirname,"../src")
        },
        //按顺序解析以下数组后缀名的文件
        extensions:['*','.js','.json','.vue']
    },
}