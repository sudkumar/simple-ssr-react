const { storiesOf } = require("@storybook/react")
const React = require("react")

const stories = storiesOf("Welcome", module)

stories.add("Welcome", () => <div>Welcome to stories.</div>)
