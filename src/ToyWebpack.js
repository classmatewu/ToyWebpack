class ToyWebpack {
  constructor(options) {
    console.log('new ToyWebpack');
    const {entry, output} = options
    this.entry = entry
    this.output = output
  }

  run() {
    console.log('run ToyWebpack');
  }

  
}

module.exports = ToyWebpack