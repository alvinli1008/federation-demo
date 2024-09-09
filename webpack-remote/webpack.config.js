const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const HtmlWebpackPlugin = require("html-webpack-plugin");

const deps = require('./package.json').dependencies;

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
    // library: {
    //   type: 'module' // 使用 module 类型的 library
    // },
    // publicPath: '/',
    // assetModuleFilename: 'static/[name].[hash:4].[ext]'
  },
  optimization: {
    minimize: false,
  },
  experiments: {
    outputModule: true, // 使用 outputModule
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  target: 'web',
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
      {
        test: /\.css$/,
        include: [path.resolve(__dirname, 'src')],
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: false
            }
          }
        ]
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new ModuleFederationPlugin({
      name: 'webpack-remote',
      filename: 'remoteEntry.js',
      library: { type: 'module' },
      exposes: {
        './Button': './src/Button',
        './Input': './src/components/Input',
      },
      shared: [
        {
          react: {
            requiredVersion: deps.react,
            import: 'react', // the "react" package will be used a provided and fallback module
            shareKey: 'react16', // under this name the shared module will be placed in the share scope
            shareScope: 'default', // share scope with this name will be used
            singleton: true, // only a single version of the shared module is allowed
          },
        },
        {
        'react-dom': {
          requiredVersion: deps['react-dom'],
          import: 'react-dom', // the "react" package will be used a provided and fallback module
          shareKey: 'react-dom16', // under this name the shared module will be placed in the share scope
          shareScope: 'default', // share scope with this name will be used
          singleton: true, // only a single version of the shared module is allowed
        },
      }],
    }),
    new HtmlWebpackPlugin({
      template: "./index.html",
      scriptLoading:"module",
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
    port: 8081,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization'
    }
  }
};
