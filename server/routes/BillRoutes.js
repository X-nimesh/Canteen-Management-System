const { getBill, getBills } = require("../controller/BillController");
const protectedMiddleware = require("../utils/ProtectedMiddleware");

exports.BillRoute = (app, passport) => {
    app.get('/bill/:bid', protectedMiddleware,
        getBill)
}   