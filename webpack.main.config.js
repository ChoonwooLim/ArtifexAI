const path = require('path');

module.exports = [
  // Main process
  {
    target: 'electron-main',
    entry: './src/main/main.ts',
    output: {
      path: path.resolve(__dirname, 'dist/main'),
      filename: 'main.js',
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
          },
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@main': path.resolve(__dirname, 'src/main'),
      },
    },
    externals: {
      'electron': 'commonjs electron',
    },
    node: {
      __dirname: false,
      __filename: false,
    },
    devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false,
  },
  // Preload script
  {
    target: 'electron-preload',
    entry: './src/main/preload.ts',
    output: {
      path: path.resolve(__dirname, 'dist/main'),
      filename: 'preload.js',
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
          },
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    externals: {
      'electron': 'commonjs electron',
    },
    node: {
      __dirname: false,
      __filename: false,
    },
    devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false,
  }
];