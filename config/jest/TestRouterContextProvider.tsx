/**
 * This component provides the Router Context to our testing
 * component which depends on Routing i.e. using Route or Link components.
 */
import { createMemoryHistory, History } from "history"
import * as React from "react"
import { Router } from "react-router-dom"

class TestRouterContextProvider extends React.Component<{
  children: (
    {
      history: {},
    }
  ) => React.ReactNode
  history: History
  route: string
}> {
  private history: History
  constructor(props: any, context: any) {
    super(props, context)
    const { route = "/", history } = this.props
    this.history = history || createMemoryHistory({ initialEntries: [route] })
  }
  public render() {
    const { children } = this.props
    const history = this.history
    return <Router history={history}>{children({ history })}</Router>
  }
}

export default TestRouterContextProvider
