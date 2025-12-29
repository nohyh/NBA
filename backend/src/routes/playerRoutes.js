const express = require("express");
const router = express.Router();
const playerController = require("../controllers/playerController");

router.get("/players/search", playerController.searchPlayer);
router.get("/players/leaders", playerController.getLeaders);
router.get("/players/mvpOfToday", playerController.mvpOfToday);
router.get("/players/topPlayer", playerController.getTopPlayer);
router.get("/players/:id", playerController.getPlayerById);
router.get("/players/team/:teamId", playerController.getPlayerByTeam);
module.exports = router;

