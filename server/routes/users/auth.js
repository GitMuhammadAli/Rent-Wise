const router = require("express").Router();

const UserController = require("../../controller/user/home");
const { protectRoute } = require("../../middleware/checkAuth")
const asyncHandler = require('../../middleware/asyncWrapper');

router.get("/check", asyncHandler(protectRoute), asyncHandler(UserController.checkAuth));


module.exports = router