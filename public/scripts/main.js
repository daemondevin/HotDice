import * as modal from "https://esm.sh/gh/daemondevin/cdn/ModalDialog.js";
import { swap, getCurrentTimestamp, timeToWords } from "./utils.js";

(function () {
    var src = "//cdn.jsdelivr.net/npm/eruda";
    if (
        !/eruda=true/.test(window.location) &&
        localStorage.getItem("active-eruda") != "true"
    )
        return;
    document.write("<scr" + 'ipt src="' + src + '"></scr' + "ipt>");
    document.write("<scr" + "ipt>eruda.init();</scr" + "ipt>");
})();

//establish a socket connection to the server
var socket = io(window.location.pathname);

let diceImgArray = document.querySelectorAll(".dice.image");
var diceLocal = [];
var diceindex = [0, 1, 2, 3, 4, 5];
let dice = [];

function initDice () {
    for (let i = 0; i < 6; i++) {	
        dice[i] = {};						
        dice[i].id = i;
        dice[i].value = null;
        dice[i].available = true;
    }
    console.log(dice);
    return dice;
}
var ismyturn = false;

const template = [
    '<div class="event">',
    '<div class="label">',
    '<img src="/img/{{ img }}.svg">',
    "</div>",
    '<div class="content">',
    '<div class="right floated date" data-timestamp="{{timestamp}}" style="font-size:.8em;"></div>',
    '<div class="summary">{{author}}</div>',
    '<div class="extra text">{{text}}</div>',
    "</div>",
    "</div>",
].join("");

//diceEventListeners();
initDice();


$(".new.button").on("click", function () {
    fetch("/api/newgame/")
        .then((resp) => {
            return resp.json();
        })
        .then((data) => {
            console.log(data);
            window.location.href = window.location + data.Name;
        });
});

$("#NewGameName").on("keypress", function () {
    fetch("/api/newgame/")
        .then((resp) => {
            return resp.json();
        })
        .then((data) => {
            console.log(data);
            window.location.href = window.location + data.Name;
        });
});

$("#rulesBtn").on("click", function () {
    $(".ui.rules.flyout").flyout("show");
});

$("#toggleChat").on("click", function () {
    $(".chat.flyout").flyout("toggle");
});

$("#chat-message").on("keypress", function (e) {
    if (e.key === "Enter" || e.keyCode === 13) {
        e.preventDefault();
        $("#chat-message").val() !== "" ? sendmsg() : "";
    }
});

$("#sendChatMsg").on("click", function () {
    $("#chat-message").val() !== "" ? sendmsg() : "";
});

$("#copyInvite").on("click", () => {
    let ta = document.createElement("textarea");
    ta.value = document.location;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    console.log("invite link copied");
    $.toast({
        showIcon: "copy",
        displayTime: "auto",
        showProgress: "top",
        title: "Copied Invite Link!",
        message: "You can now send the link to a friend!",
        class: "small black",
        className: {
            toast: "ui icon message",
        },
    });
});

function rand() {
    return Math.floor(Math.random() * 5 + 1);
}

async function playerdisconnect(player) {
    let result = await modal.alert(
        `Sorry ${player.name} but you have lost the connection with the server. You will now be taken to the lobby as this game is over.`,
        "Connection Lost"
    );
    if (result) {
        window.setTimeout(() => {
            window.location.href = "../";
        }, 1000 * 5);
    }
}

async function rollanim(dice) {
    for (let i = 0; i <= 6; i++) {
        if (dice[i].avalible) {
            document.getElementById(i).style.backgroundColor = "white";
        } else {
            document.getElementById(i).style.backgroundColor = "grey";
        }
    }
    let changes = 0;
    let interval = window.setInterval(function () {
        changes++;

        for (let i = 0; i <= 6; i++) {
            if (dice[i].avalible) {
                document
                    .getElementById(i)
                    .setAttribute("src", "/img/dice" + rand() + ".svg");
            }
        }
        if (changes > 30) {
            for (let i = 0; i <= 6; i++) {
                document
                    .getElementById(i)
                    .setAttribute("src", "/img/dice" + dice[i].value + ".svg");
            }
            window.clearInterval(interval);
        }
    }, 100);
}

