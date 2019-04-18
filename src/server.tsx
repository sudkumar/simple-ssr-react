/**
 * This file contains the server side rendering middleware
 */
import express from "express"
import * as React from "react"
import { renderToNodeStream, renderToStaticMarkup } from "react-dom/server"
import { HelmetProvider } from "react-helmet-async"
import { StaticRouter } from "react-router"
import { ServerStyleSheet } from "styled-components"

import App from "./App"

// This middleware should be envoked with the stats for js/css assets and publicUrl
export default function createHtmlMiddleware({
  clientStats,
  publicUrl,
}: {
  clientStats: { assetsByChunkName: { [key: string]: string | string[] } }
  publicUrl: string
}) {
  // { main: [Array]} stats from webpack
  const assetsByChunkName = clientStats.assetsByChunkName
  const handler: express.RequestHandler = (req, res) => {
    // set the content type
    res.setHeader("Content-Type", "text/html; charset=utf-8")
    /**
     * We need to pass the context to the StaticRouter so that we can be notified for any redirection
     * or status for response
     */
    const routerContext: { url?: string } = {}
    /**
     * react-helmet-async usage context to fix the issue of react-side-effects created by react-helmet by
     * creating an instance per request
     */
    const helmetContext: {
      helmet?: { [key: string]: { toString: () => string } }
    } = {}

    /**
     * Our application
     * We will match it with the `src/client.tsx` with different component like BrowserRouter instead of StaticRouter
     * for any interactivity
     */
    const app = (
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={req.url} context={routerContext}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    )
    /**
     * Styled component will add it's styled for the streamed app
     */
    const sheet = new ServerStyleSheet()
    const jsx = sheet.collectStyles(app)

    /**
     * There are few things in the render process that requires the parsing of React tree e.g. react-helpmet-async,
     * so we only render it as a static markup which is less expensive then renderToString
     * This way, our router will also know for any redirection. We can use this to handle the data fetching like
     * react-apollo#getDataFromTree does for our state initialization
     */
    renderToStaticMarkup(jsx)

    // check for redirection in process
    if (routerContext.url) {
      res.redirect(301, routerContext.url)
      res.end()
      return
    }

    // get the helmet content
    const { helmet } = helmetContext

    res.status(200)
    // start by sending the head and initial body content
    res.write(`
        <!doctype html>
        <html lang="en" ${helmet ? helmet.htmlAttributes.toString() : ""}>
          <head>
						<meta charset="utf-8">
						<link rel="shortcut icon" href="${publicUrl}favicon.ico">
						<meta name="description" content="This is a simple example for server side rendering an react application">
						<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
						<meta name="theme-color" content="#000000">
						<link rel="manifest" href="${publicUrl}manifest.json">
            ${helmet && helmet.title.toString()}
            ${helmet && helmet.meta.toString()}
            ${helmet && helmet.link.toString()}
          </head>
          <body ${helmet && helmet.bodyAttributes.toString()}>
            <div id="app">`)

    const stream = sheet.interleaveWithNodeStream(renderToNodeStream(jsx))
    stream.pipe(
      res,
      { end: false }
    )
    // one end, send the closing scripts
    stream.on("end", () => {
      res.end(`</div>
        <script>
            window.__SSR__ = true
        </script>
        ${Object.keys(assetsByChunkName)
          .reduce((paths: string[], key: string) => {
            const newPaths: string | string[] = assetsByChunkName[key]
            if (typeof newPaths === "string") {
              paths.push(newPaths)
            } else if (Array.isArray(newPaths)) {
              paths = paths.concat(newPaths)
            }
            return paths
          }, [])
          .filter((path) => path.endsWith(".js"))
          .map((path) => `<script src="${path}"></script>`)
          .join("\n")}
        </body>
      </html>
        `)
    })
  }
  return handler
}
