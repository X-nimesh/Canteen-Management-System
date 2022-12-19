const Joi = require("joi");
const signup = Joi.object({
    userId: Joi.number().required(),
    foodId: Joi.number().required(),
    quantity: Joi.number().min(6).max(50).required(),
    status: Joi.string().required().valid("pending", "complete", "cancelled", "rejected", "accepted")
});

module.exports = { signup };