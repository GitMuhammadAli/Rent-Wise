const Users = require("../../model/user/userModel");
const bcrypt = require("bcrypt");
const logger = require("../../utils/logger");
const { GenerateToken, decodingToken } = require("../../token/Tokens");
const { ERROR_MESSAGE } = require("../../messages/error");
const { RESPONCE_MESSAGE } = require("../../messages/response");
const { STATUS } = require("../../messages/status");

const initializeAdmin = async () => {
  try {
    const adminExists = await Users.findOne({ role: "admin" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin", 10);
      await Users.create({
        name: "admin",
        email: "admin@authkit.com",
        password: hashedPassword,
        role: "admin",
      });
      console.log("Admin user created with username: admin and password: admin");
    }
  } catch (error) {
    logger.error("Error initializing admin user:", error);
    console.error("Error initializing admin user:", error);
  }
};

const Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(STATUS.BAD_REQUEST).json({ message: ERROR_MESSAGE.INVALID_INPUT });
    }

    if (name.length < 5) {
      return res.status(STATUS.BAD_REQUEST).json({ message: ERROR_MESSAGE.NAME_VALIDATION_FAILED });
    }

    // if (!validator.isEmail(email)) {
    //   return res.status(STATUS.BAD_REQUEST).json({ success: false, message: ERROR_MESSAGE.EMAIL_VALIDATION_FAILED });
    // }

    if (password.length < 8) {
      return res.status(STATUS.BAD_REQUEST).json({ message: ERROR_MESSAGE.PASSWORD_VALIDATION_FAILED });
    }
    if (!email || !password) {
      return res.status(STATUS.BAD_REQUEST).json({ message: ERROR_MESSAGE.INVALID_INPUT });
    
    }
    
    if (await Users.findOne({ email })) {
      return res.status(STATUS.BAD_REQUEST).json({ message: RESPONCE_MESSAGE.EMAIL_ALREADY_EXISTS });
    }


  
    // if (!validator.isEmail(email)) {
    //   return res.status(400).json({ message: "Invalid email format" });
    // }

    if (await Users.findOne({ email })) {
      return res.status(STATUS.BAD_REQUEST).json({ message: RESPONCE_MESSAGE.EMAIL_ALREADY_EXISTS });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Users.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });


    if (newUser) {
      const token = await GenerateToken(newUser, req, res);
      console.log("token user in regisster", token);;

      return res.status(STATUS.CREATED).json({ message: RESPONCE_MESSAGE.USER_REGISTERED, token });
    }
  } catch (error) {
    logger.error("Error during registration:", error);
    console.error(error);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR });
  }
};

const login = async (req, res) => {
  try {
    const { your_email, your_pass } = req.body;
    const user = await Users.findOne({ email: your_email });


    if (!user) {
      return res.status(STATUS.UNAUTHORIZED).json({ message: ERROR_MESSAGE.EMAIL_NOT_FOUND });
    }
    const isPasswordValid = await bcrypt.compare(your_pass, user.password);
    if (!isPasswordValid) {
     
      return res.status(STATUS.UNAUTHORIZED).json({ message: ERROR_MESSAGE.INVALID_PASSWORD });
    }
    await GenerateToken(user, req, res);
    return res.status(200).json({
      message: "Login successful",
      user: { id: user._id, role: user.role },
    }); 
    
  } catch (error) {
    logger.error("Error during login:", error);
    console.log("Error during login:", error);
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR });
  }
};

const handleGoogleCallback = async (req, res) => {
  try {
    await GenerateToken(req.user, req, res);
    res.redirect(process.env.CLIENT_URL || "http://localhost:4000/" );
  } catch (error) {
    logger.error("Error during Google callback:", error);
    console.error(error);
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: RESPONCE_MESSAGE.INTERNAL_SERVER_ERROR });
  }
};

const logout = async (req, res) => {
  try {
    await res.clearCookie("jwt");
    await res.clearCookie("resetPasswordOTP");
    await req.session.destroy();
    return res.status(STATUS.SUCCESS).json({ message: RESPONCE_MESSAGE.LOGOUT_SUCCESS });
  } catch (error) {
    logger.error("Error during logout:", error);
    console.log(error);
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR });
  }
};

// const userAccount = async (req, res) => {
//   try {
//     const UserCookie = req.cookies.jwt;
//     const decodedToken = await decodingToken(UserCookie, process.env.JWT_API_SECRET_KEY);
//     const user = await Users.findById(decodedToken._id);
//     if (!user) {
//       return res.status(STATUS.NOT_FOUND).json({ messag: RESPONCE_MESSAGE.USER_NOT_FOUND });
//     }
//     return res.status(STATUS.SUCCESS).json(user);
//   } catch (error) {
//     logger.error("Error fetching user account:", error);
//     console.log(error);
//     res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR });
//   }
// };

module.exports = {
  initializeAdmin,
  Register,
  login,
  handleGoogleCallback,
  logout,
  // userAccount,
};