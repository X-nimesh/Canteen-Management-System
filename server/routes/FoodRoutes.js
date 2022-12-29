const { FoodViewAll, FoodViewOne, FoodAdd } = require("../controller/FoodController");
const { uploadMiddleware } = require("../utils/fileUpload");

exports.FoodRoutes = (app, passport) => {
    let nimesh = 'hey';
    app.get("/food", FoodViewAll);
    app.get("/food/:fid", FoodViewOne);
    app.post('/food', passport.authenticate("jwt", { session: false }), uploadMiddleware.single('foodImage'),
        FoodAdd)
}