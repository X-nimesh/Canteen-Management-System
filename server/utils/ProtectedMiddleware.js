const passport = require('passport');
const protectedMiddleware = passport.authenticate('jwt', { session: false });

module.exports = protectedMiddleware;