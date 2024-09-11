const path = require('path');
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
    clean: true,
  },
  optimization: {
    // minimize: false,
  },
  // experiments: {
  //   outputModule: true, // 使用 outputModule
  // },
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
            loader: 'style-loader',
            options: { attributes: { class: 'webpack-remote-css' } }
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'webpack_remote',
      filename: 'remoteEntry.js',
      library: { type: 'var', name: 'webpack_remote' },
      exposes: {
        './Input': './src/components/Input',
      },
      shared: [
        {
          react: {
            // eager: false, // 则在应用程序启动时立即加载共享模块，而不是按需加载。
            singleton: true, // 如果设置为 true，则确保共享模块的单例实例。
            requiredVersion: deps.react, // 指定所需的模块版本。如果版本不匹配，则共享模块不会被加载。
            import: 'react', // 指定要共享的模块名称。
            shareKey: 'react16', // 在共享作用域中使用的键名。默认情况下，它是模块的名称。
            shareScope: 'default', // 共享作用域的名称。默认是 'default'。
            strictVersion: false, // 如果设置为 true，则要求共享模块的版本严格匹配。
            // version: deps.react, // 指定模块的版本。
          },
        },
        {
        'react-dom': {
          // eager: false,
          singleton: true, // only a single version of the shared module is allowed
          requiredVersion: deps['react-dom'],
          import: 'react-dom', // the "react" package will be used a provided and fallback module
          shareKey: 'react-dom16', // under this name the shared module will be placed in the share scope
          shareScope: 'default', // share scope with this name will be used
          strictVersion: false, // 如果设置为 true，则要求共享模块的版本严格匹配。
          // version: deps.react, // 指定模块的版本。
        },
      }],
    }),
    new HtmlWebpackPlugin({
      template: "./index.html",
      // scriptLoading:"module",
    })
  ],
  devServer: {
    host: '0.0.0.0',
    hot: true,
    port: 8081,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization'
    }
  }
};
