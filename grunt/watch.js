module.exports = {
    options: { livereload: false },
    js: {
        files: ['src/**/*.js'],
        tasks: ['karma:watch:run', 'build'],
    },
    sass: {
        files: ['src/sass/**/*.scss'],
        tasks: ['build-css']
    },
    livereload: {
        files: ['segment.js', 'example.html'],
        options: { livereload: true },
    },
};
