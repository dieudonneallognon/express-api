const mongoose = require("mongoose");

const app = require("./app");

app.listen(process.env.PORT || process.env.SERVER_PORT, (req, res) => {
    console.log(
        `Serving on port ${
            process.env.PORT || process.env.SERVER_PORT
        } at host ${process.env.SERVER_HOSTNAME}`
    );

    if (process.env.NODE_ENV === "development") {
        mongoose
            .connect(
                `mongodb://${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}`
            )
            .then(() => {
                console.log("Server connected to database...");
            })
            .catch((err) => console.log(err));
    } else {
        mongoose
            .connect(
                `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@express-api.mizhc.mongodb.net/?retryWrites=true&w=majority`
            )
            .then(() => {
                console.log("Server connected to database...");
            })
            .catch((err) => console.log(err));
    }
});
