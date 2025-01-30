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

exports.CreateNotification = async (recipient, sender, type, message, next, ) => {

  try {
    const notification = {
      recipient, sender, type, message
    }

    console.log("notification body is" , notification)

    const newNotification = await Notification.create({
      recipient: recipient,
      sender: sender,
      type: type,
      message: message,
    });

    console.log("notification  is saved" , newNotification)


    if (!newNotification) {
      return res.status(STATUS.FORBIDDEN).json({
        status: BOOLEAN.FALSE,
        message: NOTIFICATION.GENERAL.NOTIFICATION_NOT_CREATED
      });
    }

    return newNotification;

  } catch (error) {
    next(error);
  }
};

exports.getNotificationByUser = async (req, res, next) => {
  try {
    const user = req.user._id
    console.log(user)
    const notifications = await Notification.find({ recipient: user})
      .populate('sender', 'name email')
      .sort({ createdAt: -1 });

    res.status(STATUS.SUCCESS).json({
      status: BOOLEAN.TRUE,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

exports.readAllNotificationByUser = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id },
      { isRead: true }
    );

    res.status(STATUS.SUCCESS).json({
      status: BOOLEAN.TRUE,
      message: NOTIFICATION.GENERAL.NOTIFICATIONS_READ
    });
  } catch (error) {
    next(error);
  }
};

exports.clearAllNotificationByUser = async (req, res, next) => {
  try {
    await Notification.deleteMany({ recipient: req.user._id });

    res.status(STATUS.SUCCESS).json({
      status: BOOLEAN.TRUE,
      message: NOTIFICATION.GENERAL.NOTIFICATIONS_CLEARED
    });
  } catch (error) {
    next(error);
  }
};

exports.ReadOneNotificationByUser = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.notificationId, recipient: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(STATUS.NOT_FOUND).json({
        status: BOOLEAN.FALSE,
        message: NOTIFICATION.GENERAL.NOTIFICATION_NOT_FOUND
      });
    }

    res.status(STATUS.SUCCESS).json({
      status: BOOLEAN.TRUE,
      message: NOTIFICATION.GENERAL.NOTIFICATION_READ,
      data: notification
    });
  } catch (error) {
    next(error);
  }
};