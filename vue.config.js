const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: '/',
  assetsDir: './',

  transpileDependencies: true,

  devServer: {
    port: 3000,
    historyApiFallback: true
  },

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
})
