const { userRegister, userLogin, usergetAll } = require("../controller/user-controller")

exports.userRoutes = (app, passport) => {
    app.post('/login', userLogin)
        .post('/register', userRegister)
        .get('/users', usergetAll)
}