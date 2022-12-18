const Joi = require("joi");
const signup = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(50).required(),
    role: Joi.string().required().valid("admin", "employee", "user")
});

module.exports = { signup };