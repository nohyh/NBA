const express =require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");

router.get("/teams",teamController.getTeams);
router.get("/teams/top",teamController.getTopTeam);
router.get("/teams/:id",teamController.getTeamById);
module.exports = router;