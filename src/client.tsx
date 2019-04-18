/**
 * Client side root entry for our application
 */
import * as React from "react"
import * as ReactDOM from "react-dom"
import { HelmetProvider } from "react-helmet-async"
import { setConfig } from "react-hot-loader"
import { BrowserRouter } from "react-router-dom"

setConfig({ logLevel: "no-errors-please" })

import App from "./App"

const app = (
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>
)
const root = document.getElementById("app")

if (window.__SSR__) {
  ReactDOM.hydrate(app, root)
} else {
  ReactDOM.render(app, root)
}
