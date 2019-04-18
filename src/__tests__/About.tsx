import * as React from "react"
import { HelmetProvider } from "react-helmet-async"
import { render } from "react-testing-library"
import About from "./../About"

/**
 * This is how we write test for our component.
 * Only write tests that gives you confidence for your code.
 * Avoid testing implementation details. Test the functionality.
 *
 * The bellow test is useless other then successfully rendering.
 */
describe("About Page", () => {
  it("Should render without crashing", () => {
    const { getByText } = render(
      <HelmetProvider>
        <About />
      </HelmetProvider>
    )
    expect(getByText("About")).toBeDefined()
  })
})
