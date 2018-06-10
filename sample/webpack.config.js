const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',

  output: {
    path: `${__dirname}/dist`,
    filename: 'index.js'
  },

  resolve: {
    extensions: ['.ts', '.js'],
    modules: ['node_modules']
  },

  // Configuration for dev server
  devServer: {
    contentBase: 'dist',
    port: 80,
    disableHostCheck: true
  },

  devtool: 'source-map',

  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'src/index.html'
      },
    ])
  ]
};
