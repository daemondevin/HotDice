export default function calculateScore() {
    tempScore = 0;
	$("#roll-score").text(addCommas(tempScore));
  var diceCounts = [0, 0, 0, 0, 0, 0];
  for (var i = 0; i < 6; i++) {
    if (diceArray[i].state === 1) {
      diceCounts[diceArray[i].value - 1]++;
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
  $("#current-score").text(addCommas(score));
  tempScore = score;
  //return score;
	$("#current-score").text(addCommas(tempScore));
	if(player1.turn === true) {
		$("#player1-roll").text(addCommas(tempScore));
		tempRoundScore = roundScore + tempScore;
		$("#player1-round").text(addCommas(tempRoundScore));
	} else {
		$("#player2-roll").text(addCommas(tempScore));
		tempRoundScore = roundScore + tempScore;
		$("#player2-round").text(addCommas(tempRoundScore));
	}
}