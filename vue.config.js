let path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
//		assetsDir: 'baike',
		lintOnSave:false,
    // devServer: {
    //     open: true,
    //     host: 'localhost',
    //     port: 8080,
    //     https: false,
    //     //以上的ip和端口是我们本机的;下面为需要跨域的
    //     proxy: {//配置跨域
    //         '/api': {
    //             target: 'http://106.12.208.84:8080',//这里后台的地址模拟的;应该填写你们真实的后台接口
    //             ws: true,
    //             changOrigin: true,//允许跨域
    //             pathRewrite: {
    //                 '^/api': ''//请求的时候使用这个api就可以
    //             }
    //         }
    //
    //     }
    // },
	chainWebpack:(config)=>{
        config.resolve.alias
        .set('@',resolve('./src'))
        config.entry('main')
        .add('babel-polyfill');
        //set第一个参数：设置的别名，第二个参数：设置的路径
　　　　
    },
//  transpileDependencies: ["@ckeditor"],
    pwa: {
        iconPaths: {
            favicon32: './static/image/titlelogo.png',
            favicon16: './static/image/titlelogo.png',
            appleTouchIcon: './static/image/titlelogo.png',
            maskIcon: './static/image/titlelogo.png',
            msTileImage: './static/image/titlelogo.png'
        }
    }
}