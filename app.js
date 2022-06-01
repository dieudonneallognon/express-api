const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");

require("dotenv").config();

const express = require("express");
const TaskValidator = require("./validators/TaskValidator");
const UserValidator = require("./validators/UserValidator");

const Task = require("./models/Task");
const User = require("./models/User");

const app = express();

app.use(express.json());

const isLoggedInMiddleware = async (req, res, next) => {
    try {
        const token = await Joi.object({
            token: Joi.string().min(3),
        })
            .concat(TaskValidator)
            .validateAsync({ token: req.headers["x-auth-token"], ...req.body });

        const loggedUser = await User.findOne(jwt.decode(token));

        if (loggedUser) {
            req.body.creePar = loggedUser._id.toString();
            next();
            return;
        }
        res.json({ error: "Unauthorized", status: 401 });
    } catch (err) {
        console.log(err);
        res.json({ error: err.message });
    }
};

app.get("/api/tasks", async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.json({ status: 200, data: tasks });
    } catch (err) {
        console.log(err);
        res.json({ error: "Internal Server error" });
    }
});

app.post("/api/tasks", isLoggedInMiddleware, async (req, res) => {
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

app.delete("/api/tasks/:id", isLoggedInMiddleware, async (req, res) => {
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

app.put("/api/tasks/:id", isLoggedInMiddleware, async (req, res) => {
    try {
        const value = await TaskValidator.validateAsync({
            ...req.body,
            id: req.params.id,
        });
        await Task.updateOne({ _id: req.params.id }, { ...req.body });
        res.json({ status: 201, data: { ...value, id: req.params.id } });
    } catch (err) {
        console.log(err);
        res.json({ error: err.message });
    }
});

app.post("/api/register", async (req, res) => {
    try {
        const value = await UserValidator.validateAsync(req.body);

        const user = await User.findOne({
            $or: [{ email: value.email }, { username: value.username }],
        });

        if (!user) {
            const response = {
                username: req.body.username,
                email: req.body.email,
            };

            await User.create({
                ...req.body,
                motdepasse: bcrypt.hashSync(req.body.motdepasse, 10),
            });

            res.json({
                status: 201,
                data: response,
            });
        } else {
            res.json({ message: "user email or username exists" });
        }
    } catch (err) {
        console.log(err);
        res.json({ error: err.message });
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const value = await Joi.object({
            email: Joi.string().email(),
            username: Joi.string().alphanum().min(3),
            motdepasse: Joi.string().min(3).required(),
        }).validateAsync(req.body);

        const user = await User.findOne({
            $or: [{ email: value?.email }, { username: value?.username }],
        });

        if (user && bcrypt.compareSync(value.motdepasse, user.motdepasse)) {
            const response = {
                username: req.body.username,
                email: req.body.email,
            };

            const token = jwt.sign(response, process.env.JWT_SECRET);

            res.json({ status: 200, data: { ...response, token: token } });
        } else {
            res.json({ message: "user credentials are invalid" });
        }
    } catch (err) {
        console.log(err);
        res.json({ error: err.message });
    }
});

module.exports = app;
