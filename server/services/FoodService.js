const { FoodMenu } = require('../models/FoodMenu');
const jwt = require("jsonwebtoken");

require('dotenv').config({ path: './.dev.env' });
const auth = async (req) => {
    const token = req.headers.authorization.split(" ")[1];
    let userDet = jwt.verify(token, process.env.SECRET_KEY);
    if (!(userDet.role === "employee" || userDet.role === "admin")) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}
exports.FoodViewAll = async (req, res, next) => {
    try {
        const products = await FoodMenu.findAll();
        console.log(products);
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
        auth(req);
        const product = await FoodMenu.create({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image: req.file.filename
        });
        return res.status(201).json(product);
    } catch (err) {
        next(err);
    }
}
exports.FoodUpdate = async (req, res, next) => {
    try {
        auth(req);
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
