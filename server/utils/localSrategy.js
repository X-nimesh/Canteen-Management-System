const LocalStrategy = require('passport-local').Strategy;
const { UserLogin } = require('../repository/user-repo')
const bcrypt = require('bcrypt');


exports.authenticate = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: "email" }, async (email, password, cb) => {

            const found = await UserLogin(email);

            if (found && bcrypt.compareSync(password, found.password)) {
                let data = { uid: found.uid, role: found.role }

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

