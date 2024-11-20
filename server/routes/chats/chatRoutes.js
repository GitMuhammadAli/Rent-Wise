const mongoose = require("mongoose");

const express = require("express");
const router = express.Router();


const MessageController = require("../../controller/chat/MessageController");
const asyncHandler = require("../../middleware/asyncWrapper");


router.post("/createMessage", asyncHandler(MessageController.CreateMessages));
router.get("/getMessages", asyncHandler(MessageController.getMessages));



module.exports = router;