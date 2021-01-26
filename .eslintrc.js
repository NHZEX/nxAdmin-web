module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 暂时关闭对逗号的检查
    'comma-dangle': ['off', "always-multiline"],
    'camelcase': 'off',
    // script 标签缩进设置
    'vue/script-indent': ['warn', 2, {
      baseIndent: 0,
      switchCase: 1,
      ignores: []
    }],
    // Object.prototype (https://eslint.org/docs/rules/no-prototype-builtins)
    'no-prototype-builtins': 'warn',
    // const 变量声明
    'prefer-const': 'warn',
    // array-bracket-spacing
    'array-bracket-spacing': 'warn',
    // no-async-promise-executor
    'no-async-promise-executor': 'warn',
    // quote-props
    'quote-props': 'warn',
    // dot-notation
    'dot-notation': 'warn',
    // quotes
    'quotes': 'warn',
    // object-curly-newline
    'object-curly-newline': 'off',
    // operator-linebreak
    'operator-linebreak': ['warn', 'before']
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
      files: ['*.vue'],
      rules: {
        indent: 'off',
      }
    }
  ]
}
