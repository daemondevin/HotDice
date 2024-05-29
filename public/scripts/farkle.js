import * as CANNON from "cannon-es";
import * as THREE from "three";
import * as modal from "/scripts/ModalDialog.js";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import { OBJLoader } from "three/addons/loaders/OBJLoader";
import { MTLLoader } from "three/addons/loaders/MTLLoader";
import { eruda } from "";


/*
const canvas = document.querySelector("#game-area");

const $canvas = $("#game-area");

let renderer, scene, camera, physicsWorld, raycaster, controls;

// Assuming you have an array of player scores
var playerScores = [];
let selected = { quantity: 0, values: [] };
playerScores[0] = {
  player: "P0",
  thrown: [],
  held: [],
  bank: 0,
  current: 0,
  score: 0,
};

var isGameStarted = false;

var roundScore = 0;
var rollScore = 0;
var tempScore = 0;

var request = "none";
var onePlayerVisited = false;
var lastRound = false;
var youHaveHotDice = false;
var tempRoundScore;

var currentPlayer = 0;
var nbrPlayers = 0;
/* 
// Retrieve the table element
const table = document.getElementById("score-table");
const $table = $("#score-table");
// Get the table body element
const tbody = table.getElementsByTagName("tbody")[0];
const $tbody = $table.find("tbody");
// Get the rows
var rows = tbody.getElementsByTagName("tr");
let $rows = $tbody.find("tr");
let $playerRow = null;
 
const params = {
  numberOfDice: 6,
  segments: 30,
  edgeRadius: 0.07,
  notchRadius: 0.12,
  notchDepth: 0.1,
};

const diceArray = [];
let diceValues = [];

const pointer = new THREE.Vector2();

var isStable = false;
var stableCnt = 0;

canvas.addEventListener("mousedown", onMouseDown);

raycaster = new THREE.Raycaster();

initPhysics();
initScene();

window.addEventListener("resize", updateSceneSize);
*/

////////////////////////////////////////////////////
////////////////////////////////////////////////////
/////////////////////  UI  /////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
/*
const menuContainer = document.querySelector("#welcome");
const contentContainer = document.querySelector("#game");
const playerInput = document.getElementById("player-input");
const $playerInput = $("#player-input");
const $playBtn = $(".play.button");
const $rulesBtn = $(".rules.button");
const $backBtn = $(".back.button");
const $throwBtn = $(".throw.button");
const $bankBtn = $(".bank.button");
const $scoreBtn = $(".score.button");
$throwBtn.on("click", throwDice);
$bankBtn.on("click", nextPlayer);
$scoreBtn.on("click", scoreRoll);

$("#players").dropdown({
  placeholder: "two",
});
$("#game").hide();
//$('#game-action').hide();
$("#rules").hide();

$playBtn.on("click", function () {
  const numPlayers = parseInt($playerInput.val());

  if (numPlayers >= 1 && numPlayers <= 7) {
    $("#welcome").hide();
    $("#rules").hide();
    $("#game").show();
    initializeGame(numPlayers);
  } else {
    console.log("Issue with number of players");
  }
});
*/

