const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const TaskValidator = Joi.object({
    description: Joi.string().min(3).required(),
    faite: Joi.boolean().required(),
    id: Joi.objectId(),
});

module.exports = TaskValidator;
