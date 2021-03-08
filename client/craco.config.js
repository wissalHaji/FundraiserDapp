const path = require("path");

module.exports = {
  webpack: {
    alias: {
      assets: path.resolve(__dirname, "./src/template/assets"),
      components: path.resolve(__dirname, "./src/template/components"),
      template: path.resolve(__dirname, "./src/template"),
    },
  },
};
