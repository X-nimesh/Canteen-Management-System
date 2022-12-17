const FoodController = require("./FoodController");

const controllers = async (app, passport) => {
    app.get("/", (req, res, next) => {
        res.send("This is Canteeen management system api");
    });
    FoodController(app, passport);

}
module.exports = controllers;