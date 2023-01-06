// const { OrderViewAll, OrderViewbyOid, OrderAdd, OrderViewbyUid } = require("../services/OrderService");

// exports.OrderController = async (app, passport) => {
//     app.get("/order", passport.authenticate("jwt", { session: false }), OrderViewAll)
//         .get("/order/:oid", passport.authenticate("jwt", { session: false }), OrderViewbyOid)
//         .get("/order/user/:uid", passport.authenticate("jwt", { session: false }), OrderViewbyUid)
//         .post("/order", passport.authenticate("jwt", { session: false }), OrderAdd)
//     // .put("/order/:oid", passport.authenticate("jwt", { session: false }), OrderUpdate)
//     // .delete("/order/:oid", passport.authenticate("jwt", { session: false }), OrderDelete);
// }
const { QueryTypes } = require('sequelize');
const OrderTable = require('../models/OrderTable');
const { OrderItemTable } = require('../models/OrderItem');

const jwt = require("jsonwebtoken");
const { auth } = require('../utils/Auth');
const { db } = require('../config/db_config');
const { FoodMenu } = require('../models/FoodMenu');
const { FoodDecrease } = require('../services/FoodService');
const Joi = require('joi');
const { statusChange, statusChangeByUser } = require('../validator/orderValidator');
const { getAllOrder, GetOrderDetailsByOID, GetOrderDetailsByUID, addOrder, addDuplicateItems, cancelOrder, updateStatus, getUIdofOrder, CheckItemAvailable, updateOrderItem } = require('../services/OrderService');
exports.OrderViewAll = async (req, res, next) => {
    try {
        if (!auth(req, res)) {
            return
        }
        // const orders = await OrderTable.findAll();
        const orders = await getAllOrder();
        res.status(200).json(orders);
    }
    catch (err) {
        next(err)
    }
}
exports.OrderViewbyOid = async (req, res, next) => {
    let userDet = jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY);

    try {
        let orderUid = await getUIdofOrder(req.params.oid);
        if (userDet.uid != orderUid.uid) {

            if (!auth(req, res)) {
                return
            }
        }
        const orders = await GetOrderDetailsByOID(req.params.oid);
        // const orders = await OrderTable.findAll({
        //     where: {
        //         orderId: req.params.oid
        //     }
        // });
        return res.status(200).json(orders);
    }
    catch (err) {
        next(err)
    }
}
exports.OrderViewbyUid = async (req, res, next) => {
    try {
        let userDet = jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY);
        if (!auth(req, res))
            return res.status(401).json({ message: "Unauthorized" });

        const orders = await GetOrderDetailsByUID(req.params.uid);
        // const orders = await OrderTable.findAll({
        //     where: {
        //         uid: req.params.uid
        //     }
        // });
        return res.status(200).json(orders);
    }
    catch (err) {
        next(err)
    }
}
exports.viewUserOrder = async (req, res, next) => {
    console.log('hey from')
    try {
        let userDet = jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY);
        const orders = await GetOrderDetailsByUID(userDet.uid);
        return res.status(200).json(orders);
    }
    catch (err) {
        next(err)
    }
}

// function to filter duplicate items
const filterItems = (orderItems) => {


    let filteredItem = orderItems.reduce((acc, current) => {
        const x = acc.find((item) => item.Fid === current.Fid);
        if (!x) {
            return acc.concat([current]);
        } else {
            x.quantity = x.quantity + current.quantity;
            return acc;
        }
    }, []);
    return filteredItem;
}
exports.OrderAdd = async (req, res, next) => {
    try {
        let userDet = jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY);
        //check if item are avilable or not
        let itemNotAvailable = await CheckItemAvailable(req.body.items);
        if (itemNotAvailable.length > 0) {
            return res.status(400).json({
                message: "Item Not Available",
                itemNotAvailable
            });
        }
        let totalprice = 0;
        req.body.items.forEach(element => {
            totalprice += parseInt(element.price * element.quantity);
        });
        let orderReq = {
            uid: userDet.uid,
            total_price: totalprice,
            status: 'pending'
        }
        let orderItems = req.body.items;
        // filter orderItems
        let filterOrderItems = filterItems(orderItems);
        let itemstoadd = await addDuplicateItems(filterOrderItems, userDet.uid);
        if (itemstoadd.length == 0) {
            return res.status(400).json({
                message: "Item added to previous order"
            });
        }
        let order = await addOrder(orderReq, itemstoadd);
        return res.status(201).json({
            message: "Order Placed",
            order
        });
    }
    catch (err) {
        next(err)
    }
}

const statusChanges = (payload) => {
    //bussi
    //repos => dta access 

}

exports.statusChange = async (req, res, next) => {
    let { status, oid } = req.body;
    let userDet = jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY);

    if (!(await auth(req, res))) {
        return
    }
    try {
        await statusChange.validateAsync({ status, oid });
        if (status == 'cancelled' || status == 'rejected') {
            let dbstatus = await cancelOrder(oid, status);
            if (!dbstatus.status) {
                return res.status(200).json({
                    oid: oid,
                    message: dbstatus.error
                });
            }
            return res.status(200).json({
                oid: oid,
                message: `Order ${status}`
            });

        }
        let upStatus = await updateStatus(oid, status);
        if (!upStatus.status) {
            return res.status(200).json({
                oid: oid,
                message: upStatus.error
            });
        }
        res.status(200).json({
            oid: oid,
            message: `Status Updated to ${status}`
        });
    }
    catch (err) {
        next(err)
    }
}
exports.statusChangeByUser = async (req, res, next) => {
    let { status, oid } = req.body;
    let userDet = jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY);

    try {
        await statusChangeByUser.validateAsync({ status, oid });
        let oidDb = await getUIdofOrder(oid);
        if (userDet.uid != oidDb.uid) {
            return res.status(401).json({
                oid: oid,
                message: `Unauthorized`
            });
        }
        if (status == 'cancelled') {
            let dbstatus = await cancelOrder(oid, status);
            if (!dbstatus.status) {
                return res.status(200).json({
                    oid: oid,
                    message: dbstatus.error
                });
            }
            return res.status(200).json({
                oid: oid,
                message: `Order ${status}`
            });

        }
        res.status(200).json({
            oid: oid,
            message: `Status Updated to ${status}`
        });
    }
    catch (err) {
        next(err)
    }
}
exports.updateOrder = async (req, res, next) => {
    try {
        const userDet = jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY);
        const UidofOrder = await getUIdofOrder(req.params.oid);
        // check if userId is same as orders uid
        if (!(userDet.uid === UidofOrder.uid)) {
            // if not same then check if user is admin or employee
            if (!(await auth(req, res))) {
                return
            }
        }
        // check if item are avilable or not
        let itemNotAvailable = await CheckItemAvailable(req.body.itemsToadd);
        if (itemNotAvailable.length > 0) {
            return res.status(400).json({
                message: "Item Not Available",
                itemNotAvailable
            });
        }
        let orderDetails = await updateOrderItem(req.params.oid, req.body.itemsToadd);

        if (orderDetails?.status) {
            return res.status(200).json({
                message: "Order Updated",
            })
        }
        return res.status(400).json({
            message: orderDetails.error
        });

    }
    catch (err) {
        next(err)
    }
}
