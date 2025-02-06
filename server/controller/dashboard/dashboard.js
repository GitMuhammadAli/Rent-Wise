const User = require("../../model/user/userModel");
const logger = require("../../utils/logger");
const { ERROR_MESSAGE } = require("../../messages/error");
  const { RESPONCE_MESSAGE, LISTINGS , NOTIFICATION,  } = require("../../messages/response");
const { STATUS } = require("../../messages/status");
const { GetAndDecodeToken } = require("../../token/Tokens");
const bcrypt = require('bcrypt')
const AppError = require("../../utils/AppError");
const { ROLES , BOOLEAN} = require("../../utils/Roles");
const UserSettings = require("../../model/notification/notificationSetting")


exports.GetUser = async (req, res, next) => {
  try {
    const decodedToken = await GetAndDecodeToken(req, res);

    if (!decodedToken) {
      return next(new AppError(BOOLEAN.FALSE , ERROR_MESSAGE.INVALID_TOKEN, STATUS.UNAUTHORIZED));
    }

    const user = await User.findById(decodedToken.decoded._id);
    if (!user) {
      return next(new AppError(BOOLEAN.FALSE , ERROR_MESSAGE.USER_NOT_FOUND, STATUS.NOT_FOUND));
    }

    res.status(STATUS.SUCCESS).json({
      success: BOOLEAN.TRUE,
      message: RESPONCE_MESSAGE.USER_FETCHED,
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserDashboardProfile = async (req, res , next) => {
  const { id } = req.params;
  const { name, email, bio, avatar } = req.body;

  const { currentPassword, password, ...updateData } = req.body;
  if (bio === '' || bio === '\r\n') {
    delete updateData.bio;
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return next(new AppError(BOOLEAN.FALSE , ERROR_MESSAGE.USER_NOT_FOUND, STATUS.NOT_FOUND));
    }
    console.log(req.file);
    if (req.file) {
      updateData.imageUrl = `/uploads/profile/${id}/${req.file.filename}`;
    }

    if (password) {
      if (user.googleId || user.facebookId) {
        // const salt = await bcrypt.genSalt(10);
        // updateData.password = await bcrypt.hash(password, salt);
        return res.status(STATUS.FORBIDDEN).json({
          success: BOOLEAN.FALSE,
          message: RESPONCE_MESSAGE.CANNOT_CREATE_PASSWORD_IN_GOOGLE_OR_FACEBOOK_ACCOUNTS,
        });
      } else {

        const pass = bcrypt.compare(currentPassword, user.password);
        if (!pass) {
          return next(new AppError(BOOLEAN.FALSE , ERROR_MESSAGE.CURRENT_PASSWORD_INVALID, STATUS.UNAUTHORIZED));
        }

        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: BOOLEAN.TRUE,
      runValidators: BOOLEAN.TRUE,
    });

    return res.status(STATUS.SUCCESS).json({
      success: BOOLEAN.TRUE,
      message: RESPONCE_MESSAGE.USER_UPDATED,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};


exports.NotificationSubscription = async (req, res, next) => {
  try {
    const { userId, subscription } = req.body;

    if (!userId || !subscription) {
      return next(new AppError(BOOLEAN.FALSE , ERROR_MESSAGE.INVALID_DATA, STATUS.UNAUTHORIZED));

    }

    let userSettings = await UserSettings.findOne({ user: userId });

    if (userSettings) {
      userSettings.webPushSubscription = subscription;
      userSettings.updatedAt = new Date();
      await userSettings.save();
    } else {
      userSettings = await UserSettings.create({
        _id: new mongoose.Types.ObjectId(),
        notificationPreferences: {
          messages: true,
          reviews: true,
          bookings: true,
          payments: true,
          systemUpdates: true,
        },
        webPushSubscription: subscription,
      });

      await User.findByIdAndUpdate(userId, {
        NotificationSetting: userSettings._id,
      });
    }

    res.status(STATUS.SUCCESS).json({ success: BOOLEAN.TRUE, message: NOTIFICATION.SYSTEM.NOTIFICATION_SUBSCRIBED });
  } catch (error) {
    next(error)
  }
};