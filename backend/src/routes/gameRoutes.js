const express = require("express");
const router = express.Router();
const gameController= require("../controllers/gameController");

router.get("/games/:date", gameController.getGameByDate);

module.exports = router;