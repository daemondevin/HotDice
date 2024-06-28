const Turn = require('./turn');
const { Score } = require('./score');

const Dice = {
    roll: (dice, index) => {
        index.forEach(i => {
            dice[i] = {
                value: Math.floor(Math.random() * 6 + 1),
                available: dice[i].available
            };
        });
        var scoreddice = [];

        let DiceHeld = false;
        for (let i = 0; i < 6; i++) {
            if (index.includes(i) == false) {
                if (dice[i].avalible == true) {
                    DiceHeld = true;
                    scoreddice.push(dice[i].value);
                    dice[i].avalible = false;
                }
            }
        }
        if (!DiceHeld && Turn.roll_count > 0) {
            return false;
        }

        Turn.score += Score(scoreddice, 0);

        if (Score(dice
                    .filter((x) => {
                        return x.avalible == true;
                    })
                    .map((y) => y.value),
                0
            ) == 0
        ) {
            //farkle occured
            Turn.score = 0;
            return false;
        }
        Turn.roll_count++;
        return true;
    },

    getAvailableValues: (dice) => dice.filter(d => d.available).map(d => d.value)
};

module.exports = { Dice };
