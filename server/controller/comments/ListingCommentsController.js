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



// exports.listingcommentReply =  async(req, res)=>{
//     try{
//         const { commentId, author, text  } = req.body;  
//         console.log("Data For Comments is " , commentId, author, text ); 
//         const comment = await Comment.findById(commentId);
//         console.log("Comment is", comment);
//         if (!comment) {
//             console.log("comment is not found");
//             return res.status(STATUS.NOT_FOUND).json({ message: RESPONCE_MESSAGE.COMMENT_NOT_FOUND });
//         }
//         const reply = await Reply.create({ comment: commentId, author, text ,  }); //taggedUser
//         console.log("Reply is", reply);

//         comment.replies.push(reply._id);
//         await comment.save(); // Save the updated comment
//         console.log("Comment is", comment);
//         res.status(STATUS.CREATED).json({ message: RESPONCE_MESSAGE.REPLY_CREATED, reply });


//     }catch(error){
//         res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: RESPONCE_MESSAGE.INTERNAL_SERVER_ERROR });
//     }

// }
exports.listingcommentReply = async (req, res) => {
  try {
    const { commentId, parentReplyId, author, text, taggedUser } = req.body;

    console.log("Data For Comments is ", commentId, parentReplyId, author, text, taggedUser);
    // Find the parent comment or reply
    let parent;
    if (parentReplyId) {
      parent = await Reply.findById(parentReplyId);
    } else {
      parent = await Comment.findById(commentId);
    }

    if (!parent) {
      return res.status(404).json({ message: "Parent comment or reply not found." });
    }

    // Create the reply
    const reply = await Reply.create({
      comment: commentId,
      parentReply: parentReplyId || null,
      author,
      text,
      taggedUser,
    });

    // Push reply to the parent's `replies` field
    parent.replies.push(reply._id);
    await parent.save();

    res.status(201).json({ message: "Reply created successfully.", reply });
  } catch (error) {
    console.error("Error creating reply:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};




// exports.getCommentsWithReplies = async (req, res) => {
//     try {
//          const { id: rental } = req.params;
//         console.log("Data For Comments is " , rental);
//           const comments = await Comment.find({rental} )
//         .populate({
//           path: "replies", 
//           populate: {
//             path: "author", 
//             select: "name imageUrl", 
//           },
//         })
//         .populate("author", "name imageUrl");
//         console.log("Comments are ", comments);
  
//       res.status(200).json({ comments });
      
//     } catch (error) {
//       console.error("Error fetching comments with replies:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   };


exports.getCommentsWithReplies = async (req, res) => {
  try {
    const { id: rental } = req.params;
    console.log("Data For Comments is ", rental);

    const comments = await Comment.find({ rental })
      .populate({
        path: "replies",
        populate: [
          {
            path: "author",
            select: "name imageUrl",
          },
          {
            path: "replies", // Populate nested replies
            populate: {
              path: "author", // Populate the author of nested replies
              select: "name imageUrl",
            },
          },
        ],
      })
      .populate("author", "name imageUrl");

    console.log("Comments are ", comments);

    res.status(200).json({ comments });
  } catch (error) {
    console.error("Error fetching comments with replies:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
