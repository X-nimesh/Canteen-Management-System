const OrderTable = require('../models/OrderTable');
const OrderItemTable = require('../models/OrderItem');

const { auth } = require('../utils/Auth');

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
exports.OrderAdd = async (req, res, next) => {
    try {
        if (!auth(req, res)) {
            return
        }

        let orderReq = {
            uid: req.body.uid,
            total_price: req.body.total_price,
            status: 'pending'
        }
        const order = await OrderTable.create(orderReq);

        let orderItems = req.body.items;
        let orderItemsArr = [];
        orderItems.forEach(element => {
            orderItemsArr.push({
                Fid: element,
                orderId: order.dataValues.orderId,
                quantity: element.quantity,

            })
        });
        await OrderItemTable.bulkCreate(orderItemsArr);


        return res.status(201).json(order);
    }
    catch (err) {
        next(err)
    }

}