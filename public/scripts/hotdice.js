var player1 = {};
var player2 = {};
player1.score = 0; // set initial values to zero
player2.score = 0;
var roundScore = 0;
var rollScore = 0;
var tempScore = 0;
player1.name = "Player One";
player2.name = "Player Two";
player1.turn = true;
player2.turn = false;
var request = "none";
var diceArray = []; // array for keeping track of everything
var onePlayerVisited = false;
var lastRound = false;
var youHaveHotDice = false;
var tempRoundScore;

$(document).ready(function () {
    //set initial values for dice array object
    for (i = 0; i < 6; i++) {
        diceArray[i] = {};
        diceArray[i].id = "#die" + (i + 1);
        diceArray[i].value = i + 1;
        diceArray[i].state = 0;
    }
    $("#instructions")
        .fadeTo(1000, 0.4)
        .fadeTo(1000, 1) //a couple of fades to draw
        .fadeTo(1000, 0.4)
        .fadeTo(1000, 1); //attention to the instructions
    $("#rules").click(function () {
        $("aside").slideToggle("slow", function () {
            $("#rules").text(
                $(this).is(":hidden")
                    ? "Show instructions"
                    : "Hide instructions"
            );
        });
    });
});

function addNames() {
    player1.name = prompt("Player one: please enter your name");
    player2.name = prompt("Player two: please enter your name");
    if (player1.name.substring(0, 1) === " " || player1.name === "") {
        player1.name = "Player One"; //input default values if needed
    }
    if (player2.name.substring(0, 1) === " " || player2.name === "") {
        player2.name = "Player Two"; //input default values if needed
    }
    if (player1.turn === true) {
        $("#instructions").text(
            player1.name + ": start your round by rolling the dice."
        );
    } else {
        $("#instructions").text(
            player2.name + ": start your round by rolling the dice."
        );
    }
    $(".player1-name").text(player1.name);
    $("#current-name").text(player1.name);
    $("#site-title")
        .css("color", "#AFF584")
        .text(player1.name + " Rolling");
    $(".player2-name").text(player2.name);
}

function reloadPage() {
    location.reload(true);
}

function initiateRoll() {
    $(document).ready(function () {
        $("img").off(); //remove event handlers to start with
        if (onePlayerVisited === false) {
            //since the player rolled
            $("#one-player").fadeOut("slow"); //no longer need to display the one player button
            onePlayerVisited = true; //so fade out button and set to true so we don't
        } //try to fade the button out again
        request = "roll"; //let the gameController know that the player wants to roll
        gameController(); //go to the gameController now that the request has been set
    });
}

function rollDice() {
    for (var i = 0; i < 6; i++) {
        //loop through the dice
        if (diceArray[i].state === 0) {
            //roll die that are rollable (state = 0)
            $(diceArray[i].id).removeClass("more-faded"); //if they are faded on the first roll, unfade them
            diceArray[i].value = Math.floor(Math.random() * 6 + 1); //rolled dice get new numbers
        }
    }
}

function updateImage() {
    var dieImage;
    for (var i = 0; i < 6; i++) {
        switch (diceArray[i].value) {
            case 1:
                dieImage =
                    "data:image/png;base64,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";
                break;
            case 2:
                dieImage =
                    "data:image/png;base64,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";
                break;
            case 3:
                dieImage =
                    "data:image/png;base64,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";
                break;
            case 4:
                dieImage =
                    "data:image/png;base64,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";
                break;
            case 5:
                dieImage =
                    "data:image/png;base64,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";
                break;
            case 6:
                dieImage =
                    "data:image/png;base64,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";
                break;
        }
        $(diceArray[i].id).attr("src", dieImage);
    }
}

function selectDice() {
    $("img").on("click", imageClick);
}
function imageClick() {
    var i = $(this).data("number"); //get the data-number value which corresponds to clicked die's position
    if (diceArray[i].state === 0 || diceArray[i].state === 1) {
        //if not scored on a previous roll
        $(this).toggleClass("faded"); //toggle the fade class when die is clicked
        if (diceArray[i].state === 0) {
            //also toggle the state to match
            diceArray[i].state = 1;
        } else {
            diceArray[i].state = 0;
        }
    }
    calculateRollScore(); //update the score for this roll with each click
    hotDice();
}

