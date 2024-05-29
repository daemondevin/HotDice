//establish a socket connection to the server
var socket = io(window.location.pathname);

//Show the nameModal to allow users entering the room to give themselves a name.
//nameModal(true);

diceEventListeners();
$("#play").hide();
$(window).on("unload", function () {
  return "Thanks for playing!";
});
let newPlayer;
$(".join.button").on("click", async function () {
  let result = await modal.prompt(
    `Joining a new room..<br/><br/>Please enter your name:`,
    "New Game",
  );
  newPlayer = result;
  join(newPlayer);
  $("#start").hide();
  $("#play").show();
  $("#toggleChat").removeClass("disabled");
  addmsg(newPlayer + " has joined the room.");
});
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
$("#showPlayers").on("click", function () {
  if ($(this).is(":contains('SHOW')")) {
    $(this).html('HIDE PLAYERS&emsp;<i class="users icon"></i></a>');
  } else if ($(this).is(":contains('HIDE')")) {
    $(this).html('SHOW PLAYERS&emsp;<i class="users icon"></i></a>');
  } else {
    // Shouldn't reach this..
  }
  $("#PlayerList").toggle();
});

$("#copyInvite").on("click", () => {
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
  let ta = document.createElement("textarea");
  ta.value = document.location;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
  console.log("invite link copied");
});

function rand() {
  return Math.floor(Math.random() * 6 + 1);
}

async function playerdisconnect(player) {
  let result = await modal.alert(
    `Sorry ${player.name} but you have lost the connection with the server. You will now be taken to the lobby as this game is over.`,
    "Connection Lost",
  );
  if (result) {
    window.setTimeout(() => {
      window.location.href = "../";
    }, 1000 * 5);
  }
}

function rollanim(dice) {
  for (let i = 0; i <= 5; i++) {
    if (dice[i].avalible) {
      document.getElementById("d" + i).style.backgroundColor = "white";
    } else {
      document.getElementById("d" + i).style.backgroundColor = "grey";
    }
  }
  var changes = 0;
  var interval = window.setInterval(function () {
    changes++;

    for (let i = 0; i <= 5; i++) {
      if (dice[i].avalible) {
        document
          .getElementById("d" + i)
          .setAttribute("src", "/img/dice" + rand() + ".svg");
      }
    }
    if (changes > 30) {
      for (let i = 0; i <= 5; i++) {
        document
          .getElementById("d" + i)
          .setAttribute("src", "/img/dice" + dice[i].value + ".svg");
      }
      window.clearInterval(interval);
    }
  }, 100);
}

function gamestart() {
  socket.emit("GameStart");
  //displayButton("GameStart", false);
  $("#GameStart").hide();
}

function roll(dice) {
  socket.emit("roll", dice);
}

function Bank() {
  socket.emit("bank");
}
function addmsg(string) {
  socket.emit("msg", string);
  let chatlog = document.getElementById("chatlog");
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(string));
  chatlog.appendChild(div);
}
function sendmsg() {
  socket.emit("msg", document.getElementById("chatmessage").value);
  let chatlog = document.getElementById("chatlog");
  let div = document.createElement("div");
  div.appendChild(
    document.createTextNode(
      "You: " + document.getElementById("chatmessage").value,
    ),
  );
  chatlog.appendChild(div);
  document.getElementById("chatmessage").value = "";
}
socket.on("msg", function (msg) {
  console.log(msg);
  let chatlog = document.getElementById("chatlog");
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(msg.sender + ": " + msg.msg));
  //to do: rewrite this so on a new message coming in we make a new <li>
  chatlog.appendChild(div);
});
socket.on("connection", console.log("New game connected."));

function join(playername) {
  socket.emit("playerjoin", {
    name: playername,
  });
}
socket.on("playerupdate", (players, turnindex) => {
  //in production app we should NOT share socket ID's
  document.getElementById("PlayerList").innerHTML = "";
  console.log(players);
  if (players.filter((player) => player.host)[0].id != socket.id) {
    console.log("player is not host!");
  }
  let playerlist = document.getElementById("PlayerList");
  for (let i = 0; i < players.length; i++) {
    console.log(players[i]);
    let div = document.createElement("div");
    let name = document.createElement("div");
    let score = document.createElement("div");

    div.appendChild(name);
    div.appendChild(score);
    if (i == turnindex) {
      name.innerHTML =
        `<a class="ui primary empty circular label"></a> ` + players[i].name;
    } else {
      name.innerHTML = players[i].name;
    }
    score.innerHTML = players[i].score;
    name.setAttribute("id", "PlayerListName");
    score.setAttribute("id", "PlayerListScore");

    playerlist.appendChild(div);
  }
});

socket.on("newturn", (player) => {
  ismyturn = player.id == socket.id;
  if (ismyturn) {
    diceindex = [0, 1, 2, 3, 4, 5];
  } else {
    $("#Bank").hide();
  }
  if (ismyturn) {
    $("#RollBtn").show();
  } else {
    $("#RollBtn").hide();
  }
});
socket.on("roll_Return", function (dice) {
  console.log(dice);
  diceLocal = dice;
  /*avalibleDice = dice
    .filter((x) => {
      console.log(x);
      return x.avalible;
    })
    .map((y, i) => {
      return i;
    });*/
  rollanim(dice);

  if (ismyturn) {
    $("#Bank").show();
  } else {
    $("#Bank").hide();
  }
});

socket.on("gamewon", async (player) => {
  console.log("game was won by " + player.name);
  let result = await modal.alert(
    `The winner is ${player.name}!`,
    "Congradulations!",
  );
  window.setTimeout(() => {
    window.location.href = "../";
  }, 1000 * 5);
});

socket.on("playerDisconect", function (player) {
  playerdisconnect(player);
});

var diceLocal = [];
var diceindex = [0, 1, 2, 3, 4, 5];
var ismyturn = false;

$("#GameStart").on("click", function () {
  gamestart();
});
$("#rollBtn").on("click", function () {
  socket.emit("roll", diceindex);
});
$("#Bank").on("click", function () {
  Bank();
});

function diceEventListeners() {
  for (let i = 0; i < document.querySelectorAll(".dice.image").length; i++) {
    document
      .querySelectorAll(".dice.image")
      [i].addEventListener("click", function () {
        console.log(ismyturn, diceLocal[i].avalible);
        if (ismyturn && diceLocal[i].avalible) {
          if (diceindex.includes(i)) {
            diceindex = diceindex.filter((j) => j != i);
            document.getElementById("d" + i).style.backgroundColor = "grey";
          } else {
            diceindex.push(i);
            document.getElementById("d" + i).style.backgroundColor = "white";
          }
        }
      });
  }
}

/*function diceEventListeners() {
  $(".dice.image").each(function (i) {
    $(this).on("click", function () {
      console.log(ismyturn, diceLocal[i].avalible);
      if (ismyturn && diceLocal[i].avalible) {
        if ($.inArray(i, diceindex) !== -1) {
          diceindex = $.grep(diceindex, function (j) {
            return j != i;
          });
          $("#d" + i).css("background-color", "grey");
        } else {
          diceindex.push(i);
          $("#d" + i).css("background-color", "white");
        }
      }
    });
  });
}*/
