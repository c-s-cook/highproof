const path = require('path');

module.exports = {
  entry: './src/addVouchers.ts',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [path.resolve(__dirname, 'src')],
        use: 'ts-loader',
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devtool: 'source-map',
  output: {
    publicPath: 'public',
    filename: 'addVouchersBundle.js',
    path: path.resolve(__dirname, 'public/javascripts'),
  },
};