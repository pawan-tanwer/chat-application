const express = require("express");
const router = express.Router();
const {isLogin} = require('../middleware/authentication.js');
const userHandlerController = require("../controller/userHandler.controller.js")

router.get('/search/',isLogin,userHandlerController.getUserBySearch);
router.get('/currentChatters',isLogin,userHandlerController.getCurrentChatters);

module.exports = router;