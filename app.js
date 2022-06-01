const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const cors = require("cors");

require("dotenv").config();

const express = require("express");
const TaskValidator = require("./validators/TaskValidator");
const UserValidator = require("./validators/UserValidator");

const Task = require("./models/Task");
const User = require("./models/User");

const app = express();

app.use(
    cors({
        exposedHeaders: "x-auth-token",
    })
);
app.use(express.json());

const isLoggedInMiddleware = async (req, res, next) => {
    try {
        const data = await Joi.object({
            token: Joi.string().min(3),
        })
            .concat(TaskValidator)
            .validateAsync({ token: req.headers["x-auth-token"], ...req.body });

        const loggedUser = await User.findOne(jwt.decode(data.token));

        if (loggedUser) {
            req.body.creePar = loggedUser._id.toString();
            next();
            return;
        }
        res.status(401).json({ error: "Unauthorized", status: 401 });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message, status: 500 });
    }
};

const isAuthorMiddleware = async (req, res, next) => {
    try {
        const { token } = await Joi.object({
            token: Joi.string().min(3),
            id: Joi.string().min(3),
        }).validateAsync({ token: req.headers["x-auth-token"], ...req.params });

        const user = await User.findOne(jwt.decode(token));
        const task = await Task.findById(req.params.id);

        if (task?.creePar.toString() === user?._id.toString()) {
            req.body.creePar = user._id.toString();
            next();
            return;
        }
        res.status(401).json({ error: "Unauthorized", status: 401 });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message, status: 500 });
    }
};

app.get("/", async (req, res) => {
    res.status(200).json({ status: 200, data: "Hello World!" });
});

app.get("/api/tasks", async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.status(200).json({ status: 200, data: tasks });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message, status: 500 });
    }
});

app.post("/api/tasks", isLoggedInMiddleware, async (req, res) => {
    try {
        const value = await TaskValidator.validateAsync(req.body);
        const { _id } = await Task.create(value);
        res.status(201).json({ status: 201, data: { ...value, id: _id } });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message, status: 500 });
    }
});

app.get("/api/tasks/:id", async (req, res) => {
    try {
        const { description, id, faite } = await Task.findById(req.params.id);
        res.status(200).json({ status: 200, data: { description, id, faite } });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message, status: 500 });
    }
});

app.delete("/api/tasks/:id", isAuthorMiddleware, async (req, res) => {
    try {
        const task = await Task.deleteOne({
            id: req.params.id,
            creePar: req.body.creePar,
        });

        res.status(201).json({ status: 201, data: task });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message, status: 500 });
    }
});

app.put("/api/tasks/:id", isAuthorMiddleware, async (req, res) => {
    try {
        const value = await TaskValidator.validateAsync({
            ...req.body,
            id: req.params.id,
        });

        await Task.updateOne({ _id: req.params.id }, { ...req.body });
        res.status(201).json({
            status: 201,
            data: { ...value, id: req.params.id },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message, status: 500 });
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

            res.status(201).json({
                status: 201,
                data: response,
            });
        } else {
            res.status(403).json({ message: "user email or username exists" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message, status: 500 });
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
                username: user.username,
                email: user.email,
            };

            const token = jwt.sign(
                { ...response, id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.status(200).json({
                status: 200,
                data: { ...response, token: token },
            });
            return;
        }
        res.status(404).json({
            status: 404,
            message: "user credentials are invalid",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message, status: 500 });
    }
});

app.get("/api/user/account", async (req, res) => {
    try {
        const { token } = await Joi.object({
            token: Joi.string().min(3),
        }).validateAsync({ token: req.headers["x-auth-token"] });

        const { email, _id, username } = await User.findOne(jwt.decode(token));
        res.status(200).json({
            status: 200,
            data: { id: _id, email, username },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message, status: 500 });
    }
});

module.exports = app;
