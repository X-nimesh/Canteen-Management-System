// const OrderTable = require('../models/OrderTable');
// const { OrderItemTable } = require('../models/OrderItem');
// const jwt = require("jsonwebtoken");

// const { auth } = require('../utils/Auth');

// exports.OrderViewAll = async (req, res, next) => {
//     try {
//         const orders = await OrderTable.findAll();
//         res.status(200).json(orders);
//     }
//     catch (err) {
//         next(err)
//     }
// }
// exports.OrderViewbyOid = async (req, res, next) => {
//     try {
//         if (!auth(req, res)) {
//             return
//         }
//         const orders = await OrderTable.findAll({
//             where: {
//                 orderId: req.params.oid
//             }
//         });
//         return res.status(200).json(orders);
//     }
//     catch (err) {
//         next(err)
//     }
// }
// exports.OrderViewbyUid = async (req, res, next) => {
//     try {
//         let userDet = jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY);

//         if (!auth(req, res) || req.params.uid != userDet.uid) {
//             return
//         }
//         const orders = await OrderTable.findAll({
//             where: {
//                 uid: req.params.uid
//             }
//         });
//         return res.status(200).json(orders);
//     }
//     catch (err) {
//         next(err)
//     }
// }

// exports.OrderAdd = async (req, res, next) => {
//     try {
//         if (!auth(req, res)) {
//             return
//         }
//         let totalprice = 0;
//         req.body.items.forEach(element => {
//             totalprice += parseInt(element.price * element.quantity);
//             console.log(element.price * element.quantity)
//         });
//         console.log(totalprice);
//         let orderReq = {
//             uid: req.body.uid,
//             total_price: totalprice,
//             status: 'pending'
//         }
//         const order = await OrderTable.create(orderReq);

//         let orderItems = req.body.items;
//         let orderItemsArr = [];

//         orderItems.forEach(element => {
//             orderItemsArr.push({
//                 Fid: element.fid,
//                 orderId: order.dataValues.orderId,
//                 quantity: element.quantity,
//             })
//         });
//         let itemss = await OrderItemTable.bulkCreate(orderItemsArr, { ignoreDuplicates: true });

//         return res.status(201).json(order);
//     }
//     catch (err) {
//         next(err)
//     }

// }



const { Sequelize } = require('sequelize');
const { db } = require('../config/db_config');
const OrderTable = require('../models/OrderTable');
exports.GetOrderDetails = async (oid) => {
    const orderDetails =
        await Sequelize.query(`SELECT "orderId",total_price,"createdAt" 
            FROM order_table WHERE "orderId"=${oid};`);
    return orderDetails;
}
exports.getOrderItems = async (oid) => {

    const orderItems = await db.query(`SELECT oT.uid,oT."orderId",oT.total_price,
    oT.status, fM.name,oIt.quantity,fM.price,fM.image,oT."createdAt"
        FROM order_table oT full join
        "order_Item_table" oIt on oT."orderId" = oIt."orderId"
        full join "foodMenu" fM on 
        fM."Fid" = oIt."Fid" where oT."orderId"=4;`);
    return orderItems[0];

};
