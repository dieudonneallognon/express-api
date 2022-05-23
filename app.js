require("dotenv").config();

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

module.exports = app;
