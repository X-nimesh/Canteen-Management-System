const Joi = require("joi");
const signup = Joi.object({
    userId: Joi.number().required(),
    foodId: Joi.number().required(),
    quantity: Joi.number().min(6).max(50).required(),
    status: Joi.string().required().valid("pending", "complete", "cancelled", "rejected", "accepted")
});
const statusChange = Joi.object({
    status: Joi.string().required().valid("pending", "complete", "cancelled", "rejected", "accepted"),
    oid: Joi.number().required()
});
const statusChangeByUser = Joi.object({
    status: Joi.string().required().valid("cancelled"),
    oid: Joi.number().required()
});
module.exports = { signup, statusChange, statusChangeByUser };