const ToyWebpack = require('./src/ToyWebpack')
const options = require('./config')

const compiler = new ToyWebpack(options)
compiler.run()