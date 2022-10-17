const CompressionWebpackPlugin = require('compression-webpack-plugin')
// const VueFilenameInjector = require('@d2-projects/vue-filename-injector')
const ThemeColorReplacer = require('webpack-theme-color-replacer')
const forElementUI = require('webpack-theme-color-replacer/forElementUI')
const { set, each, compact, map, keys } = require('lodash')

// 拼接路径
const resolve = dir => require('path').join(__dirname, dir)

// 增加环境变量
process.env.VUE_APP_VERSION = require('./package.json').version
process.env.VUE_APP_BUILD_TIME = require('dayjs')().format('YYYY-M-D HH:mm:ss')

// 基础路径 注意发布之前要先修改这里
const publicPath = process.env.VUE_APP_PUBLIC_PATH || '/'

// 多页配置，默认未开启，如需要请参考 https://cli.vuejs.org/zh/config/#pages
const pages = {
  index: {
    entry: 'src/main.js',
    template: 'public/index.html',
    filename: 'index.html',
    chunks: [
      'manifest',
      'index',
      'chunk-index',
      'chunk-vendor',
      'chunk-common',
      'chunk-vue',
      'chunk-element',
      'chunk-vxe',
    ]
  },
}

// 引入文件的 cdn 链接
const cdn = {
  index: []
}

// 设置不参与构建的库
const externals = {}
keys(pages).forEach(name => {
  cdn[name].forEach(p => {
    externals[p.name] = p.library
  })
})

module.exports = {
  // 根据你的实际情况更改这里
  publicPath,
  lintOnSave: true,
  devServer: {
    allowedHosts: process.env.NODE_ENV === 'development' ? 'all' : 'auto', // 关闭 host check，方便使用 ngrok 之类的内网转发工具
    port: process.env.VUE_DEV_SERVER_PORT || 8080,
    proxy: {
      '/api-proxy': {
        target: process.env.API_SERVER_PATH || '/',
        pathRewrite: { '^/api-proxy': '' },
      },
    },
  },
  css: {
    loaderOptions: {
      // 设置 scss 公用变量文件
      sass: {
        additionalData: '@use "sass:math"; @import \'~@/assets/style/public.scss\';'
      },
      less: {
        lessOptions: {
          modifyVars: {
            blue: '#2262AB'
          }
        }
      }
    }
  },
  pages,
  configureWebpack: config => {
    const configNew = {}
    if (process.env.NODE_ENV === 'production') {
      configNew.externals = externals
      configNew.plugins = [
        // gzip
        new CompressionWebpackPlugin({
          filename: '[path][base].gz',
          test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: false
        })
      ]
    }
    configNew.resolve = {
      alias: {
        // 'element-ui': 'element-ui-eoi',
      },
      fallback: {
        path: require.resolve('path-browserify'),
        fs: false,
        os: false,
      },
    }
    return configNew
  },
  // 默认设置: https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-service/lib/config/base.js
  chainWebpack: config => {
    config.optimization.runtimeChunk({
      name: 'manifest'
    })
    config.optimization.splitChunks({
      cacheGroups: {
        // External dependencies common to all pages
        libs: {
          name: 'chunk-vendor',
          chunks: 'initial',
          minChunks: 1,
          test: /[\\/]node_modules[\\/]/,
          priority: 1,
          reuseExistingChunk: true,
          enforce: true
        },
        // Code common to all pages
        common: {
          name: 'chunk-common',
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
          priority: 2,
          reuseExistingChunk: true,
          enforce: true
        },
        // External dependencies that are only used by the index page
        index: {
          name: 'chunk-index',
          chunks: 'all',
          minChunks: 1,
          test: /[\\/]node_modules[\\/](sortablejs|screenfull|nprogress|hotkeys-js|fuse\.js|better-scroll|lowdb|shortid)[\\/]/,
          priority: 3,
          reuseExistingChunk: true,
          enforce: true
        },
        // Vue family packages
        vue: {
          name: 'chunk-vue',
          test: /[\\/]node_modules[\\/](vue|vue-router|vuex)[\\/]/,
          chunks: 'all',
          priority: 3,
          reuseExistingChunk: true,
          enforce: true
        },
        // only element-ui
        element: {
          name: 'chunk-element',
          test: /[\\/]node_modules[\\/]element-ui(-eoi)?[\\/]/,
          chunks: 'all',
          priority: 3,
          reuseExistingChunk: true,
          enforce: true
        },
        // only vxe
        vxe: {
          name: 'chunk-vxe',
          test: /[\\/]node_modules[\\/](vxe-table(-plugin.+)?|xe-utils)[\\/]/,
          chunks: 'all',
          priority: 3,
          reuseExistingChunk: true,
          enforce: true
        }
      }
    })
    // Add the CDN settings to the settings of the htmlwebpackplugin plug-in
    keys(pages).forEach(name => {
      const packages = cdn[name]
      config.plugin(`html-${name}`).tap(options => {
        const setting = {
          css: compact(map(packages, 'css')),
          js: compact(map(packages, 'js'))
        }
        set(options, '[0].cdn', process.env.NODE_ENV === 'production' ? setting : [])
        return options
      })
    })
    /**
     * 删除懒加载模块的 prefetch preload，降低带宽压力
     * Remove prefetch preload settings for lazy load modules
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload
     * 而且预渲染时生成的 prefetch 标签是 modern 版本的，低版本浏览器是不需要的
     */
    each(keys(pages), name => {
      config.plugins.delete(`prefetch-${name}`)
      config.plugins.delete(`preload-${name}`)
    })
    config
      .plugin('theme-color-replacer')
      .use(ThemeColorReplacer, [{
        fileName: 'css/theme-colors.[contenthash:8].css',
        matchColors: [
          ...forElementUI.getElementUISeries(process.env.VUE_APP_ELEMENT_COLOR), // element-ui 主色系列
          // ...forElementUI.getElementUISeries('#2d8cf0'), // iview-ui 主色系列 (样式暂时无法完全兼任)
        ],
        // replace './node_modules/element-ui-eoi/lib/theme-chalk/index.css'
        externalCssFiles: ['./node_modules/element-ui/lib/theme-chalk/index.css'], // optional, String or string array. Set external css files (such as cdn css) to extract colors.
        changeSelector: forElementUI.changeSelector,
      }])
    config
      // 开发环境 sourcemap 不包含列信息
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )
      // 预览环境构建 vue-loader 添加 filename
      // .when(process.env.VUE_APP_SCOURCE_LINK === 'TRUE',
      //   config => VueFilenameInjector(config, {
      //     propName: process.env.VUE_APP_SOURCE_VIEWER_PROP_NAME
      //   })
      // )
    // markdown
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('text-loader')
      .loader('text-loader')
      .end()
    // svg
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .include
      .add(resolve('src/assets/svg-icons/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'd2-[name]'
      })
      .end()
    // image exclude
    const imagesRule = config.module.rule('images')
    imagesRule
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .exclude
      .add(resolve('src/assets/svg-icons/icons'))
      .end()
    // 重新设置 alias
    config.resolve.alias
      .set('@api', resolve('src/api'))
    // 分析工具
    if (process.env.npm_config_report) {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
  },
  // 不输出 map 文件
  productionSourceMap: false,
  // i18n
  pluginOptions: {
    i18n: {
      locale: 'zh-chs',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
}
