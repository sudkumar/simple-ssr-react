import webpack from "webpack"

const TSDocgenPlugin = require("react-docgen-typescript-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")

const paths = require("./../paths")

// what is environment
const isDevelopment = process.env.NODE_ENV === "development"

// base webpack configuration
const base: webpack.Configuration = {
  context: paths.appPath,
  devtool: isDevelopment ? "cheap-module-source-map" : false,
  mode: isDevelopment ? "development" : "production",
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              plugins: [
                "@babel/plugin-syntax-dynamic-import",
                "react-hot-loader/babel",
                [
                  "styled-components",
                  {
                    displayName: isDevelopment,
                    ssr: true,
                  },
                ],
              ],
            },
          },
          { loader: "awesome-typescript-loader" },
        ],
      },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
    ],
  },
  optimization: {
    minimizer: isDevelopment
      ? []
      : [
          new TerserPlugin({
            cache: true,
            parallel: true,
          }),
        ],
  },
  performance: {
    hints: !isDevelopment ? "warning" : false,
  },
  plugins: [new TSDocgenPlugin()],
  resolve: {
    extensions: [".ts", ".tsx", ".js", "jsx", ".json"],
    modules: [paths.srcPath, paths.packagesPath, "node_modules"],
  },
  target: "web",
}

export default base
