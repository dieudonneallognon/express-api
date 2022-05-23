const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const Task = require("../models/Task");

const httpRequest = require();

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

    beforeEach(async () => {
        await Task.remove();
        expect(await (await Task.find({})).length).toEqual(0);
    });

    test("Can add a new task to DB", async () => {
        const response = await request(app)
            .post("/api/tasks")
            .send({
                description: "Test",
                faite: true,
            })
            .expect("Content-Type", /json/);
        const { description, faite, id } = response.body.data;
        const res = await Task.findById(id);

        expect(JSON.stringify({ description, faite, id: id })).toMatch(
            JSON.stringify(response.body.data)
        );
    });
});
