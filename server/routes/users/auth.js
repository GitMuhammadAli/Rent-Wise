const router = require("express").Router();

const UserController = require("../../controller/user/home");
const { protectRoute } = require("../../middleware/checkAuth")


router.get("/check", protectRoute, UserController.checkAuth);


module.exports = router