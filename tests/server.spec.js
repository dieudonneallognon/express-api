const mongoose = require("mongoose");
const app = require("../app");

mongoose
    .connect(
        `mongodb://${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}`
    )
    .catch((err) => console.log(err));

describe("Testing Jest and Supertest is working", () => {
    it("Works !", () => {});
});
