const router = require("express").Router();
const UserDashboard = require("../../controller/dashboard/dashboard");


router.get("/getUserDashboard", UserDashboard.GetUser);
module.exports = router