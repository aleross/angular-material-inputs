module.exports = {
    options: {
        sourceMap: true,
    },
    build: {
        files: {
            'dist/material-inputs.css': 'src/sass/material-inputs.scss',
            'demo/index.css': 'demo/index.scss',
        },
    },
};
