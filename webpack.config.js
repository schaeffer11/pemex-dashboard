
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const embedFileSize = 65536
const isProduction = process.argv.indexOf('-p') !== -1
const distPath = path.join(__dirname, `/dist${ isProduction ? '' : '-dev'}/client`)

module.exports = {
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       commons: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name: 'vendors',
  //         filename: 'vendors.js',
  //         chunks: 'all',
  //       },
  //     },
  //   },
  // },
  mode: isProduction ? 'production' : 'development',
  entry: {
    app: ['./client/index.js'],
    // vendors: [
    //   'classnames',
    //   'react',
    //   'react-dom',
    //   'react-redux',
    //   'react-router',
    //   'react-router-redux',
    //   'redux',
    //   'redux-immutable',
    //   'redux-registry',
    // ],
  },
  devtool: isProduction ? 'hidden-source-map' : 'source-map',
  output: {
    path: distPath + '/js',
    filename: 'app.js',
  },
  plugins: [
    new CopyWebpackPlugin([{ from: 'static', to: distPath }]),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.scss$/,
        loaders: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.svg$/,
        loader: 'url-loader',
        options: {
          mimetype: 'image/svg+xml',
          limit: embedFileSize,
        },
      },
      {
        test: /\.png$/,
        loader: 'url-loader',
        options: {
          mimetype: 'image/png',
          limit: embedFileSize,
        },
      },
      {
        test: /\.jpg$/,
        loader: 'url-loader',
        options: {
          mimetype: 'image/jpeg',
          limit: embedFileSize,
        },
      },
      {
        test: /\.gif$/,
        loader: 'url-loader',
        options: {
          mimetype: 'image/gif',
          limit: embedFileSize,
        },
      },
    ],
  },
}
