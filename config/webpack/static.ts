import HtmlWebpackPlugin from "html-webpack-plugin"
import webpack from "webpack"

const paths = require("./../paths")

import baseConfig from "./base"

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = paths.servedPath

// what is environment
const isDevelopment = process.env.NODE_ENV === "development"

// client webpack configuration
const staticConf: webpack.Configuration = {
  ...baseConfig,
  entry: {
    main: isDevelopment
      ? ["webpack-hot-middleware/client", paths.clientPath]
      : [paths.clientPath],
  },
  name: "client",
  optimization: {
    ...baseConfig.optimization,
    // Keep the runtime chunk seperated to enable long term caching
    // https://twitter.com/wSokra/status/969679223278505985
    runtimeChunk: true,
    splitChunks: {
      chunks: isDevelopment ? "initial" : "all",
    },
  },
  output: {
    chunkFilename: isDevelopment
      ? "[name].chunk.js"
      : "[name].[chunkHash].chunk.js",
    filename: isDevelopment ? "[name].js" : "[name].[hash].js",
    path: paths.appBuild,
    publicPath,
  },
  plugins: (isDevelopment
    ? [new webpack.HotModuleReplacementPlugin()]
    : []
  ).concat([
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      ...(!isDevelopment
        ? {
            minify: {
              collapseWhitespace: true,
              keepClosingSlash: true,
              minifyCSS: true,
              minifyJS: true,
              minifyURLs: true,
              removeComments: true,
              removeEmptyAttributes: true,
              removeRedundantAttributes: true,
              removeStyleLinkTypeAttributes: true,
              useShortDoctype: true,
            },
          }
        : undefined),
    }),
  ]),
}

export default staticConf
