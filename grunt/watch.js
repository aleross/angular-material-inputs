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

    // hot-swap CSS changes
    css: {
        files: ['dist/*.css'],
        options: { livereload: true },
    },
    templates: {
        files: ['src/templates/*'],
        tasks: ['html2js', 'concat'],
    },
    livereload: {
        files: ['dist/*.js', 'index.html'],
        options: { livereload: true },
    },
};
