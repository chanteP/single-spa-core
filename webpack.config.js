const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const env = process.env.NODE_ENV || 'development';

module.exports = {
  mode: env,
  entry: {
    // Set the single-spa config as the project entry point
    'single-spa.config': ['babel-polyfill', 'single-spa.config.js'],
  },
  output: {
    publicPath: '/static/',
    filename: '[name].js',
    path: path.resolve(__dirname, 'static'),
  },
  module: {
    rules: [
      {
        // Webpack style loader added so we can use materialize
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
          test: /\.s(c|a)ss$/,
          use: ['vue-style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.js$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        loader: 'babel-loader',
      },
      {
        // This plugin will allow us to use html templates when we get to the angularJS app 
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'html-loader',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
          test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
          use: [
              {
                  loader: 'url-loader',
                  options: {
                      limit: 10000,
                      name: 'static/image/[name].[ext]'
                  }
              }
          ]
      },
    ],
  },
  node: {
    fs: 'empty'
  },
  resolve: {
    modules: [
      __dirname,
      'node_modules',
    ],
  },
  plugins: [
    // A webpack plugin to remove/clean the build folder(s) before building
    new AssetsPlugin({filename: 'static/assets.json'}),
    new VueLoaderPlugin()
  ],
  devtool: env === 'production' ? 'source-map' : '',
  externals: [],
  devServer: {
    historyApiFallback: true,
    proxy: {
      '/api/m/': 'http://localhost:9000'
    },
  }
};