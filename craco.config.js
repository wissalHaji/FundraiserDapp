const path = require("path");

module.exports = {
  webpack: {
    alias: {
      assets: path.resolve(__dirname, "./src/template/assets"),
      template: path.resolve(__dirname, "./src/template"),
    },
  },
};
