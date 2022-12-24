// const { usergetAll, userLogin, userRegister } = require("../services/UserService");
// const userController = (app, passport) => {
//     app.post('/login', userLogin)
//         .post('/register', userRegister)
//     app.get('/users', usergetAll)
// }
// module.exports = userController; 


const passport = require('passport');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const userSchema = require('../validator/userValidator');
const { findAllUser } = require('../services/UserService');
const userTable = require('../models/UserTable');
require('dotenv').config({ path: './.dev.env' });
exports.usergetAll = async (req, res, next) => {
    try {
        const users = await findAllUser();
        return res.status(200).json({ users });
    } catch (error) {
        next(error);
    }
}

exports.userLogin = async (req, res, next) => {
    passport.authenticate('local', { session: false },
        (err, user, info) => {
            if (user) {
                token = jwt.sign(user, process.env.SECRET_KEY);
                return res.status(200).json({
                    token: token
                })
            }
            return res.status(400).json({
                message: "user not found"
            })
        }
    )(req, res, next);
}
exports.userRegister = async (req, res, next) => {
    try {
        let { name, email, password, role } = req.body;
        await userSchema.signup.validateAsync({ name, email, password, role });
        password = bcrypt.hashSync(password, 11);
        const user = await userTable.create({
            name,
            email,
            password,
            role
        });
        return res.status(201).json({
            message: "user created successfully",
            uid: user.uid,
            role: user.role,

        });
    } catch (error) {
        next(error);
    }
}


