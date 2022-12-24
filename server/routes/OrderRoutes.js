exports.OrderRoutes = (app, passport) => {
    app.get("/order", passport.authenticate("jwt", { session: false }), OrderViewAll)
        .get("/order/:oid", passport.authenticate("jwt", { session: false }), OrderViewbyOid)
        .get("/order/user/:uid", passport.authenticate("jwt", { session: false }), OrderViewbyUid)
        .post("/order", passport.authenticate("jwt", { session: false }), OrderAdd)
}