const { getOrderItems } = require("../services/OrderService");

exports.getBill = async (req, res, next) => {
    const oid = req.params.bid;
    let rawOrder = await getOrderItems(oid);
    if (rawOrder.length === 0) {
        return res.status(200).json({ message: "no Items Found" })
    }

    let orderDetails = {
        orderId: rawOrder[0].orderId,
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