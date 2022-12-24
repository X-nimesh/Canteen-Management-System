
const { BillRoute } = require("./BillRoutes");
const { userRoutes } = require("./UserRoutes");
const { FoodRoutes } = require("./FoodRoutes");
const { OrderRoutes } = require("./OrderRoutes");

const Routes = (app, passport) => {
    FoodRoutes(app, passport);
    userRoutes(app, passport);
    OrderRoutes(app, passport);
    BillRoute(app, passport);
}
module.exports = Routes;