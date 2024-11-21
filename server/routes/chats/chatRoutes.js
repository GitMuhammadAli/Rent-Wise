const mongoose = require("mongoose");

const express = require("express");
const router = express.Router();


const MessageController = require("../../controller/chat/MessageController");
const asyncHandler = require("../../middleware/asyncWrapper");
const { AuthorizeUser, FindUser } = require("../../middleware/auth");

// router.get("/createMessage" , (req, res)=>{
//     res.send("Hello")
// })
router.post("/createMessage", AuthorizeUser("user" , "admin") ,asyncHandler(MessageController.CreateMessages));
// router.post("/createMessage",asyncHandler(MessageController.CreateMessages));
router.get("/getMessages", asyncHandler(MessageController.getMessages));
// router.get("/checkloggeduser", AuthorizeUser("user" , "admin"), asyncHandler(MessageController.checkloggeduser));
router.get("/checkloggeduser", asyncHandler(MessageController.checkloggeduser));


module.exports = router;