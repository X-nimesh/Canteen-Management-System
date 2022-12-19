
exports.socket = (app) => {
    const { createServer } = require("http");
    const { Server } = require("socket.io");
    const cors = require('cors');


    const corsOptions = {
        origin: '*',
        credentials: true,            //access-control-allow-credentials:true
        optionSuccessStatus: 200,
    }
    // socket.io
    // const { notification } = require('./notification-socket');
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
        },
    });
    // notification(io);
    io.on("connection", (socket) => {
        console.log('user connected')
        socket.emit("join", "hello from server");

        // it recieves message from client in "message" event
        socket.on("message", (data) => {
            console.log(data);
        });
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    });
    httpServer.listen(4000);


    app.use(cors(corsOptions))
}
