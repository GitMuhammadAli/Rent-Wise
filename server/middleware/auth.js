const Users = require("../model/user/userModel");
const jsonwebtoken = require("jsonwebtoken");


function clearCookies(req, res) {
  res.clearCookie("jwt");
}

exports.AuthorizeUser = (RequiredRole) => {
  return async (req, res, next) => {
    const token = req.cookies.jwt;
   console.log("JWT Cookie:", token); // Debugging

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decodedToken = jsonwebtoken.verify(token, process.env.JWT_API_SECRET_KEY);
      const user = await Users.findById(decodedToken._id);

      if (!user) {
        clearCookies(req, res);  
        return res.status(401).json({ message: "User not found" });
      }

      if (user.role === RequiredRole || (RequiredRole === "user" && user.role === "admin")) {
        req.user = user;
        return next();
      } else {
        clearCookies(req, res);  
        return res.status(403).json({ message: "Forbidden" });
      }
    } catch (error) {
      clearCookies(req, res); 
      return res.status(401).json({ message: "Invalid token" });
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

    if (emailVerified === false) {
      if (otpVerified === false) {
        console.log("Email verified but OTP not verified yet");
        return res.status(401).json({ message: "OTP not verified" });
      }
      console.log("Email Not verified in Cookie ");
      return res.status(401).json({ message: "Email not verified" });
    }

    next();
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(401).json({ message: "Internal server error" });
  }
};
