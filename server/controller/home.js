const Users = require("../model/user/userModel");
const { ERROR_MESSAGE } = require("../messages/error");
const { RESPONCE_MESSAGE } = require("../messages/response");

exports.userHome = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: ERROR_MESSAGE.USER_NOT_FOUND });
    }
    console.log("sending to frontend" + user);
    res.status(200).json({
      success: true,
      message: RESPONCE_MESSAGE.USER_FETCHED,
      user,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res
      .status(500)
      .json({
        message:
          ERROR_MESSAGE.FETCHING_USER_ERROR +
          ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
      });
  }
};
exports.adminHome = async (req, res) => {};
