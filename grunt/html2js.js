module.exports = {
    build: {
        src: ['src/templates/*.tpl.html'],
        dest: 'tmp/templates.js',
        options: {
            singleModule: true,
            existingModule: true,
            module: 'material-inputs',
            indentString: '    ', // 4-space indents
            useStrict: true,
            htmlmin: {
                collapseBooleanAttributes: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true,
                removeEmptyAttributes: false,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
            },
        },
    },
};
