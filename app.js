require("dotenv").config();

const express = require("express");

const app = express();

app.listen(process.env.SERVER_PORT, process.env.SERVER_HOSTNAME, (req, res) => {
    console.log(
        `Serving on port ${process.env.SERVER_PORT} at host ${process.env.SERVER_HOSTNAME}`
    );
});
