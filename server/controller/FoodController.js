const { FoodViewAll, FoodViewOne } = require("../services/FoodService");

const FoodController = (app, passport) => {
    app.get("/food", FoodViewAll)
        .get("/food/:fid", FoodViewOne)
        .post('/food',
            passport.authenticate("jwt", { session: false }),
            FoodAdd)
}
module.exports = FoodController;
