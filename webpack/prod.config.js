const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  target: 'web',
  entry: {
    'index': './src/index.ts',
    'standaloneExports': './src/standaloneExports.ts',
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    clean: true
  },
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React'
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'ReactDOM',
      root: 'ReactDOM'
    },
    '@mui/material': '@mui/material',
    '@mui/icons-material': '@mui/icons-material',
    '@emotion/react': '@emotion/react',
    '@emotion/styled': '@emotion/styled'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            compilerOptions: {
              declaration: false,
              emitDeclarationOnly: false
            }
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.svg$/,
        type: 'asset/inline'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      PACKAGE_VERSION: JSON.stringify(require("../package.json").version),
      REPOSITORY_URL: JSON.stringify(require("../package.json").repository.url),
    })
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()]
  }
};
