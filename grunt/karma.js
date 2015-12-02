module.exports = {
    options: {
        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'material-inputs.js',
            'test/*.js',
        ],
        frameworks: ['jasmine'],
        browsers: ['PhantomJS'],
    },
    unit: {
        singleRun: true,
    },
    watch: {
        singleRun: false,
        background: true,
    },
};
