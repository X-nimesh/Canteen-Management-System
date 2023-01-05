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
const { statusChange } = require('../validator/orderValidator');
const { getAllOrder, GetOrderDetailsByOID, GetOrderDetailsByUID, addOrder, addDuplicateItems, cancelOrder, updateStatus, getUIdofOrder } = require('../services/OrderService');
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
    try {
        if (!auth(req, res)) {
            return
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

        if (req.params.uid != userDet.uid) {
            if (!auth(req, res))
                return res.status(401).json({ message: "Unauthorized" });
        }
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
// function to filter duplicate items
const filterItems = (orderItems) => {
    // const filterOrderMap = new Map();

    // orderItems.forEach((order) => {
    //     const found = filterOrderMap.get('if');
    //     if(found){
    //         //oper
    //         filterOrderMap.set(id) = //asdasl
    //     }
    //     else{
    //         asdasd
    //         //s
    //     }
    // })

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

        await addOrder(orderReq, orderItems);

        return res.status(201).json({
            message: "Order Placed",
            itemstoadd
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

    if (!auth(req, res)) {
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
exports.updateOrder = async (req, res, next) => {
    try {
        const userDet = jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY);
        const UidofOrder = await getUIdofOrder(req.params.oid);
        let authorized = true;

        if (!(userDet.uid === UidofOrder)) {
            if (!(await auth(req, res))) {
                authorized = false;
            }
        }
        if (authorized)
            return res.status(200).json({
                message: "noicee"
            })
    }
    catch (err) {
        next(err)
    }
}
