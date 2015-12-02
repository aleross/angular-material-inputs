module.exports = {
    options: {
        map: false, // will point to sass task css map
        processors: [
            require('pixrem')(), // add fallbacks for rem units
            require('autoprefixer-core')({ browsers: 'last 2 versions' }), // add vendor prefixes
        ],
    },
    build: {
        src: 'dist/material-inputs.css',
    },
};
