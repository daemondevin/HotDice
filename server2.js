const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const Game = require("./game/game");
const port = process.env.PORT || 3030;
const routes = require('./routes');
const socketHandler = require('./socketHandler');
const rooms = [];

app.use(express.static(__dirname + "/public"));
app.use('/', routes);

io.on('connection', (socket) => {
    socketHandler(io, socket, rooms, Game);
});

http.listen(port, () => {
    console.log("listening on port: " + port);
});
