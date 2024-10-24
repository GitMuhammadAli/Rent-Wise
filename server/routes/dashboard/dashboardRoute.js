const router = require("express").Router();
const UserDashboard = require("../../controller/dashboard/dashboard");
const profileImage = require("../../utils/profile");

router.get("/getUserDashboard", UserDashboard.GetUser);


router.put("/updateUserDashboard", profileImage.single("profile"), UserDashboard.updateUserDashboard);
module.exports = router