function gamestart() {
    socket.emit("GameStart");
    $("#GameStart").hide();
}

async function roll(dice) {
    for (let i = 0; i < 6; i++) {
        if (dice[i].available === true) {
            dice[i].id = i;
            dice[i].value = Math.floor(Math.random() * 6 + 1);
            dice[i].avalible = dice[i].avalible;
            console.log("Roll: " + dice[i].value);
        }
    }
    await rollanim(dice);
    selectDice();
}

function Bank() {
    socket.emit("bank");
}

function addmsg(string) {
    socket.emit("addmsg", string);
    let now = getCurrentTimestamp();
    let chatlog = $("#chatlog");
    let data = {
        author: "FarkleBot",
        timestamp: now,
        img: "bot",
        text: string,
    };
    chatlog.append(swap(template, data));
    let date = $("div.date");
    date.text(timeToWords(date.attr("data-timestamp")));
    setInterval(function () {
        date.text(timeToWords(date.attr("data-timestamp")));
    }, 30000);
}
socket.on("addmsg", function (msg) {
    console.log(msg.sender + " triggered an event.");
    let now = getCurrentTimestamp();
    let chatlog = $("#chatlog");
    let data = {
        author: FarkleBot,
        timestamp: now,
        img: "bot",
        text: msg.msg,
    };
    chatlog.append(swap(template, data));
    let date = $("div.date");
    date.text(timeToWords(date.attr("data-timestamp")));
    setInterval(function () {
        date.text(timeToWords(date.attr("data-timestamp")));
    }, 30000);
});

function sendmsg() {
    let message = $("#chat-message").val();
    socket.emit("msg", message);
    let now = getCurrentTimestamp();
    let chatlog = $("#chatlog");
    let data = {
        author: "You",
        timestamp: now,
        img: "avatar",
        text: $("#chat-message").val(),
    };
    chatlog.append(swap(template, data));
    let date = $("div.date");
    date.text(timeToWords(date.attr("data-timestamp")));
    setInterval(function () {
        date.text(timeToWords(date.attr("data-timestamp")));
    }, 30000);
    $("#chat-message").val("");
}
socket.on("msg", function (msg) {
    console.log(msg);
    let now = getCurrentTimestamp();
    let chatlog = $("#chatlog");
    let data = {
        author: msg.sender,
        timestamp: now,
        img: "avatar",
        text: msg.msg,
    };
    chatlog.append(swap(template, data));
    let date = $("div.date");
    date.text(timeToWords(date.attr("data-timestamp")));
    setInterval(function () {
        date.text(timeToWords(date.attr("data-timestamp")));
    }, 30000);
});
socket.on("connection", console.log("New game connected."));

function join(playername) {
    socket.emit("playerjoin", {
        name: playername,
    });
}
socket.on("playerupdate", (players, turnindex) => {
    let $playerList = $("#PlayerList");
    let playerlist = document.getElementById("PlayerList");
    //in production app we should NOT share socket ID's
    playerlist.innerHTML = "";
    console.log(players);
    if (players.filter((player) => player.host)[0].id != socket.id) {
        console.log("player is not host!");
    }
    for (let i = 0; i < players.length; i++) {
        console.log("Player number: " + players[i]);
        let div = document.createElement("div");
        div.classList.add("ui");
        div.classList.add("small");
        div.classList.add("item");
        div.classList.add("horizontal");
        div.classList.add("statistic");
        let name = document.createElement("div");
        name.classList.add("label");
        let score = document.createElement("div");
        score.classList.add("right");
        score.classList.add("floated");
        score.classList.add("value");

        div.appendChild(name);
        div.appendChild(score);
        if (i == turnindex) {
            name.innerHTML =
                `<div class="ui primary empty circular horizontal label"></div> <i class="child icon"></i> ` +
                players[i].name;
        } else {
            name.innerHTML = `<i class="male icon"></i> ` + players[i].name;
        }
        score.innerHTML = players[i].score;
        name.setAttribute("data-player-name", players[i].name);
        score.setAttribute("data-player-score", players[i].score);

        playerlist.appendChild(div);
    }
});

