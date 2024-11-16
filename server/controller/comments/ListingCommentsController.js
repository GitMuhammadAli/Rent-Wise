const  Comment = require("../../model/comments/listingCommentModel");
const Reply = require("../../model/comments/listingReplyModel");
const { RESPONCE_MESSAGE, LISTINGS } = require("../../messages/response");
const { STATUS } = require("../../messages/status");
const { ERROR_MESSAGE } = require("../../messages/error");



exports.createComment = async (req, res) => {
    try {
        const { rental, author, text } = req.body;
        console.log("Data For Comments is", req.body);
        const comment = await Comment.create({ rental, author, text }); // Ensure all fields are included
        console.log("Comment is", comment);
        res.status(STATUS.CREATED).json({ message: RESPONCE_MESSAGE.COMMENT_CREATED, comment });
    } catch (error) {
        console.error("Error in createComment:", error); // Log detailed error
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: RESPONCE_MESSAGE.INTERNAL_SERVER_ERROR });
    }
};



exports.Check = async(req, res)=>{
    const Data = req.body;


    console.log("Data For Comments is " , Data);
}


exports.showSpecificListComments = async (req, res) => {
    try {
        const { id } = req.body;
        // const rental = '671aa58e6973118ab008c850'
        console.log("Data For Comments is " , id);
        const comments = await Comment.find({ id }).populate("author", "name email imageUrl").populate("rental", "title").sort({ createdAt: -1 });
        console.log("Comments are ", comments);
        res.status(STATUS.SUCCESS).json({ message: RESPONCE_MESSAGE.COMMENT_FETCHED, comments });
    } catch (error) {
        console.error("Error in showSpecificListComments:", error); // Log detailed error
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: RESPONCE_MESSAGE.INTERNAL_SERVER_ERROR });
    }
};



exports.listingcommentReply =  async(req, res)=>{
    try{
        const { commentId, author, text , taggedUser } = req.body;
        console.log("Data For Comments is " , commentId, author, text , taggedUser);
        const comment = await Comment.findById(commentId);
        console.log("Comment is", comment);
        if (!comment) {
            console.log("comment is not found");
            return res.status(STATUS.NOT_FOUND).json({ message: RESPONCE_MESSAGE.COMMENT_NOT_FOUND });
        }
        const reply = await Reply.create({ comment: commentId, author, text , taggedUser });
        console.log("Reply is", reply);

        comment.replies.push(reply._id);
        await comment.save(); // Save the updated comment
        console.log("Comment is", comment);
        res.status(STATUS.CREATED).json({ message: RESPONCE_MESSAGE.REPLY_CREATED, reply });


    }catch(error){
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: RESPONCE_MESSAGE.INTERNAL_SERVER_ERROR });
    }

}





exports.getCommentsWithReplies = async (req, res) => {
    try {
        // const { id } = req.body;
        const id = "67363ba7180afc7b6aa88c9b"
        console.log("Data For Comments is " , id);
      const comments = await Comment.findById( id )
        .populate({
          path: "replies", 
          populate: {
            path: "author", 
            select: "name avatar", 
          },
        })
        .populate("author", "name avatar");
        console.log("Comments are ", comments);
  
      res.status(200).json({ comments });
    } catch (error) {
      console.error("Error fetching comments with replies:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };