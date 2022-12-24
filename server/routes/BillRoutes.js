const { getBill } = require("../controller/BillController");

exports.BillRoute = (app, passport) => {
    app.get('/bill/:bid', passport.authenticate("jwt", { session: false }),
        getBill)
}   