/*
$backBtn.on("click", function () {
  $("#welcome").show();
  $("#game").hide();
  $("#rules").hide();
});

$bankBtn.on("click", function () {
  playerScores[currentPlayer].bank += playerScores[currentPlayer].current;
  playerScores[currentPlayer].current = 0;

  checkForWinner();
  resetDie();
  nextPlayer();
});

function initializeGame(numPlayers) {
  console.log("Starting game with " + numPlayers + " players");
  nbrPlayers = numPlayers;
  // Game initialization logic goes here
  // You can access the number of players using the 'numPlayers' parameter
  // Assuming you have an array of player scores

  playerScores = [];

  for (let i = 0; i < numPlayers; i++) {
    playerScores[i] = {
      player: "P" + (i + 1),
      thrown: [],
      held: [],
      bank: 0,
      current: 0,
      score: 0,
    };
  }

  fillScore();

  // Add the highlight-row class to the chosen row
  currentPlayer = 0;
  //var firstCell = rows[currentPlayer].querySelector('td:first-child');
  const P = "P" + (currentPlayer + 1);
  $playerRow = $(`.${P}-row`);
  //$playerRow
  $(`.${P}`)
    .addClass("left black colored blue marked")
    .html(`<i class="child icon"></i> ${P}`);
  $(`.${P}-action`).append($throwBtn).append($bankBtn).append($scoreBtn);
  //let $firstCell = $playerRow.find('td:first-child');
  //firstCell.classList.add('left blue marked');
  //$firstCell.addClass('left blue marked');

  $throwBtn.removeClass("disabled");
  $bankBtn.addClass("disabled");

  for (const dice of diceArray) {
    resetDice(dice.mesh.getObjectByName("outDice"));
    dice.mesh.getObjectByName("outDice").material[0].color = new THREE.Color(
      0xfafafa,
    );
  }

  rows[currentPlayer].scrollIntoView();
}

function max_points(die_arr) {
  const combos = {},
    used_dice = {};
  let points = 0,
    triple_pairs;

  for (let dice of die_arr) {
    // Hashmap die rolls
    combos[dice] = combos[dice] ? combos[dice] + 1 : 1;
  }

  for (let dice_num in combos) {
    if (die_arr.length === 6) {
      // all (6) die combos only

      if (combos[dice_num] === 6)
        // 6 of any number
        return { points: 3000, dice: combos };
      else if (Object.keys(combos).length === 6)
        // straight
        return { points: 1500, dice: combos };
      else if (combos[dice_num] === 3 && Object.keys(combos).length === 2)
        // (2) triplets
        return { points: 2500, dice: combos };
      else if (combos[dice_num] === 4 && Object.keys(combos).length === 2)
        // 4 of any number + pair
        return { points: 1500, dice: combos };
      else if (
        triple_pairs === undefined &&
        combos[dice_num] === 2 &&
        Object.keys(combos).length === 3
      )
        // 3 pairs
        triple_pairs = true;
    }

    if (combos[dice_num] === 5) {
      // 5 of any number
      points += 2000;
      used_dice[dice_num] = 5;
    } else if (combos[dice_num] === 4) {
      // 4 of any number
      points += 1000;
      used_dice[dice_num] = 4;
    } else if (combos[dice_num] === 3) {
      if (+dice_num > 1)
        // 3 of any number except one's
        points += dice_num * 100;
      // 3 of one's
      else points += 300;

      used_dice[dice_num] = 3;
      triple_pairs = false;
    } else if (+dice_num === 1) {
      // single one's
      points += combos[dice_num] * 100;
      used_dice[dice_num] = combos[dice_num];
    } else if (+dice_num === 5) {
      // single five's
      points += combos[dice_num] * 50;
      used_dice[dice_num] = combos[dice_num];
    }
  }

  if (triple_pairs) return { points: 1500, dice: combos };

  return { points: points, dice: used_dice };
}

function updateScores(i) {
  let P = "P" + (i + 1);
  $(`.${P}-bank-score`).html(playerScores[i].bank);
  $(`.${P}-current-score`).html(playerScores[i].current);
}

function scoreRoll() {
  const sel = max_points(selected.values);
  const newPoints = sel.points;

  if (selected.quantity < 1) {
    console.log("Must select at least one dice before scoring");
  } else if (newPoints === 0) {
    console.log("No possible score from selected die");
  } else if (
    selected.quantity != Object.values(sel.dice).reduce((a, b) => a + b, 0)
  ) {
    console.log(`Not all die needed`);
  } else {
    console.log(
      `Selected ${selected.quantity} die at values ${selected.values}`,
    );

    playerScores[currentPlayer].current += newPoints;
    updateScores(currentPlayer);

    selected = { quantity: 0, values: [] };

    $("#roll-btn").removeClass("disabled");
    $("#score-btn").addClass("disabled");
    $("#bank-btn").removeClass("disabled");
  }
}

function fillScore() {
  console.log("Building Scoreboard");

  $tbody.html("");

  for (let i = 0; i < playerScores.length; i++) {
    let P = "P" + (i + 1);
    const player = playerScores[i].player;
    const held = playerScores[i].held;
    const thrown = playerScores[i].thrown;
    const score = playerScores[i].score;

    const $row = $("<tr />");
    $row.addClass(`${P}-row`);

    const $playerCell = $("<td />");
    $playerCell.addClass(`${P}`);
    $playerCell.html(`<i class="male icon"></i> ${player}`);
    $row.append($playerCell);

    const $holdingCell = $("<td />");
    $holdingCell.addClass(`center aligned ${P}-holding`);

    for (let j = 0; j < 6; j++) {
      const $die = $("<div />");
      $die.addClass("dice-button");
      switch (held[j]) {
        case 1:
          $die.html("<i class='dice one icon'></i>");
          break;
        case 2:
          $die.html("<i class='dice two icon'></i>");
          break;
        case 3:
          $die.html("<i class='dice three icon'></i>");
          break;
        case 4:
          $die.html("<i class='dice four icon'></i>");
          break;
        case 5:
          $die.html("<i class='dice five icon'></i>");
          break;
        case 6:
          $die.html("<i class='dice six icon'></i>");
          break;
      }
      $holdingCell.append($die);
    }

    $row.append($holdingCell);

    const $actionCell = $("<td />");
    $actionCell.addClass(`center aligned ${P}-action`);
    $row.append($actionCell);

    const $currentCell = $("<td />");
    $currentCell.addClass(`right aligned ${P}-current-score`);
    $currentCell.html(score);
    $row.append($currentCell);

    const $scoreCell = $("<td />");
    $scoreCell.addClass(`right aligned ${P}-bank-score`);
    $scoreCell.html(score);
    $row.append($scoreCell);

    // Append the row to the table body
    $tbody.append($row);
  }
}

function modifScore(i) {
  let P = "P" + (i + 1);
  const score = playerScores[i].score;
  const held = playerScores[i].held;
  const thrown = playerScores[i].thrown;
  const bank = playerScores[i].bank;
  const current = playerScores[i].current;

  console.log(`Changing ${P}'s Score`);

  // Get the existing row for the player (if it exists)
  const existingRow = rows[i];
  //const $existingRow = $rows.eq(i);
  const $existingRow = $(`.${P}-row`);

  if ($existingRow) {
    // Update the score cell for the player
    const $playersCell = $existingRow.find(`.${P}`);
    $playersCell.append("&emsp;&emsp;&emsp;");
    for (let j = 5; j >= 0; j--) {
      const $die = $("<i />");
      switch (thrown[j]) {
        case 1:
          $die.addClass("ui large dice one icon");
          break;
        case 2:
          $die.addClass("ui large dice two icon");
          break;
        case 3:
          $die.addClass("ui large dice three icon");
          break;
        case 4:
          $die.addClass("ui large dice four icon");
          break;
        case 5:
          $die.addClass("ui large dice five icon");
          break;
        case 6:
          $die.addClass("ui large dice six icon");
          break;
      }
      $playersCell.append($die);
    }
  }
  console.log(playerScores[i]);
}

function nextPlayer() {
  if (!isStable || rows.length < 1) {
    return;
  }
  const oldP = "P" + (currentPlayer + 1);
  // Remove old
  const $oldRow = $(`.${oldP}-row`);
  //$oldRow.removeClass('left black colored blue marked');
  $(`.${oldP}`)
    .removeClass("left black colored blue marked")
    .html(`<i class="male icon"></i> ${oldP}`);

  // Update score
  modifScore(currentPlayer);

  currentPlayer = currentPlayer + 1;

  playerScores[currentPlayer].score = [];
  //playerScores[currentPlayer].throws = 0;
  $throwBtn.removeClass("disabled");
  $bankBtn.addClass("disabled");

  for (const dice of diceArray) {
    resetDice(dice.mesh.getObjectByName("outDice"));
  }

  const newP = "P" + (currentPlayer + 1);
  const $newRow = $(`.${newP}-row`);
  //$newRow;
  $(`.${newP}`)
    .addClass("left black colored blue marked")
    .html(`<i class="child icon"></i> ${newP}`);
  //const row = rows[currentPlayer];
  //cell = row.querySelector('td:first-child');
  //cell.classList.add('left blue marked');

  $newRow[0].scrollIntoView({ block: "end" });
}

function resetDie() {
  const P = "P" + currentPlayer;
  $(`.${P}-current-score"`).text("0");
  playerScores[currentPlayer].current = 0;
  selected = { quantity: 0, values: [] };

  updateScores(currentPlayer);
}

function checkForHotDice() {
  var counter = 0;
  diceArray.forEach((d, dIdx) => {
    if (
      d.mesh.getObjectByName("outDice").state === -1 ||
      d.mesh.getObjectByName("outDice").state === 1
    ) {
      counter++;
    }
    if (counter === 6 && tempScore !== 0) {
      $("#toast-template").toast({
        title: "Hot Dice!",
        message: 'You have Hot Dice! Keep rolling or bank your score."',
        showIcon: "orange fire",
      });
      youHaveHotDice = true;
    }
  });
}

function checkForWinner() {
  if (playerScores[currentPlayer].bank >= 10000) alert("You Win!");
}

function hasFarkled() {
  return max_points(diceValues).points === 0;
}

function calculateRollScore() {
  const P = "P" + (currentPlayer + 1);
  tempScore = 0;
  $(`.${P}-current-score`).text(addCommas(tempScore));
  $("#current-score").text(addCommas(tempScore));
  var ones = [];
  var twos = [];
  var threes = [];
  var fours = [];
  var fives = [];
  var sixes = [];
  var scoreArray = [];

  diceArray.forEach((d, dIdx) => {
    if (d.mesh.getObjectByName("outDice").state === 1) {
      switch (d.mesh.getObjectByName("outDice").value) {
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
  });

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

  $(`.${P}-current-score`).text(addCommas(tempScore));
  $("#current-score").text(addCommas(tempScore));
  tempRoundScore = roundScore + tempScore;
  $(`.${P}-bank-score`).text(addCommas(tempRoundScore));
}

function addCommas(nStr) {
  return Number(nStr).toLocaleString();
}

////////////////////////////////////////////////////
////////////////////////////////////////////////////
///////////////////  Events  ///////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////

function onMouseDown(event) {
  if (!isStable) {
    return;
  }

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    for (let i = 0; i < intersects.length; i++) {
      const intersectedObject = intersects[i].object;

      if (intersectedObject.name === "outDice") {
        toggleDice(intersectedObject);
        break;
      }
    }
  }
}

function toggleDice(diceOutMesh) {
  console.log(
    "Toggled dice number " +
      diceOutMesh.index +
      " with a value of " +
      diceValues[diceOutMesh.index],
  );
  diceOutMesh.isToggled = !diceOutMesh.isToggled;
  if (diceOutMesh.isToggled) {
    selected.quantity++;
    selected.values.push(diceValues[diceOutMesh.index]);
    diceOutMesh.material[0].color.set(0x00ff00);
    diceArray[diceOutMesh.index].body.mass = 1000;
    diceArray[diceOutMesh.index].body.updateMassProperties();
  } else {
    selected.quantity--;
    selected.values = selected.values.filter(
      (val, idx) =>
        idx !== selected.values.indexOf(diceValues[diceOutMesh.index]),
    );
    diceOutMesh.material[0].color.set(0xeeeeee);
    diceArray[diceOutMesh.index].body.mass = 1;
    diceArray[diceOutMesh.index].body.updateMassProperties();
  }
}

function resetDice(diceOutMesh) {
  console.log("Reset dice : " + diceOutMesh.index);
  if (diceOutMesh.isToggled) {
    diceOutMesh.isToggled = false;
    diceOutMesh.material[0].color.set(0xeeeeee);
    diceArray[diceOutMesh.index].body.mass = 1;
    diceArray[diceOutMesh.index].body.updateMassProperties();
  }
}

function throwDice() {
  if (!isStable) {
    console.log("Dice are not stable !");
    $throwBtn.toggleClass("disabled");
    return;
  }

  if (!isGameStarted) {
    isGameStarted = true;
  }

  var oneMoved = false;

  diceArray.forEach((d, dIdx) => {
    if (d.body.mass === 1000) {
      return;
    }
    oneMoved = true;

    stableCnt--;

    throwDie(d, dIdx);
  });

  isStable = !oneMoved;
}

function throwDie(d, dIdx) {
  d.body.velocity.setZero();
  d.body.angularVelocity.setZero();

  d.body.position = new CANNON.Vec3(5, dIdx * 1.5 + 10, 0);
  d.mesh.position.copy(d.body.position);

  d.mesh.rotation.set(
    2 * Math.PI * Math.random(),
    0,
    2 * Math.PI * Math.random(),
  );
  d.body.quaternion.copy(d.mesh.quaternion);

  const forceX = 5 + 25 * Math.random();
  const forceY = 5 + 25 * Math.random();
  d.body.applyImpulse(
    new CANNON.Vec3(-forceX, -forceY, 0),
    new CANNON.Vec3(0, Math.random(), Math.random()),
  );

  d.body.allowSleep = true;
}

function addDiceEvents(dice) {
  dice.body.addEventListener("sleep", (e) => {
    dice.body.allowSleep = false;

    const euler = new CANNON.Vec3();
    e.target.quaternion.toEuler(euler);

    const eps = 0.1;
    let isZero = (angle) => Math.abs(angle) < eps;
    let isHalfPi = (angle) => Math.abs(angle - 0.5 * Math.PI) < eps;
    let isMinusHalfPi = (angle) => Math.abs(0.5 * Math.PI + angle) < eps;
    let isPiOrMinusPi = (angle) =>
      Math.abs(Math.PI - angle) < eps || Math.abs(Math.PI + angle) < eps;

    if (isZero(euler.z)) {
      if (
        !isZero(euler.x) &&
        !isHalfPi(euler.x) &&
        !isMinusHalfPi(euler.x) &&
        !isPiOrMinusPi(euler.x)
      ) {
        console.log("Is one of the dice stuck?");
        dice.body.allowSleep = true;
      }
    } else if (!isHalfPi(euler.z) && !isMinusHalfPi(euler.z)) {
      console.log("Is one of the dice stuck?");
      dice.body.allowSleep = true;
    }

    stableCnt++;
    checkAllStable();
  });
}

function calculateValue(dice, diceId) {
  const euler = new CANNON.Vec3();
  dice.body.quaternion.toEuler(euler);

  const eps = 0.1;
  let isZero = (angle) => Math.abs(angle) < eps;
  let isHalfPi = (angle) => Math.abs(angle - 0.5 * Math.PI) < eps;
  let isMinusHalfPi = (angle) => Math.abs(0.5 * Math.PI + angle) < eps;
  let isPiOrMinusPi = (angle) =>
    Math.abs(Math.PI - angle) < eps || Math.abs(Math.PI + angle) < eps;

  diceValues = playerScores[currentPlayer].thrown;

  if (isZero(euler.z)) {
    if (isZero(euler.x)) {
      diceValues[diceId] = 1;
    } else if (isHalfPi(euler.x)) {
      diceValues[diceId] = 4;
    } else if (isMinusHalfPi(euler.x)) {
      diceValues[diceId] = 3;
    } else if (isPiOrMinusPi(euler.x)) {
      diceValues[diceId] = 6;
    } else {
      console.log("Is one of the dice stuck?");
    }
  } else if (isHalfPi(euler.z)) {
    diceValues[diceId] = 2;
  } else if (isMinusHalfPi(euler.z)) {
    diceValues[diceId] = 5;
  } else {
    console.log("Is one of the dice stuck?");
  }
}

function checkAllStable() {
  if (stableCnt != diceArray.length) {
    console.log("Some dice are not stable...");
    return;
  }
  var checkStable = true;

  diceArray.forEach((d, dIdx) => {
    if (d.body.allowSleep) {
      checkStable = false;
      stableCnt--;
      throwDie(d, dIdx);
    }
  });

  isStable = checkStable;

  if (isStable) {
    console.log("Dice are stable!");

    if (!isGameStarted) {
      return;
    }

    for (let i = 0; i < diceArray.length; i++) {
      calculateValue(diceArray[i], i);
    }

    calculateRollScore();
    checkForHotDice();

    if (hasFarkled()) {
      resetDie();
      nextPlayer();
    } else {
      $scoreBtn.toggleClass("disabled");
      //$throwBtn.toggleClass("disabled");
      $bankBtn.toggleClass("disabled");
    }
  }
}

////////////////////////////////////////////////////
////////////////////////////////////////////////////
/////////////////  Rendering  //////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////

function render() {
  physicsWorld.fixedStep();

  for (const dice of diceArray) {
    dice.mesh.position.copy(dice.body.position);
    dice.mesh.quaternion.copy(dice.body.quaternion);
  }

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function updateSceneSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

////////////////////////////////////////////////////
////////////////////////////////////////////////////
///////////////  Scene Element   ///////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////

function initScene() {
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas: canvas,
  });
  renderer.shadowMap.enabled = true;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100,
  );
  camera.position.set(0, 30, 30);

  // Orbit controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.dampingFactor = 0.2;
  controls.minDistance = 1;
  controls.maxDistance = 40;

  updateSceneSize();

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const topLight = new THREE.PointLight(0xffffff, 0.5);
  topLight.position.set(10, 15, 0);
  topLight.castShadow = true;
  topLight.shadow.mapSize.width = 2048;
  topLight.shadow.mapSize.height = 2048;
  topLight.shadow.camera.near = 5;
  topLight.shadow.camera.far = 400;
  scene.add(topLight);

  createBorders();

  for (let i = 0; i < params.numberOfDice; i++) {
    diceArray.push(createDice(i));
    addDiceEvents(diceArray[i]);
  }

  render();
}

function initPhysics() {
  physicsWorld = new CANNON.World({
    allowSleep: true,
    gravity: new CANNON.Vec3(0, -50, 0),
  });
  physicsWorld.defaultContactMaterial.restitution = 0.3;
}

function createBorders() {
  const wallMaterial = new THREE.ShadowMaterial({
    opacity: 0.1,
  });

  // Floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(13, 13), wallMaterial);
  floor.name = "wall";
  floor.receiveShadow = true;

  // Create the border line
  const edges = new THREE.EdgesGeometry(floor.geometry);
  const borderMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
  const borderLine = new THREE.LineSegments(edges, borderMaterial);
  borderLine.position.copy(floor.position);
  borderLine.position.y += 0.01; // Raise the line slightly above the floor
  borderLine.rotation.x = -Math.PI / 2; // Rotate the line to align with the floor
  scene.add(borderLine);

  // Rotate the plane along the x-axis
  floor.quaternion.setFromAxisAngle(new THREE.Vector3(-1, 0, 0), Math.PI * 0.5);

  scene.add(floor);

  const floorBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Plane(),
  });
  floorBody.position.copy(floor.position);
  floorBody.quaternion.copy(floor.quaternion);
  physicsWorld.addBody(floorBody);

  // Walls
  const wallOptions = {
    width: 14,
    height: 15,
    depth: 1,
  };

  function createWall(x, z, isParallel) {
    if (isParallel) {
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(
          wallOptions.depth,
          wallOptions.height,
          wallOptions.width,
        ),
        wallMaterial,
      );
      wall.position.set(x, wallOptions.height * 0.5, z);
      wall.receiveShadow = true;
      wall.name = "wall";
      scene.add(wall);

      const wallBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Box(
          new CANNON.Vec3(
            wallOptions.depth * 0.5,
            wallOptions.height * 0.5,
            wallOptions.width * 0.5,
          ),
        ),
      });
      wallBody.position.copy(wall.position);
      physicsWorld.addBody(wallBody);
    } else {
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(
          wallOptions.width,
          wallOptions.height,
          wallOptions.depth,
        ),
        wallMaterial,
      );
      wall.position.set(x, wallOptions.height * 0.5, z);
      wall.receiveShadow = true;
      wall.name = "wall";
      scene.add(wall);

      const wallBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Box(
          new CANNON.Vec3(
            wallOptions.width * 0.5,
            wallOptions.height * 0.5,
            wallOptions.depth * 0.5,
          ),
        ),
      });
      wallBody.position.copy(wall.position);
      physicsWorld.addBody(wallBody);
    }
  }

  createWall(-wallOptions.width * 0.5, 0, true); // Left wall
  createWall(wallOptions.width * 0.5, 0, true); // Right wall
  createWall(0, -wallOptions.width * 0.5, false); // Back wall
  createWall(0, wallOptions.width * 0.5, false); // Front wall
}

function createDiceMesh(id) {
  const diceMesh = new THREE.Group();

  const mtlLoader = new MTLLoader();

  mtlLoader.load("dice.mtl", (materials) => {
    materials.preload();

    const loader = new OBJLoader();
    loader.setMaterials(materials);

    loader.load(
      "dice.obj",
      function (object) {
        object.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.name = "outDice";
            child.isToggled = false;
            child.value = null;
            child.index = id;
            child.state = 0;
          }
        });

        object.rotation.set(0, Math.PI / 2, 0);

        const boundingBox = new THREE.Box3().setFromObject(object);

        const boundingBoxSize = new THREE.Vector3();
        boundingBox.getSize(boundingBoxSize);

        const scaleFactor = new THREE.Vector3(
          1.05 / boundingBoxSize.x,
          1.05 / boundingBoxSize.y,
          1.05 / boundingBoxSize.z,
        );
        object.scale.copy(scaleFactor);

        diceMesh.add(object);
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (err) {
        console.error("Error loading .obj");
      },
    );
  });
  return diceMesh;
}

function createDice(id) {
  const mesh = createDiceMesh(id);

  scene.add(mesh);

  const body = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
    sleepTimeLimit: 0.1,
  });
  physicsWorld.addBody(body);
  return { mesh, body };
}
*/
