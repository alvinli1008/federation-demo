const path = require('path');
const { ModuleFederationPlugin } = require('webpack').container;
const HtmlWebpackPlugin = require("html-webpack-plugin");

const { dependencies } = require('./package.json');

const mode = 'development';

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: mode,
  entry: {
    main: path.resolve(__dirname, 'src/index.js'),
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    // publicPath: '/',
    // assetModuleFilename: 'static/[name].[hash:4].[ext]'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'remote',
      filename: 'remoteEntry.js',
      library: { type: 'umd', name: 'remote' },
      exposes: {
        './Button': './src/Button',
      },
      shared: [
        {
          react: {
            eager: true,
            singleton: true,
            requiredVersion: dependencies['react'],
          },
        },
        {
        'react-dom': {
          eager: true,
          singleton: true,
          requiredVersion: dependencies['react-dom'],
        },
      }],
    }),
    new HtmlWebpackPlugin({
      template: "./index.html"
    })
  ],
  devServer: {
    host: '0.0.0.0',
    hot: true,
    liveReload: false,
    historyApiFallback: true,
    client: {
      overlay: false
    },
    port: 8080,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization'
    }
  }
};
