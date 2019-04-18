import webpack from "webpack"
import nodeExternals from "webpack-node-externals"

import baseConfig from "./base"

const paths = require("./../paths")

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = paths.servedPath

// what is environment
const isDevelopment = process.env.NODE_ENV === "development"

// client webpack configuration
const client: webpack.Configuration = {
  ...baseConfig,
  entry: {
    main: isDevelopment
      ? ["webpack-hot-middleware/client", paths.clientPath]
      : [paths.clientPath],
  },
  name: "client",
  output: {
    chunkFilename: isDevelopment
      ? "[name].chunk.js"
      : "[name].[chunkHash].chunk.js",
    filename: isDevelopment ? "[name].js" : "[name].[hash].js",
    path: paths.appClientBuild,
    publicPath,
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
}
client.optimization = {
  ...client.optimization,
  // Keep the runtime chunk seperated to enable long term caching
  // https://twitter.com/wSokra/status/969679223278505985
  runtimeChunk: true,
  splitChunks: {
    chunks: isDevelopment ? "initial" : "all",
  },
}

// server webpack configuration
const server: webpack.Configuration = {
  ...baseConfig,
  entry: { main: [paths.serverPath] },
  externals: [nodeExternals()],
  name: "server",
  output: {
    filename: "server.js",
    libraryTarget: "commonjs2",
    path: paths.appServerBuild,
    publicPath,
  },
  target: "node",
}

// let's export an array of configs which webpack supports
export default [client, server]
