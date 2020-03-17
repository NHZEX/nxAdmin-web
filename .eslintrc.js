module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 暂时关闭对逗号的检查
    'comma-dangle': ["off", "always-multiline"],
    'camelcase': 'off',
    // script 标签缩进设置
    "vue/script-indent": ["warn", 2, {
      "baseIndent": 1,
      "switchCase": 0,
      "ignores": []
    }]
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }, {
      // 关闭对 vue 文件的缩进检测
      files: ["*.vue"],
      rules: {
        indent: "off",
      }
    }
  ]
}
