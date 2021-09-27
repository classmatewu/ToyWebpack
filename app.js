const ToyWebpack = require('./ToyWebpack')
const options = require('./config')

const compiler = new ToyWebpack(options)
compiler.run()