// const { FoodViewAll, FoodViewOne, FoodAdd } = require("../services/FoodService");
// const { uploadMiddleware } = require("../utils/fileUpload");

// const auth = (passport) => {
//     let auth = passport.authenticate("jwt", { session: false });
//     console.log(auth);
// }
// const FoodController = (app, passport) => {

//     app.get("/food", FoodViewAll)
//         .get("/food/:fid", FoodViewOne);
//     // passport.authenticate("jwt", { session: false });
//     auth(passport);
//     app.post('/food',
//         passport.authenticate("jwt", { session: false }),
//         uploadMiddleware.single('foodImage'),
//         FoodAdd)
// }


const { FoodMenu } = require('../models/FoodMenu');
const { AllFood, getByFid, FoodAdd, FoodUpdateService } = require('../services/FoodService');
const { auth } = require('../utils/Auth');


require('dotenv').config({ path: './.dev.env' });

exports.FoodViewAll = async (req, res, next) => {
    try {
        const products = await AllFood();
        return res.status(200).json(products);
        // return products;
    } catch (err) {
        next(err);
    }
}
exports.FoodViewOne = async (req, res, next) => {
    try {
        const product = await getByFid(req.params.fid);
        // FoodMenu.findAll({ where: { Fid: req.params.fid } });

        if (product.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json(product);
    } catch (err) {
        next(err);
    }
}
exports.FoodAdd = async (req, res, next) => {
    try {
        if (!auth(req, res)) {
            return
        }
        const product = await FoodAdd(req);
        // const product = await FoodMenu.create({
        //     name: req.body.name,
        //     price: req.body.price,
        //     description: req.body.description,
        //     image: req.file.filename,
        //     quantity: req.body.quantity
        // });
        return res.status(201).json({
            message: "Product added successfully",
        });
    } catch (err) {
        next(err);
    }
}
exports.FoodUpdate = async (req, res, next) => {
    try {

        if (!auth(req, res)) {
            return
        }
        const product = await FoodUpdateService(req, req.params.fid);

        return res.status(201).json(
            {
                message: "Product updated successfully",
            }
        );
    } catch (err) {
        next(err);
    }
}



