const path = require('path')

const alias = {
  '@': path.join(__dirname, 'src')
}

module.exports = {
  plugins: {
    'postcss-import': {
      resolve: function (id) {
        let pathname
        if (id.startsWith('~@/') || id.startsWith('@/')) {
          const part = id.toString().split('/')
          part.shift()
          pathname = path.join(alias['@'], ...part)
        } else {
          pathname = id
        }
        // console.warn(alias, arguments)
        return pathname
      }
    },
    tailwindcss: {},
    autoprefixer: {},
  },
}
