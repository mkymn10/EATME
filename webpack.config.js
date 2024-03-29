const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './client/index.js',

  output: {
    path: path.join(__dirname, '/build'),
    filename: 'bundle.js',
  },

  plugins: [
    new HTMLWebpackPlugin({
      template: './client/index.html',
    }),
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, 'build'),
      publicPath: '/build',
    },
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },

  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.s?css/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      }
    ],
  },
};
