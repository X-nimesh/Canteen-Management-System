const { usergetAll, userLogin, userRegister } = require("../services/UserService");

const userController = (app, passport) => {
    app.post('/login', userLogin)
        .post('/register', userRegister)
    app.get('/users', usergetAll)
}
module.exports = userController; 