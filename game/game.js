// game.js
const Player = require('./player');
const { Dice } = require('./dice');
const { Turn, nextTurn } = require('./turn');
const { Score } = require('./score');

class Game {
    constructor() {
        this.Name = Math.random().toString(36).substr(2, 5);
        this.players = [];
        this.messages = [];
        this.started = false;
        this.turnindex = 0;
        this.scoreToWin = 10000;
        this.turn = new Turn();
        this.dice = new Array(6).fill({
            value: 0,
            avalible: true,
        }, 0, 6);
    }

    addPlayer(playerName, socketId) {
        const player = new Player(playerName, socketId, this.players.length === 0);
        this.players.push(player);
    }

    isHost(socket) {
        const player = this.players.find(p => p.id === socket.id);
        return player ? player.host : false;
    }

    hasWon() {
        return this.players.some(player => player.score >= this.scoreToWin);
    }

    bank(socket) {
        const currentPlayer = this.players[this.turnindex];
        if (socket.id === currentPlayer.id && this.started) {
            this.turn.addScore(Dice.getAvailableValues(this.dice));
            if (currentPlayer.score !== 0 || this.turn.score >= 1000) {
                currentPlayer.addScore(this.turn.score);
            }
            this.turn.reset();
            nextTurn(this);
            return true;
        }
        return false;
    }
}

module.exports = Game;
