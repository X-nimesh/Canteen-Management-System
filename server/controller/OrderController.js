// const { OrderViewAll, OrderViewbyOid, OrderAdd, OrderViewbyUid } = require("../services/OrderService");

// exports.OrderController = async (app, passport) => {
//     app.get("/order", passport.authenticate("jwt", { session: false }), OrderViewAll)
//         .get("/order/:oid", passport.authenticate("jwt", { session: false }), OrderViewbyOid)
//         .get("/order/user/:uid", passport.authenticate("jwt", { session: false }), OrderViewbyUid)
//         .post("/order", passport.authenticate("jwt", { session: false }), OrderAdd)
//     // .put("/order/:oid", passport.authenticate("jwt", { session: false }), OrderUpdate)
//     // .delete("/order/:oid", passport.authenticate("jwt", { session: false }), OrderDelete);
// }

const OrderTable = require('../models/OrderTable');
const { OrderItemTable } = require('../models/OrderItem');
const jwt = require("jsonwebtoken");
const { auth } = require('../utils/Auth');
const { db } = require('../config/db_config');
const { FoodMenu } = require('../models/FoodMenu');
const { FoodDecrease } = require('../services/FoodService');
const Joi = require('joi');
const { statusChange } = require('../validator/orderValidator');
exports.OrderViewAll = async (req, res, next) => {
    try {
        const orders = await OrderTable.findAll();
        res.status(200).json(orders);
    }
    catch (err) {
        next(err)
    }
}
exports.OrderViewbyOid = async (req, res, next) => {
    try {
        if (!auth(req, res)) {
            return
        }
        const orders = await OrderTable.findAll({
            where: {
                orderId: req.params.oid
            }
        });
        return res.status(200).json(orders);
    }
    catch (err) {
        next(err)
    }
}
exports.OrderViewbyUid = async (req, res, next) => {
    try {
        let userDet = jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY);

        if (!auth(req, res)) {
            if (req.params.uid != userDet.uid)
                return res.status(401).json({ message: "Unauthorized" });
        }
        const orders = await OrderTable.findAll({
            where: {
                uid: req.params.uid
            }
        });
        return res.status(200).json(orders);
    }
    catch (err) {
        next(err)
    }
}

exports.OrderAdd = async (req, res, next) => {
    const t = await db.transaction();
    try {
        if (!auth(req, res)) {
            return
        }
        let totalprice = 0;
        req.body.items.forEach(element => {
            totalprice += parseInt(element.price * element.quantity);
            console.log(element.price * element.quantity)
        });
        // console.log(totalprice);
        let orderReq = {
            uid: req.body.uid,
            total_price: totalprice,
            status: 'pending'
        }
        console.log("order", orderReq)
        const order = await OrderTable.create(orderReq);

        let orderItems = req.body.items;
        let orderItemsArr = [];

        orderItems.forEach(async (element) => {
            orderItemsArr.push({
                Fid: element.fid,
                orderId: order.dataValues.orderId,
                quantity: element.quantity,
            })
            await FoodDecrease(element.fid)
        });
        console.log("orderItems:", orderItemsArr);
        // let productRemove =
        let itemss = await OrderItemTable.bulkCreate(orderItemsArr, { ignoreDuplicates: true }, { transaction: t });
        await t.commit();
        return res.status(201).json(order);
    }
    catch (err) {
        await t.rollback();
        next(err)
    }
}
exports.statusChange = async (req, res, next) => {
    let { status, oid } = req.body;
    if (!auth(req, res)) {
        return
    }
    try {
        await statusChange.validateAsync({ status, oid });

        const order = await OrderTable.update({ status: status }, {
            where: {
                orderId: oid
            }
        });
        res.status(200).json({
            oid: oid,
            message: "Status Updated"
        });
    }
    catch (err) {
        next(err)
    }
}
