const path = require('path');

module.exports = {
    entry: {
        main: './src/main.ts'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    devtool: 'source-map',
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: { }
    },
    output: {
        filename: './dist/[name].bundle.js',
        path: __dirname
    }
};
