const { userRegister, userLogin, usergetAll } = require("../controller/user-controller")
const protectedMiddleware = require("../utils/ProtectedMiddleware");

exports.userRoutes = (app) => {
    app.post('/login', userLogin)
        .post('/register', userRegister)
        .get('/users',
            protectedMiddleware,
            // passport.authenticate("jwt", { session: false }),
            usergetAll)
}