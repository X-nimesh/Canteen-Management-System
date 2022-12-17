// passport-jwt
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
require('dotenv').config({ path: './.dev.env' });

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;
const jwtAutherer = (payload, done) => {
    //   console.log(payload);
    done(null, payload);
};
const jwtAuthenticate = (passport) => {
    passport.use(new JwtStrategy(opts, jwtAutherer));
};
module.exports = { jwtAuthenticate };
