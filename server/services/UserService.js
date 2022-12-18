const passport = require('passport');
const userTable = require('../models/UserTable');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const userSchema = require('../validator/userValidator');
require('dotenv').config({ path: './.dev.env' });
exports.usergetAll = async (req, res, next) => {
    try {
        const users = await userTable.findAll();
        return res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

exports.userLogin = async (req, res, next) => {
    passport.authenticate('local', { session: false },
        (err, user, info) => {
            // loginToken(passport);
            if (user) {
                token = jwt.sign(user, process.env.SECRET_KEY);
                // let unsign = jwt.verify(token, "Secret_Token");
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
//  encrypt password using bcrypt
// const saltRounds = 10;
// const myPlaintextPassword = 's0/
// const someOtherPlaintextPassword = 'not_bacon';
//
// bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
//     // Store hash in your password DB.
// });
//
// // Load hash from your password DB.
// bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
//     // result == true
// });
// bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
//     // result == false
// });
//
