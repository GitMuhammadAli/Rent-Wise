const router = require("express").Router();
const asyncHandler = require('../../middleware/asyncWrapper');
// const userForAdmin = require("../../controller/admin/users/userforadmin")
const listings = require("../../controller/admin/lists/AllLists")
const user = require("../../controller/admin/users/userforadmin")
const { AuthorizeUser } = require("../../middleware/auth");


// router.get("/admin/getAllUsers" , AuthorizeUser("admin"), asyncHandler(userForAdmin))

router.get("/admin/getAllLists" , AuthorizeUser("admin"), asyncHandler(listings.getAllLists))

router.get("/admin/getAllLists/:id" , AuthorizeUser("admin"), asyncHandler(listings.getListingById))

router.get("/admin/getAllListsOFUser" , AuthorizeUser("admin"), asyncHandler(user.userManage))

router.get("/admin/getAllListsOFUser/:id" , AuthorizeUser("admin"), asyncHandler(user.userManageById))


module.exports = router