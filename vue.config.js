const path = require('path')
const UglifyPlugin = require('uglifyjs-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const autoprefixer = require('autoprefixer')
const pxtoviewport = require('postcss-px-to-viewport')

const resolve = dir => {
  return path.join(__dirname, dir)
}

const isPro = process.env.NODE_ENV === 'production'

module.exports = {
  publicPath: './',
  devServer: {
    host: '0.0.0.0',
    port: 8888,
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      '/test': {
        target: 'http://192.168.2.180/hbm', // 测试服务器
        // target: 'http://localhost:8080/hbm', // 目标地址
        // target: 'http://yapi.hongguaninfo.com/mock/26', // yapi
        // target: 'http://192.168.8.160:8080/hbm', // 姚海强
        // target: 'http://192.168.8.55:8080/hbm', // Markie
        // target: 'http://192.168.8.66:8080/hbm', // 史承群
        changeOrigin: true, // 是否改变源地址
        pathRewrite: { '^/test': '' },
        headers: { 'Referer': '' } // 兼容本地开发时csrf的拦截
      },
      '/upload': {
        target: 'http://localhost:3000', // 目标地址
        changeOrigin: true // 是否改变源地址
      },
      '/my-test': {
        target: 'http://localhost:3000', // 目标地址
        changeOrigin: true // 是否改变源地址
      },
      '/ng-test': {
        target: 'http://127.0.0.1:80'
      }
    },
    hot: true
  },
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('src'))
      .set('@utils', resolve('src/utils'))
      .set('@com', resolve('src/components'))
      .set('@img', resolve('src/assets/images'))
  },
  css: {
    loaderOptions: { // 向 CSS 相关的 loader 传递选项
      less: {
        javascriptEnabled: true
      },
      postcss: {
        plugins: [
          autoprefixer(),
          pxtoviewport({
            viewportWidth: 375
          })
        ]
      }
    },
    sourceMap: true
  },
  configureWebpack: config => {
    const commonCfg = {
      externals: {
        'particlesJS': 'particlesJS'
      }
    }

    const commonPlugins = []
    const devPlugins = []
    const prodPlugins = [
      new CompressionWebpackPlugin({
        // 使用 gzip 压缩
        algorithm: 'gzip',
        // 处理与此正则相匹配的所有文件
        test: new RegExp(
          '\\.(js|css)$'
        ),
        // 只处理大于此大小的文件
        threshold: 10240,
        // 最小压缩比达到 0.8 时才会被压缩
        minRatio: 0.8
      })
    ]

    if (isPro) {
      return {
        optimization: {
          minimizer: [
            new UglifyPlugin({
              uglifyOptions: {
                warnings: false,
                compress: {
                  drop_console: true,
                  drop_debugger: true
                }
              },
              cache: true,
              parallel: true
            })
          ]
        },
        plugins: prodPlugins.concat(commonPlugins),
        ...commonCfg
      }
    } else {
      return {
        ...commonCfg,
        plugins: devPlugins.concat(commonPlugins)
      }
    }
  }
}