function calculateScore() {
    tempScore = 0;
    $("#roll-score").text(addCommas(tempScore));
    var ones = [];
    var twos = [];
    var threes = [];
    var fours = [];
    var fives = [];
    var sixes = [];
    var scoreArray = [];
    for (var i = 0; i < 6; i++) {
        //test out totals, etc.
        if (diceArray[i].state === 1) {
            switch (diceArray[i].value) {
                case 1:
                    ones.push(1);
                    break;
                case 2:
                    twos.push(2);
                    break;
                case 3:
                    threes.push(3);
                    break;
                case 4:
                    fours.push(4);
                    break;
                case 5:
                    fives.push(5);
                    break;
                case 6:
                    sixes.push(6);
                    break;
            }
        }
    }
    switch (ones.length) {
        case 1:
            scoreArray[0] = 100;
            break;
        case 2:
            scoreArray[0] = 200;
            break;
        case 3:
            scoreArray[0] = 1000;
            break;
        case 4:
            scoreArray[0] = 2000;
            break;
        case 5:
            scoreArray[0] = 3000;
            break;
        case 6:
            scoreArray[0] = 4000;
            break;
        default:
            scoreArray[0] = 0;
    }
    switch (twos.length) {
        case 3:
            scoreArray[1] = 200;
            break;
        case 4:
            scoreArray[1] = 400;
            break;
        case 5:
            scoreArray[1] = 600;
            break;
        case 6:
            scoreArray[1] = 800;
            break;
        default:
            scoreArray[1] = 0;
    }
    switch (threes.length) {
        case 3:
            scoreArray[2] = 300;
            break;
        case 4:
            scoreArray[2] = 600;
            break;
        case 5:
            scoreArray[2] = 900;
            break;
        case 6:
            scoreArray[2] = 1200;
            break;
        default:
            scoreArray[2] = 0;
    }
    switch (fours.length) {
        case 3:
            scoreArray[3] = 400;
            break;
        case 4:
            scoreArray[3] = 800;
            break;
        case 5:
            scoreArray[3] = 1200;
            break;
        case 6:
            scoreArray[3] = 1600;
            break;
        default:
            scoreArray[3] = 0;
    }
    switch (fives.length) {
        case 1:
            scoreArray[4] = 50;
            break;
        case 2:
            scoreArray[4] = 100;
            break;
        case 3:
            scoreArray[4] = 500;
            break;
        case 4:
            scoreArray[4] = 1000;
            break;
        case 5:
            scoreArray[4] = 1500;
            break;
        case 6:
            scoreArray[4] = 2000;
            break;
        default:
            scoreArray[4] = 0;
    }
    switch (sixes.length) {
        case 3:
            scoreArray[5] = 600;
            break;
        case 4:
            scoreArray[5] = 1200;
            break;
        case 5:
            scoreArray[5] = 1800;
            break;
        case 6:
            scoreArray[5] = 2400;
            break;
        default:
            scoreArray[5] = 0;
    }
    tempScore =
        scoreArray[0] +
        scoreArray[1] +
        scoreArray[2] +
        scoreArray[3] +
        scoreArray[4] +
        scoreArray[5];
    $("#roll-score").text(addCommas(tempScore));
    if (player1.turn === true) {
        $("#player1-roll").text(addCommas(tempScore));
        tempRoundScore = roundScore + tempScore;
        $("#player1-round").text(addCommas(tempRoundScore));
    } else {
        $("#player2-roll").text(addCommas(tempScore));
        tempRoundScore = roundScore + tempScore;
        $("#player2-round").text(addCommas(tempRoundScore));
    }
}

function calculateRollScore() {
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
    $("#roll-score").text(addCommas(score));
    tempScore = score;
    //return score;
    $("#roll-score").text(addCommas(tempScore));
    if (player1.turn === true) {
        $("#player1-roll").text(addCommas(tempScore));
        tempRoundScore = roundScore + tempScore;
        $("#player1-round").text(addCommas(tempRoundScore));
    } else {
        $("#player2-roll").text(addCommas(tempScore));
        tempRoundScore = roundScore + tempScore;
        $("#player2-round").text(addCommas(tempRoundScore));
    }
}

function hotDice() {
    var counter = 0;
    for (var i = 0; i < 6; i++) {
        if (diceArray[i].state === -1 || diceArray[i].state === 1) {
            counter++;
        }
    }
    if (counter === 6 && tempScore !== 0) {
        $("#instructions").text(
            "You have Hot Dice! Keep rolling or bank your score."
        );
        youHaveHotDice = true;
    }
}

