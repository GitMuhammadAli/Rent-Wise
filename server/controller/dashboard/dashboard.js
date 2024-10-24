const User = require("../../model/user/userModel");
const { ERROR_MESSAGE } = require("../../messages/error");
const { RESPONCE_MESSAGE, LISTINGS } = require("../../messages/response");
const { STATUS } = require("../../messages/status");
const { GetAndDecodeToken } = require("../../token/Tokens");

exports.GetUser = async (req, res) => {
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
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.updateUserDashboard = async (req, res) => {
    const { id } = req.params;
    const { password, ...updateData } = req.body;
  
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      if (user.googleId || user.facebookId) {
        if (password) {
          const salt = await bcrypt.genSalt(10);
          updateData.password = await bcrypt.hash(password, salt);
        }
      } else {
        if (password) {
          const salt = await bcrypt.genSalt(10);
          updateData.password = await bcrypt.hash(password, salt);
        }
      }
  
      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true, 
        runValidators: true, 
      });
  
      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };

