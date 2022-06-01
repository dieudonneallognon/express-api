const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../app");
const Task = require("../models/Task");
const User = require("../models/User");

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
        await User.remove();
    });

    const testTask = {
        description: "Test",
        faite: true,
    };

    const testCredentials = {
        email: "Rupert_Monahan@gmail.com",
        username: "Kristina",
        motdepasse: "root",
    };

    test("Can add a new task to DB", async () => {
        await User.create(testCredentials);

        const response = await request(app)
            .post("/api/tasks")
            .set(
                "x-auth-token",
                jwt.sign(
                    {
                        email: testCredentials.email,
                        username: testCredentials.username,
                    },
                    process.env.JWT_SECRET
                )
            )
            .send(testTask)
            .expect("Content-Type", /json/);
        const { description, faite } = response.body.data;

        expect({ description, faite }).toEqual(testTask);
    });

    test("Can update a task in DB", async () => {
        const user = await User.create({
            motdepasse: "root",
            email: "Keshaun_Altenwerth@yahoo.com",
            username: "Geraldine_Johns",
        });

        testTask.creePar = user._id.toString();
        testTask.description = "Test2";
        testTask.faite = false;

        const { description, faite, creePar, _id, ...ignore } =
            await Task.create(testTask);

        const response = await request(app)
            .put(`/api/tasks/${_id + ""}`)
            .set(
                "x-auth-token",
                jwt.sign(
                    {
                        email: "Keshaun_Altenwerth@yahoo.com",
                        username: "Geraldine_Johns",
                    },
                    process.env.JWT_SECRET
                )
            )
            .send(testTask)
            .expect("Content-Type", /json/);

        expect(response.body.data).toEqual({ ...testTask, id: _id + "" });
    });
});

describe("Testing User CRUD", () => {
    beforeAll(async () => {
        await User.remove();
        expect(await (await User.find({})).length).toEqual(0);
    });

    const testCredentials = {
        email: "Rupert_Monahan@gmail.com",
        username: "Kristina",
        motdepasse: "root",
    };

    test("User can register", async () => {
        const response = await request(app)
            .post("/api/register")
            .send(testCredentials)
            .expect("Content-Type", /json/);
        const { motdepasse, ...keep } = testCredentials;

        expect(response.body.data).toEqual(keep);
    });

    test("User can login", async () => {
        const response = await request(app)
            .post("/api/login")
            .send(testCredentials)
            .expect("Content-Type", /json/);

        const { username, email } = jwt.decode(response.body.data.token);
        const { motdepasse, ...keep } = testCredentials;

        expect({ username, email }).toEqual(keep);
    });
});
