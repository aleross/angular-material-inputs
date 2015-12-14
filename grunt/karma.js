module.exports = {
    options: {
        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'test/spec.js',
            'dist/material-inputs.js',
            'test/unit/*.js',
        ],
        frameworks: ['jasmine'],
        browsers: ['PhantomJS'],
    },
    unit: {
        singleRun: true,
        preprocessors: {
            'dist/material-inputs.js': 'coverage'
        },
        reporters: ['coverage', 'progress'],
        coverageReporter: {
            type: 'lcov',
            dir: 'coverage/',
        },
    }
};
