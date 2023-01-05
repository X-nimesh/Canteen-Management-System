const { FoodViewAll, FoodViewOne, FoodAdd, FoodUpdate } = require("../controller/FoodController");
const { uploadMiddleware } = require("../utils/fileUpload");
const protectedMiddleware = require("../utils/ProtectedMiddleware");
exports.FoodRoutes = (app) => {
    app.get("/food", FoodViewAll);
    app.get("/food/:fid", FoodViewOne);
    app.post('/food', protectedMiddleware, uploadMiddleware.single('foodImage'),
        FoodAdd);
    app.post('/food/:fid', protectedMiddleware, uploadMiddleware.single('foodImage'),
        FoodUpdate);
}