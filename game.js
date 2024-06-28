function calculateRollScore(dice) {
  let diceCounts = [0, 0, 0, 0, 0, 0];
  for (var i = 0; i < dice.length; i++) {
    if (dice[i].avalible === false) {
      diceCounts[dice[i].value - 1]++;
    }
  }

  var score = 0;

  // Check for individual 1s and 5s
  score += diceCounts[0] >= 3 ? 1000 : diceCounts[0] * 100; // Three 1s are worth 1000 points, individual 1s are worth 100 points each
  score += diceCounts[4] >= 3 ? 500 : diceCounts[4] * 50; // Three 5s are worth 500 points, individual 5s are worth 50 points each

  // Check for three of a kind
  for (var j = 1; j <= 5; j++) {
    if (diceCounts[j] >= 3) {
      score += (j + 1) * 100; // Three of any number (except 1) are worth 100 times the number
    }
  }

  // Check for special combinations
  if (
    diceCounts[0] >= 1 &&
    diceCounts[1] >= 1 &&
    diceCounts[2] >= 1 &&
    diceCounts[3] >= 1 &&
    diceCounts[4] >= 1 &&
    diceCounts[5] >= 1
  ) {
    score += 3000; // 1-2-3-4-5-6 combination is worth 3000 points
  }

  if (
    diceCounts.filter(function (count) {
      return count === 2;
    }).length === 3
  ) {
    score += 1500; // Three pairs (including 4-of-a-kind and a pair) are worth 1500 points
  }
  return score;
}

function calculateScore() {
	tempScore = 0;
	var ones = [];
	var twos = [];
	var threes = [];
	var fours = [];
	var fives = [];
	var sixes = [];
	var scoreArray = [];
	for (var i = 0; i < this.dice.length; i++) {							//test out totals, etc.
		if (this.dice[i].available === false) {
			switch (this.dice[i].value) {
				case 1: ones.push(1);
								break;
				case 2: twos.push(2);
								break;
				case 3: threes.push(3);
								break;
				case 4: fours.push(4);
								break;
				case 5: fives.push(5);
								break;
				case 6: sixes.push(6);
								break;
			}
		}
	}
	switch (ones.length) {
		case 1: scoreArray[0] = 100; break;
		case 2: scoreArray[0] = 200; break;
		case 3: scoreArray[0] = 1000; break;
		case 4: scoreArray[0] = 2000; break;
		case 5: scoreArray[0] = 3000; break;
		case 6: scoreArray[0] = 4000; break;
		default: scoreArray[0] = 0;
	}
	switch (twos.length) {
		case 3: scoreArray[1] = 200; break;
		case 4: scoreArray[1] = 400; break;
		case 5: scoreArray[1] = 600; break;
		case 6: scoreArray[1] = 800; break;
		default: scoreArray[1] = 0;
	}
	switch (threes.length) {
		case 3: scoreArray[2] = 300; break;
		case 4: scoreArray[2] = 600; break;
		case 5: scoreArray[2] = 900; break;
		case 6: scoreArray[2] = 1200; break;
		default: scoreArray[2] = 0;
	}
	switch (fours.length) {
		case 3: scoreArray[3] = 400; break;
		case 4: scoreArray[3] = 800; break;
		case 5: scoreArray[3] = 1200; break;
		case 6: scoreArray[3] = 1600; break;
		default: scoreArray[3] = 0;
	}
	switch (fives.length) {
		case 1: scoreArray[4] = 50; break;
		case 2: scoreArray[4] = 100; break;
		case 3: scoreArray[4] = 500; break;
		case 4: scoreArray[4] = 1000; break;
		case 5: scoreArray[4] = 1500; break;
		case 6: scoreArray[4] = 2000; break;
		default: scoreArray[4] = 0;
	}
	switch (sixes.length) {
		case 3: scoreArray[5] = 600; break;
		case 4: scoreArray[5] = 1200; break;
		case 5: scoreArray[5] = 1800; break;
		case 6: scoreArray[5] = 2400; break;
		default: scoreArray[5] = 0;
	}
	return scoreArray[0] + scoreArray[1] + scoreArray[2] + scoreArray[3] + scoreArray[4] + scoreArray[5];
}

