const Users = require("../../model/user/userModel");
const { ERROR_MESSAGE  } = require("../../messages/error");
const {STATUS_CODE} = require("../../messages/status");
const { RESPONCE_MESSAGE } = require("../../messages/response");
const AppError = require("../../utils/AppError");

exports.userHome = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await Users.findById(userId);

    if (!user) {
      throw new AppError(ERROR_MESSAGE.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    console.log("Sending user to frontend:", user);

    res.status(200).json({
      success: true,
      message: RESPONCE_MESSAGE.USER_FETCHED,
      user,
    });
  } catch (error) {
    next(error); 
  }
};


exports.adminHome = async (req, res) => {};


exports.checkAuth = (req, res) => {
  try {
    console.log("User in checkAuth:", req.user);
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error); 
  }
};