socket.on("newturn", (player) => {
    ismyturn = player.id == socket.id;
    if (ismyturn) {
        diceindex = [0, 1, 2, 3, 4, 5];
    } else {
        $("#bankBtn").hide();
    }
    if (ismyturn) {
        $("#rollBtn").show();
    } else {
        $("#rollBtn").hide();
    }
});
socket.on("roll_Return", function (dice) {
    selectDice();
    diceLocal = dice;
    rollanim(dice);

    if (ismyturn) {
        $("#bankBtn").show();
    } else {
        $("#bankBtn").hide();
    }
});

socket.on("current-score", function (score) {
    $("#current-score").text(score);
});

socket.on("farkle", function (name) {
    $.toast({
        showIcon: "poo",
        displayTime: "auto",
        showProgress: "top",
        title: "Oops!",
        message: `${name} busted!`,
        class: "small black",
        className: {
            toast: "ui icon message",
        },
    });
});

socket.on("gamewon", async (player) => {
    console.log("game was won by " + player.name);
    let result = await modal.alert(
        `The winner is ${player.name}!`,
        "Congradulations!"
    );
    window.setTimeout(() => {
        window.location.href = "../";
    }, 1000 * 5);
});

socket.on("playerDisconect", function (player) {
    playerdisconnect(player);
});

$("#GameStart").on("click", function () {
    $("#rollBtn, #bankBtn").show();
    gamestart();
});
$("#rollBtn").on("click", function () {
    roll(dice);
});
$("#bankBtn").on("click", function () {
    Bank();
});

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

function selectDice() {
    $(".dice.image").on("click", imageClick);
}
function imageClick() {
    let i = $(this).attr("id"); //get the data-number value which corresponds to clicked die's position
    if (diceLocal[i].available === false) {
        //if not scored on a previous roll
        $(this).toggleClass("selected"); //toggle the fade class when die is clicked
        if (diceLocal[i].available === true) {
            //also toggle the state to match
            diceLocal[i].available = false;
        } else {
            diceLocal[i].available = true;
        }
    }
    calculateRollScore(diceLocal); //update the score for this roll with each click
    hotDice();
}

function hotDice(dice) {
	var counter = 0;
	for (var i = 0; i < 6; i++) {
		if (diceLocal[i].available === false) {
			counter++;
		}
	}
	if (counter === 6) {
		
        $.toast({
            showIcon: "fire",
            displayTime: "auto",
            showProgress: "top",
            title: "Hot Dice!",
            message: "You've got hot dice.. Keep rolling!",
            class: "small red",
            className: {
                toast: "ui icon message",
            },
        });

		youHaveHotDice = true;
	}
}	

function diceEventListeners() {
    for (let i = 0; i < diceImgArray.length; i++) {
        diceImgArray[i].addEventListener("click", function () {
            console.log(ismyturn, diceLocal[i].avalible);
            if (ismyturn && diceLocal[i].avalible) {
                if (diceindex.includes(i)) {
                    diceindex = diceindex.filter((j) => j != i);
                    console.log(
                        "Die #" +
                            i +
                            " with the value of " +
                            diceLocal[i].value +
                            " was selected.."
                    );
                    document.getElementById("d" + i).style.backgroundColor =
                        "grey";
                    $("#current-score").text(calculateRollScore(diceindex));
                } else {
                    diceindex.push(i);
                    console.log(
                        "Die #" +
                            i +
                            "  with the value of " +
                            diceLocal[i].value +
                            " was deselected.."
                    );
                    document.getElementById("d" + i).style.backgroundColor =
                        "white";
                    $("#current-score").text(diceindex);
                }
            }
        });
        //socket.emit("calculate-roll", diceindex);
    }
}
