const router = require("express").Router()
const asyncHandler = require('../../middleware/asyncWrapper');
const { AuthorizeUser } = require("../../middleware/auth");
const Review = require("../../controller/review/review")
const Listing = require("../../controller/review/listingReview")



// Listing Review Routes

router.post("/listing/:id" , AuthorizeUser("user" , "Admin") , asyncHandler(Listing.CreateListReview))

module.exports = router;