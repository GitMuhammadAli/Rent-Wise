const Aggrement = require("../../model/agreements/Aggrement");
const AggrementDetails = require("../../model/agreements/AggrementDetails");
const RentalItem = require("../../model/listings/RentalItemModel");
const listingReview = require("../../model/reviews/listingReview");
const Notification = require("../../model/notification/notification")
const UserSettings = require("../../model/notification/notificationSetting")
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
const sendWebPush = require("../../utils/pushService");


exports.CreateNotification = async (recipient, sender, type, message, next, ) => {

  try {
    const notification = {
      recipient, sender, type, message
    }

    // console.log("notification body is" , notification)
    
    const userSettings = await UserSettings.findOne({ user: recipient });

    if (!userSettings) {
          // throw new AppError(ERROR_MESSAGE.NOTIFICATION.SETTINGS_NOT_FOUND, STATUS.NOT_FOUND); // it says not exist
          throw new AppError("Error setting not found");
        }
    
        const isEnabled = userSettings.notificationPreferences[type.toLowerCase()];
        
        if (!isEnabled) {
          console.log(`Notification type ${type} is disabled for user`);
          return null;
        }
    
    const newNotification = await Notification.create({
      recipient: recipient,
      sender: sender,
      type: type,
      message: message,
    });

    // console.log("notification  is saved" , newNotification)


    if (userSettings?.webPushSubscription?.endpoint) {
      
      const payload = {
        _id: newNotification._id,
        title: `New ${type} Notification from Rent-Wise`,
        message: message,
        icon: "./../../Server-Images/notification.png",
        isRead:false,
        type: newNotification.type,
        createdAt: newNotification.createdAt
      };

      await sendWebPush(userSettings.webPushSubscription, payload , next);
    }

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
      message: NOTIFICATION.GENERAL.NOTIFICATION_MARKED_READ
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
      message: NOTIFICATION.GENERAL.NOTIFICATION_CLEARED
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
      message: NOTIFICATION.GENERAL.NOTIFICATION_MARKED_READ,
      data: notification
    });
  } catch (error) {
    next(error);
  }
};





// const payload = {
      //   title: `New ${type} Notification from Rent-Wise`,
      //   message: message,  // body changed to message
      //   // body: message,
      // //   recipient: recipient,
      // //   sender: sender,
      // // createdAt:newNotification.createdAt,
      // // _id: newNotification._id,  // id added,
      // // isRead: newNotification.isRead,
      // // type: newNotification.type,
      //  icon: "./../../Server-Images/notification.png",
      // };