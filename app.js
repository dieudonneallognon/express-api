require("dotenv").config();

const express = require("express");
const Task = require("./models/Task");

const TaskValidator = require("./validators/TaskValidator");

const app = express();

app.use(express.json());

app.get("/api/tasks", async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.json({ status: 200, data: tasks });
    } catch (err) {
        console.log(err);
        res.json({ error: "Internal Server error" });
    }
});

app.post("/api/tasks", async (req, res) => {
    try {
        const value = await TaskValidator.validateAsync(req.body);
        const { _id } = await Task.create(value);
        res.json({ status: 201, data: { ...value, id: _id } });
    } catch (err) {
        console.log(err);
        res.json({ error: err.message });
    }
});

app.get("/api/tasks/:id", async (req, res) => {
    try {
        const { description, id, faite } = await Task.findById(req.params.id);
        res.json({ status: 200, data: { description, id, faite } });
    } catch (err) {
        console.log(err);
        res.json({ error: err.message });
    }
});

app.delete("/api/tasks/:id", async (req, res) => {
    try {
        await Task.deleteOne({
            id: req.params.id,
        });
        res.json({ status: 202 });
    } catch (err) {
        console.log(err);
        res.json({ error: err.message });
    }
});

module.exports = app;
