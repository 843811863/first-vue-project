const webpack = require('webpack')
const baseConfig = require('./base')
const path = require('path')
const root = path.resolve(__dirname, '..')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(baseConfig, {
  entry: [
    'webpack/hot/dev-server', // 热替换处理入口文件
    path.join(root, 'src/index.js')
  ],
  devServer: {
    historyApiFallback: true, // 404的页面会自动跳转到 / 页面
    inline: true, // 文件改变自动刷新页面
    port: 8080 // 服务器端口
  },
  devtool: 'source-map', // 用于标记编译后的文件与编译前的文件对应位置，便于调试
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 添加热替换插件
    new HtmlWebpackPlugin({
      template: path.join(root, 'index.html'),
      inject: 'body' // js的script注入到body底部
    })
  ]
})
