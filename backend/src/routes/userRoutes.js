const express =require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/auth"); 

router.post("/users/signup",userController.signUp);
router.post("/users/signin",userController.signIn);
router.post("/users/signout",userController.signOut);
router.get("/users/me",authMiddleware, userController.getUser);
router.get("/users/checkUsername",userController.checkUsername);
router.post("/users/favoritePlayer/:playerId",authMiddleware, userController.favoritePlayer);
router.post("/users/unfavoritePlayer/:playerId",authMiddleware, userController.unfavoritePlayer);
router.post("/users/favoriteTeam/:teamId",authMiddleware, userController.favoriteTeam);
router.post("/users/unfavoriteTeam/:teamId",authMiddleware, userController.unfavoriteTeam);
module.exports = router;