function hotDice(dice) {
	var counter = 0;
	for (var i = 0; i < 6; i++) {
		if (diceArray[i].available === false) {
			counter++;
		}
	}
	if (counter === 6 && tempScore !== 0) {
		$("#instructions").text("You have Hot Dice! Keep rolling or bank your score.");
		youHaveHotDice = true;
	}
}	

function addCommas(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

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

function game() {
    this.Name = Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, "")
        .substr(0, 5);
    this.players = [];
    this.messages = [];
    this.started = false;
    this.turnindex = 0;
    this.die = 0;
    this.firstconnection = false;
    this.turn = {
        roll_count: 0,
        tempscore: 0,
        score: 0,
    };
    this.scoreToWin = 10000;

    this.dice = function() {
        let dice = [];
        for (i = 0; i < 6; i++) {	
            dice[i] = {};						
            dice[i].id = i;
            dice[i].value = 0;
            dice[i].available = true;
        }
        return dice;
    }

    this.diceindex = [];

    this.nextturn = function nextturn() {
        this.turnindex = (this.turnindex + 1) % this.players.length;
        for (i = 0; i < 6; i++) {	
            this.dice[i] = {};						
            this.dice[i].id = i;
            this.dice[i].value = null;
            this.dice[i].available = true;
        }
        this.turn.roll_count = 0;
        this.turn.score = 0;
    };

    
    this.calculateRoll = function (index) {
        let calculateDice = [];
        for (let i = 0; i < index.length; i++) {
            calculateDice.push(this.dice[index[i]]);
        }
        return calculateRollScore(calculateDice);
    }

    this.roll = function (index) {
        console.log("Dice index: ", index);
        this.dice = index;
        /*for (let i = 0; i < index.length; i++) {
            this.dice[i] = {
                id: i,
                value: Math.floor(Math.random() * 6 + 1),
                avalible: this.dice[i].avalible,
            };
        }*/
        var scoreddice = [];
        //set all the dice not in the index to unavalible
        //use DiceHeld to determine if a dice was selected to be held per the rules of Farkle

        let DiceHeld = false;
        for (let i = 0; i < 6; i++) {
            if (index.includes(i) == false) {
                if (this.dice[i].avalible == true) {
                    DiceHeld = true;
                    scoreddice.push(this.dice[i].value);
                    this.dice[i].avalible = false;
                }
            }
        }
        console.log(this.turn.roll_count, DiceHeld);
        if (!DiceHeld && this.turn.roll_count > 0) {
            return false;
        }
        this.turn.score += calculateRollScore(scoreddice);

        if (
            Score(
                this.dice
                    .filter((x) => {
                        return x.avalible == true;
                    })
                    .map((y) => y.value),
                0
            ) == 0
        ) {
            //farkle occured
            this.turn.score = 0;
            return false;
        }
        this.turn.roll_count++;
        return true;
        // debugger
    };

    this.addplayer = function addplayer(Player) {
        this.players.push(Player);
    };

    this.isHost = function isHost(socket) {
        for (i = 0; i < this.players.length; i++) {
            if (socket.id == this.players[i].id) {
                return true;
            }
            return false;
        }
    };
    this.hasWon = function isWon(game) {
        return game.players
            .map((player) => player.score)
            .findIndex((score) => score > winscore);
    };

    this.Bank = function Bank(socket) {
        if (socket.id == this.players[this.turnindex].id && this.started == true) {
            //debugger
            this.turn.score += Score(
                this.dice
                    .filter((x) => {
                        return x.avalible == true;
                    })
                    .map((y) => y.value),
                0
            );
            if (
                !(this.players[this.turnindex].score == 0) ||
                this.turn.score >= 1000
            ) {
                this.players[this.turnindex].score += this.turn.score;
            }
            this.turn.score = 0;
            this.nextturn();
            return true;
        }
        //this.nextturn()
    };
}
module.exports = game;
