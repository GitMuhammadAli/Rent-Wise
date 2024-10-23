const User = require("../../model/user/userModel");
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