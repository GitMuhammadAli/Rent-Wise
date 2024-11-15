const router = require("express").Router();
const Comments = require("../../controller/comments/CommentsController")

router.post("/createListingComment", Comments.createComment)

router.post("/comment" , Comments.Check )

router.get("/showSpecificListComments/:id" , Comments.showSpecificListComments )

module.exports = router