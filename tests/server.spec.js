const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const Task = require("../models/Task");

mongoose
    .connect(
        `mongodb://${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}`
    )
    .catch((err) => console.log(err));

describe("Testing Task CRUD", () => {
    test("Serve the list of tasks", async () => {
        const tasks = await Task.find({});

        const response = await request(app).get("/api/tasks");

        expect(JSON.stringify(response.body.data)).toEqual(
            JSON.stringify(tasks)
        );
    });
});
