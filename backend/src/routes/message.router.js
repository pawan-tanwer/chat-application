const express = require("express");
const router = express.Router();
const messageController = require("../controller/message.controller");
const authentication= require("../middleware/authentication");

router.post("/send/:id",authentication.isLogin,messageController.sendMessage);
router.get('/:id',authentication.isLogin,messageController.getMessage);

module.exports = router;