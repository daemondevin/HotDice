class Player {
    constructor(name, id, host = false) {
        this.name = name;
        this.id = id;
        this.host = host;
        this.score = 0;
    }

    addScore(points) {
        this.score += points;
    }
}

module.exports = Player;