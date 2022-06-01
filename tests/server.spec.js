const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const Task = require("../models/Task");
const User = require("../models/User");

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

        expect(JSON.stringify({ description, faite, id: id })).toMatch(
            JSON.stringify(response.body.data)
        );
    });

    test("Can update a task in DB", async () => {
        const task = await Task.create({
            description: "Test",
            faite: true,
        });

        const response = await request(app)
            .put("/api/tasks/" + task._id)
            .send({
                description: "Test2",
                faite: false,
            })
            .expect("Content-Type", /json/);

        const { description, faite, id } = response.body.data;

        expect(JSON.stringify({ description, faite, id: id })).toMatch(
            JSON.stringify(response.body.data)
        );
    });
});

describe("Testing User CRUD", () => {
    beforeEach(async () => {
        await User.remove();
        expect(await (await User.find({})).length).toEqual(0);
    });

    test("User can register", async () => {
        const response = await request(app)
            .post("/api/register")
            .send({
                email: "Rupert_Monahan@gmail.com",
                username: "Kristina",
                motdepasse: "root",
            })
            .expect("Content-Type", /json/);
        const { username, email, token } = response.body.data;

        expect(JSON.stringify({ username, email, token })).toMatch(
            JSON.stringify(response.body.data)
        );
    });
});
