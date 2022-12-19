const { FoodViewAll, FoodViewOne, FoodAdd } = require("../services/FoodService");
const { uploadMiddleware } = require("../utils/fileUpload");

const auth = (passport) => {
    let auth = passport.authenticate("jwt", { session: false });
    console.log(auth);
}
const FoodController = (app, passport) => {

    app.get("/food", FoodViewAll)
        .get("/food/:fid", FoodViewOne);
    // passport.authenticate("jwt", { session: false });
    auth(passport);
    app.post('/food',
        passport.authenticate("jwt", { session: false }),
        uploadMiddleware.single('foodImage'),
        FoodAdd)
}

module.exports = FoodController;
//q: formula for schrodinger equation


