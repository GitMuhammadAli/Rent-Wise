const router = require("express").Router();

const UserController = require("../../controller/user/home");
const { protectRoute } = require("../../middleware/checkAuth")
const asyncHandler = require('../../middleware/asyncWrapper');
const { AuthorizeUser, FindUser } = require("../../middleware/auth");

// router.get("/check", asyncHandler(protectRoute), asyncHandler(UserController.checkAuth));
router.get("/check", AuthorizeUser("user" , "admin"), asyncHandler(UserController.checkAuth));


module.exports = router