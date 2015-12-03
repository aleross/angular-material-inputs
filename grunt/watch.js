module.exports = {
    options: { livereload: false },
    js: {
        files: ['src/**/*.js'],
        tasks: ['concat'],
    },
    sass: {
        files: ['src/sass/**/*.scss'],
        tasks: ['build-css'],
    },
    templates: {
        files: ['src/templates/*'],
        tasks: ['html2js', 'concat'],
    },
    livereload: {
        files: ['dist/*', 'index.html'],
        options: { livereload: true },
    },
};
