// Karma configuration
// Generated on Wed Oct 12 2016 14:47:17 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'requirejs', 'should'],


    // list of files / patterns to load in the browser
    files: [
      'test/karma/init.js',
      {pattern: '*.js', included: false},
      {pattern: 'renderers/*.js', included: false},
      {pattern: 'test/test.js', included: false},
      {pattern: 'test/images/*.nfo', included: false},
      {pattern: 'Images/*.*', included: false},
      {pattern: 'Fonts/*.flf', included: false},
      {pattern: 'node_modules/browser-request/index.js', included:false},
      {pattern: 'node_modules/dirname-shim/shim.js', included:false}
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 8082,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
        //'PhantomJS',
        //'Safari',
        'Chrome',
    ],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
