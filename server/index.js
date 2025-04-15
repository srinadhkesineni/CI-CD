const express = require("express")
const webhooks = require("./webhooks")
const app = express()
app.use(express.json())

app.use("/webhook", webhooks)

app.listen(3000, ()=>{
    console.log("App is listening on the port 3000");
})