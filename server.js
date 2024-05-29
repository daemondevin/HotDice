const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const gameclass = require("./gameclass");
const port = process.env.PORT || 3030;
var rooms = [];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/lobby.html");
});

app.get("/api/newgame/", (req, res) => {
  var NewGame = new gameclass();
  res.send({ Name: NewGame.Name });
  var nsp = io.of("/" + NewGame.Name);
  rooms.push(NewGame);
  nsp.on("connection", (socket) => {
    try {
      socket.on("playerjoin", (player) => {
        if (!NewGame.started) {
          if (NewGame.players.length == 0) {
            NewGame.players.push({
              name: player.name,
              id: socket.id,
              host: true,
              score: 0,
            });
          } else {
            NewGame.players.push({
              name: player.name,
              id: socket.id,
              host: false,
              score: 0,
            });
          }
          nsp.emit("playerupdate", NewGame.players);
          console.log(NewGame.players);
        }
      });
      socket.on("GameStart", () => {
        console.log(socket.id, NewGame.players);
        console.log(NewGame.isHost(socket));
        if (NewGame.isHost(socket)) {
          NewGame.started = true;
        }
        NewGame.turnindex = Math.floor(Math.random() * NewGame.players.length);
        nsp.emit("newturn", NewGame.players[NewGame.turnindex]);
        nsp.emit("playerupdate", NewGame.players, NewGame.turnindex);
      });
      socket.on("roll", (diceindex) => {
        if (
          socket.id == NewGame.players[NewGame.turnindex].id &&
          NewGame.started == true
        ) {
          console.log("player rolled index: ", diceindex);
          if (!NewGame.roll(diceindex)) {
            nsp.emit("roll_Return", NewGame.dice);
            NewGame.nextturn();
            //if roll returns false it means that a farkle happened
            nsp.emit("newturn", NewGame.players[NewGame.turnindex]);
            nsp.emit("playerupdate", NewGame.players, NewGame.turnindex);
            console.log(
              "It is ",
              NewGame.players[NewGame.turnindex].name,
              "'s turn",
            );
          } else {
            nsp.emit("roll_Return", NewGame.dice);
          }
        } else {
          console.log(
            socket.id +
              " tried to roll but it is " +
              NewGame.players[NewGame.turnindex].id +
              " turn",
          );
        }
      });
      socket.on("bank", () => {
        if (NewGame.Bank(socket)) {
          nsp.emit("playerupdate", NewGame.players, NewGame.turnindex);
          nsp.emit("newturn", NewGame.players[NewGame.turnindex]);
        }
        if (
          NewGame.players.filter((player) => {
            return player.score >= NewGame.scoreToWin;
          }).length == 1
        ) {
          console.log(
            NewGame.players.filter((player) => {
              return player.score >= NewGame.scoreToWin;
            }),
          );
          nsp.emit(
            "gamewon",
            NewGame.players.filter((player) => {
              return player.score >= NewGame.scoreToWin;
            })[0],
          );
        }
      });

      socket.on("msg", (msg) => {
        console.log(socket.id + " sent: " + msg);

        socket.broadcast.emit("msg", {
          msg: msg,
          sender: NewGame.players.filter((player) => socket.id == player.id)[0]
            .name,
        });
      });
      socket.on("disconnect", () => {
        console.log(socket.id + " disconnected");
        nsp.emit(
          "playerDisconect",
          NewGame.players.filter((player) => {
            return player.id == socket.id;
          })[0],
        );
        if (
          app._router.stack.findIndex((x) => {
            return x.path == "/" + NewGame.Name;
          }) != -1
        ) {
          app._router.stack.findIndex((x) => {
            return x.path == "/" + NewGame.Name;
          });
          app._router.stack.splice(
            app._router.stack.findIndex((x) => {
              return x.path == "/" + NewGame.Name;
            }),
            1,
          );
        }
        rooms = rooms.filter((room) => {
          return !NewGame == room;
        });
      });
    } catch (err) {
      console.log(err);
    }
  });
  app.get("/" + NewGame.Name, (req, res) => {
    res.sendFile(__dirname + "/public/game.html");
  });
});
app.get("/api/getrooms", (req, res) => {
  res.send({
    rooms: rooms,
  });
});
app.get("/rules", (req, res) => {
  res.sendFile(__dirname + "/public/rules.html");
});

app.use(express.static(__dirname + "/public"));

http.listen(port, function () {
  console.log("listening on port: " + port);
});
