const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const MODE = 'development';

module.exports = [
    {
    entry: './src/var/index.ts',
    mode: MODE,
    devtool: 'inline-source-map',
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'src/var/index.html'
      })
    ]
  },
  /* Bundle all css files in src/var/ */
  {
    entry: {
      styles: [
        path.resolve(__dirname, 'src/var/index.css'),
        path.resolve(__dirname, 'src/var/monitor/monitor.css'),
        path.resolve(__dirname, 'src/var/editor/editor.css'),
        path.resolve(__dirname, 'src/var/action/action.css'),
        path.resolve(__dirname, 'src/var/monitor/register/register.css'),
        path.resolve(__dirname, 'src/var/monitor/memory/memory.css')
      ]
    },
    mode: MODE,
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            type: 'css/mini-extract',
            // For webpack@4
            // test: /\.css$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css'
      })
    ]
  }
];