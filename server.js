const mongoose = require("mongoose");

const app = require("./app");

app.listen(process.env.SERVER_PORT, process.env.SERVER_HOSTNAME, (req, res) => {
    console.log(
        `Serving on port ${process.env.SERVER_PORT} at host ${process.env.SERVER_HOSTNAME}`
    );

    mongoose
        .connect(
            `mongodb://${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}`
        )
        .then(() => {
            console.log("Server connected to database...");
        })
        .catch((err) => console.log(err));
});
