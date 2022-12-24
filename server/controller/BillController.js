const { getOrderItems } = require("../services/OrderService");
const { auth } = require("../utils/Auth");

exports.getBill = async (req, res, next) => {
    const oid = req.params.bid;
    let rawOrder = await getOrderItems(oid);
    // console.log(rawOrder)
    if (rawOrder.length === 0) {
        return res.status(200).json({ message: "no Items Found" })
    }
    if (!auth(req, res)) {
        if (!(rawOrder[0].status === "complete")) {
            return res.status(200).json({ message: `Order is ${rawOrder[0].status}` })
        }
        let userDet = jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY);
        if (rawOrder[0].uid === userDet.uid) {
            return res.status(200).json({ message: `Unauthorized` })
        }
    }

    let orderDetails = {
        orderId: rawOrder[0].orderId,
        uid: rawOrder[0].uid,
        TotalPrice: rawOrder[0].total_price,
        Created: rawOrder[0].createdAt,
        items: []
    };
    rawOrder.forEach((item) => {
        let filter = {
            foodName: item.name,
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