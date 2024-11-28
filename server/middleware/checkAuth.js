const jwt = require("jsonwebtoken");
const User = require("../model/user/userModel");
exports.protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    // const {authorization } = req.headers;
    // console.log("JWT Cookie:", authorization); 

    // if (!authorization) {
    //   return res.status(401).json({ message: "No token provided" });
    // }

    // const token = authorization.split(' ')[1]
    console.log("token extracted", token)

  

    const decoded = jwt.verify(token, process.env.JWT_API_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded._id).select("-password  -phoneNumber");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
