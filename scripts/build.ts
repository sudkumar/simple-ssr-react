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

import staticConf from "./../config/webpack/static"
const paths = require("./../config/paths")

const compiler = webpack(staticConf)

function copyPublicFolder() {
  console.log("Copying static assets to " + paths.appClientBuild + " folder.")
  fs.copySync(paths.appPublic, paths.appBuild, {
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
      console.log(
        stats.toString({
          chunks: false,
          colors: true,
        })
      )
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
