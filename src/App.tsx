/**
 * Application root
 * This is used by both our client and server renders
 */
import * as React from "react"
import { hot } from "react-hot-loader"
import { Link, Route, Switch } from "react-router-dom"

import About from "./About"
import Home from "./Home"

export function App() {
  return (
    <div>
      <h1>This is our website</h1>
      <Link to="/">Hom</Link>
      <Link to="/about">About</Link>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/about" exact component={About} />
      </Switch>
    </div>
  )
}
export default hot(module)(App)
