const express = require("express");
const { db } = require("./config/db_config.js");
const controllers = require("./controller/index-controller.js");
const { dbConnection } = require("./models/index-model.js");
//use  transaction in database

// import exceptions
const notfound = require('./exception/notfound');
const errorException = require('./exception/error.exception');
const passport = require("passport");
// jwt and local strategy
const { authenticate } = require("./utils/localSrategy");
const { jwtAuthenticate } = require('./utils/jwt-authenticate');
const { socket } = require("./utils/socketNotification.js");
const Routes = require("./routes/index-Routes.js");
// socket.io
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require('cors');


require('dotenv').config({ path: './.dev.env' });

const app = express();
app.use(express.json());
const io = socket(app)
app.use(passport.initialize());
authenticate(passport);
jwtAuthenticate(passport);
// data base connection
dbConnection(db)


io.on("connection", (socket) => {
    socket.emit("join", "hello from server 2");
});

Routes(app, passport);

// not found and error exception
app.use(notfound)
app.use(errorException)

// httpServer.listen(4000);
// app.use(cors(corsOptions))
const PORT = process.env.PORT;
app.listen(PORT,
    () => console.log(` \n 🎊  Server started on port -> ${PORT}  🎊\n`)
);

