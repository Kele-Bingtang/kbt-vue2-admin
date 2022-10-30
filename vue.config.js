const { defineConfig } = require("@vue/cli-service");

const port = process.env.port || 8097; // dev port

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  devServer: {
    host: "localhost",
    port: port,
    open: true,
    // before: require('./mock/mock-server.js')
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/styles/index.scss";`,
      },
    },
  },
});
