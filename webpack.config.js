const path = require('path');

module.exports = {
    entry: './src/js/index.js',
    output: {
        filename: 'script.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'production'
};