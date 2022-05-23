require("dotenv").config();

const mongoose = require("mongoose");

const express = require("express");
const Task = require("./models/Task");

const app = express();

app.get("/api/tasks", async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.json({ status: 200, data: tasks });
    } catch (err) {
        console.log(err);
        res.json({ status: 505, error: "Internal Server error" });
    }
});

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
