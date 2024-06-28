const Score = require('./score');

class Turn {
    constructor() {
        this.rollCount = 0;
        this.score = 0;
    }

    reset() {
        this.rollCount = 0;
        this.score = 0;
    }

    addScore(diceValues) {
        this.score += Score(diceValues);
    }
}

function nextTurn(game) {
    game.turnindex = (game.turnindex + 1) % game.players.length;
    game.dice.fill({ value: 0, available: true });
    game.turn.reset();
}

module.exports = { Turn, nextTurn };
