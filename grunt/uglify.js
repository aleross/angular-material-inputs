module.exports = {
    options: {
        mangle: true,
        sourceMap: true,
    },
    release: {
        files: { 'dist/material-inputs.min.js': 'dist/material-inputs.js' },
    },
};
