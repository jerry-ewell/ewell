/* eslint-disable */
const CracoLessPlugin = require('craco-less');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const { NODE_ENV, REACT_APP_PREFIX } = process.env;
const activeApi = require('./proxy');
const Webpack = {
  production: {
    plugins: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            // drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log'],
          },
        },
      }),
      // Ignore all local files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
  },
  development: {},
};

module.exports = {
  devServer: {
    proxy: {
      '/whitelist-proxy': {
        target: activeApi.whitelistApi,
        changeOrigin: true,
        secure: true,
        pathRewrite: {
          '^/whitelist-proxy': '',
        },
      },
      '/v1': {
        target: activeApi.mockApi,
        changeOrigin: true,
        secure: true,
      },
      '/api': {
        target: activeApi.api,
        changeOrigin: true,
        secure: true,
      },
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@app-prefix': REACT_APP_PREFIX,
              '@ant-prefix': REACT_APP_PREFIX,
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  webpack: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
    ...Webpack[NODE_ENV],
  },
};
