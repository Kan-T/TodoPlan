// This is a karma config file. For more details see
//   http://karma-runner.github.io/0.13/config/configuration-file.html
// we are also using it with karma-webpack
//   https://github.com/webpack/karma-webpack

var webpackConfig = require('../../build/webpack.test.conf')

module.exports = function karmaConfig (config) {
  config.set({
    // to run in additional browsers:
    // 1. install corresponding karma launcher
    //    http://karma-runner.github.io/0.13/config/browsers.html
    // 2. add it to the `browsers` array below.
    // browsers: ['PhantomJS'],
    browsers: ['Chrome'],
    frameworks: ['mocha', 'sinon-chai'],
    reporters: ['spec', 'coverage'],            // 测试报告
    files: ['./index.js'],                      // 测试入口文件
    preprocessors: {                            // 预处理器 karma-webpack
      './index.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,                     // Webpack配置
    webpackMiddleware: {
      noInfo: true
    },
    coverageReporter: {                         // 测试覆盖率报告  https://github.com/karma-runner/karma-coverage/blob/master/docs/configuration.md
      dir: './coverage',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' }
      ]
    }
  })
}
