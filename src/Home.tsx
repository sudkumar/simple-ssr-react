import { Button } from "components"
import * as React from "react"
import Helmet from "react-helmet-async"
import Styled from "styled-components"
import { Heading } from "typography"

const H2 = Styled(Heading)`
  color: green
`

export function Home() {
  return (
    <div>
      <Helmet>
        <title>Hello World</title>
      </Helmet>
      <H2 level={2}>Home page</H2>
      <Button>This is sample Button</Button>
    </div>
  )
}

export default Home
