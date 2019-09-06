// 打包开启 Gzip 压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin')

// 打包过滤 console
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

// cdn预加载使用
const externals = {
  'vue': 'Vue',
  'vue-router': 'VueRouter',
  'vuex': 'Vuex',
  'axios': 'axios',
  'element-ui': 'ELEMENT',
  // 'js-cookie': 'Cookies',
  'nprogress': 'NProgress'
}

const cdn = {
  // 开发环境
  dev: {
    css: [
      'https://unpkg.com/element-ui/lib/theme-chalk/index.css',
      'https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.css'
    ],
    js: []
  },
  // 生产环境
  build: {
    css: [
      'https://unpkg.com/element-ui/lib/theme-chalk/index.css',
      'https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.css'
    ],
    js: [
      'https://cdn.bootcss.com/vue/2.6.10/vue.min.js',
      'https://cdn.bootcss.com/vue-router/3.1.3/vue-router.min.js',
      'https://cdn.bootcss.com/vuex/3.0.1/vuex.min.js',
      'https://cdn.bootcss.com/axios/0.19.0/axios.min.js',
      'https://unpkg.com/element-ui/lib/index.js',
      // 'https://cdn.bootcss.com/js-cookie/2.2.0/js.cookie.min.js',
      'https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.js'
    ]
  }
}

// 是否使用gzip
const productionGzip = true
// 需要gzip压缩的文件后缀
const productionGzipExtensions = ['js', 'css']

module.exports = {
  // 设置代理
  devServer: {
    proxy: {
      '/FEApi': {
        target: 'http://192.168.254.238:9528',
        changeOrigin: true,
        pathRewrite: {
          '^/FEApi': ''
          // '^/FEApi': '/FEApi'
        }
      }
    }
    // host port 设置会覆盖默认
    // host: '192.168.254.241',
    // host: 'localhost',
    // port: 8080
  },
  chainWebpack: config => {
    /**
     * 添加CDN参数到htmlWebpackPlugin配置中， 详见public/index.html 修改
     */
    config.plugin('html').tap(args => {
      if (process.env.NODE_ENV === 'production') {
        args[0].cdn = cdn.build
      }
      if (process.env.NODE_ENV === 'development') {
        args[0].cdn = cdn.dev
      }
      return args
    })
  },
  configureWebpack: config => {
    const myConfig = {}
    if (process.env.NODE_ENV === 'production') {
      // 1. 生产环境npm包转CDN
      myConfig.externals = externals

      myConfig.plugins = []
      // 2. 构建时开启gzip，降低服务器压缩对CPU资源的占用，服务器也要相应开启gzip
      productionGzip && myConfig.plugins.push(
        new CompressionWebpackPlugin({
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 8192,
          minRatio: 0.8
        })
      )
      myConfig.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_console: true, // console
              drop_debugger: false,
              pure_funcs: ['console.log'] // 移除console
            },
            // 新版需要在这里添加
            warnings: false
          }
        })
      )
    }
    if (process.env.NODE_ENV === 'development') {
      /**
       * 关闭host check，方便使用ngrok之类的内网转发工具
       */
      myConfig.devServer = {
        disableHostCheck: true
      }
    }
    //   open: true,
    //   hot: true
    //   // https: true,
    //   // proxy: {
    //   //   '/proxy': {
    //   //     target: 'http://47.94.138.75',
    //   //     // changeOrigin: true,
    //   //     pathRewrite: {
    //   //       '^/proxy': ''
    //   //     }
    //   //   }
    //   // },
    // }
    return myConfig
  }
}
