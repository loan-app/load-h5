module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    // 'transform-runtime',
    'transform-remove-strict-mode'
  ],
  'ignore': [
    './src/lib/mui.min.js'
  ]
};