function addCommas(nStr) {
    nStr += "";
    x = nStr.split(".");
    x1 = x[0];
    x2 = x.length > 1 ? "." + x[1] : "";
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + x2;
}

function bankScore() {
    $(document).ready(function () {
        $("img").off(); //remove event handler
        request = "bank"; //let the gameController know that the player wants to bank
        gameController(); //go to the gameController now that the request has been set
    });
}

function checkForWin() {
    if (player2.score === player1.score && lastRound === true) {
        //compare scores to evaluate for a win
        $("#instructions").text("Game over. It's a tie!!!");
        $("#site-title")
            .css("color", "#AFF584")
            .text("Game over. It's a tie!!!");
        player1.score = 0;
        player2.score = 0;
        roundScore = 0;
        lastRound = false;
        confetti();
    }
    if (player1.score > player2.score && lastRound === true) {
        $("#instructions").text(
            "Congratulations, " + player1.name + " wins!!!"
        );
        $("#site-title")
            .css("color", "#AFF584")
            .text("Congratulations, " + player1.name + " wins!!!");
        player1.score = 0;
        player2.score = 0;
        roundScore = 0;
        lastRound = false;
        confetti();
    }
    if (player2.score > player1.score && lastRound === true) {
        $("#instructions").text(
            "Congratulations, " + player2.name + " wins!!!"
        );
        $("#site-title")
            .css("color", "#AFF584")
            .text("Congratulations, " + player2.name + " wins!!!");
        player1.score = 0;
        player2.score = 0;
        roundScore = 0;
        lastRound = false;
        confetti();
    }
    if (player1.score >= 10000 && lastRound !== true) {
        $("#instructions").text(
            player1.name +
                " topped 10,000. " +
                player2.name +
                " gets one last round."
        );
        lastRound = true;
    }
    if (player2.score >= 10000 && lastRound !== true) {
        $("#instructions").text(
            player2.name +
                " topped 10,000. " +
                player1.name +
                " gets one last round."
        );
        lastRound = true;
    }
}

$(document).ready(function () {
    //create area in upper right corner to activate confetti
    var clickableArea = $("<div id='clickable'></div>"); //manual activation is for demonstration purposes
    $("body").prepend(clickableArea);
    $("#clickable")
        .css("position", "absolute")
        .css("width", "50px")
        .css("height", "50px")
        .css("background", "transparent")
        .css("cursor", "pointer");
    $("#clickable").on("click", function () {
        confetti();
    });
});

function confetti() {
    //loop for creating confetti with delay
    for (var i = 0; i < 300; i++) {
        setTimeout(function () {
            addConfetti(i);
        }, 30 * i);
    }
}
function addConfetti(i) {
    //a div is created for each particle
    var totalTime = 3000;
    var pageWidth = $(window).width();
    var pageHeight = $(window).height();
    var particleBlue = [];
    var particleGreen = [];
    var xPositionBlue = [];
    var yPositionBlue = [];
    var xPositionGreen = [];
    var yPositionGreen = [];
    particleBlue[i] = $("<div class='confettiParticle'></div>");
    particleGreen[i] = $("<div class='confettiParticle'></div>");
    xPositionBlue[i] = randomPosition(pageWidth);
    yPositionBlue[i] = randomPosition(pageHeight);
    xPositionGreen[i] = randomPosition(pageWidth);
    yPositionGreen[i] = randomPosition(pageHeight);
    $("body").prepend(particleBlue[i]);
    $("body").prepend(particleGreen[i]);
    $(particleBlue[i])
        .css("position", "absolute") //the blue confetti
        .css("width", "4px")
        .css("height", "4px")
        .css("background", "#7848FE")
        .css("left", xPositionBlue[i])
        .css("top", yPositionBlue[i])
        .css("opacity", "0")
        .css("z-index", "1000")
        .animate({ opacity: 1 }, 50)
        .animate({ top: yPositionBlue[i] + 600, opacity: 0 }, 3000);
    $(particleGreen[i])
        .css("position", "absolute") //the green confetti
        .css("width", "4px")
        .css("height", "4px")
        .css("background", "#AFF584")
        .css("left", xPositionGreen[i])
        .css("top", yPositionGreen[i])
        .css("opacity", "0")
        .css("z-index", "1000")
        .animate({ opacity: 1 }, 50)
        .animate({ top: yPositionGreen[i] + 600, opacity: 0 }, 3000);
    setTimeout(function () {
        //Don't leave a mess behind, clean up the confetti!!!
        $(".confettiParticle").remove();
    }, 12100);
}
function randomPosition(dimension) {
    var position = Math.floor(Math.random() * (dimension - 52) + 20); //10px margin each side
    return position;
}

