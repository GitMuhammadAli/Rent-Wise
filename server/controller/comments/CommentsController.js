const  Comment = require("../../model/comments/listingCommentModel");
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
        const comments = await Comment.find({ id }).populate("author", "name email").populate("rental", "title");
        console.log("Comments are ", comments);
        res.status(STATUS.SUCCESS).json({ message: RESPONCE_MESSAGE.COMMENT_FETCHED, comments });
    } catch (error) {
        console.error("Error in showSpecificListComments:", error); // Log detailed error
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: RESPONCE_MESSAGE.INTERNAL_SERVER_ERROR });
    }
};
