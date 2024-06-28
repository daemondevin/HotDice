const express = require('express');
const router = express.Router();
const path = require('path');

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/lobby.html"));
});

router.get("/api/newgame/", (req, res) => {
    var NewGame = new gameclass();
    res.send({ Name: NewGame.Name });
});

router.get("/api/getrooms", (req, res) => {
    res.send({ rooms });
});

router.get("/rules", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/rules.html"));
});

module.exports = router;
