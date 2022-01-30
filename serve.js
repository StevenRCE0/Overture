const express = require("express")
const app = express()
const port = process.env.PORT || 8080
const path = require("path")
const target = require("express-http-proxy")

app.use("/sf", target("https://c.rcex.live:8/sf", {
    forwardPath: (req, res) => {
        return '/sf' + require("url").parse(req.url).path
    }
}))
app.use(express.static("public"))
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"))
})
app.listen(port, () => {
    console.log(`Server is up at port ${port}`)
})
