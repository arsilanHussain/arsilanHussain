const path = require('path');

module.exports = {
  entry: './src/index.js', // Update with your main JS file location
  output: {
    filename: 'bundle.js', // Output bundled JS file
    path: path.resolve(__dirname, 'dist'), // Bundles will be saved to /dist folder
    clean: true, // Clean /dist folder before each build
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
};
