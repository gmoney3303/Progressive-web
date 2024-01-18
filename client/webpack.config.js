const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = () => {
  return {
    mode: 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'), // Adjust the output path
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html', // Adjust the path to your index.html
        filename: 'index.html', // Output filename
      }),
      new WebpackPwaManifest({
        // Your manifest configuration
      }),
      new InjectManifest({
        // Your workbox configuration
      }),
    ],

    module: {
      rules: [
        // Add your CSS loaders and babel configuration here
      ],
    },
  };
};