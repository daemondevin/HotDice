import * as CANNON from "cannon-es";

export const diceArray = [];
export let diceValues = [];
export let stableCnt = 0;
export let isStable = false;
export let selected = { 
    quantity: 0, 
    values: [] 
};

let isGameStarted = false;

function toggleDice(diceOutMesh) {
    console.log(
        "Toggled dice number " +
            diceOutMesh.index +
            " with a value of " +
            diceOutMesh.value
            //diceValues[diceOutMesh.index]
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
                idx !== selected.values.indexOf(diceValues[diceOutMesh.index])
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
        2 * Math.PI * Math.random()
    );
    d.body.quaternion.copy(d.mesh.quaternion);

    const forceX = 5 + 25 * Math.random();
    const forceY = 5 + 25 * Math.random();
    d.body.applyImpulse(
        new CANNON.Vec3(-forceX, -forceY, 0),
        new CANNON.Vec3(0, Math.random(), Math.random())
    );

    d.body.allowSleep = true;
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

    //diceValues = playerScores[currentPlayer].thrown;

    if (isZero(euler.z)) {
        if (isZero(euler.x)) {
            diceValues[diceId] = 1;
            return 1;
        } else if (isHalfPi(euler.x)) {
            diceValues[diceId] = 4;
            return 4;
        } else if (isMinusHalfPi(euler.x)) {
            diceValues[diceId] = 3;
            return 3;
        } else if (isPiOrMinusPi(euler.x)) {
            diceValues[diceId] = 6;
            return 6;
        } else {
            console.log("Is one of the dice stuck?");
        }
    } else if (isHalfPi(euler.z)) {
        diceValues[diceId] = 2;
        return 2;
    } else if (isMinusHalfPi(euler.z)) {
        diceValues[diceId] = 5;
        return 5;
    } else {
        console.log("Is one of the dice stuck?");
    }
}

function checkAllStable() {
    if (stableCnt != diceArray.length) {
        console.log("Some dice are not stable...");
        return;
    }
    let checkStable = true;

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
            //diceArray[i].mesh.getObjectByName("outDice").value = calculateValue(diceArray[i], i);
            console.log(calculateValue(diceArray[i], i));
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


export {
    toggleDice,
    resetDice,
    throwDice,
    throwDie,
    addDiceEvents,
    calculateValue,
    checkAllStable,
};
