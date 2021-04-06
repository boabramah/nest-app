const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-nestjs-webpack-plugin');

module.exports = (env) => {

  const config = {
    entry: [ 'webpack/hot/poll?100', './src/api/main.ts' ],
    target: 'node',
    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?100'],
      }),
    ],
    module: {
      rules: [
        {
          test: /.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },      
      ],
    },
    mode: env.NODE_ENV,
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },    
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin({paths: [ 'test' ]}),
      new StartServerPlugin({ name: 'server.js'}),
    ],
    output: {
      path: path.join(__dirname, 'dist/api'),
      filename: 'server.js',
    },
    optimization: {
      // We do not want to minimize our code.
      minimize: false
    },    
  };

  /*
    config.plugins = config.plugins.filter((plugin) => {
      console.log(plugin.constructor.name);
      return plugin.constructor.name !== 'UglifyJsPlugin';
    });
  */
 
  return config;

}
