const LocalStrategy = require('passport-local').Strategy;
const { UserLogin } = require('../repository/user-repo')


exports.authenticate = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: "email" }, async (email, password, cb) => {
            const found = await UserLogin(email, password);
            if (found) {
                let data = { uid: found.uid, userType: found.userType }

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

