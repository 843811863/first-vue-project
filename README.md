**<big>转自：[[造轮子教程]十分钟搭建Webpack+Vue项目](https://github.com/varHarrie/Dawn-Blossoms/issues/7)</big>**

原文使用的版本比较老，且看且珍惜。

之前说到的[vue.js的安装--vue-cli脚手架](http://blog.csdn.net/headmaster_tan/article/details/74178355)采用的`vue-cli`脚手架进行安装的自动构建的项目，但是实际项目中可能会有特殊的要求，所以没有使用到脚手架

推荐vue项目目录结构：

```
|-- ./config  // 全局变量
|-- ./dist    // 编译后的项目代码
|-- ./src     // 项目源码
    |-- apis        // api封装
    |-- components  // Vue组件
    |-- lib         // js工具类
    |-- router      // 路由
    |-- store       // Vuex的store
        |-- modules     // Vuex模块
    |-- style       // css
    |-- views       // 页面组件
    |-- index.js    // 入口文件
|-- ./webpack.config    // Webpack各种环境的配置文件
|-- ./package.json
```

首先安装[Node.js](http://nodejs.cn/)，选择需要的版本自行安装，这里不多赘述。

## 初始化项目

为了方便阅读，这里的项目目录结构使用的是上面的推荐目录。

在项目的根目录处（此处为`./`）使用使用命令行执行`npm init -y`（`-y`的作用是跳过信息填写）创建`package.json`

## 入口文件

1、在`根目录`下直接建立一个`index.html`，作为页面的入口文件。

``` html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>myProject</title>
  </head>
  <body>
    <div id="app">{{ message }}</div> <!-- Vue模板入口 -->
    <script src="dist/index.js" charset="utf-8"></script>
  </body>
</html>
```

2、在`src`下建立一个`index.js`，作为Vue的入口文件

``` javascript
// import...from的语法是ES6的，需要用到babel，后面再说
// require的语法是Commonjs的，webpack已经实现了，可以直接使用
const Vue = require('vue')
new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue.js!'
  }
})
```

3、安装模块

安装Vue：`npm install --save vue`

安装Webpack：`npm install --save-dev webpack`

4、使用webpack编译打包

除非在全局安装`webpack`，使用本地安装的`webpack`你需要写一长串的命令`.\node_modules\.bin\webpack src\index.js dist\index.js`，所以建议在`package.json`的`script`加入运行脚本，添加之后`package.json`如下：

``` json
{
  "name": "myProject",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack src/index.js dist/index.js"  // <---添加这句
  },
  "keywords": [],
  "author": "Headmaster_Tan",
  "license": "ISC",
  "dependencies": {
    "vue": "^2.4.2"
  },
  "devDependencies": {
    "webpack": "^3.5.5"
  }
}
```

然后你可以执行`npm run dev`命令进行打包，此时打开`index.html`，如无意外应该是会报错的。这是一个vue@1 -> vue@2的版本升级问题，报错内容如下：

> [Vue warn]: You are using the runtime-only build of Vue where the template compiler is not available. Either pre-compile the templates into render functions, or use the compiler-included build.

解决办法是使用下面的`webpack`配置文件对`'vue'`进行定义，报错原因详情可以看这里：[Vue 2.0 升（cai）级（keng）之旅](https://segmentfault.com/a/1190000006435886#articleHeader2)

## 编写webpack配置文件

上一步中直接使用webpack运行脚本`webpack [入口文件] [出口文件]`，显然对于后期添加webpack插件和不同环境的配置是不行的。

1、在项目根目录下创建`webpack.config`文件夹专门用于存放webpack的配置文件（当然也是完全可以只建一个webpack.config.js文件的）

2、为了让配置文件不同的编译环境能够复用（例如`loaders`的配置，不管在开发环境还是生产环境肯定都是一样的），在`webpack.config`中首先创建一个`base.js`：

``` javascript
const path = require('path')
const root = path.resolve(__dirname, '..')  // 项目的根目录绝对路径

module.exports = {
  entry: path.join(root, 'src/index.js'),    // 入口文件路径
  output: {
    path: path.join(root, 'dist'),    // 出口目录
    filename: 'index.js'   // 出口文件名
  }
}
```

上面这段配置就实现了`webpack src/index.js dist/index.js`的功能，还可以额外拓展一下，变成：

``` javascript
const path = require('path')
const root = path.resolve(__dirname, '..')    // 项目的根目录绝对路径

module.exports = {
  entry: path.join(root, 'src/main.js'),    // 入口文件路径
  output: {
    path: path.join(root, 'dist'),    // 出口目录
    filename: 'main.js'   // 出口文件名
  },
  resolve: {
    alias: {    // 配置目录别名
      // 在任意目录下require('components/example') 相当于require('项目根目录/src/components/example')
      components: path.join(root, 'src/components'),
      views: path.join(root, 'src/views'),
      styles: path.join(root, 'src/styles'),
      store: path.join(root, 'src/store'),
      'vue': 'vue/dist/vue.js'    // 这里就是解决上面vue@1 -> vue@2版本升级的报错问题
    },
    // 这里注意在新版本的webpack中，extensions是不能包含''空串的
    extensions: ['.js', '.vue'],    // 引用js和vue文件可以省略后缀名
  },
  module: {   // 配置loader
    // 在这里 -loader 不能忽略，乖乖加上吧
    loaders: [
      {test: /\.vue$/, loader: 'vue-loader'},    // 所有.vue结尾的文件，使用vue-loader
      {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/}   // .js文件使用babel-loader，切记排除node_modules目录
    ]
  }
}
```

`babel-loader`就是将ES6的语法解析为ES5，要用到`babel`则根目录下要新建`.babelrc`文件用于配置`babel`：

``` json
{
  "presets": ["es2015"]
}
```

> 使用了`vue-loader`和`babel-loader`需要安装包：  
``` base
npm install --save-dev vue-loader babel-loader babel-core babel-plugin-transform-runtime babel-preset-es2015 css-loader vue-style-loader vue-hot-reload-api vue-html-loader
```

3、在`webpack.config`文件夹中创建`dev.js`文件：

``` javascript
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./base')
const root = path.resolve(__dirname, '..')

module.exports = merge(baseConfig, {})
```

上面代码仅仅是导出了跟`base.js`一模一样的配置，下面我们添加更多用于`dev`（开发环境）的配置。

> webpack-merge 用于合并两个配置文件，需要安装  
``` base
npm install --save-dev webpack-merge
```

4、使用`webpack-dev-server`，开启一个小型服务器，不需要再手动打开`index.html`进行调试了，修改配置文件为：

``` javascript
module.exports = merge(baseConfig, {
  devServer: {
    historyApiFallback: true, // 404的页面会自动跳转到/页面
    inline: true, // 文件改变自动刷新页面
    port: 8080, // 服务器端口
  },
  devtool: 'source-map' // 用于标记编译后的文件与编译前的文件对应位置，便于调试
})
```

5、添加热替换配置，每次改动文件不会再整个页面都刷新，并使用`HtmlWebpackPlugin`，实现js入口文件自动注入

安装`webpack-dev-server`: `npm install --save-dev webpack-dev-server`

```javascript
// ...同上
const HtmlWebpackPlugin = require('html-webpack-plugin')  // 实现js入口文件自动注入
module.exports = merge(baseConfig, {
  entry: [
    'webpack/hot/dev-server', // 热替换处理入口文件
    path.join(root, 'src/index.js')
  ],
  devServer: { /* 同上 */ },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),   // 添加热替换插件
    new HtmlWebpackPlugin({
      template: path.join(root, 'index.html'),  // 模板文件
      inject: 'body' // js的script注入到body底部
    })
  ]
})
```

> 这里的HotModuleReplacementPlugin是webpack内置的插件，不需要安装  
> 但HtmlWebpackPlugin需要自行安装：  
```base
npm install --save-dev html-webpack-plugin
```  
> 在文件头中引入  
``` javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')
```

修改`index.html`，去掉入口文件的javascript引入：

``` html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>myProject</title>
  </head>
  <body>
    <div id="app">{{ message }}</div>
  </body>
</html>
```

6、最后修改`package.json`中的webpack运行脚本为：

``` json
{
  "dev": "webpack-dev-server --config webpack.config/dev.js"
}
```

为了测试webpack配置是否都生效了，下面创建一个vue组件`src/components/Hello.vue`:

``` html
<template>
  <div>{{ message }}</div>
</template>

<script>
  export default {
    data: () => ({ message: 'Hello Vue.js!' })
  }
</script>
```

既然用到了vue组件，那自然需要安装`vue-template-compiler`: `npm install --save-dev vue-template-compiler`

修改`index.js`：

``` javascript
import Vue  from 'vue'
import Hello from './components/Hello.vue'

new Vue({
  el: '#app',
  template: '<div><hello></hello></div>',
  components: { Hello }
})
```

运行`npm run dev`，打开浏览器`localhost:8080`，查看结果：

```
Hello Vue.js!
```

如果这里出现了报错，而且长这个样子的：

```
Error: Cannot find module 'webpack/bin/config-yargs'
    at Function.Module._resolveFilename (module.js:485:15)
    at Function.Module._load (module.js:437:25)
    at Module.require (module.js:513:17)
    ······balabala
```

那是因为`webpack`和`webpack-dev-server`的版本不兼容导致的，查看下版本重新下载就好了。

## 配置路由

1、安装`vue-router`: `npm install --save vue-router`

2、在`src`目录下创建`views`（用于存放页面组件）和`router`（用于存放所有路由相关的配置）文件夹。

3、添加页面组件`src/views/Home.vue`：

``` html
<template>
  <div><hello></hello></div>
</template>

<script>
  import Hello from 'components/Hello'
  export default {
    components: { Hello }
  }
</script>
```

下面的几个文件因为是使用的新版环境，所以和原文的会有很大出入。

添加项目路由配置文件`src/router/routes.js`：

``` javascript
import Home from 'views/Home'

export default [{
  path: '/',        // 代表访问 '/' 的时候其实是访问Home.vue页面
  name: 'home',
  component: Home
}]

```

添加路由入口文件`src/router/index.js`：

``` javascript
import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'

Vue.use(Router)

const router = new Router({
  hashbang: false, // 关闭hash模式
  history: true, // 开启html5 history模式
  linkActiveClass: 'active', // v-link激活时添加的class，默认是`v-link-active`
  routes
})

// 全局导航钩子
router.beforeEach((to, from, next) => {
  console.log('---------> ' + to.path)  // 每次调整路由时打印，便于调试
  next()
})

export default router
```

修改`src/index.js`

``` javascript
import Vue  from 'vue'
import router from './router'

const App = new Vue({
  router
}).$mount('#app')
```

最后别忘了`index.html`：

``` html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>myProject</title>
</head>
<body>
  <div id="app">
    <router-view></router-view>    <!--路由替换位置-->
  </div>
</body>
</html>
```

重新执行`npm run dev`，打开浏览器`localhost:8080`（访问`Home.vue`页面）查看效果

```
Hello Vue.js
```

## 配置Vuex

> vuex通常用于存放和管理不同组件中的共用状态，例如不同路由页面之间的公共数据  
> vuex中的几个概念：  
> - state: 状态，即数据
- store： 数据的集合，一个vuex引用，仅有一个store，包含n个state
- getters：state不能直接取值，使用getters返回需要的state
- mutations： state不能直接赋值，通过mutation定义最基本的操作
- actions： 在action中调用一个或多个mutation
- modules： store和state之间的一层，便于大型项目管理，store包含多个module，module包含state、mutation、action  
  
> 本教程将以一个全局计数器作为例子

1、安装`vuex`: `npm install --save vuex`

2、添加`src/store`文件夹，存放vuex相关文件，添加`src/store/modules`用于vuex分模块管理。

添加`src/store/types.js`，vuex的所有`mutation type`都放在一起，不建议分开多个文件，有效避免重名情况：

``` javascript
export const INCREASE = 'INCREASE' // 累加
export const RESET = 'RESET' // 清零
```

3、编写vuex模块，添加`counter.js`模块目录`store/modules/counter.js`

``` javascript
import * as types from 'store/types'
// state
const state = {
  count: 0
}
// getters
const getters = {
  getCount: state => state.count
}
// actions
const actions = {
  increase({ commit }) {
    commit(types.INCREASE)  // 调用type为INCREASE的mutation
  },
  reset({ commit }) {
    commit(types.RESET)     // 调用type为RESET的mutation
  }
}
// mutations
const mutations = {
  [types.INCREASE](state) {
    state.count++
  },
  [types.RESET](state) {
    state.count = 0
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
```

4、添加`store/index.js`，作为vuex入口文件（共用的getters和actions可拆分到`store/getters.js`和`store/actions.js`，然后在`store/index.js`进行导入，这里因为没有，所以就直接写了）：

``` javascript
import Vue from 'vue'
import Vuex from 'vuex'
import counter from './modules/counter'

Vue.use(Vuex) // 确保在new Vuex.Store()之前

export default new Vuex.Store({
  getters: {},
  actions: {},
  modules: {
    counter
  }
})
```

5、修改`src/index.js`，将store引入并添加到App中：

``` javascript
import Vue from 'vue'
import router from './router'
import store from 'store'

const app = new Vue({
  router,
  store
}).$mount('#app')
```

6、最后改造一下`components/Hello.vue`，可以看到vuex v2变化了蛮多：

``` html
<template>
<div>
  <p>{{ message }}</p>
  <p>click count: {{ getCount }}</p>
  <button @click="increase">increase</button>
  <button @click="reset">reset</button>
</div>
</template>

<script>
// vuex 提供了独立的构建工具函数 Vuex.mapGetters, Vuex.mapActions
import { mapGetters, mapActions } from 'vuex'

export default {
  data: () => {
    return {
      message: 'Hello Vue.js!'
    }
  },
  computed: mapGetters({
    getCount: 'getCount'
  }),
  methods: mapActions([
    'increase',
    'reset'
  ])
}
</script>
```

重新执行`npm run dev`，打开浏览器`localhost:8080`，查看效果。

## 配置eslint

这不是必须的，不想要可以跳过。

> 虽然`eslint`不是必须的，但是强烈建议用在所有的JavaScript项目中。  
> 对于个人开发，可以在编程过程中发现并提示语法错误，有效过滤各种低级错误  
> 对于团队开发，强制采用一致的编码风格，保证项目的一致性，有效避免各种任性行为  
> 但是一定要注意，`eslint`定义的只是编码风格，规则是死的，人是活的，学会利用自定义规则的功能，增减规则  
> 同时要知道，`eslint`检测不通过不一定就是不能运行的，可能只是这种写法违背了编码风格，学会查看控制的查找具体错误原因  
> 想要更好的`eslint`体验，请根据不同编辑器安装对应的eslint插件，主流的编辑器已有相应的插件  

1、选择合适的编码风格

> `eslint`提供了很多[rules](https://eslint.org/docs/rules/)，可以直接在`.eslintrc`文件的`rules`中一个一个地配置  
> 显然我们大多数情况下不需要这么做，晚上已经有一些比较多人使用的风格了，本文推荐使用[standard](https://github.com/standard/standard)，点开这个链接，可以看到支持的编辑器和对应的插件名，自行去安装

2、配置`.eslintrc`文件，在根目录下创建`.eslintrc`文件：

``` JSON
{
  "parser": "babel-eslint", // 支持babel
  "extends": "standard", // 使用eslint-config-standard的配置
  "plugins": [
    "html" // 支持.vue文件的检测
  ],
  "env": {
    "browser": true, // 不会将window上的全局变量判断为未定义的变量
    "es6": true // 支持es6的语法
  },
  "rules": { // 自定义个别规则写在这，0忽略，1警告，2报错
    "no-unused-vars": 1 // 将”未使用的变量“调整为警告级别，原为错误级别，更多规则请看官网
  }
}
```

`结合不同编辑器的插件`，打开js和vue文件中，就可以看到提示了

> 根据使用的不同风格，安装所需的包，本文安装：  
``` base
npm install --save-dev eslint babel-eslint eslint-config-standard eslint-plugin-standard eslint-plugin-html eslint-plugin-promise
```

## webpack生产环境配置

前面已经配置过了开发环境下使用的配置文件`dev.js`，对于生产环境，通常需要对编译出来的文件户必须不过压缩处理，提取公共模块等，就需要专门提供一个配置文件。

1、添加`webpack.config/pro.js`文件，把生产环境用不到的删除，比如`webpack-dev-server`, `webpack-hot-replacement`

``` javascript
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseConfig = require('./base')
const root = path.resolve(__dirname, '..')

module.exports = merge(baseConfig, {
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(root, 'index.html'), // 模板文件
      inject: 'body' // js的script注入到body底部
    })
  ]
})
```

> webpack常用插件  
- extract-text-webpack-plugin 提取css到单独的文件
- compression-webpack-plugin 压缩gzip
- webpack.optimize.UglifyJsPlugin 压缩js文件，内置插件
- webpack.DefinePlugin 定义全局变量，内置插件
- webpack.optimize.CommonsChunkPlugin 提取公共依赖，内置插件

> 根据项目需求添加相应的插件，插件配置参数请查看官方文档，这里不进行罗列

2、在`package.json`中添加脚本：`"build": "webpack --config webpack.config/pro.js"`

3、运行`npm run build`，可以在dist文件夹中看到打包好的文件。

**<font size="7">完</font>**
