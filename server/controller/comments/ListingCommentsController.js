const  Comment = require("../../model/comments/listingCommentModel");
const Reply = require("../../model/comments/listingReplyModel");
const { RESPONCE_MESSAGE, LISTINGS , COMMENTS} = require("../../messages/response");
const { STATUS } = require("../../messages/status");
const { ERROR_MESSAGE } = require("../../messages/error");
const logger = require("../../utils/logger");
const AppError = require("../../utils/AppError");
const { ROLES , BOOLEAN} = require("../../utils/Roles");

exports.createComment = async (req, res , next) => {
    try {
        const { rental, author, text } = req.body;
        if(!rental || !author || !text){
        return next(new AppError (BOOLEAN.FALSE , ERROR_MESSAGE.INVALID_DATA , STATUS.BAD_REQUEST));
        }
        const comment = await Comment.create({ rental, author, text });
        if (!comment) {
            return next(new AppError(BOOLEAN.FALSE , COMMENTS.COMMENT_NOT_CREATED , STATUS.BAD_REQUEST));
        }

        res.status(STATUS.CREATED).json({ message: RESPONCE_MESSAGE.COMMENT_CREATED, comment });
    } catch (error) {
        next(error);
    }
};



exports.Check = async(req, res )=>{
    const Data = req.body;


    console.log("Data For Comments is " , Data);
}


exports.showSpecificListComments = async (req, res , next) => {
    try {
        const { id } = req.body;
        console.log("Data For Comments is " , id);
        const comments = await Comment.find({ id }).populate("author", "name email imageUrl").populate("rental", "title").sort({ createdAt: -1 });
        if (!comments) {
return next(new AppError(BOOLEAN.FALSE , COMMENTS.COMMENT_NOT_FOUND , STATUS.NOT_FOUND));
        }
        console.log("Comments are ", comments);
        res.status(STATUS.SUCCESS).json({ message: COMMENTS.COMMENT_FETCHED, comments });
    } catch (error) {
        next(error);
    }
};





exports.getCommentsWithReplies = async (req, res , next) => {
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
            path: "replies", 
            populate: {
              path: "author", 
              select: "name imageUrl",
            },
          },
        ],
      })
      .populate("author", "name imageUrl");
      if (!comments) {
        return next(new AppError(BOOLEAN.FALSE , COMMENTS.COMMENT_NOT_FOUND , STATUS.NOT_FOUND));
      }

    res.status(200).json({ comments });
  } catch (error) {
  next(error);
  }
};


  exports.deleteComments = async (req, res , next) => {
    try {
      const { id } = req.params;
      console.log("Data For Comments is " , id);
      const comment = await Comment.findById(id);
      if (!comment) {
        return next(new AppError(BOOLEAN.FALSE , COMMENTS.COMMENT_NOT_FOUND , STATUS.NOT_FOUND));
      }

      // if (comment.author.toString() !== req.user._id.toString() && 
      //     comment.rental.createdBy.toString() !== req.user._id.toString()) {
      //   return res.status(403).json({ message: "Not authorized to delete this comment" });
      // }

      await Comment.findByIdAndDelete(id);
      res.status(200).json({ message: "Comment deleted successfully." });

    } catch (error) {
      next(error);
    }
  };



  
  exports.deleteCommentsReplies = async(req,res , next)=>{
    try {
      const { id } = req.params;
      console.log("Data For Comments is " , id);
      const reply = await Reply.findById(id);
      if (!reply) {
      return next(new AppError(BOOLEAN.FALSE , COMMENTS.COMMENT_NOT_FOUND , STATUS.NOT_FOUND));
      }

      // if (reply.author.toString() !== req.user?._id?.toString()) {
      //   return res.status(403).json({ message: "Not authorized to delete this reply" });
      // }

      await Reply.findByIdAndDelete(id);
      res.status(200).json({ message: "Comment deleted successfully." });

    } catch (error) {
      next(error);
    }
  }




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



// exports.listingcommentReply = async (req, res , next) => {
  //   try {
  //     const { commentId, parentReplyId, author, text, taggedUser } = req.body;
  
  //     console.log("Data For Comments is ", commentId, parentReplyId, author, text, taggedUser);
  //     let parent;
  //     if (parentReplyId) {
  //       parent = await Reply.findById(parentReplyId);
  //     } else {
  //       parent = await Comment.findById(commentId);
  //     }
  
  //     if (!parent) {
  //       return res.status(404).json({ message: "Parent comment or reply not found." });
  //     }
  
  //     // Create the reply
  //     const reply = await Reply.create({
  //       comment: commentId,
  //       parentReply: parentReplyId || null,
  //       author,
  //       text,
  //       taggedUser,
  //     });
  
  //     // Push reply to the parent's `replies` field
  //     parent.replies.push(reply._id);
  //     await parent.save();
  
  //     res.status(201).json({ message: "Reply created successfully.", reply });
  //   } catch (error) {
  //     console.error("Error creating reply:", error);
  //     res.status(500).json({ message: "Internal server error." });
  //   }
  // };
  