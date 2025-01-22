const Aggrement = require("../../model/agreements/Aggrement");
const AggrementDetails = require("../../model/agreements/AggrementDetails");
const RentalItem = require("../../model/listings/RentalItemModel");
const { ERROR_MESSAGE } = require("../../messages/error");
const { RESPONCE_MESSAGE, AGGREEMENT, CONVERSATION } = require("../../messages/response");
const { STATUS } = require("../../messages/status");
const AppError = require("../../utils/AppError");
const { ROLES, BOOLEAN } = require("../../utils/Roles");
const QRCode = require('qrcode')
const { io } = require("../../utils/socket");
const Messsage = require("../../model/chat/MesssageModel");
const Conversation = require("../../model/chat/ConversationModel");





exports.ToGetReview = async(req,res,next)=>{
    try {
        const userId = req.user._id; 
            
        // Fetch agreements where the logged-in user is either the owner or renter
        const agreements = await Aggrement.find({
          $or: [{ ownerId: userId }, { renterId: userId }],
        })
          .populate("listingId", "title description") // Populate listing details
          .populate("ownerId", "name email imageUrl") // Populate owner details
          .populate("renterId", "name email imageUrl") // Populate renter details
          .exec();
    
        // Prepare the response with the counterpart user
        const counterparts = agreements.map((agreement) => {
          const isOwner = agreement.ownerId._id.toString() === userId.toString();
          const counterpartUser = isOwner ? agreement.renterId : agreement.ownerId;
    
          return {
            agreementId: agreement._id,
            listing: agreement.listingId,
            user: {
              id: counterpartUser._id,
              name: counterpartUser.name,
              email: counterpartUser.email,
              imageUrl: counterpartUser.imageUrl,
            },
            agreementStatus: agreement.agreementStatus,
            blockchainStatus: agreement.blockchainStatus,
            ownerConfirmed: agreement.ownerConfirmed,
            renterConfirmed: agreement.renterConfirmed,
            agreementDate: agreement.agreementDate,
          };
        });
    
        return res.status(200).json({
          success: true,
          message: "  to be given review  users fetched successfully",
          data: counterparts,
        });
      } catch (error) {
        console.error("Error fetching counterpart users:", error);
        return res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
}