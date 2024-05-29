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
/*the idea of this function is that we start checking the dice for the highest scoring roll conditions first, then we run re-run the 
functions with the dice used in the first conditon filtered out till no more condtions are met and return the score.  , writing it down here so I remember what I was thinking.
*/
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
      score,
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
      score,
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
      score,
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
      score,
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
  this.fistconnection = false;
  this.turn = {
    roll_count: 0,
    score: 0,
  };
  this.scoreToWin = 10000;

  this.dice = new Array(6).fill(
    {
      value: 0,
      avalible: true,
    },
    0,
    6,
  );
  //debugger
  this.diceindex = [];

  this.nextturn = function nextturn() {
    this.turnindex = (this.turnindex + 1) % this.players.length;
    this.dice.fill(
      {
        value: null,
        avalible: true,
      },
      0,
      6,
    );
    this.turn.roll_count = 0;
    this.turn.score = 0;
  };

  this.roll = function (index) {
    console.log("Index: ", index);
    for (let i = 0; i < index.length; i++) {
      this.dice[index[i]] = {
        value: Math.floor(Math.random() * 6 + 1),
        avalible: this.dice[index[i]].avalible,
      };
    }
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
    this.turn.score += Score(scoreddice, 0);

    if (
      Score(
        this.dice
          .filter((x) => {
            return x.avalible == true;
          })
          .map((y) => y.value),
        0,
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
  this.isWon = function isWon(game) {
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
        0,
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
