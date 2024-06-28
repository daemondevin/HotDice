const Dice = require('../game/dice');
const { hasFarkle, nextTurn } = require('../game/turn');

function handleSocketConnection(namespace, game) {
    namespace.on('connection', (socket) => {
        socket.on('playerjoin', (player) => {
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

        socket.on('roll', (diceIndex) => {
            if (socket.id === game.players[game.turnindex].id && game.started) {
                Dice.roll(game.dice, diceIndex);
                if (hasFarkle(game.dice)) {
                    game.turn.reset();
                    nextTurn(game);
                    namespace.emit('newturn', game.players[game.turnindex]);
                    namespace.emit('playerupdate', game.players, game.turnindex);
                } else {
                    game.turn.addScore(Dice.getAvailableValues(game.dice));
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

        socket.on('addmsg', (msg) => {
            const sender = game.players.find(player => player.id === socket.id);
            if (sender) {
                socket.broadcast.emit('msg', { msg, sender: sender.name });
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
    });
}

module.exports = { handleSocketConnection };
