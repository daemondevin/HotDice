import * as modal from "https://esm.sh/gh/daemondevin/cdn/ModalDialog.js";

;(function () {
    var src = '//cdn.jsdelivr.net/npm/eruda';
    if (!/eruda=true/.test(window.location) && localStorage.getItem('active-eruda') != 'true') return;
    document.write('<scr' + 'ipt src="' + src + '"></scr' + 'ipt>');
    document.write('<scr' + 'ipt>eruda.init();</scr' + 'ipt>');
})();

//establish a socket connection to the server
var socket = io(window.location.pathname);

var tim = (function(){
    "use strict";

    var start   = "{{",
        end     = "}}",
        path    = "[a-z0-9_$][\\.a-z0-9_]*", // e.g. config.person.name
        pattern = new RegExp(start + "\\s*("+ path +")\\s*" + end, "gi"),
        undef;
    
    return function(template, data){
        // Merge data into the template string
        return template.replace(pattern, function(tag, token){
            var path = token.split("."),
                len = path.length,
                lookup = data,
                i = 0;

            for (; i < len; i++){
                lookup = lookup[path[i]];
                
                // Property not found
                if (lookup === undef){
                    throw "tim: '" + path[i] + "' not found in " + tag;
                }
                
                // Return the required value
                if (i === len - 1){
                    return lookup;
                }
            }
        });
    };
}());

