const OrderTable = require('../models/OrderTable');

exports.OrderViewAll = async (req, res, next) => {
    try {
        const orders = await OrderTable.findAll();
        res.status(200).json(orders);
    }
    catch (err) {
        res.status(500).json(err);
    }
}
