const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    motdepasse: {
        type: String,
        required: true,
        trim: true,
    },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
