const { OrderViewAll, OrderViewbyOid, OrderAdd, OrderViewbyUid } = require("../services/OrderService");

exports.OrderController = async (app, passport) => {
    app.get("/order", passport.authenticate("jwt", { session: false }), OrderViewAll)
        .get("/order/:oid", passport.authenticate("jwt", { session: false }), OrderViewbyOid)
        .get("/order/user/:uid", passport.authenticate("jwt", { session: false }), OrderViewbyUid)
        .post("/order", passport.authenticate("jwt", { session: false }), OrderAdd)
    // .put("/order/:oid", passport.authenticate("jwt", { session: false }), OrderUpdate)
    // .delete("/order/:oid", passport.authenticate("jwt", { session: false }), OrderDelete);
}