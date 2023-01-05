const { OrderViewAll, OrderViewbyOid, OrderViewbyUid, OrderAdd, statusChange, updateOrder } = require("../controller/OrderController")
const protectedMiddleware = require("../utils/ProtectedMiddleware")

exports.OrderRoutes = (app) => {
    app.get("/order", protectedMiddleware,
        OrderViewAll)
        .get("/order/:oid", protectedMiddleware,
            OrderViewbyOid)
        .get("/order/user/:uid", protectedMiddleware,
            OrderViewbyUid)
        .post("/order", protectedMiddleware,
            OrderAdd)
        .post("/order/status", protectedMiddleware,
            statusChange)
        .post("/order/:oid", protectedMiddleware,
            updateOrder)
}