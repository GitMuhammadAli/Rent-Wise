const router = require("express").Router();
const UserDashboard = require("../../controller/dashboard/dashboard");
const profileImage = require("../../utils/profile");
const  asyncHandler = require('../../middleware/asyncWrapper');
const review = require("../../controller/review/review")
const { AuthorizeUser } = require("../../middleware/auth");


router.get("/getUserDashboard", asyncHandler(UserDashboard.GetUser));


router.put("/updateUserDashboard/:id", profileImage.single("avatar"), asyncHandler(UserDashboard.updateUserDashboard));

router.get("/reviews" , AuthorizeUser("user" , "Admin" ) , asyncHandler(review.ToGetReview))

module.exports = router