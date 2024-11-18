const router = require("express").Router();
const UserDashboard = require("../../controller/dashboard/dashboard");
const profileImage = require("../../utils/profile");
const  asyncHandler = require('../../middleware/asyncWrapper');


router.get("/getUserDashboard", UserDashboard.GetUser);


router.put("/updateUserDashboard/:id", profileImage.single("avatar"), UserDashboard.updateUserDashboard);

module.exports = router