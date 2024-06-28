export default class Player {
    constructor(name) {
        this.name = name;
        this.id = id;
        this.score = 0;
        this.turn = false;
        this.thrown = [];
        this.held = [];
    }

    addScore(points) {
        this.score += points;
    }

}