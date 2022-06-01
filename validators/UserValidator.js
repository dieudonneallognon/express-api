const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const UserValidator = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().alphanum().required().min(3),
    id: Joi.objectId(),
    motdepasse: Joi.string().required().min(3),
});

module.exports = UserValidator;
