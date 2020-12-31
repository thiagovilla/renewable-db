module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['jasmine'],

    files: [
      'bower_components/angular/angular.min.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'src/**/*.js',
      'src/**/*.html',
    ],

    exclude: [
    ],

    preprocessors: {
      '**/*.html': ['ng-html2js'],
    },

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['Firefox'],

    singleRun: false,

    concurrency: Infinity,

    ngHtml2JsPreprocessor: {
      stripPrefix: 'src/',
    }
  })
}
