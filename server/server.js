const express = require("express");
const { db } = require("./config/db_config.js");
const controllers = require("./controller/index-controller.js");
const { dbConnection } = require("./models/index-model.js");

// import exceptions
const notfound = require('./exception/notfound');
const errorException = require('./exception/error.exception');
const passport = require("passport");
// jwt and local strategy
const { authenticate } = require("./utils/localSrategy");
const { jwtAuthenticate } = require('./utils/jwt-authenticate');


require('dotenv').config({ path: './.dev.env' });

const app = express();
app.use(express.json());

app.use(passport.initialize());
authenticate(passport);
jwtAuthenticate(passport);
// data base connection
dbConnection(db)


// all controllers are here
controllers(app, passport);


// not found and error exception
app.use(notfound)
app.use(errorException)


const PORT = process.env.PORT;
app.listen(PORT,
    () => console.log(` \n 🎊  Server started on port -> ${PORT}  🎊\n`)
);

