const Users = require("../model/user/userModel");
const jsonwebtoken = require("jsonwebtoken");
const { BOOLEAN } = require("../utils/Roles");
const AppError = require("../utils/AppError");
const { ROLES, } = require("../utils/Roles");
const { STATUS } = require("../messages/status")


function clearCookies(req, res) {
  res.clearCookie("jwt");
}

exports.AuthorizeUser = (RequiredRole) => {
  return async (req, res, next) => {
    const token = req.cookies.jwt;
    console.log("JWT Cookie:", token); // Debugging

    if (!token) {
      return res.status(STATUS.UNAUTHORIZED).json({ message: "No token provided" });
    }

    try {
      const decodedToken = jsonwebtoken.verify(token, process.env.JWT_API_SECRET_KEY);
      const user = await Users.findById(decodedToken._id);

      if (!user) {
        clearCookies(req, res);
        return res.status(STATUS.UNAUTHORIZED).json({ message: "User not found" });
      }

      if (user.role === RequiredRole || (RequiredRole === ROLES.USER && user.role === ROLES.ADMIN)) {
        req.user = user;
        return next();
      } else {
        clearCookies(req, res);
        return next(new AppError(BOOLEAN.FALSE, "Unauthorized - Invalid Role", STATUS.UNAUTHORIZED));
      }
    } catch (error) {
      clearCookies(req, res);
      next(error);
    }
  };
};


exports.FindUser = async (req, res, next) => {
  try {
    const cookieOtp = req.cookies.resetPasswordOTP;

    if (!cookieOtp) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decodedToken = jsonwebtoken.verify(
      cookieOtp,
      process.env.JWT_API_SECRET_KEY
    );

    const { otpVerified, emailVerified } = decodedToken;

    if (emailVerified === BOOLEAN.FALSE) {
      if (otpVerified === BOOLEAN.FALSE) {
        console.log("Email verified but OTP not verified yet");
        return res.status(401).json({ message: "OTP not verified" });
      }
      console.log("Email Not verified in Cookie ");
      return res.status(401).json({ message: "Email not verified" });
    }

    next();
  } catch (error) {
    next(error);
  }
};
