
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
        socket.on("food", (data) => {
            console.log(data);
            //food service =>               
        });
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    });
    // io.on("try1", (socket) => {
    //     console.log('user connected')
    //     socket.emit("join", "hello from server");
    // });
    // timeout
    // setTimeout(() => {
    //     io.emit("try1", "hello from server");
    // }, 3000);
    // io.emit("try2", "hello from server");
    io.on("connection", (socket) => {
        socket.emit("try2", "hello from server");
    });
    io.on("connection", (socket) => {
        socket.emit("try2", "hello from server");
    });
    httpServer.listen(4000);


    app.use(cors(corsOptions))
    return io;
}
