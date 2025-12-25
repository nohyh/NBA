const express = require("express");
const router = express.Router();
const gameController= require("../controllers/gameController");

router.get("/games", gameController.getGameByDate);
router.get("/game/:teamId", gameController.getGameByTeam);

module.exports = router;