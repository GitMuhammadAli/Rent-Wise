const router = require("express").Router();
const UserDashboard = require("../../controller/dashboard/dashboard");


router.get("/getUserDashboard", UserDashboard.GetUser);


router.put("/updateUserDashboard", UserDashboard.updateUserDashboard);
module.exports = router