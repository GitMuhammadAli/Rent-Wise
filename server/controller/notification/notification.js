const Aggrement = require("../../model/agreements/Aggrement");
const AggrementDetails = require("../../model/agreements/AggrementDetails");
const RentalItem = require("../../model/listings/RentalItemModel");
const listingReview = require("../../model/reviews/listingReview");
const Notification = require("../../model/notification/notification")
const { ERROR_MESSAGE } = require("../../messages/error");
const {
  RESPONCE_MESSAGE,
  AGGREEMENT,
  CONVERSATION,
  REVIEWS,
  NOTIFICATION,

} = require("../../messages/response");
const { STATUS } = require("../../messages/status");
const AppError = require("../../utils/AppError");
const { ROLES, BOOLEAN } = require("../../utils/Roles");
const QRCode = require("qrcode");
const { io } = require("../../utils/socket");
const Messsage = require("../../model/chat/MesssageModel");
const Conversation = require("../../model/chat/ConversationModel");








exports.CreateNotification = async(recipient , sender , type , message ) =>{
  try {
    const notification = {
      recipient , sender , type , message
    }

    console.log("Notification body is " , notification);

    const Notification = await Notification.create({
      recipient:recipient,
      sender:sender,
      type:type,
      message:message,
    })



    res.status(STATUS.SUCCESS).json({
      status:BOOLEAN.SUCCESS,
      message:NOTIFICATION.GENERAL.NOTIFICATION_CREATED
    })





  } catch (error) {
    
  }
  

}



exports.getNotificationByUser = async(req,res,next)=>{

}


exports.readAllNotificationByUser = async(req,res,next)=>{

}


exports.clearAllNotificationByUser = async(req,res,next)=>{

}


exports.ReadOneNotificationByUser = async (req , res , next) =>{

}