function switchPlayers() {
    if (player1.turn === true) {
        player1.turn = false;
        player2.turn = true;
        player1.score = player1.score + roundScore;
        $("#player1-total").text(addCommas(player1.score));
        if (roundScore === 0) {
            $("#player1-round").text("Farkle!!!");
        } else {
            $("#player1-round").text(addCommas(roundScore));
        }
        roundScore = 0;
        $("#player1-roll").text(addCommas(rollScore));
        $("#instructions").text(
            player2.name + ": start your round by rolling the dice."
        );
        $("#current-name").text(player2.name);
        $("#site-title")
            .css("color", "#AFF584")
            .text(player2.name + " rolling");
    } else {
        player1.turn = true;
        player2.turn = false;
        player2.score = player2.score + roundScore;
        $("#player2-total").text(addCommas(player2.score));
        if (roundScore === 0) {
            $("#player2-round").text("Farkle!!!");
        } else {
            $("#player2-round").text(addCommas(roundScore));
        }
        roundScore = 0;
        $("#player2-roll").text(addCommas(rollScore));
        $("#instructions").text(
            player1.name + ": start your round by rolling the dice."
        );
        $("#current-name").text(player1.name);
        $("#site-title")
            .css("color", "#AFF584")
            .text(player1.name + " Rolling");
    }
}

function gameController() {
    if (player1.name === null) {
        player1.name = "Player One"; //input default values if name input was cancelled from alert box
    }
    if (player2.name === null) {
        player2.name = "Player Two"; //input default values if name input was cancelled from alert box
    }
    if (request === "roll") {
        rollScore = tempScore; //pass off score from last roll
        if (rollScore === 0) {
            //if there was no score in the last roll
            roundScore = 0; //the round score is now zero (Farkled)
        }
        roundScore = roundScore + rollScore; //register score from last roll
        if (player1.turn === true) {
            $("#player1-roll").text("0");
        } else {
            $("#player2-roll").text("0");
        }
        if (player1.turn === true) {
            //update display for current player
            $("#player1-round").text(addCommas(roundScore));
        } else {
            $("#player2-round").text(addCommas(roundScore));
        }
        for (var i = 0; i < 6; i++) {
            //update state for dice previously rolled
            if (diceArray[i].state === 1) {
                diceArray[i].state = -1;
                $(diceArray[i].id).removeClass("faded").addClass("more-faded");
            }
        }
        if (youHaveHotDice === true) {
            //if hot dice, reset for continued rolling
            for (i = 0; i < 6; i++) {
                diceArray[i].state = 0;
            }
        }
        tempScore = 0;
        $("#roll-score").text(addCommas(tempScore));
        rollDice(); //roll any dice that can be rolled
        updateImage(); //make images match new dice values
        if (youHaveHotDice === true) {
            $("#instructions").text(
                "You have Hot Dice! Keep rolling or bank your score."
            );
        } else {
            $("#instructions").text("Select scoring dice, then Roll or Bank.");
        }
        youHaveHotDice = false; //reset the hot dice indicator
        selectDice(); //allow player to click dice for scoring, calls function to calculate score
    }
    if (request === "bank") {
        rollScore = tempScore; //pass off score from last roll
        if (rollScore === 0) {
            //if there was no score in the last roll
            roundScore = 0; //the round score is now zero (Farkled)
        }
        tempScore = 0; //reset the temporary score to zero
        $("#roll-score").text(addCommas(tempScore)); //replace the text with zero value
        roundScore = roundScore + rollScore; //register score from last roll
        $("#instructions").text("Select scoring dice, then Roll or Bank.");
        for (var i = 0; i < 6; i++) {
            //remove faded and more-faded classes
            diceArray[i].state = 0;
            $(diceArray[i].id)
                .removeClass("faded")
                .removeClass("more-faded")
                .addClass("more-faded");
        }
        switchPlayers();
        checkForWin(); //check to see if either player has topped 10,000
    }
}
