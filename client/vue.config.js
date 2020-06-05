const path = require('path')

module.exports = {
    css: {
        loaderOptions: {
          sass: {
            prependData: `
            @import "@/scss/_common.scss";
            `
          }
        }
    },
    outputDir: path.resolve(__dirname, '../server/public'),
    devServer: {
        proxy : 'https://192.168.0.199:3000/',
    },
}