const { getOrderItemsbyOid, getBillbyOid } = require("../repository/order-repo");
// const { getOrderItems } = require("../services/OrderService");
const { auth } = require("../utils/Auth");
const jwt = require("jsonwebtoken");
const { GetOrderDetailsByOID, getOrderItembyOID } = require("../services/OrderService");
const { OrderItemTable } = require("../models/OrderItem");

exports.getBill = async (req, res, next) => {
    const oid = req.params.bid;
    const userDet = jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY);
    // let [rawOrder] = await getBillbyOid(oid);
    // // console.log(rawOrder)
    // if (rawOrder.length === 0) {
    //     return res.status(200).json({ message: "no Items Found" })
    // }
    let order = await GetOrderDetailsByOID(oid);
    if (order[0].uid !== userDet.uid) {
        if (!(await auth(req, res))) {
            return
            // if (!(rawOrder[0].status === "complete")) {
            //     return res.status(200).json({ message: `Order is ${rawOrder[0].status}` })
            // }
            // let userDet = jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY);
            // if (rawOrder[0].uid === userDet.uid) {
            //     return res.status(200).json({ message: `Unauthorized` })
            // }
        }
    }
    let orderItems = await getBillbyOid(oid);
    // let orderItems = await OrderItemTable.findAll({
    //     where: {
    //         orderId: oid
    //     }
    // })

    let orderDetails = {
        orderId: order[0].orderId,
        uid: order[0].uid,
        TotalPrice: order[0].total_price,
        Created: order[0].createdAt,
        items: []
    };
    orderItems.forEach((item) => {
        let filter = {
            foodName: item.productname,
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.price * item.quantity,
            image: item.image
        }
        orderDetails.items.push(filter);
    })
    console.log(orderDetails);
    res.status(200).json(orderDetails);

}

