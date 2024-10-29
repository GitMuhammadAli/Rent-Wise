const User = require("../../model/user/userModel");
const logger = require("../../utils/logger");
const { ERROR_MESSAGE } = require("../../messages/error");
const { RESPONCE_MESSAGE, LISTINGS } = require("../../messages/response");
const { STATUS } = require("../../messages/status");
const { GetAndDecodeToken } = require("../../token/Tokens");
const bcrypt = require('bcrypt')

exports.GetUser = async (req, res, next) => {
  try {
    const decodedToken = await GetAndDecodeToken(req, res);

    if (!decodedToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const user = await User.findById(decodedToken._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User Fetched Successfully",
      user,
    });
  } catch (error) {
    logger.error(error);
    console.log(error);
    next(error);
  }
};

exports.updateUserDashboard = async (req, res , next) => {
  const { id } = req.params;
  const { name, email, bio, avatar } = req.body;
  console.log("body is", req.body);
  console.log("biooo is", bio);


  const { currentPassword, password, ...updateData } = req.body;
  if (bio === '' || bio === '\r\n') {
    delete updateData.bio;
  }

  console.log("body after bio empty is", req.body);

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGE.USER_NOT_FOUND,
      });
    }
    console.log(req.file);
    if (req.file) {
      updateData.imageUrl = `/uploads/profile/${id}/${req.file.filename}`;
    }

    if (password) {
      if (user.googleId || user.facebookId) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      } else {

        const pass = bcrypt.compare(currentPassword, user.password);
        if (!pass) {
          logger.error("Current Password not matched in updateUserDashboard " + currentPassword);
          return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: ERROR_MESSAGE.CURRENT_PASSWORD_INVALID,

          });

        }

        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(STATUS.SUCCESS).json({
      success: true,
      message: RESPONCE_MESSAGE.USER_UPDATED,
      user: updatedUser,
    });
  } catch (error) {
    console.error("errrrror", error);
    logger.error(error + " in updateUserDashboard");
    next(error);
  }
};
