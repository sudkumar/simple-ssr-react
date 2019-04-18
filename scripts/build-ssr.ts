/**
 * This script is used to create our production build
 */

// MAKE SURE WE ARE IN THE PRODUCTION ENVIRONMENT AND EVERY BODY KNOWS IT
process.env.NODE_ENV = "production"
process.env.BABEL_ENV = "production"

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", (err, p) => {
  console.error("Unhandled Rejection at:", p, "reason:", err)
  throw err
})

import fs from "fs-extra"
import webpack from "webpack"

import webpackConfig from "./../config/webpack/ssr"
import serverRenderer from "./../src/server"

const compiler = webpack(webpackConfig)
const paths = require("./../config/paths")

function copyPublicFolder() {
  console.log("Copying static assets to " + paths.appClientBuild + " folder.")
  fs.copySync(paths.appPublic, paths.appClientBuild, {
    dereference: true,
    filter: (file: string) => !!file,
  })
}

function clean(path: string) {
  fs.emptyDirSync(path)
}

function compile(): Promise<webpack.Stats> {
  console.log(`Creating build...`)
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err)
      }
      resolve(stats)
    })
  })
}

function main() {
  return Promise.resolve()
    .then(() => {
      // clean the directories used by build
      clean(paths.appBuild)
      // copy the folder
      copyPublicFolder()
      return compile()
    })
    .then((stats: webpack.Stats) => {
      const assetsByChunkName = stats.toJson().assetsByChunkName
      // const outputPath = stats.toJson().outputPath
      console.log(
        stats.toString({
          chunks: false,
          colors: true,
        })
      )
      serverRenderer({
        clientStats: { assetsByChunkName },
        publicUrl: paths.publicUrl,
      })
      console.log("Compiled successfully")
    })
    .catch((error) => {
      throw error
    })
}

if (require.main === module) {
  main()
}

export default main
