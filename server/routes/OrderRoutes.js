const { OrderViewAll, OrderViewbyOid, OrderViewbyUid, OrderAdd, statusChange, updateOrder, viewUserOrder, statusChangeByUser } = require("../controller/OrderController")
const protectedMiddleware = require("../utils/ProtectedMiddleware")

exports.OrderRoutes = (app) => {
    app.get("/order/admin", protectedMiddleware,
        OrderViewAll)
        .post("/order/user/status", protectedMiddleware,
            statusChangeByUser)
        .get("/order/:oid", protectedMiddleware,
            OrderViewbyOid)
        .get("/orders", protectedMiddleware,
            viewUserOrder)
        .get("/order/admin/:uid", protectedMiddleware,
            OrderViewbyUid)
        .post("/order", protectedMiddleware,
            OrderAdd)
        .post("/order/admin/status", protectedMiddleware,
            statusChange)
        .post("/order/:oid", protectedMiddleware,
            updateOrder)
}