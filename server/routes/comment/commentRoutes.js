const router = require("express").Router();
const Comments = require("../../controller/comments/ListingCommentsController")
const  asyncHandler = require('../../middleware/asyncWrapper');


router.post("/createListingComment", asyncHandler(Comments.createComment))

router.post("/comment" , asyncHandler(Comments.Check) )

router.get("/showSpecificListComments/:id" , asyncHandler(Comments.showSpecificListComments) )

router.post("/reply" , Comments.listingcommentReply )

router.get("/CommentWithReply/:id" ,  Comments.getCommentsWithReplies)
// router.get("/CommentWithReply" ,  Comments.getCommentsWithReplies)



router.delete("/deleteComment/:id" , Comments.deleteComments)

router.delete("/deleteReply/:id" , Comments.deleteCommentsReplies)

module.exports = router