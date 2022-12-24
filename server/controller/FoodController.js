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
const { auth } = require('../utils/Auth');

require('dotenv').config({ path: './.dev.env' });

exports.FoodViewAll = async (req, res, next) => {
    try {
        const products = await FoodMenu.findAll();
        return res.status(200).json(products);
        // return products;
    } catch (err) {
        next(err);
    }
}
exports.FoodViewOne = async (req, res, next) => {
    try {
        const product = await FoodMenu.findAll({ where: { Fid: req.params.fid } });

        if (product.length() === 0) {
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
        const product = await FoodMenu.create({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image: req.file.filename,
            quantity: req.body.quantity
        });
        return res.status(201).json(product);
    } catch (err) {
        next(err);
    }
}
exports.FoodUpdate = async (req, res, next) => {
    try {
        auth(req, res);
        const product = await FoodMenu.update({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image: req.file.filename
        }, { where: { Fid: req.params.fid } });
        return res.status(201).json(product);
    } catch (err) {
        next(err);
    }
}

//q: formula for schrodinger equation


