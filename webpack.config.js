const webpack = require('webpack');
const path = require('path');

webpack({
    mode: "development",
    watch: false,
    target: "node",
    stats: "errors-only",
    devtool: "source-map",
    context: path.resolve(__dirname, ""),
    node: {
        fs: "empty"
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [
            path.resolve(__dirname, "api"),
            path.resolve(__dirname, "node_modules"),
            path.resolve(__dirname, "node_modules/@types")
        ]
    },
    entry: [
        path.resolve(__dirname, './api/server.ts')
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "webpack_api_bundle.js"
    },
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: [{
                loader: 'ts-loader'
            }]
        }]
    },

}, (err, stats) => {
    console.log('console errors', err);
});