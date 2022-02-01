/* eslint-disable @typescript-eslint/no-var-requires */
const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = (req, res) => {
    let target = ""

    // 处理代理目标地址
    if (req.url.startsWith("/sf")) {
        target = "https://c.rcex.live:8/"
    }
    if (req.url.startsWith("/gist")) {
        target = "https://gist.githubusercontent.com/"
    }

    // 创建代理对象并转发请求
    createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: {
            "^/api": "",
            "/gist": "",
        },
    })(req, res)
}
