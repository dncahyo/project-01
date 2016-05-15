/* global __dirname */

var path = require('path');
var isProd = process.env.NODE_ENV == 'production';

var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var dir_html = path.resolve(__dirname, 'client/html');
var dir_build = path.resolve(__dirname, 'client/build');
var dir_client = path.resolve(__dirname,'client');

module.exports = {
    entry: path.resolve(dir_client, 'index.js'),
    output: {
        path: dir_build,
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    devServer: {
        contentBase: dir_build,
    },
    module: {
        loaders: [
            {
                loader: 'react-hot',
                test: /\.js$/,
            },
            {
                loader: 'babel-loader',
                test: /\.js$/,
                query: {
                    presets: ['es2015', 'react'],
                },
            },
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
            { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
        ]
    },
    plugins: [
        isProd ? new webpack.optimize.UglifyJsPlugin({minimize: true}) : function () {},
        // Simply copies the files over
        // new CopyWebpackPlugin([
        //     { from: dir_html } // to: output.path
        // ]),
        // Separate css file from bundle.js
        new ExtractTextPlugin("bundle.css"),
        // Avoid publishing files when compilation fails
        new webpack.NoErrorsPlugin()
    ],
    stats: {
        // Nice colored output
        colors: true
    },
    // Create Sourcemaps for the bundle
    devtool: 'source-map',
};
