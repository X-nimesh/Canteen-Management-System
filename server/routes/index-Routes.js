
const { BillRoute } = require("./BillRoutes");
const { userRoutes } = require("./UserRoutes");
const { FoodRoutes } = require("./FoodRoutes");
const { OrderRoutes } = require("./OrderRoutes");

const Routes = (app) => {
    FoodRoutes(app);
    userRoutes(app);
    OrderRoutes(app);
    BillRoute(app);
}
module.exports = Routes;