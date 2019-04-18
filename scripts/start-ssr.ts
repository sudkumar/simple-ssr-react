/**
 * This script is used to start the development process.
 * For the development, we have hot module replacement for a better development experience.
 */

// MAKE SURE WE ARE IN THE DEVELOPMENT ENVIRONMENT AND EVERY BODY KNOWS IT
process.env.NODE_ENV = "development"
process.env.BABEL_ENV = "development"

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", (err, p) => {
  console.error("Unhandled Rejection at:", p, "reason:", err)
  throw err
})

import express from "express"
import webpack from "webpack"
import webpackDevMiddleware from "webpack-dev-middleware"
import webpackHotMiddleware from "webpack-hot-middleware"

// these are not typescript friendly, so we need to import in this way
const webpackHotServerMiddleware = require("webpack-hot-server-middleware")
const open = require("opn")

const { appPublic, publicUrl, servedPath } = require("./../config/paths")
import webpackConfig from "./../config/webpack/ssr"

/**
 * App
 * @type ExpressApp
 *
 * Create an instance of express application which will be responsible for handling the request for our server
 */
const app = express()

/**
 * Static Middleware
 * @types ExpressMiddleware
 *
 * Static middleware is responsible for serving our static assets like favicon.icon, mainfest.json from `appPublic`
 * folder
 */
const staticMiddleware = express.static(appPublic)
app.use(staticMiddleware)

/**
 * Compiler
 * @type webpackCompiler
 *
 * Create a webpack compiler. This is a node api provided by webpack. It let's us compile and get the stats for further usages
 * two apis are exposed for compiler
 * `compiler.run` and `compiler.watch`.
 * We are using webpackDevMiddleware which takes this compiler and calls `compiler.watch|run` to run the in watch mode
 */
const compiler: webpack.MultiCompiler = webpack(webpackConfig)

// we need to FOLLOW THE ORDER of these middlewares

/**
 * Webpack Development Middleware
 * @type ExpressMiddleware
 *
 * This middleware is responsible for running our compiler in watch mode and adding stats for `response` params of a
 * request. Compiler stats are attached to `response.local.webpackStats` and the memory file system is attached to
 * `response.locals.fs`
 */
const devMiddleware = webpackDevMiddleware(compiler, {
  publicPath: servedPath,
  serverSideRender: true,
})
app.use(devMiddleware)

/**
 * Webpack Hot Client Middleware
 * @type ExpressMiddleware
 *
 * This middleware is responsible for creating a connection for hot module replacement for our client bundle. We will
 * only pass the cliend compiler to it
 */
const clientCompiler = compiler.compilers.find(
  (compiler) => compiler.name === "client"
)
if (clientCompiler) {
  const hotClientMiddleware = webpackHotMiddleware(clientCompiler)
  app.use(hotClientMiddleware)
} else {
  console.warn(
    "Compiler with name `client` not found. Skipping `webpack-hot-middleware`"
  )
}

// NOTE: webpack-hot-middleware needs to be mounted before webpack-hot-server-middleware to

/**
 * Webpack Hot Server Middleware
 * @type ExpressMiddleware
 *
 * This middleware add the HMR to our server rendering. After the `devMiddleware` finished compiling assets, this
 * middleware will get the serverFile with `chunkName` specified and will call our server file's exported middleware.
 */
const hotServerMiddleware = webpackHotServerMiddleware(compiler, {
  chunkName: "main",
  serverRendererOptions: {
    publicUrl,
  },
})
app.use(hotServerMiddleware)

// if this is the main module, means used as the direct call, start the application
if (require.main === module) {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Application is running at http://localhost:${PORT}`)
    console.log("  Press CTRL-C to stop\n")
    open(`http://localhost:${PORT}`)
  })
}
// export the app as default
export default app
