const withSass = require("@zeit/next-sass");
const withCss = require("@zeit/next-css");

require("dotenv").config();

module.exports = withSass(withCss({
  cssModules: true,
  env: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN
  }
}));
