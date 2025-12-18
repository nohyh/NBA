const express =require("express");
const router = express.Router();
const  playerController = require("../controllers/playerController");

router.get("/players",playerController.getPlayers);
router.get("/players/leaders",playerController.getLeaders);
router.get("/players/mvpOfToday",playerController.mvpOfToday);
router.get("/players/:id",playerController.getPlayerById);
module.exports = router;
