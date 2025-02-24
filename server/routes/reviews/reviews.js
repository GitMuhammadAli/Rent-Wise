const router = require("express").Router()
const asyncHandler = require('../../middleware/asyncWrapper');
const { AuthorizeUser } = require("../../middleware/auth");
const Review = require("../../controller/review/review")
const Listing = require("../../controller/review/listingReview")
const User = require("../../controller/review/profileReview")


// Listing Review Routes

router.post("/Createlisting/:id" , AuthorizeUser("user" , "Admin") , asyncHandler(Listing.CreateListReview))


// Get All One listing Review
router.get("/listing/:id" , AuthorizeUser("user" , "Admin") , asyncHandler(Listing.getAllReviewsForRentalItem))



// User Review Routes

router.post("/CreateUser/:id" , AuthorizeUser("user" , "Admin") , asyncHandler(User.CreateUserReview))


// Get All User Review
router.get("/User/:id" , AuthorizeUser("user" , "Admin") , asyncHandler(User.getAllReviewsForUsers))


module.exports = router