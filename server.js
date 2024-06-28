const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const Game = require('./gameclass');
const Player = require('./game/player');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 3030;

let rooms = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/lobby.html');
});

app.get('/api/newgame', (req, res) => {
    const newGame = new Game();
    rooms.push(newGame);

    const namespace = io.of('/' + newGame.Name);
    namespace.on('connection', socket => {
        handleSocketConnection(socket, namespace, newGame);
    });

    app.get('/' + newGame.Name, (req, res) => {
        res.sendFile(__dirname + '/public/game.html');
    });

    res.send({ Name: newGame.Name });
});

app.get('/api/getrooms', (req, res) => {
    res.send({ rooms: rooms.map(room => room.Name) });
});

app.get('/rules', (req, res) => {
    res.sendFile(__dirname + '/public/rules.html');
});

app.use(express.static(__dirname + '/public'));

server.listen(port, () => {
    console.log('Listening on port: ' + port);
});

function handleSocketConnection(socket, namespace, game) {
    socket.on('playerjoin', player => {
        if (!game.started) {
            game.addPlayer(player.name, socket.id);
            namespace.emit('playerupdate', game.players);
        }
    });

    socket.on('GameStart', () => {
        if (game.isHost(socket)) {
            game.started = true;
            game.turnindex = Math.floor(Math.random() * game.players.length);
            namespace.emit('newturn', game.players[game.turnindex]);
            namespace.emit('playerupdate', game.players, game.turnindex);
        }
    });

    socket.on('roll', diceIndex => {
        if (socket.id === game.players[game.turnindex].id && game.started) {
            if (!game.roll(diceIndex)) {
                namespace.emit('roll_Return', game.dice);
                game.nextturn();
                namespace.emit('newturn', game.players[game.turnindex]);
                namespace.emit('playerupdate', game.players, game.turnindex);
            } else {
                namespace.emit('roll_Return', game.dice);
            }
        }
    });

    socket.on('bank', () => {
        if (game.bank(socket)) {
            namespace.emit('playerupdate', game.players, game.turnindex);
            namespace.emit('newturn', game.players[game.turnindex]);
            if (game.hasWon()) {
                const winner = game.players.find(player => player.score >= game.scoreToWin);
                namespace.emit('gamewon', winner);
            }
        }
    });

    socket.on('msg', msg => {
        const sender = game.players.find(player => player.id === socket.id);
        if (sender) {
            socket.broadcast.emit('msg', { msg, sender: sender.name });
        }
    });
    
    socket.on('addmsg', msg => {
        const sender = game.players.find(player => player.id === socket.id);
        if (sender) {
            socket.broadcast.emit('addmsg', { msg, sender: sender.name });
        }
    });

    socket.on('disconnect', () => {
        const player = game.players.find(player => player.id === socket.id);
        if (player) {
            namespace.emit('playerDisconect', player);
            game.players = game.players.filter(p => p.id !== socket.id);
            if (game.players.length === 0) {
                rooms = rooms.filter(room => room !== game);
            }
        }
    });
}