diceEventListeners();
$("#play").hide();
//$("#PlayerList").hide();
let currentPlayer;
$(".join.button").on("click", async function () {
    let result = await modal.prompt(
        `Joining a new room..<br/><br/>Please enter your name:`,
        "New Game",
    );
    currentPlayer = result;
    join(currentPlayer);
    $("#start").hide();
    $("#play").show();
    $("#toggleChat").removeClass("disabled");
    addmsg(currentPlayer + " has joined the room.");
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

function timeToWords(time) {
    let syntax = {
        postfixes: {
            '<': ' ago',
            '>': ' from now'
        },
        1000: {
            singular: 'a few moments',
            plural: 'a few moments'
        },
        60000: {
            singular: 'about a minute',
            plural: '# minutes'
        },
        3600000: {
            singular: 'about an hour',
            plural: '# hours'
        },
        86400000: {
            singular: 'a day',
            plural: '# days'
        },
        31540000000: {
            singular: 'a year',
            plural: '# years'
        }
    };

    var timespans = [1000, 60000, 3600000, 86400000, 31540000000];
    var parsedTime = Date.parse(time.replace(/\-00:?00$/, ''));

    if (parsedTime && Date.now) {
        var timeAgo = parsedTime - Date.now();
        var diff = Math.abs(timeAgo);
        var postfix = syntax.postfixes[(timeAgo < 0) ? '<' : '>'];
        var timespan = timespans[0];

        for (var i = 1; i < timespans.length; i++) {
            if (diff > timespans[i]) {
                timespan = timespans[i];
            }
        }

        var n = Math.round(diff / timespan);

        return syntax[timespan][n > 1 ? 'plural' : 'singular']
            .replace('#', n) + postfix;
    }
}


function getCurrentTimestamp() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

function timeAgo(date) {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInSeconds = Math.floor((now - messageDate) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };

    for (const interval in intervals) {
        const intervalSeconds = intervals[interval];
        const count = Math.floor(diffInSeconds / intervalSeconds);
        if (count >= 1) {
            return `${count} ${interval}${count !== 1 ? 's' : ''} ago`;
        }
    }

    return 'Just now';
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
    socket.emit("addmsg", string);
    //let now = new Date().toISOString().slice(0, 19);
    //let dateInWords = timeToWords(now);
    let now = getCurrentTimestamp();
    //let dateInWords = timeAgo(now);
    let chatlog = $("#chatlog");
    /*let comment = $('<div>').addClass('comment');
    let avatar = $('<a>').addClass('avatar');
    let avatarImg = $('<img>').attr('src', '/img/avatar.svg');
    avatar.append(avatarImg);
    let content = $('<div>').addClass('content');
    let author = $('<div>').addClass('author').text('You');
    let metadata = $('<div>').addClass('metadata');
    let date = $('<span>').addClass('date').attr("data-timestamp", now);
    date.text(timeToWords(date.attr("data-timestamp")));
    setInterval(function() {
        date.text(timeToWords(date.attr("data-timestamp")));
    }, 30000);
    metadata.append(date);
    let text = $('<div>').addClass('text').text(string);
    content.html(author[0].outerHTML + metadata[0].outerHTML + text[0].outerHTML);
    comment.append(avatar, content);*/
    const template = [
        '<div class="event">',
        '<div class="label">',
        '<img src="/img/avatar.svg">',
        '</div>',
        '<div class="content">',
        '<div class="right floated date" data-timestamp="{{timestamp}}" style="font-size:.8em;"></div>',
        '<div class="summary">{{author}}</div>',
        '<div class="extra text">{{text}}</div>',
        '</div>',
        '</div>'
    ].join('');
    let data = {
        author: "FarkleBot",
        timestamp: now,
        text: string
    };
    chatlog.append(tim(template, data));
    let date = $("div.date");
    date.text(timeToWords(date.attr("data-timestamp")));
    setInterval(function() {
        date.text(timeToWords(date.attr("data-timestamp")));
    }, 30000);
}
socket.on("addmsg", function (msg) {
    console.log(msg.sender + " triggered an event.");
    //let now = new Date().toISOString().slice(0, 19);
    //let dateInWords = timeToWords(now);
    let now = getCurrentTimestamp();
    let chatlog = $("#chatlog");
    /*let dateInWords = timeAgo(now);
    let comment = $('<div>').addClass('comment');
    let avatar = $('<div>').addClass('avatar');
    let avatarImg = $('<img>').attr('src', '/img/avatar.svg');
    avatar.append(avatarImg);
    let content = $('<div>').addClass('content');
    let author = $('<a>').addClass('author').text(msg.sender);
    let metadata = $('<div>').addClass('metadata');
    let date = $('<time>').addClass('date');
    if (dateInWords) {
        setInterval(function() {
            date.text(dateInWords);
        }, 10000);
    }
    metadata.append(date);
    let text = $('<div>').addClass('text').text(msg.msg);
    content.append(author, metadata, text);
    comment.append(avatar, content);*/
    const template = [
        '<div class="event">',
        '<div class="label">',
        '<img src="/img/avatar.svg">',
        '</div>',
        '<div class="content">',
        '<div class="right floated date" data-timestamp="{{timestamp}}" style="font-size:.8em;"></div>',
        '<div class="summary">{{author}}</div>',
        '<div class="extra text">{{text}}</div>',
        '</div>',
        '</div>'
    ].join('');
    let data = {
        author: msg.sender,
        timestamp: now,
        text: msg.msg
    };
    chatlog.append(tim(template, data));
    let date = $("div.date");
    date.text(timeToWords(date.attr("data-timestamp")));
    setInterval(function() {
        date.text(timeToWords(date.attr("data-timestamp")));
    }, 30000);
});

function sendmsg() {
    socket.emit("msg", $("#chat-message").val());
    let now = getCurrentTimestamp();
    let chatlog = $("#chatlog");
    const template = [
        '<div class="event">',
        '<div class="label">',
        '<img src="/img/avatar.svg">',
        '</div>',
        '<div class="content">',
        '<div class="right floated date" data-timestamp="{{timestamp}}" style="font-size:.8em;"></div>',
        '<div class="summary">{{author}}</div>',
        '<div class="extra text">{{text}}</div>',
        '</div>',
        '</div>'
    ].join('');
    let data = {
        author: "You",
        timestamp: now,
        text: $("#chat-message").val()
    };
    chatlog.append(tim(template, data));
    let date = $("div.date");
    date.text(timeToWords(date.attr("data-timestamp")));
    setInterval(function() {
        date.text(timeToWords(date.attr("data-timestamp")));
    }, 30000);
    $("#chat-message").val("")
    /*let chatlog = document.getElementById("chatlog");
    let comment = document.createElement("div");
    comment.className = "comment";
    let avatar = document.createElement("div");
    avatar.className = "avatar";
    let img = document.createElement("img");
    img.src = "/img/avatar.svg";
    let content = document.createElement("div");
    content.className = "content";
    let author = document.createElement("div");
    author.textContent = "You"
    author.className = "author";
    let meta = document.createElement("div");
    meta.className = "metadata";
    let time = document.createElement("time");
    time.className = "date";
    //let now = new Date().toISOString().slice(0, 19);
    //var dateInWords = timeToWords(now);
    let dateInWords = timeAgo(now);
    if (dateInWords) {
        setInterval(function() {
            time.textContent = dateInWords;
        }, 10000);
    }
    let text = document.createElement("div");
    text.className = "text";
    text.textContent = document.getElementById("chatmessage").value
    content.appendChild(author);
    content.appendChild(meta.appendChild(time));
    content.appendChild(text);
    comment.appendChild(avatar.appendChild(img));
    comment.appendChild(content.appendChild(author));
    chatlog.appendChild(comment);
    document.getElementById("chatmessage").value = "";*/
}
socket.on("msg", function (msg) {
    console.log(msg);
    let now = getCurrentTimestamp();
    let chatlog = $("#chatlog");
    const template = [
        '<div class="event">',
        '<div class="label">',
        '<img src="/img/avatar.svg">',
        '</div>',
        '<div class="content">',
        '<div class="right floated date" data-timestamp="{{timestamp}}" style="font-size:.8em;"></div>',
        '<div class="summary">{{author}}</div>',
        '<div class="extra text">{{text}}</div>',
        '</div>',
        '</div>'
    ].join('');
    let data = {
        author: msg.sender,
        timestamp: now,
        text: msg.msg
    };
    chatlog.append(tim(template, data));
    let date = $("div.date");
    date.text(timeToWords(date.attr("data-timestamp")));
    setInterval(function() {
        date.text(timeToWords(date.attr("data-timestamp")));
    }, 30000);
    /*let chatlog = document.getElementById("chatlog");
    let comment = document.createElement("div");
    comment.className = "comment";
    let avatar = document.createElement("div");
    avatar.className = "avatar";
    let img = document.createElement("img");
    img.src = "/img/avatar.svg";
    let content = document.createElement("div");
    content.className = "content";
    let author = document.createElement("div");
    author.className = "author";
    author.textContent = msg.sender;
    let meta = document.createElement("div");
    meta.className = "metadata";
    let time = document.createElement("time");
    time.className = "date";
    //let now = new Date().toISOString().slice(0, 19);
    //var dateInWords = timeToWords(now);
    let dateInWords = timeAgo(now);
    if (dateInWords) {
        setInterval(function() {
            time.textContent = dateInWords;
        }, 10000);
    }
    let text = document.createElement("div");
    text.className = "text";
    text.textContent = msg.msg;
    content.appendChild(meta.appendChild(time));
    content.appendChild(author.appendChild(time));
    content.appendChild(text);
    comment.appendChild(avatar.appendChild(img));
    comment.appendChild(content.appendChild(author));
    chatlog.appendChild(comment);*/
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
    /*for (let i = 0; i < players.length; i++) {
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
    }*/
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
            name.innerHTML = 
            `<i class="male icon"></i> ` +
            players[i].name;
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
        $("#Bank").hide();
    }
    if (ismyturn) {
        $("#RollBtn").show();
    } else {
        $("#RollBtn").hide();
    }
});
socket.on("roll_Return", function (dice) {
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
$("#scoreBtn").on("click", function () {
    socket.emit("score");
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
