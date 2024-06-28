function ofakind(eval, arr) {
    for (let i = 1; i < 7; i++) {
        if (
            arr.filter((n) => {
                return n == i;
            }).length == eval
        ) {
            return [true, i];
        }
    }
    return [false];
}

function Score(dice, score) {
    if (dice.length == 6) {
        if (ofakind(6, dice)[0]) {
            score += 3000;
            return score;
        }
        if (
            dice.filter((value, index, self) => {
                return self.indexOf(value) == index;
            }).length == 6
        ) {
            score += 1500;
            return score;
        }

        if (ofakind(2, dice)[0]) {
            let next = dice.filter((x) => x != ofakind(2, dice)[1]);
            if (ofakind(2, next)[0]) {
                next = next.filter((x) => x != ofakind(2, next)[1]);
                if (ofakind(2, next)[0]) {
                    return 2500;
                }
            }
        }
        //check for 2 triplets
        if (ofakind(3, dice)[0]) {
            let next = dice.filter((x) => x != ofakind(3, dice)[1]);
            //if there are 3 of a kind check if the remainging dice are 3 of a kind this catches the 2 triplets condition
            if (ofakind(3, next)[0]) {
                return 1500;
            }
        }
    }
    if (ofakind(5, dice)[0]) {
        score += 2000;
        return Score(
            dice.filter((x) => x != ofakind(5, dice)[1]),
            score
        );
    }
    if (
        dice.filter((value, index, self) => {
            return self.indexOf(value) == index;
        }).length == 6
    ) {
        score += 1500;
        return score;
    }
    if (ofakind(4, dice)[0]) {
        score += 1000;
        //(ofakind(4, dice)[1])
        return Score(
            dice.filter((x) => x != ofakind(4, dice)[1]),
            score
        );
    }
    if (ofakind(3, dice)[0]) {
        //this needs work, maybe try to fit the 2 triplets condition into here
        //("3 of a kind!")
        if (ofakind(3, dice)[1] == 1) {
            score += 300;
        } else {
            score += ofakind(3, dice)[1] * 100;
        }
        return Score(
            dice.filter((x) => x != ofakind(3, dice)[1]),
            score
        );
    }
    if (
        dice.filter((x) => {
            return x == 1 || x == 5;
        }).length > 0
    ) {
        //(score)
        score +=
            dice.filter((x) => x == 1).length * 100 +
            dice.filter((x) => x == 5).length * 50;
        //(score)
        //(dice.filter(x => {return x != 1 || x != 5;},score))
        return Score(
            dice.filter((x) => {
                return x != 1 && x != 5;
            }),
            score
        );
    }
    return score;
}

module.exports = { Score, ofakind };
