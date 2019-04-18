import { Card } from "layouts"
import * as React from "react"
import Helmet from "react-helmet-async"
import Styled from "styled-components"

const H2 = Styled.h2`
  background: pink
`

export function About() {
  return (
    <div>
      <Helmet>
        <title>About page for my site</title>
      </Helmet>
      <H2>About</H2>
      <Card>This is a card layout</Card>
    </div>
  )
}

export default About
