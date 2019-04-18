const { configure } = require("@storybook/react")

const { packagesPath } = require("./../paths")

// const req = require.context(packagesPath, true, /.stories.tsx$/)

function loadStories() {
  require("./welcome")
  req.keys().forEach(req)
}

configure(loadStories, module)
