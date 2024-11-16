const router = require("express").Router();
const Comments = require("../../controller/comments/ListingCommentsController")

router.post("/createListingComment", Comments.createComment)

router.post("/comment" , Comments.Check )

router.get("/showSpecificListComments/:id" , Comments.showSpecificListComments )

router.post("/reply" , Comments.listingcommentReply )

router.get("/CommentWithReply/:id" ,  Comments.getCommentsWithReplies)

module.exports = router