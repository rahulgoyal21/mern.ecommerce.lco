const express = require("express");

const app = express();

app.get("/", (req, res) => {
    return res.send("Hello i am there");
})


const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server started listening on PORT ${PORT}`);
})