/**
 * This file contains the paths configuration for our application
 */
const fs = require("fs-extra")
const path = require("path")
const url = require("url")

// app root directory
const appDirectory = fs.realpathSync(process.cwd())
// resolve any path relative to app root
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)
// public url from env if set
// for development, set it to the root "/"
const envPublicUrl =
  process.env.NODE_ENV === "development" ? "/" : process.env.PUBLIC_URL

function ensureSlash(p, needsSlash) {
  const hasSlash = p.endsWith("/")
  if (hasSlash && !needsSlash) {
    return p.substr(0, p.length - 1)
  } else if (!hasSlash && needsSlash) {
    return `${p}/`
  } else {
    return p
  }
}

const getPublicUrl = (appPackageJson) =>
  envPublicUrl || require(appPackageJson).homepage

// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can"t use a relative path in HTML because we don"t want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson)
  const servedUrl =
    envPublicUrl || (publicUrl ? new url.URL(publicUrl).pathname : "/")
  return ensureSlash(servedUrl, true)
}

const appBuild = resolveApp("build")
const appClientBuild = resolveApp("build/public")
const appServerBuild = resolveApp("build")
const appPath = resolveApp(".")
const appPublic = resolveApp("public")
const publicUrl = getPublicUrl(resolveApp("package.json"))
const servedPath = getServedPath(resolveApp("package.json"))
const srcPath = resolveApp("src")
const packagesPath = resolveApp("packages")
const clientPath = resolveApp("src/client.tsx")
const serverPath = resolveApp("src/server.tsx")
const appHtml = resolveApp("public/index.html")

module.exports = {
  appClientBuild,
  appBuild,
  appHtml,
  appServerBuild,
  appDirectory,
  appPath,
  appPublic,
  clientPath,
  packagesPath,
  publicUrl,
  servedPath,
  serverPath,
  srcPath,
}
