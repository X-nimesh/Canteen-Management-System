const LocalStrategy = require('passport-local').Strategy;
const { UserLogin } = require('../repository/user-repo')
const bcrypt = require('bcrypt');


exports.authenticate = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: "email" }, async (email, password, cb) => {

            const found = await UserLogin(email);

            if (found.length && bcrypt.compareSync(password, found[0].password)) {
                let data = { uid: found[0].uid, role: found[0].role }

                return cb(null, data, {
                    // return cb(null, found.dataValues.uid, {
                    message: "Successfully authenticated"
                });
            }
            return cb(null, false, {
                message: "Couldn't authenticate"
            })
        })
    )
}

