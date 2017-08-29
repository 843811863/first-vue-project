const path = require('path')
const root = path.resolve(__dirname, '..') // 项目的根目录绝对路径

module.exports = {
  entry: path.join(root, 'src/index.js'), // 入口文件路径
  output: {
    path: path.join(root, 'dist'), // 出口目录
    filename: 'index.js' // 出口文件名
  },
  resolve: {
    alias: { // 配置目录别名
      // 在任意目录下require('components/example') 相当于require('项目根目录/src/components/example')
      'components': path.join(root, 'src/components'),
      'views': path.join(root, 'src/views'),
      'styles': path.join(root, 'src/styles'),
      'store': path.join(root, 'src/store'),
      'vue': 'vue/dist/vue.js'
    },
    extensions: ['.js', '.vue'] // 引用js和vue文件可以省略后缀名
  },
  module: { // 配置loader
    loaders: [{
        test: /\.vue$/,
        loader: 'vue-loader'
      }, // 所有.vue结尾的文件，使用vue-loader
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      } // .js文件使用babel-loader，切记排除node_modules目录
    ]
  }
}
