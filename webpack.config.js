var webpack = require('webpack');
var path = require('path');

module.exports = function (options) {
  const { plugins, ...config } = options;
  return {
    ...config,
    entry: ['./src/lambda.ts'],
    externals: [],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      libraryTarget: 'commonjs2',
    },
    plugins: [
      ...plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          const lazyImports = [
            '@nestjs/websockets/socket-module',
            '@nestjs/microservices/microservices-module',
          ];
          if (!lazyImports.includes(resource)) {
            return false;
          }
          try {
            require.resolve(resource, {
              paths: [process.cwd()],
            });
          } catch (err) {
            return true;
          }
          return false;
        },
      }),
    ],
  };
};
